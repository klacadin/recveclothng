-- Add category codes: SHRT, SHORT, SING, LSLV
-- Run in: https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new

-- Add code column
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_categories_code ON public.categories(code);

-- Update existing categories
UPDATE public.categories SET code = 'SHRT' WHERE name ILIKE '%Running Shirt%';
UPDATE public.categories SET code = 'SHORT' WHERE name ILIKE '%Running Shorts%';
UPDATE public.categories SET code = 'SING' WHERE name ILIKE '%Running Singlets%';
UPDATE public.categories SET code = 'LSLV' WHERE name ILIKE '%Running Long Sleeves%';
-- NOBODY is a sub-brand, not a category; do not assign code to NOBODY Collection
-- UPDATE public.categories SET code = 'NOBODY' WHERE name ILIKE '%NOBODY%'; -- removed

-- Verify
SELECT name, code, slug FROM public.categories ORDER BY sort_order;
