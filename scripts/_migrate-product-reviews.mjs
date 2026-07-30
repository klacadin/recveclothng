import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

config({ path: ".env.local" });
config({ path: ".env" });

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!url) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);
const dir = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(dir, "../drizzle/0004_product_reviews.sql"),
  "utf8"
);

for (const stmt of migration
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean)) {
  await sql.query(stmt);
  console.log("ok:", stmt.slice(0, 70).replace(/\s+/g, " "));
}

const cols = await sql`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'product_reviews'
  ORDER BY ordinal_position
`;
console.log(
  "product_reviews columns:",
  cols.map((c) => c.column_name)
);
