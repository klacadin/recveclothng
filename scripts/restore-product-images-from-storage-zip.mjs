/**
 * Restore product photos from a Supabase storage zip into Vercel Blob + Neon.
 *
 * Usage:
 *   node scripts/restore-product-images-from-storage-zip.mjs [storageZipOrDir] [dbBackupGz]
 */
import { createGunzip } from "zlib";
import {
  createReadStream,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, basename, extname } from "path";
import { createInterface } from "readline";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const storageArg =
  process.argv[2] ||
  "tmp-storage-backup/txiwvjfdlxgwjtaibbpb/product-images";
const dbBackup =
  process.argv[3] || "src/db_cluster-27-07-2026@08-49-13.backup.gz";

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnv(".env.local");
loadEnv(".env.vercel.prod");
loadEnv(".env");

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!databaseUrl || !token) {
  console.error("Missing DATABASE_URL or BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

function unescapeCopyField(raw) {
  if (raw === "\\N") return null;
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "\\" && i + 1 < raw.length) {
      const n = raw[++i];
      if (n === "n") out += "\n";
      else if (n === "t") out += "\t";
      else if (n === "r") out += "\r";
      else out += n;
    } else out += raw[i];
  }
  return out;
}

function parsePgTextArray(v) {
  if (v == null) return [];
  const s = String(v).trim();
  if (!s.startsWith("{") || !s.endsWith("}")) return [];
  const inner = s.slice(1, -1);
  if (!inner) return [];
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '"') {
      if (inQuotes && inner[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      if (cur && cur !== "NULL") out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur && cur !== "NULL") out.push(cur);
  return out;
}

function fileKeyFromUrl(url) {
  if (!url) return null;
  try {
    const u = String(url);
    // .../product-images/products/NAME or just basename
    const idx = u.indexOf("/product-images/");
    if (idx >= 0) return decodeURIComponent(u.slice(idx + "/product-images/".length).split("?")[0]);
    return decodeURIComponent(basename(u.split("?")[0]));
  } catch {
    return null;
  }
}

function walkFiles(dir, base = dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, base, acc);
    else {
      const rel = full.slice(base.length).replace(/^[/\\]/, "").replace(/\\/g, "/");
      acc.push({ full, rel, name, size: st.size });
    }
  }
  return acc;
}

async function extractProductImageRefs(path) {
  const input = path.endsWith(".gz")
    ? createReadStream(path).pipe(createGunzip())
    : createReadStream(path);
  const rl = createInterface({ input, crlfDelay: Infinity });
  let mode = false;
  let cols = null;
  /** @type {Array<{id:string,sku:string,image_url:string|null,images:string[]}>} */
  const rows = [];
  for await (const line of rl) {
    if (line.startsWith("COPY public.products ")) {
      mode = true;
      cols = line
        .match(/\(([^)]+)\)/)[1]
        .split(",")
        .map((s) => s.trim());
      continue;
    }
    if (mode && line === "\\.") break;
    if (mode) {
      const vals = line.split("\t").map(unescapeCopyField);
      const o = {};
      cols.forEach((c, i) => (o[c] = vals[i]));
      rows.push({
        id: o.id,
        sku: o.sku,
        image_url: o.image_url,
        images: parsePgTextArray(o.images),
      });
    }
  }
  return rows;
}

