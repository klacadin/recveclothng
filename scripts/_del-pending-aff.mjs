import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const sql = neon(
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL
);

const removed = await sql`
  DELETE FROM affiliates
  WHERE code = 'kikin127'
    AND status = 'pending'
    AND email = 'khlacadin@gmail.com'
  RETURNING id, code, email, status, clerk_user_id
`;

console.log(JSON.stringify(removed, null, 2));
