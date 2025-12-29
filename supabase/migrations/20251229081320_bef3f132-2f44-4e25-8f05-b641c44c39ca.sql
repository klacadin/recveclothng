-- Add images array column to products table for multiple product images
ALTER TABLE public.products 
ADD COLUMN images text[] DEFAULT '{}'::text[];