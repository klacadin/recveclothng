import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

config({ path: ".env.local" });
config({ path: ".env" });

const sql = neon(
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL
);

await sql`DROP INDEX IF EXISTS affiliates_clerk_user_id_idx`;
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS affiliates_clerk_user_id_uidx
  ON affiliates (clerk_user_id)
  WHERE clerk_user_id IS NOT NULL
`;

const rows = await sql`
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE tablename = 'affiliates'
  ORDER BY indexname
`;
console.log(rows);
