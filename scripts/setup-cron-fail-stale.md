# Cron: Auto-fail pending_payment orders after 2 hours

Orders with `pending_payment` status are automatically marked `failed` if not paid within 2 hours. The cron runs every 15 minutes.

## Setup (one-time)

### 1. Enable Cron in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/unaodlytdymouicuuywb) → **Integrations**
2. Find **Cron** and click to enable it (enables `pg_cron`)

### 2. Run the cron migration

```bash
supabase db push --linked
```

Or run the SQL manually in **Dashboard → SQL Editor**:

```sql
SELECT cron.schedule(
  'fail-stale-pending-payments',
  '*/15 * * * *',
  $$UPDATE public.orders SET status = 'failed', updated_at = now() WHERE status = 'pending_payment' AND created_at < now() - interval '2 hours'$$
);
```

### 3. Verify

**Dashboard → Integrations → Cron → Jobs** — you should see `fail-stale-pending-payments` scheduled `*/15 * * * *` (every 15 min).
