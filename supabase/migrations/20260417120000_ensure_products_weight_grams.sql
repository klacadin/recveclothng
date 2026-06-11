-- Repair: some environments never applied 20260318000000_add_product_weight_grams.sql.
-- Fully idempotent so `db push` / remote apply is safe.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight_grams integer;
UPDATE public.products
SET weight_grams = COALESCE(weight_grams, 250)
WHERE weight_grams IS NULL;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM pg_constraint
  WHERE conname = 'products_weight_grams_positive'
) THEN
ALTER TABLE public.products
ADD CONSTRAINT products_weight_grams_positive CHECK (
    weight_grams IS NULL
    OR weight_grams > 0
  );
END IF;
END $$;