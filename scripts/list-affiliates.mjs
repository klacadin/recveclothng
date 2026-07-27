import { readFileSync, existsSync } from "fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv(".env.local");
const sql = neon(process.env.DATABASE_URL);
console.log(JSON.stringify(await sql`select * from affiliates`, null, 2));
