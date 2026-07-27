/**
 * Non-interactive cutover helper.
 * - Exports catalog seed from Supabase (anon key)
 * - Prints next commands for local Postgres / Vercel
 * Does not require Vercel login.
 */
import { spawnSync } from "child_process";
import { existsSync } from "fs";

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  return r.status === 0;
}

console.log("=== REVE Clothing — autonomous migration helper ===\n");

if (!run("node", ["scripts/export-supabase-catalog-seed.mjs"])) {
  console.error("Catalog export failed (check .env VITE_SUPABASE_*).");
}

if (existsSync("drizzle/seed_catalog.sql")) {
  console.log("\nCatalog seed ready: drizzle/seed_catalog.sql");
}

console.log(`
Next (when Docker Desktop is running):
  docker compose up -d postgres
  # schema auto-applies from drizzle/0000_init.sql
  # then: psql postgresql://reve:reve@localhost:5433/reve -f drizzle/seed_catalog.sql

Next (when Vercel account is linked once):
  npx vercel link --yes
  npx vercel env pull .env.local
  # add Neon/Blob/Clerk from Marketplace, then:
  npm run db:migrate:data
  npm run db:migrate:images
  npx vercel --prod

HitPay webhook (after prod deploy):
  https://reveclothingxnobody.com/api/webhooks/hitpay

Local Next.js (with DATABASE_URL):
  set DATABASE_URL=postgresql://reve:reve@localhost:5433/reve
  set ALLOW_DEV_ADMIN=1
  npm run dev
`);

process.exit(0);
