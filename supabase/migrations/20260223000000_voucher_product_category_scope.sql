-- Add scope columns to vouchers: restrict discount to specific products or categories
-- When both product_ids and category_ids are empty, voucher applies to entire order

ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS product_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}';

COMMENT ON COLUMN public.vouchers.product_ids IS 'When non-empty: discount applies only to these product IDs';
COMMENT ON COLUMN public.vouchers.category_ids IS 'When non-empty: discount applies only to products in these categories (matches products.category to categories.name)';
