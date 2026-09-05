import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error("No DATABASE_URL configured");
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`
  UPDATE events
  SET
    promo_code = 'TESTEVENT',
    promo_discount_percent = 100,
    updated_at = now()
  WHERE slug IN ('year-end-pasasalamat-trail-run', 'test-trail-run')
  RETURNING slug, title, promo_code, promo_discount_percent
`;
console.log(JSON.stringify(rows, null, 2));
