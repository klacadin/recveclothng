# Cron: Payment reminder emails at 30m, 1h, 90m

Sends friendly "Your order is reserved for you" reminders to customers with pending HitPay payments (GCash/Maya/Bank Transfer) at 30 minutes, 1 hour, and 90 minutes after order creation.

## Prerequisites

1. Run the migration for reminder columns: `supabase db push` (includes `20260221000002_add_payment_reminder_columns.sql`)
2. Deploy the `send-payment-reminders` Edge Function
3. Enable **pg_net** and **pg_cron** in Supabase Dashboard → Database → Extensions

## Option A: pg_cron + pg_net (recommended)

Run in **Dashboard → SQL Editor** (replace placeholders with your project URL and anon key):

```sql
-- Enable pg_net if not already enabled
create extension if not exists pg_net with schema extensions;

-- Schedule payment reminders every 10 minutes
select cron.schedule(
  'send-payment-reminders',
  '*/10 * * * *',
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-payment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

If using `CRON_SECRET`, add it to the headers:
```sql
'x-cron-secret', 'YOUR_CRON_SECRET'
```

## Option B: External cron service

Use [cron-job.org](https://cron-job.org), Vercel Cron, or GitHub Actions to POST every 10–15 minutes to:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-payment-reminders
```

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_ANON_KEY`
- (Optional) `x-cron-secret: YOUR_CRON_SECRET` if `CRON_SECRET` is set

## Verify

- **Dashboard → Edge Functions → send-payment-reminders** — check logs after a run
- **Dashboard → Integrations → Cron** — verify job is scheduled (Option A)
