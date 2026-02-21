-- Cron: Mark pending_payment orders as failed after 2 hours (runs every 15 min)
-- Prerequisite: Enable Cron in Supabase Dashboard → Project Settings → Integrations → Cron
-- Then run: supabase migration up (or run this file in SQL Editor)
SELECT cron.schedule(
  'fail-stale-pending-payments',
  '*/15 * * * *',
  $$UPDATE public.orders SET status = 'failed', updated_at = now() WHERE status = 'pending_payment' AND created_at < now() - interval '2 hours'$$
);
