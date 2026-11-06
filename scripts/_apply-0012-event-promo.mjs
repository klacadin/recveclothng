import { config } from "dotenv";
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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
const file = join(dirname(fileURLToPath(import.meta.url)), "../drizzle/0012_event_convenience_fee_souvenir_promo.sql");
const raw = readFileSync(file, "utf8");
const functionMatch = raw.match(/CREATE OR REPLACE FUNCTION[\s\S]+?\$\$;/);
if (!functionMatch) {
  console.error("Could not find assign_event_souvenir_promo function in migration");
  process.exit(1);
}

const [before, after] = raw.split(functionMatch[0]);
const chunks = [
  ...before.split(";").map((part) => part.trim()).filter(Boolean),
  functionMatch[0].trim().replace(/;$/, ""),
  ...after.split(";").map((part) => part.trim()).filter(Boolean),
];

for (const statement of chunks) {
  await sql.query(statement);
}

const summary = await sql`
  SELECT
    count(*)::int AS registrations,
    count(*) FILTER (WHERE convenience_fee IS NOT NULL)::int AS with_fee_column,
    count(*) FILTER (WHERE promo_rank IS NOT NULL)::int AS ranked,
    count(*) FILTER (WHERE free_souvenir_shirt)::int AS free_shirts
  FROM event_registrations
`;
console.log(JSON.stringify({ applied: true, summary: summary[0] }, null, 2));
