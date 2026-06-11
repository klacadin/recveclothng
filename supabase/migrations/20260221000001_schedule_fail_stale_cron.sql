-- Cron: Mark pending_payment orders as failed after 2 hours (runs every 15 min)
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'fail-stale-pending-payments',
  '*/15 * * * *',
  $$UPDATE public.orders SET status = 'failed', updated_at = now() WHERE status = 'pending_payment' AND created_at < now() - interval '2 hours'$$
);
