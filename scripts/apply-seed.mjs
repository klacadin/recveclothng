/**
 * Apply drizzle/seed_catalog.sql to DATABASE_URL.
 */
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
loadEnv(".env");

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;
if (!url) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);

function splitSql(input) {
  const statements = [];
  let buf = "";
  let i = 0;
  let inSingle = false;
  let dollarTag = null;

  while (i < input.length) {
    const ch = input[i];
    const next = input[i + 1];

    if (!inSingle && dollarTag === null && ch === "-" && next === "-") {
      while (i < input.length && input[i] !== "\n") i++;
      continue;
    }

    if (!inSingle && ch === "$") {
      const rest = input.slice(i);
      const m = rest.match(/^(\$[A-Za-z0-9_]*\$)/);
      if (m) {
        const tag = m[1];
        if (dollarTag === null) {
          dollarTag = tag;
          buf += tag;
          i += tag.length;
          continue;
        }
        if (tag === dollarTag) {
          buf += tag;
          i += tag.length;
          dollarTag = null;
          continue;
        }
      }
    }

    if (dollarTag === null && ch === "'" && !inSingle) {
      inSingle = true;
      buf += ch;
      i++;
      continue;
    }
    if (dollarTag === null && ch === "'" && inSingle) {
      if (next === "'") {
        buf += "''";
        i += 2;
        continue;
      }
      inSingle = false;
      buf += ch;
      i++;
      continue;
    }

    if (ch === ";" && !inSingle && dollarTag === null) {
      const st = buf.trim();
      if (st) statements.push(st);
      buf = "";
      i++;
      continue;
    }

    buf += ch;
    i++;
  }
  const last = buf.trim();
  if (last) statements.push(last);
  return statements;
}

const seedPath = process.argv[2] || "drizzle/seed_catalog.sql";
const schema = readFileSync(seedPath, "utf8");
// Neon HTTP has no sticky sessions — skip BEGIN/COMMIT wrappers
const statements = splitSql(schema).filter((st) => {
  const u = st.trim().toUpperCase();
  return u !== "BEGIN" && u !== "COMMIT" && u !== "ROLLBACK";
});

let ok = 0;
let fail = 0;
for (let i = 0; i < statements.length; i++) {
  const st = statements[i];
  try {
    await sql.query(st);
    ok++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/already exists|duplicate key/i.test(msg)) {
      ok++;
      continue;
    }
    console.error("FAIL:", st.slice(0, 140).replace(/\s+/g, " "), "→", msg);
    fail++;
  }
  if ((i + 1) % 50 === 0 || i + 1 === statements.length) {
    console.log(`progress ${i + 1}/${statements.length} ok=${ok} fail=${fail}`);
  }
}

console.log(JSON.stringify({ seed: seedPath, ok, fail, total: statements.length }));
if (fail > 0) process.exit(1);
