/**
 * Import orders (+ items) from a pg_dump cluster backup (.sql.gz / .backup.gz)
 * for the last N hours into Neon.
 *
 * Usage:
 *   node scripts/import-orders-from-backup.mjs [backupPath] [hours]
 */
import { createGunzip } from "zlib";
import { createReadStream, existsSync, readFileSync } from "fs";
import { createInterface } from "readline";
import { neon } from "@neondatabase/serverless";

const backupPath =
  process.argv[2] ||
  "src/db_cluster-27-07-2026@08-49-13.backup.gz";
const hours = Number(process.argv[3] || 48);

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

/** Parse a PostgreSQL COPY text row (tab-separated, \N = null). */
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
  // COPY public.orders (col1, col2, ...) FROM stdin;
  const m = line.match(/^COPY\s+[^\s(]+\s*\(([^)]+)\)\s+FROM\s+stdin;?\s*$/i);
  if (!m) return null;
  return m[1].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
}

async function extractTables(path) {
  const input = path.endsWith(".gz")
    ? createReadStream(path).pipe(createGunzip())
    : createReadStream(path);
  const rl = createInterface({ input, crlfDelay: Infinity });

  let mode = null;
  let columns = null;
  const tables = {
    orders: { columns: null, rows: [] },
    order_items: { columns: null, rows: [] },
  };

  for await (const line of rl) {
    if (line.startsWith("COPY public.orders ") || line.startsWith('COPY public."orders" ')) {
      mode = "orders";
      columns = parseCopyHeader(line);
      tables.orders.columns = columns;
      continue;
    }
    if (
      line.startsWith("COPY public.order_items ") ||
      line.startsWith('COPY public."order_items" ')
    ) {
      mode = "order_items";
      columns = parseCopyHeader(line);
      tables.order_items.columns = columns;
      continue;
    }
    if (mode && line === "\\.") {
      mode = null;
      columns = null;
      continue;
    }
    if (mode === "orders" || mode === "order_items") {
      const vals = parseCopyRow(line);
      const row = {};
      const cols = tables[mode].columns || [];
      for (let i = 0; i < cols.length; i++) {
        row[cols[i]] = vals[i] ?? null;
      }
      tables[mode].rows.push(row);
    }
  }
  return tables;
}

function rowToObject(row) {
  // already object
  return row;
}

