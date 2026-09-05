import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;
const sql = neon(url);

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

/** Products with stock but no variant rows */
const missing = await sql`
  SELECT p.id, p.name, p.stock_quantity, p.low_stock_threshold
  FROM products p
  WHERE p.stock_quantity > 0
    AND NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id)
`;

console.log(`Backfilling variants for ${missing.length} products…`);

for (const p of missing) {
  const total = Math.max(0, Number(p.stock_quantity) || 0);
  const threshold = Math.max(0, Number(p.low_stock_threshold) || 5);
  // Put remainder on M so sizes remain buyable; distribute as evenly as possible
  const base = Math.floor(total / SIZES.length);
  let rem = total - base * SIZES.length;
  for (const size of SIZES) {
    const qty = base + (size === "M" ? rem : 0);
    if (size === "M") rem = 0;
    await sql`
      INSERT INTO product_variants (product_id, size, stock_quantity, low_stock_threshold)
      VALUES (${p.id}::uuid, ${size}::product_size, ${qty}, ${threshold})
      ON CONFLICT DO NOTHING
    `;
  }
  console.log(`  ${p.name}: ${total} → variants`);
}

/** Sync products.stock_quantity = SUM(variants) for all products that have variants */
const synced = await sql`
  UPDATE products p
  SET stock_quantity = COALESCE(s.total, 0),
      updated_at = now()
  FROM (
    SELECT product_id, SUM(stock_quantity)::int AS total
    FROM product_variants
    GROUP BY product_id
  ) s
  WHERE p.id = s.product_id
    AND p.stock_quantity IS DISTINCT FROM s.total
  RETURNING p.name, p.stock_quantity
`;
console.log(`Synced product totals: ${synced.length}`);

const check = await sql`
  SELECT COUNT(*)::int AS n
  FROM products p
  WHERE p.stock_quantity > 0
    AND COALESCE((SELECT SUM(v.stock_quantity) FROM product_variants v WHERE v.product_id = p.id), 0) = 0
`;
console.log("Remaining product>0 variants=0:", check[0]?.n);
