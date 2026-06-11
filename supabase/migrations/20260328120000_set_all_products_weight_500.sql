-- Set every catalog item to 0.5 kg (500 g) for J&T shipping calculations.
UPDATE public.products
SET weight_grams = 500
WHERE weight_grams IS DISTINCT FROM 500;