function parseTs(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  console.log(`Reading backup: ${backupPath}`);
  console.log(`Window: last ${hours} hours`);
  const tables = await extractTables(backupPath);
  console.log(
    `Backup contains ${tables.orders.rows.length} orders, ${tables.order_items.rows.length} order_items`
  );
  console.log("orders columns:", tables.orders.columns?.join(", "));
  console.log("order_items columns:", tables.order_items.columns?.join(", "));

  if (!tables.orders.columns) {
    console.error("No COPY public.orders section found in backup");
    process.exit(1);
  }

  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  // Backup timestamp is 2026-07-27 08:49 — prefer filtering relative to backup time
  // if "now" would exclude everything (clock skew). Use max(now-48h, backupMaxCreated-48h)?
  // User asked last 48 hours — use wall clock now (2026-07-28).
  const recentOrders = tables.orders.rows
    .map(rowToObject)
    .filter((o) => {
      const created = parseTs(o.created_at);
      return created && created >= cutoff;
    });

  const orderIds = new Set(recentOrders.map((o) => o.id));
  const recentItems = tables.order_items.rows.filter((i) => orderIds.has(i.order_id));

  console.log(
    `Filtered (>= ${cutoff.toISOString()}): ${recentOrders.length} orders, ${recentItems.length} items`
  );

  if (recentOrders.length === 0) {
    // Diagnostic: show newest orders in backup
    const sorted = [...tables.orders.rows]
      .map((o) => ({ id: o.id, order_number: o.order_number, created_at: o.created_at }))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, 10);
    console.log("Newest orders in backup:", sorted);
    process.exit(0);
  }

  const sql = neon(databaseUrl);

  let insertedOrders = 0;
  let skippedOrders = 0;
  let insertedItems = 0;
  let skippedItems = 0;
  const errors = [];

  for (const o of recentOrders) {
    try {
      const hitpay = o.hitpay_payment_id || o.xendit_payment_id || null;
      const result = await sql`
        INSERT INTO orders (
          id, order_number, customer_name, customer_email, customer_phone, shipping_address,
          status, payment_method, subtotal, shipping_fee, total, notes,
          proof_of_payment_url, proof_uploaded_at, payment_reference_number,
          hitpay_payment_id, waybill_number, user_id, created_at, updated_at
        ) VALUES (
          ${o.id}::uuid,
          ${o.order_number},
          ${o.customer_name},
          ${o.customer_email},
          ${o.customer_phone},
          ${o.shipping_address},
          ${o.status}::order_status,
          ${o.payment_method}::payment_method,
          ${o.subtotal},
          ${o.shipping_fee},
          ${o.total},
          ${o.notes},
          ${o.proof_of_payment_url},
          ${o.proof_uploaded_at},
          ${o.payment_reference_number},
          ${hitpay},
          ${o.waybill_number},
          ${o.user_id},
          ${o.created_at},
          ${o.updated_at || o.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `;
      if (result.length) insertedOrders++;
      else skippedOrders++;
    } catch (e) {
      // order_number unique conflict with different id
      try {
        const result = await sql`
          INSERT INTO orders (
            id, order_number, customer_name, customer_email, customer_phone, shipping_address,
            status, payment_method, subtotal, shipping_fee, total, notes,
            proof_of_payment_url, proof_uploaded_at, payment_reference_number,
            hitpay_payment_id, waybill_number, user_id, created_at, updated_at
          ) VALUES (
            ${o.id}::uuid,
            ${o.order_number},
            ${o.customer_name},
            ${o.customer_email},
            ${o.customer_phone},
            ${o.shipping_address},
            ${o.status}::order_status,
            ${o.payment_method}::payment_method,
            ${o.subtotal},
            ${o.shipping_fee},
            ${o.total},
            ${o.notes},
            ${o.proof_of_payment_url},
            ${o.proof_uploaded_at},
            ${o.payment_reference_number},
            ${o.hitpay_payment_id || o.xendit_payment_id || null},
            ${o.waybill_number},
            ${o.user_id},
            ${o.created_at},
            ${o.updated_at || o.created_at}
          )
          ON CONFLICT (order_number) DO NOTHING
          RETURNING id
        `;
        if (result.length) insertedOrders++;
        else skippedOrders++;
      } catch (e2) {
        errors.push({ order: o.order_number, error: e2.message || String(e2) });
      }
    }
  }

  for (const it of recentItems) {
    try {
      const result = await sql`
        INSERT INTO order_items (
          id, order_id, product_id, product_name, product_sku, quantity, size,
          unit_price, total_price, created_at
        ) VALUES (
          ${it.id}::uuid,
          ${it.order_id}::uuid,
          ${it.product_id}::uuid,
          ${it.product_name},
          ${it.product_sku},
          ${Number(it.quantity) || 1},
          ${it.size},
          ${it.unit_price},
          ${it.total_price},
          ${it.created_at}
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `;
      if (result.length) insertedItems++;
      else skippedItems++;
    } catch (e) {
      // product_id FK may fail if product missing — retry with null product_id
      try {
        const result = await sql`
          INSERT INTO order_items (
            id, order_id, product_id, product_name, product_sku, quantity, size,
            unit_price, total_price, created_at
          ) VALUES (
            ${it.id}::uuid,
            ${it.order_id}::uuid,
            NULL,
            ${it.product_name},
            ${it.product_sku},
            ${Number(it.quantity) || 1},
            ${it.size},
            ${it.unit_price},
            ${it.total_price},
            ${it.created_at}
          )
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        `;
        if (result.length) insertedItems++;
        else skippedItems++;
      } catch (e2) {
        errors.push({ item: it.id, order_id: it.order_id, error: e2.message || String(e2) });
      }
    }
  }

  const verify = await sql`
    SELECT count(*)::int AS n
    FROM orders
    WHERE created_at >= ${cutoff.toISOString()}
  `;

  console.log(
    JSON.stringify(
      {
        insertedOrders,
        skippedOrders,
        insertedItems,
        skippedItems,
        neonOrdersInWindow: verify[0]?.n,
        errorCount: errors.length,
        errors: errors.slice(0, 20),
        sampleImported: recentOrders.slice(0, 5).map((o) => ({
          order_number: o.order_number,
          created_at: o.created_at,
          status: o.status,
          total: o.total,
          customer_email: o.customer_email,
        })),
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
