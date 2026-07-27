/**
 * Import all compatible public tables from a pg_dump cluster backup into Neon.
 *
 * Usage:
 *   node scripts/import-all-from-backup.mjs [backupPath]
 *
 * Existing rows (same primary key) are left alone (ON CONFLICT DO NOTHING).
 * Tables not in the Neon schema are skipped.
 */
import { createGunzip } from "zlib";
import { createReadStream, existsSync, readFileSync } from "fs";
import { createInterface } from "readline";
import { neon } from "@neondatabase/serverless";

const backupPath =
  process.argv[2] || "src/db_cluster-27-07-2026@08-49-13.backup.gz";

function loadEnvFile(path) {
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
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.vercel.prod");
loadEnvFile(".env");

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL / POSTGRES_URL");
  process.exit(1);
}
if (!existsSync(backupPath)) {
  console.error("Backup not found:", backupPath);
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
      else if (n === "b") out += "\b";
      else if (n === "f") out += "\f";
      else if (n === "v") out += "\v";
      else out += n;
    } else {
      out += raw[i];
    }
  }
  return out;
}

function parseCopyRow(line) {
  return line.split("\t").map(unescapeCopyField);
}

function parseCopyHeader(line) {
  const m = line.match(/^COPY\s+([^\s(]+)\s*\(([^)]+)\)\s+FROM\s+stdin;?\s*$/i);
  if (!m) return null;
  return {
    table: m[1].replace(/^public\./, "").replace(/"/g, ""),
    columns: m[2].split(",").map((c) => c.trim().replace(/^"|"$/g, "")),
  };
}

/** Postgres array literal → JS string[] | null */
function parsePgTextArray(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  if (s === "" || s === "{}") return [];
  if (!s.startsWith("{") || !s.endsWith("}")) return null;
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
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur === "NULL" ? null : cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur === "NULL" ? null : cur);
  return out.filter((x) => x != null);
}

function bool(v, fallback = true) {
  if (v == null) return fallback;
  if (typeof v === "boolean") return v;
  return v === "t" || v === "true" || v === "1";
}

