-- Add new size values to the product_size enum
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS 'XS' BEFORE 'S';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '2XL' AFTER 'XL';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '3XL' AFTER '2XL';