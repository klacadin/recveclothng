/**
 * Quick row counts against DATABASE_URL.
 */
import { readFileSync, existsSync } from "fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv(".env.local");
loadEnv(".env");

const sql = neon(
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING
);

const tables = [
  "categories",
  "products",
  "product_variants",
  "orders",
  "affiliates",
];
const out = {};
for (const t of tables) {
  try {
    const r = await sql.query(`select count(*)::int as n from ${t}`);
    out[t] = r[0]?.n ?? r.rows?.[0]?.n ?? r;
  } catch (e) {
    out[t] = e instanceof Error ? e.message : String(e);
  }
}
console.log(JSON.stringify(out, null, 2));
