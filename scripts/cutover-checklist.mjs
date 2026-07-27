/**
 * Prints cutover checklist for Supabase → Vercel production switch.
 * Run: node scripts/cutover-checklist.mjs
 */
const steps = [
  "1. Provision Vercel Postgres, Blob, Clerk on the Vercel project (Marketplace).",
  "2. Set env on Vercel: DATABASE_URL, BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, HITPAY_API_KEY, HITPAY_WEBHOOK_SALT, APP_URL, CRON_SECRET.",
  "3. Apply schema: psql $DATABASE_URL -f drizzle/0000_init.sql",
  "4. Migrate data: node scripts/migrate-supabase-to-vercel.mjs",
  "5. Migrate images: node scripts/migrate-images-to-blob.mjs",
  "6. Set Clerk publicMetadata.role=admin for owner account.",
  "7. Deploy Preview and smoke-test checkout + HitPay sandbox.",
  "8. Freeze orders ~1h. Final delta migrate.",
  "9. Point HitPay webhook to https://reveclothingxnobody.com/api/webhooks/hitpay",
  "10. Promote Production on Vercel (live001 / main).",
  "11. Smoke test: shop → checkout → paid → admin → affiliate attribution.",
  "12. Pause Supabase project; keep 7-day rollback buffer; then cancel billing.",
];

console.log("\nREVE Clothing — Vercel cutover checklist\n");
for (const s of steps) console.log(s);
console.log("");
