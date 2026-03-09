-- Add audit columns to products: date/time added, last updated, and who made changes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS created_by_email TEXT,
  ADD COLUMN IF NOT EXISTS updated_by_email TEXT;

COMMENT ON COLUMN public.products.created_by_email IS 'Email of admin who created the product';
COMMENT ON COLUMN public.products.updated_by_email IS 'Email of admin who last updated the product';
