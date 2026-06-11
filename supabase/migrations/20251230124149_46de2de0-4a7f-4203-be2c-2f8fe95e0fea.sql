-- Create size enum (idempotent)
DO $$ BEGIN
  CREATE TYPE public.product_size AS ENUM ('S', 'M', 'L', 'XL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create product variants table with size-specific stock
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size product_size NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  sku_suffix TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_id, size)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can insert product variants" ON public.product_variants;
CREATE POLICY "Admins can insert product variants" 
ON public.product_variants 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update product variants" ON public.product_variants;
CREATE POLICY "Admins can update product variants" 
ON public.product_variants 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete product variants" ON public.product_variants;
CREATE POLICY "Admins can delete product variants" 
ON public.product_variants 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to reserve stock for a specific size variant
CREATE OR REPLACE FUNCTION public.reserve_variant_stock(_product_id uuid, _size product_size, _quantity integer)
RETURNS TABLE(success boolean, available_stock integer, product_price numeric, product_name text, product_sku text, variant_sku_suffix text, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock INTEGER;
  p_price NUMERIC;
  p_name TEXT;
  p_sku TEXT;
  p_active BOOLEAN;
  v_sku_suffix TEXT;
BEGIN
  -- Get product info
  SELECT price, name, sku, products.is_active 
  INTO p_price, p_name, p_sku, p_active
  FROM public.products
  WHERE id = _product_id
  FOR UPDATE;
  
  -- Check if product exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0::NUMERIC, ''::TEXT, NULL::TEXT, NULL::TEXT, false;
    RETURN;
  END IF;
  
  -- Check if product is active
  IF NOT p_active THEN
    RETURN QUERY SELECT false, 0, p_price, p_name, p_sku, NULL::TEXT, false;
    RETURN;
  END IF;
  
  -- Lock variant row and get current stock
  SELECT pv.stock_quantity, pv.sku_suffix
  INTO current_stock, v_sku_suffix
  FROM public.product_variants pv
  WHERE pv.product_id = _product_id AND pv.size = _size
  FOR UPDATE;
  
  -- Check if variant exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, p_price, p_name, p_sku, NULL::TEXT, true;
    RETURN;
  END IF;
  
  -- Check if enough stock
  IF current_stock < _quantity THEN
    RETURN QUERY SELECT false, current_stock, p_price, p_name, p_sku, v_sku_suffix, true;
    RETURN;
  END IF;
  
  -- Decrement stock atomically
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - _quantity
  WHERE product_id = _product_id AND size = _size;
  
  -- Also update the main product stock_quantity (sum of all variants)
  UPDATE public.products
  SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0)
    FROM public.product_variants
    WHERE product_variants.product_id = _product_id
  )
  WHERE id = _product_id;
  
  RETURN QUERY SELECT true, current_stock - _quantity, p_price, p_name, p_sku, v_sku_suffix, true;
END;
$$;

-- Create function to restore variant stock
CREATE OR REPLACE FUNCTION public.restore_variant_stock(_product_id uuid, _size product_size, _quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity + _quantity
  WHERE product_id = _product_id AND size = _size;
  
  -- Also update the main product stock_quantity (sum of all variants)
  UPDATE public.products
  SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0)
    FROM public.product_variants
    WHERE product_variants.product_id = _product_id
  )
  WHERE id = _product_id;
END;
$$;

-- Function to sync product stock from variants (for use after variant updates)
CREATE OR REPLACE FUNCTION public.sync_product_stock_from_variants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0)
    FROM public.product_variants
    WHERE product_variants.product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to keep product stock synced with variants
DROP TRIGGER IF EXISTS sync_product_stock_on_variant_change ON public.product_variants;
CREATE TRIGGER sync_product_stock_on_variant_change
AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_stock_from_variants();

-- Create initial variants for existing products (all sizes with 0 stock initially)
-- The admin will need to update the actual stock per size
INSERT INTO public.product_variants (product_id, size, stock_quantity, low_stock_threshold)
SELECT p.id, s.size, 0, 5
FROM public.products p
CROSS JOIN (VALUES ('S'::product_size), ('M'::product_size), ('L'::product_size), ('XL'::product_size)) AS s(size)
ON CONFLICT (product_id, size) DO NOTHING;

-- Add size column to order_items for tracking which size was ordered
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS size TEXT;