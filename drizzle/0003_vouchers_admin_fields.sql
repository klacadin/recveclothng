-- Expand vouchers table to match admin voucher management fields
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS min_order_amount numeric(12,2) DEFAULT 0;
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS product_ids jsonb DEFAULT '[]'::jsonb;
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS category_ids jsonb DEFAULT '[]'::jsonb;
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
