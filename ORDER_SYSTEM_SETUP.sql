-- =====================================================
-- ORDER SYSTEM SETUP for REVE Clothing
-- Run this in: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
-- =====================================================
-- This sets up the complete order processing system including:
-- - Order status and payment method enums
-- - Orders and order_items tables
-- - Product size variants for stock management
-- - Rate limiting and duplicate order prevention
-- - Stock reservation functions
-- =====================================================

-- =====================================================
-- PREREQUISITES: Create required types and functions
-- =====================================================

-- Create app_role enum (used by has_role function)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function (used by RLS policies)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create update_updated_at_column function (used by triggers)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- MAIN SETUP: Order system tables and functions
-- =====================================================

-- Step 1: Create ENUMs (skip if already exist)
DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('new', 'paid', 'packed', 'shipped', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('cod', 'gcash', 'maya', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.product_size AS ENUM ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add missing size values to existing enum (safe to run multiple times)
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS 'XS' BEFORE 'S';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '2XL';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '3XL';

-- Step 2: Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'new',
  payment_method payment_method NOT NULL DEFAULT 'cod',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 4: Create product_variants table for size-specific stock
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

-- Step 5: Create order_rate_limits table
CREATE TABLE IF NOT EXISTS public.order_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_order_rate_limits_ip_created ON public.order_rate_limits (ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_rate_limits_email_created ON public.order_rate_limits (customer_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- Step 7: Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_rate_limits ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for orders
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Admins can delete orders"
ON public.orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 9: Create RLS policies for order_items
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;

CREATE POLICY "Authenticated users can view order items"
ON public.order_items FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert order items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items"
ON public.order_items FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Admins can delete order items"
ON public.order_items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 10: Create RLS policies for product_variants
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can insert product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can update product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can delete product variants" ON public.product_variants;

CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert product variants" 
ON public.product_variants FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product variants" 
ON public.product_variants FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product variants" 
ON public.product_variants FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Step 11: Create RLS policies for order_rate_limits
DROP POLICY IF EXISTS "Admins can view rate limits" ON public.order_rate_limits;
DROP POLICY IF EXISTS "Admins can insert rate limits" ON public.order_rate_limits;
DROP POLICY IF EXISTS "Admins can delete rate limits" ON public.order_rate_limits;

CREATE POLICY "Admins can view rate limits"
ON public.order_rate_limits FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert rate limits"
ON public.order_rate_limits FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rate limits"
ON public.order_rate_limits FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Step 12: Create stock reservation functions
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
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0::NUMERIC, ''::TEXT, NULL::TEXT, NULL::TEXT, false;
    RETURN;
  END IF;
  
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
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, p_price, p_name, p_sku, NULL::TEXT, true;
    RETURN;
  END IF;
  
  IF current_stock < _quantity THEN
    RETURN QUERY SELECT false, current_stock, p_price, p_name, p_sku, v_sku_suffix, true;
    RETURN;
  END IF;
  
  -- Decrement stock atomically
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - _quantity
  WHERE product_id = _product_id AND size = _size;
  
  -- Update main product stock
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
  
  UPDATE public.products
  SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0)
    FROM public.product_variants
    WHERE product_variants.product_id = _product_id
  )
  WHERE id = _product_id;
END;
$$;

-- Step 13: Create rate limiting functions
CREATE OR REPLACE FUNCTION public.check_order_rate_limit(
  _ip_address TEXT,
  _customer_email TEXT,
  _max_orders_per_hour INTEGER DEFAULT 5
)
RETURNS TABLE(allowed BOOLEAN, orders_in_last_hour INTEGER) AS $$
DECLARE
  ip_count INTEGER;
  email_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO ip_count
  FROM public.order_rate_limits
  WHERE ip_address = _ip_address
    AND created_at > now() - interval '1 hour';
  
  SELECT COUNT(*) INTO email_count
  FROM public.order_rate_limits
  WHERE customer_email = _customer_email
    AND created_at > now() - interval '1 hour';
  
  total_count := GREATEST(ip_count, email_count);
  
  IF total_count >= _max_orders_per_hour THEN
    RETURN QUERY SELECT false, total_count;
  ELSE
    RETURN QUERY SELECT true, total_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_duplicate_order(
  _customer_email TEXT,
  _total NUMERIC,
  _minutes INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM public.orders
  WHERE customer_email = _customer_email
    AND total = _total
    AND created_at > now() - (_minutes || ' minutes')::interval;
  
  RETURN duplicate_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 14: Create cleanup functions
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.order_rate_limits WHERE created_at < now() - interval '24 hours';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_rate_limits_trigger ON public.order_rate_limits;
CREATE TRIGGER cleanup_rate_limits_trigger
  AFTER INSERT ON public.order_rate_limits
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_rate_limits();

-- Step 15: Create sync function for product stock from variants
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

DROP TRIGGER IF EXISTS sync_product_stock_on_variant_change ON public.product_variants;
CREATE TRIGGER sync_product_stock_on_variant_change
AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_stock_from_variants();

-- Step 16: Create updated_at trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 17: Create updated_at trigger for product_variants
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Verification: Check if tables were created successfully
-- =====================================================
SELECT 
  'Order system setup complete!' as status,
  (SELECT COUNT(*) FROM public.orders) as total_orders,
  (SELECT COUNT(*) FROM public.product_variants) as total_variants;
