-- Add 'failed' status for orders where payment was not completed within 2 hours
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'failed';
