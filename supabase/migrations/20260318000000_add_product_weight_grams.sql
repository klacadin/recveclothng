-- Add product weight for shipping calculations (J&T weight tiers)
-- Stored in grams to avoid floating point issues.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight_grams integer;
-- Sensible default for apparel if missing (can be edited in Admin):
-- 250g per item (t-shirt/singlet range). Adjust per product as needed.
UPDATE public.products
SET weight_grams = COALESCE(weight_grams, 250)
WHERE weight_grams IS NULL;
-- Basic guardrail
DO $$ BEGIN
  IF NOT EXISTS (
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