function int(v, fallback = 0) {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function num(v, fallback = "0") {
  if (v == null || v === "") return fallback;
  return String(v);
}

async function extractPublicTables(path) {
  const input = path.endsWith(".gz")
    ? createReadStream(path).pipe(createGunzip())
    : createReadStream(path);
  const rl = createInterface({ input, crlfDelay: Infinity });

  /** @type {Record<string, { columns: string[], rows: Record<string, string|null>[] }>} */
  const tables = {};
  let current = null;
  let columns = null;

  for await (const line of rl) {
    if (line.startsWith("COPY public.")) {
      const parsed = parseCopyHeader(line);
      if (!parsed) continue;
      current = parsed.table;
      columns = parsed.columns;
      tables[current] = { columns, rows: [] };
      continue;
    }
    if (current && line === "\\.") {
      current = null;
      columns = null;
      continue;
    }
    if (current && columns) {
      const vals = parseCopyRow(line);
      const row = {};
      for (let i = 0; i < columns.length; i++) {
        row[columns[i]] = vals[i] ?? null;
      }
      tables[current].rows.push(row);
    }
  }
  return tables;
}

async function insertOne(label, fn) {
  try {
    const result = await fn();
    return result?.length ? "inserted" : "skipped";
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

async function main() {
  console.log(`Reading backup: ${backupPath}`);
  const tables = await extractPublicTables(backupPath);

  const summary = Object.fromEntries(
    Object.entries(tables).map(([k, v]) => [k, v.rows.length])
  );
  console.log("Backup public tables:", summary);

  const sql = neon(databaseUrl);
  const stats = {};
  const errors = [];

  function track(table, result) {
    if (!stats[table]) stats[table] = { inserted: 0, skipped: 0, errors: 0 };
    if (result === "inserted") stats[table].inserted++;
    else if (result === "skipped") stats[table].skipped++;
    else {
      stats[table].errors++;
      if (errors.length < 50) errors.push({ table, ...result });
    }
  }

  // ---- categories ----
  for (const r of tables.categories?.rows || []) {
    track(
      "categories",
      await insertOne("categories", () => sql`
        INSERT INTO categories (
          id, name, slug, description, code, image_url, sort_order, is_active, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${r.name}, ${r.slug}, ${r.description}, ${r.code},
          ${r.image_url}, ${int(r.sort_order, 0)}, ${bool(r.is_active, true)},
          ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- products ----
  for (const r of tables.products?.rows || []) {
    const images = parsePgTextArray(r.images);
    track(
      "products",
      await insertOne("products", () => sql`
        INSERT INTO products (
          id, name, description, price, sku, category, image_url, images,
          stock_quantity, low_stock_threshold, weight_grams, is_active,
          created_by_email, updated_by_email, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${r.name}, ${r.description}, ${num(r.price)}, ${r.sku},
          ${r.category}, ${r.image_url}, ${images},
          ${int(r.stock_quantity, 0)}, ${int(r.low_stock_threshold, 5)},
          ${r.weight_grams == null ? null : int(r.weight_grams)},
          ${bool(r.is_active, true)}, ${r.created_by_email}, ${r.updated_by_email},
          ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- product_variants ----
  for (const r of tables.product_variants?.rows || []) {
    const size = r.size;
    let result = await insertOne("product_variants", () => sql`
      INSERT INTO product_variants (
        id, product_id, size, stock_quantity, low_stock_threshold, sku_suffix, created_at, updated_at
      ) VALUES (
        ${r.id}::uuid, ${r.product_id}::uuid, ${size}::product_size,
        ${int(r.stock_quantity, 0)}, ${int(r.low_stock_threshold, 5)},
        ${r.sku_suffix}, ${r.created_at}, ${r.updated_at || r.created_at}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `);
    if (typeof result === "object" && result.error) {
      // unique (product_id, size) may collide with different id
      result = await insertOne("product_variants", () => sql`
        INSERT INTO product_variants (
          id, product_id, size, stock_quantity, low_stock_threshold, sku_suffix, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${r.product_id}::uuid, ${size}::product_size,
          ${int(r.stock_quantity, 0)}, ${int(r.low_stock_threshold, 5)},
          ${r.sku_suffix}, ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (product_id, size) DO NOTHING
        RETURNING id
      `);
    }
    track("product_variants", result);
  }

  // ---- vouchers ----
  for (const r of tables.vouchers?.rows || []) {
    track(
      "vouchers",
      await insertOne("vouchers", () => sql`
        INSERT INTO vouchers (
          id, code, discount_type, discount_value, is_active, max_uses, used_count, expires_at, created_at
        ) VALUES (
          ${r.id}::uuid, ${r.code}, ${r.discount_type || "percent"}, ${num(r.discount_value)},
          ${bool(r.is_active, true)},
          ${r.max_uses == null ? null : int(r.max_uses)},
          ${int(r.times_used ?? r.used_count, 0)},
          ${r.expires_at}, ${r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- articles ----
  for (const r of tables.articles?.rows || []) {
    track(
      "articles",
      await insertOne("articles", () => sql`
        INSERT INTO articles (
          id, title, slug, content, excerpt, source, source_url, image_url,
          published_at, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${r.title}, ${r.slug}, ${r.content}, ${r.excerpt},
          ${r.source || "manual"}, ${r.source_url}, ${r.image_url},
          ${r.published_at || r.created_at}, ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- contact_submissions ----
  for (const r of tables.contact_submissions?.rows || []) {
    track(
      "contact_submissions",
      await insertOne("contact_submissions", () => sql`
        INSERT INTO contact_submissions (
          id, name, email, phone, subject, message, read_at, created_at
        ) VALUES (
          ${r.id}::uuid, ${r.name}, ${r.email}, ${r.phone}, ${r.subject},
          ${r.message}, ${r.read_at}, ${r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- event_carousel ----
  for (const r of tables.event_carousel?.rows || []) {
    track(
      "event_carousel",
      await insertOne("event_carousel", () => sql`
        INSERT INTO event_carousel (id, image_url, title, caption, created_at)
        VALUES (
          ${r.id}::uuid, ${r.image_url}, ${r.title}, ${r.caption}, ${r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- order_rate_limits ----
  for (const r of tables.order_rate_limits?.rows || []) {
    track(
      "order_rate_limits",
      await insertOne("order_rate_limits", () => sql`
        INSERT INTO order_rate_limits (id, ip_address, customer_email, created_at)
        VALUES (
          ${r.id}::uuid, ${r.ip_address}, ${r.customer_email}, ${r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  // ---- orders ----
  for (const r of tables.orders?.rows || []) {
    const hitpay = r.hitpay_payment_id || r.xendit_payment_id || null;
    let result = await insertOne("orders", () => sql`
      INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone, shipping_address,
        status, payment_method, subtotal, shipping_fee, total, notes,
        proof_of_payment_url, proof_uploaded_at, payment_reference_number,
        hitpay_payment_id, waybill_number, user_id, created_at, updated_at
      ) VALUES (
        ${r.id}::uuid, ${r.order_number}, ${r.customer_name}, ${r.customer_email},
        ${r.customer_phone}, ${r.shipping_address},
        ${r.status}::order_status, ${r.payment_method}::payment_method,
        ${num(r.subtotal)}, ${num(r.shipping_fee)}, ${num(r.total)}, ${r.notes},
        ${r.proof_of_payment_url}, ${r.proof_uploaded_at}, ${r.payment_reference_number},
        ${hitpay}, ${r.waybill_number}, ${r.user_id},
        ${r.created_at}, ${r.updated_at || r.created_at}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `);
    if (typeof result === "object" && result.error) {
      result = await insertOne("orders", () => sql`
        INSERT INTO orders (
          id, order_number, customer_name, customer_email, customer_phone, shipping_address,
          status, payment_method, subtotal, shipping_fee, total, notes,
          proof_of_payment_url, proof_uploaded_at, payment_reference_number,
          hitpay_payment_id, waybill_number, user_id, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${r.order_number}, ${r.customer_name}, ${r.customer_email},
          ${r.customer_phone}, ${r.shipping_address},
          ${r.status}::order_status, ${r.payment_method}::payment_method,
          ${num(r.subtotal)}, ${num(r.shipping_fee)}, ${num(r.total)}, ${r.notes},
          ${r.proof_of_payment_url}, ${r.proof_uploaded_at}, ${r.payment_reference_number},
          ${hitpay}, ${r.waybill_number}, ${r.user_id},
          ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (order_number) DO NOTHING
        RETURNING id
      `);
    }
    track("orders", result);
  }

  // ---- order_items ----
  for (const r of tables.order_items?.rows || []) {
    let result = await insertOne("order_items", () => sql`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_sku, quantity, size,
        unit_price, total_price, created_at
      ) VALUES (
        ${r.id}::uuid, ${r.order_id}::uuid, ${r.product_id}::uuid,
        ${r.product_name}, ${r.product_sku}, ${int(r.quantity, 1)}, ${r.size},
        ${num(r.unit_price)}, ${num(r.total_price)}, ${r.created_at}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `);
    if (typeof result === "object" && result.error) {
      result = await insertOne("order_items", () => sql`
        INSERT INTO order_items (
          id, order_id, product_id, product_name, product_sku, quantity, size,
          unit_price, total_price, created_at
        ) VALUES (
          ${r.id}::uuid, ${r.order_id}::uuid, NULL,
          ${r.product_name}, ${r.product_sku}, ${int(r.quantity, 1)}, ${r.size},
          ${num(r.unit_price)}, ${num(r.total_price)}, ${r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `);
    }
    track("order_items", result);
  }

  // ---- user_approvals (map supabase user_id → clerk_user_id text) ----
  for (const r of tables.user_approvals?.rows || []) {
    const clerkUserId = r.clerk_user_id || r.user_id;
    if (!clerkUserId || !r.email) {
      track("user_approvals", "skipped");
      continue;
    }
    track(
      "user_approvals",
      await insertOne("user_approvals", () => sql`
        INSERT INTO user_approvals (
          id, clerk_user_id, email, status, reviewed_by, reviewed_at, notes, created_at, updated_at
        ) VALUES (
          ${r.id}::uuid, ${clerkUserId}, ${r.email}, ${r.status || "pending"},
          ${r.approved_by || r.reviewed_by || null},
          ${r.approved_at || r.reviewed_at || null},
          ${r.rejection_reason || r.notes || null},
          ${r.created_at}, ${r.updated_at || r.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `)
    );
  }

  const skippedTables = [
    "checkout_otps",
    "inventory_logs",
    "payment_transactions",
    "product_reviews",
    "user_roles",
  ].filter((t) => tables[t]);

  const counts = await sql`
    SELECT
      (SELECT count(*)::int FROM categories) AS categories,
      (SELECT count(*)::int FROM products) AS products,
      (SELECT count(*)::int FROM product_variants) AS product_variants,
      (SELECT count(*)::int FROM orders) AS orders,
      (SELECT count(*)::int FROM order_items) AS order_items,
      (SELECT count(*)::int FROM vouchers) AS vouchers,
      (SELECT count(*)::int FROM articles) AS articles,
      (SELECT count(*)::int FROM contact_submissions) AS contact_submissions,
      (SELECT count(*)::int FROM event_carousel) AS event_carousel,
      (SELECT count(*)::int FROM order_rate_limits) AS order_rate_limits,
      (SELECT count(*)::int FROM user_approvals) AS user_approvals
  `;

  console.log(
    JSON.stringify(
      {
        importStats: stats,
        neonCounts: counts[0],
        skippedBackupTables: Object.fromEntries(
          skippedTables.map((t) => [t, tables[t].rows.length])
        ),
        errorCount: errors.length,
        errors: errors.slice(0, 25),
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
