/**
 * Cleanup affiliate DATA only (keeps the affiliate feature/schema).
 * - Ensures affiliate tables exist
 * - Deletes all affiliate_commissions rows
 * - Clears orders.affiliate_id
 * - Deletes all affiliates rows
 */
import { readFileSync, existsSync } from "fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = {
  ...loadEnv(".env"),
  ...loadEnv(".env.local"),
  ...loadEnv(".env.vercel.prod"),
};
const url =
  env.DATABASE_URL_UNPOOLED ||
  env.POSTGRES_URL_NON_POOLING ||
  env.DATABASE_URL ||
  env.POSTGRES_URL;
if (!url) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

const host = new URL(url.replace(/^postgres(ql)?:/, "https:")).host;
console.log("DB host:", host);

const sql = neon(url);

// Ensure enum + tables (feature stays; data will be wiped)
await sql`
  DO $$ BEGIN
    CREATE TYPE affiliate_status AS ENUM ('active', 'inactive', 'pending');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$
`;

await sql`
  CREATE TABLE IF NOT EXISTS affiliates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text,
    code text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    status affiliate_status NOT NULL DEFAULT 'active',
    commission_rate numeric(5, 4) NOT NULL DEFAULT 0.1000,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`CREATE UNIQUE INDEX IF NOT EXISTS affiliates_code_idx ON affiliates(code)`;
await sql`CREATE UNIQUE INDEX IF NOT EXISTS affiliates_email_idx ON affiliates(email)`;
await sql`CREATE INDEX IF NOT EXISTS affiliates_clerk_user_id_idx ON affiliates(clerk_user_id)`;

await sql`
  CREATE TABLE IF NOT EXISTS affiliate_commissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_number text NOT NULL,
    order_subtotal numeric(12, 2) NOT NULL,
    commission_rate numeric(5, 4) NOT NULL,
    commission_amount numeric(12, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`CREATE UNIQUE INDEX IF NOT EXISTS affiliate_commissions_order_idx ON affiliate_commissions(order_id)`;

// Add affiliate_id to orders if missing
await sql`
  DO $$ BEGIN
    ALTER TABLE orders ADD COLUMN affiliate_id uuid REFERENCES affiliates(id);
  EXCEPTION WHEN duplicate_column THEN NULL;
  END $$
`;
await sql`CREATE INDEX IF NOT EXISTS orders_affiliate_id_idx ON orders(affiliate_id)`;

await sql`
  CREATE TABLE IF NOT EXISTS store_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`
  INSERT INTO store_settings (key, value, updated_at)
  VALUES ('affiliate_default_commission_rate', '0.1000', now())
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now()
`;

const beforeAff = await sql`SELECT count(*)::int AS n FROM affiliates`;
const beforeComm = await sql`SELECT count(*)::int AS n FROM affiliate_commissions`;
const beforeOrders = await sql`SELECT count(*)::int AS n FROM orders WHERE affiliate_id IS NOT NULL`;
const list = await sql`SELECT code, name, email, status FROM affiliates ORDER BY created_at`;

console.log("Before cleanup:");
console.log("  affiliates:", beforeAff[0].n, list);
console.log("  commissions:", beforeComm[0].n);
console.log("  orders linked:", beforeOrders[0].n);

await sql`DELETE FROM affiliate_commissions`;
await sql`UPDATE orders SET affiliate_id = NULL WHERE affiliate_id IS NOT NULL`;
await sql`DELETE FROM affiliates`;

const afterAff = await sql`SELECT count(*)::int AS n FROM affiliates`;
const afterComm = await sql`SELECT count(*)::int AS n FROM affiliate_commissions`;
const afterOrders = await sql`SELECT count(*)::int AS n FROM orders WHERE affiliate_id IS NOT NULL`;

console.log("After cleanup:");
console.log("  affiliates:", afterAff[0].n);
console.log("  commissions:", afterComm[0].n);
console.log("  orders linked:", afterOrders[0].n);
console.log("Done. Affiliate FEATURE kept; all affiliate ENTRIES removed.");
