-- Add category codes for REVE Clothing
-- Run in: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new

-- Add code column
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;

-- Update existing categories with codes
UPDATE public.categories SET code = 'SHRT' WHERE (name ILIKE '%Running Shirt%') AND (code IS NULL OR code = '');
UPDATE public.categories SET code = 'SHORT' WHERE name ILIKE '%Running Shorts%' AND (code IS NULL OR code = '');
UPDATE public.categories SET code = 'SING' WHERE name ILIKE '%Running Singlets%' AND (code IS NULL OR code = '');
UPDATE public.categories SET code = 'LSLV' WHERE name ILIKE '%Running Long Sleeves%' AND (code IS NULL OR code = '');
UPDATE public.categories SET code = 'NOBODY' WHERE name ILIKE '%NOBODY Collection%' AND (code IS NULL OR code = '');

