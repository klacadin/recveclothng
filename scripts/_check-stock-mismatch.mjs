import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;
const sql = neon(url);

const rows = await sql`
  SELECT p.id, p.name, p.stock_quantity AS product_stock, p.is_active,
    COALESCE((SELECT SUM(v.stock_quantity) FROM product_variants v WHERE v.product_id = p.id), 0)::int AS variant_stock,
    (SELECT COUNT(*) FROM product_variants v WHERE v.product_id = p.id)::int AS variant_count
  FROM products p
  ORDER BY p.name
`;

console.log("mismatches:");
for (const r of rows) {
  const ps = Number(r.product_stock);
  const vs = Number(r.variant_stock);
  if (ps !== vs) {
    console.log({
      name: r.name,
      product: ps,
      variants: vs,
      count: Number(r.variant_count),
      active: r.is_active,
    });
  }
}

const withStock = rows.filter(
  (x) => Number(x.product_stock) > 0 || Number(x.variant_stock) > 0
);
console.log("with stock sample:", withStock.length);
for (const r of withStock.slice(0, 15)) {
  console.log({
    name: r.name,
    product: Number(r.product_stock),
    variants: Number(r.variant_stock),
    count: Number(r.variant_count),
  });
}

const oosButVariants = rows.filter(
  (x) => Number(x.product_stock) === 0 && Number(x.variant_stock) > 0
);
const stockButNoVariants = rows.filter(
  (x) => Number(x.product_stock) > 0 && Number(x.variant_stock) === 0
);
console.log("shop OOS but variants have stock:", oosButVariants.length);
console.log("product stock but variants zero:", stockButNoVariants.length);
