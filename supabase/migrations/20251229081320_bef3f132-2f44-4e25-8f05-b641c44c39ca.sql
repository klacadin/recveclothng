-- Add images array column to products table for multiple product images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];