async function main() {
  const productsDir = existsSync(join(storageArg, "products"))
    ? storageArg
    : existsSync(storageArg)
      ? storageArg
      : null;
  if (!productsDir) {
    console.error("Storage product-images dir not found:", storageArg);
    process.exit(1);
  }

  const files = walkFiles(productsDir);
  console.log(`Local storage files: ${files.length} under ${productsDir}`);

  // Index by relative path and by basename
  const byRel = new Map();
  const byBase = new Map();
  for (const f of files) {
    byRel.set(f.rel, f);
    byRel.set(`products/${f.name}`, f);
    if (!byBase.has(f.name)) byBase.set(f.name, f);
  }

  console.log(`Reading product image refs from ${dbBackup}...`);
  const backupProducts = existsSync(dbBackup)
    ? await extractProductImageRefs(dbBackup)
    : [];
  console.log(`Backup products with rows: ${backupProducts.length}`);

  const sql = neon(databaseUrl);
  const neonProducts = await sql`SELECT id, sku, image_url, images FROM products`;
  console.log(`Neon products: ${neonProducts.length}`);

  // Prefer backup URLs (still point at old supabase paths) keyed by id/sku
  const refById = new Map();
  const refBySku = new Map();
  for (const p of backupProducts) {
    refById.set(p.id, p);
    if (p.sku) refBySku.set(p.sku, p);
  }

  const uploaded = new Map(); // rel path → blob url
  let updated = 0;
  let skipped = 0;
  let missing = 0;
  let alreadyBlob = 0;
  const missingList = [];

  async function ensureBlob(relOrName) {
    if (!relOrName) return null;
    if (uploaded.has(relOrName)) return uploaded.get(relOrName);
    const f =
      byRel.get(relOrName) ||
      byRel.get(relOrName.replace(/^\/+/, "")) ||
      byBase.get(basename(relOrName));
    if (!f) return null;
    const key = f.rel.startsWith("products/") ? f.rel : `products/${f.name}`;
    if (uploaded.has(key)) return uploaded.get(key);
    const buf = readFileSync(f.full);
    const contentType =
      extname(f.name).toLowerCase() === ".png"
        ? "image/png"
        : extname(f.name).toLowerCase() === ".webp"
          ? "image/webp"
          : extname(f.name).toLowerCase() === ".gif"
            ? "image/gif"
            : "image/jpeg";
    const blob = await put(`product-images/restored/${f.name}`, buf, {
      access: "public",
      token,
      allowOverwrite: true,
      contentType,
    });
    uploaded.set(key, blob.url);
    uploaded.set(f.name, blob.url);
    uploaded.set(relOrName, blob.url);
    console.log(`uploaded ${f.name} (${Math.round(f.size / 1024)}KB)`);
    return blob.url;
  }

  for (const row of neonProducts) {
    const current = row.image_url || "";
    if (current.includes("blob.vercel-storage.com") || current.includes("blob.vercel")) {
      alreadyBlob++;
      skipped++;
      continue;
    }

    const ref = refById.get(row.id) || refBySku.get(row.sku);
    const candidates = [];
    if (ref?.image_url) candidates.push(fileKeyFromUrl(ref.image_url));
    for (const u of ref?.images || []) candidates.push(fileKeyFromUrl(u));
    if (row.image_url) candidates.push(fileKeyFromUrl(row.image_url));
    if (Array.isArray(row.images)) {
      for (const u of row.images) candidates.push(fileKeyFromUrl(u));
    }

    let primary = null;
    const gallery = [];
    for (const key of candidates.filter(Boolean)) {
      const url = await ensureBlob(key);
      if (!url) {
        missingList.push({ sku: row.sku, key });
        continue;
      }
      if (!primary) primary = url;
      if (!gallery.includes(url)) gallery.push(url);
    }

    if (!primary) {
      missing++;
      continue;
    }

    await sql`
      UPDATE products
      SET image_url = ${primary},
          images = ${gallery},
          updated_at = now()
      WHERE id = ${row.id}
    `;
    updated++;
  }

  const summary = await sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE image_url ILIKE '%blob.vercel%')::int AS with_blob,
      count(*) FILTER (WHERE image_url IS NULL OR image_url = '')::int AS empty
    FROM products
  `;

  console.log(
    JSON.stringify(
      {
        localFiles: files.length,
        uploadedUnique: uploaded.size,
        updated,
        skippedAlreadyBlob: alreadyBlob,
        missingPrimary: missing,
        neon: summary[0],
        missingSample: missingList.slice(0, 20),
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
