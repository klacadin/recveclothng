/**
 * Fix broken product images after Supabase storage died.
 * 1) Upload local batch1 webps → Vercel Blob
 * 2) Point matching SKUs at Blob URLs
 * 3) Clear dead supabase.co URLs for the rest (frontend falls back to placeholder)
 *
 * Usage: node scripts/fix-product-images.mjs
 * Requires: .env.vercel.prod with DATABASE_URL + BLOB_READ_WRITE_TOKEN
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const t = readFileSync(".env.vercel.prod", "utf8");
const get = (k) =>
  (t.match(new RegExp(`^${k}=(.+)$`, "m")) || [])[1]?.replace(
    /^["']|["']$/g,
    ""
  );

const databaseUrl = get("DATABASE_URL") || get("POSTGRES_URL");
const token = get("BLOB_READ_WRITE_TOKEN");
if (!databaseUrl || !token) {
  console.error("Missing DATABASE_URL or BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

const sql = neon(databaseUrl);

// Parse SKU → filename from productImageMap.ts
const mapSrc = readFileSync("src/data/productImageMap.ts", "utf8");
const skuToFile = {};
for (const m of mapSrc.matchAll(/"([^"]+)":\s*"([^"]*)"/g)) {
  if (m[1].startsWith("SHRT") || m[1].startsWith("SHORT") || m[1].startsWith("SING") || m[1].startsWith("LSLV")) {
    if (m[2]) skuToFile[m[1]] = m[2];
  }
}

const localDirs = [
  join("public", "assets", "reve-clothing-products-batch1"),
  join("src", "assets", "reve-clothing-products-batch1"),
];

function findLocal(filename) {
  for (const dir of localDirs) {
    const p = join(dir, filename);
    if (existsSync(p)) return p;
  }
  return null;
}

// Upload unique local files once
const fileToBlobUrl = {};
const uniqueFiles = [...new Set(Object.values(skuToFile))];
console.log(`Uploading ${uniqueFiles.length} local images to Blob...`);

for (const filename of uniqueFiles) {
  const path = findLocal(filename);
  if (!path) {
    console.warn("missing local file", filename);
    continue;
  }
  const buf = readFileSync(path);
  const blob = await put(`product-images/batch1/${filename}`, buf, {
    access: "public",
    token,
    allowOverwrite: true,
  });
  fileToBlobUrl[filename] = blob.url;
  console.log("uploaded", filename);
}

const rows = await sql`SELECT id, sku, image_url FROM products`;
let updatedLocal = 0;
let clearedDead = 0;
let kept = 0;

for (const row of rows) {
  const filename = skuToFile[row.sku];
  const blobUrl = filename ? fileToBlobUrl[filename] : null;
  const isDeadSupabase = (row.image_url || "").includes("supabase.co");
  const isRelativeBatch =
    (row.image_url || "").includes("reve-clothing-products-batch1/");

  if (blobUrl) {
    await sql`UPDATE products SET image_url = ${blobUrl}, updated_at = now() WHERE id = ${row.id}`;
    updatedLocal++;
    continue;
  }

  if (isRelativeBatch) {
    // Promote relative → absolute site URL so emails/OG also work
    const abs = `https://reveclothingxnobody.com${row.image_url.startsWith("/") ? "" : "/"}${row.image_url}`;
    // Prefer blob if we somehow have the file
    const fname = row.image_url.split("/").pop();
    const better = fname && fileToBlobUrl[fname];
    await sql`UPDATE products SET image_url = ${better || abs}, updated_at = now() WHERE id = ${row.id}`;
    updatedLocal++;
    continue;
  }

  if (isDeadSupabase) {
    await sql`UPDATE products SET image_url = NULL, updated_at = now() WHERE id = ${row.id}`;
    clearedDead++;
    continue;
  }

  kept++;
}

console.log(
  JSON.stringify({ updatedLocal, clearedDead, kept, blobFiles: Object.keys(fileToBlobUrl).length }, null, 2)
);
