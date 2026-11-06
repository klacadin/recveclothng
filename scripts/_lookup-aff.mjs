import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const sql = neon(
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL
);

const rows = await sql`
  SELECT id, code, name, email, status, clerk_user_id, commission_rate, created_at
  FROM affiliates
  WHERE email ILIKE ${"%khlacadin%"}
     OR email ILIKE ${"%devcon%"}
     OR code ILIKE ${"%meow%"}
     OR name ILIKE ${"%keren%"}
  ORDER BY created_at DESC
`;
console.log(JSON.stringify(rows, null, 2));

const sample = await sql`
  SELECT id, code, email, status, clerk_user_id IS NOT NULL AS has_clerk
  FROM affiliates
  ORDER BY created_at DESC
  LIMIT 20
`;
console.log("recent:", JSON.stringify(sample, null, 2));
