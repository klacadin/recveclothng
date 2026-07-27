/**
 * Export public catalog from live Supabase into a SQL seed file (no service role needed for public tables).
 * Uses VITE_SUPABASE_* from .env
 *
 *   node scripts/export-supabase-catalog-seed.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const p = resolve(process.cwd(), ".env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return `ARRAY[${v.map((x) => esc(x)).join(",")}]::text[]`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function main() {
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);
  if (pErr) throw pErr;

  const { data: variants, error: vErr } = await supabase.from("product_variants").select("*");
  if (vErr) console.warn("variants:", vErr.message);

  const { data: categories, error: cErr } = await supabase.from("categories").select("*");
  if (cErr) console.warn("categories:", cErr.message);

  const lines = ["-- Auto-exported catalog seed from Supabase", "BEGIN;"];

  for (const r of categories || []) {
    lines.push(
      `INSERT INTO categories (id, name, slug, description, code, image_url, sort_order, is_active, created_at, updated_at) VALUES (${esc(r.id)}, ${esc(r.name)}, ${esc(r.slug)}, ${esc(r.description)}, ${esc(r.code)}, ${esc(r.image_url)}, ${esc(r.sort_order ?? 0)}, ${esc(r.is_active ?? true)}, ${esc(r.created_at)}, ${esc(r.updated_at)}) ON CONFLICT (id) DO NOTHING;`
    );
  }

  for (const r of products || []) {
    lines.push(
      `INSERT INTO products (id, name, description, price, sku, category, image_url, images, stock_quantity, low_stock_threshold, weight_grams, is_active, created_at, updated_at) VALUES (${esc(r.id)}, ${esc(r.name)}, ${esc(r.description)}, ${esc(r.price)}, ${esc(r.sku)}, ${esc(r.category)}, ${esc(r.image_url)}, ${esc(r.images)}, ${esc(r.stock_quantity ?? 0)}, ${esc(r.low_stock_threshold ?? 5)}, ${esc(r.weight_grams)}, ${esc(r.is_active ?? true)}, ${esc(r.created_at)}, ${esc(r.updated_at)}) ON CONFLICT (id) DO NOTHING;`
    );
  }

  for (const r of variants || []) {
    lines.push(
      `INSERT INTO product_variants (id, product_id, size, stock_quantity, low_stock_threshold, sku_suffix, created_at, updated_at) VALUES (${esc(r.id)}, ${esc(r.product_id)}, ${esc(r.size)}, ${esc(r.stock_quantity ?? 0)}, ${esc(r.low_stock_threshold ?? 5)}, ${esc(r.sku_suffix)}, ${esc(r.created_at)}, ${esc(r.updated_at)}) ON CONFLICT (id) DO NOTHING;`
    );
  }

  lines.push("COMMIT;");
  const out = resolve(process.cwd(), "drizzle/seed_catalog.sql");
  writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`Wrote ${out}`);
  console.log(`products=${products?.length || 0} variants=${variants?.length || 0} categories=${categories?.length || 0}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
