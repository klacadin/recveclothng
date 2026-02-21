-- Add columns to track which payment reminder emails have been sent
-- Used by send-payment-reminders to avoid duplicate reminders at 30m, 60m, 90m

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_reminder_30_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_reminder_60_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_reminder_90_at TIMESTAMPTZ;

COMMENT ON COLUMN public.orders.payment_reminder_30_at IS 'When 30-min payment reminder email was sent (HitPay pending orders)';
COMMENT ON COLUMN public.orders.payment_reminder_60_at IS 'When 60-min payment reminder email was sent';
COMMENT ON COLUMN public.orders.payment_reminder_90_at IS 'When 90-min (final) payment reminder email was sent';
