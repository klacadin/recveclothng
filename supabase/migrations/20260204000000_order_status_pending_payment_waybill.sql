-- Add new order statuses: pending_payment, preparing, for_pickup
-- Flow: pending_payment → (proof validated) preparing → (waybill printed) for_pickup → shipped/completed via J&T

ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'preparing';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'for_pickup';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'for_verification';

-- Add waybill number for J&T (set when store prints waybill; tracking from J&T API later)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS waybill_number text;

COMMENT ON COLUMN public.orders.waybill_number IS 'J&T waybill/tracking number; set when waybill is printed, status becomes for_pickup';

-- Reference number entered by store manager when verifying proof of payment
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_reference_number text;

COMMENT ON COLUMN public.orders.payment_reference_number IS 'Reference number entered by store manager when verifying proof of payment';
