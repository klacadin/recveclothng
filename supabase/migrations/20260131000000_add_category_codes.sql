-- Add category codes for REVE Clothing (idempotent; no-op if public.categories does not exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;
    UPDATE public.categories SET code = 'SHRT' WHERE (name ILIKE '%Running Shirt%') AND (code IS NULL OR code = '');
    UPDATE public.categories SET code = 'SHORT' WHERE name ILIKE '%Running Shorts%' AND (code IS NULL OR code = '');
    UPDATE public.categories SET code = 'SING' WHERE name ILIKE '%Running Singlets%' AND (code IS NULL OR code = '');
    UPDATE public.categories SET code = 'LSLV' WHERE name ILIKE '%Running Long Sleeves%' AND (code IS NULL OR code = '');
    UPDATE public.categories SET code = 'NOBODY' WHERE name ILIKE '%NOBODY Collection%' AND (code IS NULL OR code = '');
  END IF;
END $$;

