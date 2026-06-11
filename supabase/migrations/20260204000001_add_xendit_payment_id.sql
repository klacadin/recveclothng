-- Add xendit_payment_id column to orders table
-- This stores the Xendit payment request ID for tracking payment status

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS xendit_payment_id text;

COMMENT ON COLUMN public.orders.xendit_payment_id IS 'Xendit Payment Request ID (e.g., pr-xxx) for tracking payment status via Xendit API';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_xendit_payment_id ON public.orders(xendit_payment_id) WHERE xendit_payment_id IS NOT NULL;
