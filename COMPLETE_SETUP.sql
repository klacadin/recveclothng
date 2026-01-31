-- =====================================================
-- COMPLETE DATABASE SETUP for REVE Clothing
-- Run this in: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
-- =====================================================
-- This is a comprehensive setup that includes ALL required:
-- - Types and enums
-- - Utility functions
-- - User approval system
-- - OTP verification system
-- - Order processing system
-- =====================================================

-- =====================================================
-- PART 1: PREREQUISITES (Types and Functions)
-- =====================================================

-- Create app_role enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create order_status enum
DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('new', 'paid', 'packed', 'shipped', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create payment_method enum
DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('cod', 'gcash', 'maya', 'bank_transfer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create product_size enum
DO $$ BEGIN
    CREATE TYPE public.product_size AS ENUM ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Add missing size values to existing enum (safe to run multiple times)
DO $$ BEGIN
    ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS 'XS' BEFORE 'S';
EXCEPTION WHEN others THEN null;
END $$;
DO $$ BEGIN
    ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '2XL';
EXCEPTION WHEN others THEN null;
END $$;
DO $$ BEGIN
    ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '3XL';
EXCEPTION WHEN others THEN null;
END $$;

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- PART 2: USER ROLES SYSTEM
-- =====================================================

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PART 3: USER APPROVAL SYSTEM
-- =====================================================

-- Create user_approvals table
CREATE TABLE IF NOT EXISTS public.user_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.user_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_approvals
DROP POLICY IF EXISTS "Users can view their own approval status" ON public.user_approvals;
CREATE POLICY "Users can view their own approval status" ON public.user_approvals
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all approval statuses" ON public.user_approvals;
CREATE POLICY "Admins can view all approval statuses" ON public.user_approvals
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update approval statuses" ON public.user_approvals;
CREATE POLICY "Admins can update approval statuses" ON public.user_approvals
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert approval records" ON public.user_approvals;
CREATE POLICY "System can insert approval records" ON public.user_approvals
FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for user_approvals
CREATE INDEX IF NOT EXISTS idx_user_approvals_user_id ON public.user_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_approvals_status ON public.user_approvals(status);

-- Auto-create approval record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_approvals (user_id, status)
  VALUES (NEW.id, 'approved')  -- Auto-approve for now
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create approval record for existing users who don't have one
INSERT INTO public.user_approvals (user_id, status)
SELECT id, 'approved' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_approvals)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- PART 4: OTP VERIFICATION SYSTEM
-- =====================================================

-- Create checkout_otps table
CREATE TABLE IF NOT EXISTS public.checkout_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.checkout_otps ENABLE ROW LEVEL SECURITY;

-- RLS policies for checkout_otps
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.checkout_otps;
CREATE POLICY "Users can view their own OTPs" ON public.checkout_otps
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage OTPs" ON public.checkout_otps;
CREATE POLICY "Admins can manage OTPs" ON public.checkout_otps
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes for checkout_otps
CREATE INDEX IF NOT EXISTS idx_checkout_otps_user_email ON public.checkout_otps(user_id, email);
CREATE INDEX IF NOT EXISTS idx_checkout_otps_expires_at ON public.checkout_otps(expires_at);

-- Cleanup expired OTPs function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.checkout_otps WHERE expires_at < now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_otps_on_insert ON public.checkout_otps;
CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.checkout_otps
FOR EACH STATEMENT EXECUTE FUNCTION public.cleanup_expired_otps();

-- =====================================================
-- PART 5: ORDERS SYSTEM
-- =====================================================

-- Create orders table
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
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create order_items table
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
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create product_variants table
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
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create order_rate_limits table
CREATE TABLE IF NOT EXISTS public.order_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.order_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_rate_limits_ip_created ON public.order_rate_limits (ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_rate_limits_email_created ON public.order_rate_limits (customer_email, created_at DESC);

-- RLS policies for orders
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Authenticated users can view orders" ON public.orders
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
CREATE POLICY "Authenticated users can insert orders" ON public.orders
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders" ON public.orders
FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for order_items
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
CREATE POLICY "Authenticated users can view order items" ON public.order_items
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
CREATE POLICY "Authenticated users can insert order items" ON public.order_items
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;
CREATE POLICY "Authenticated users can update order items" ON public.order_items
FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;
CREATE POLICY "Admins can delete order items" ON public.order_items
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for product_variants
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;
CREATE POLICY "Admins can manage product variants" ON public.product_variants
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for order_rate_limits
DROP POLICY IF EXISTS "Admins can manage rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can manage rate limits" ON public.order_rate_limits
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PART 6: ORDER FUNCTIONS
-- =====================================================

-- Reserve variant stock function
CREATE OR REPLACE FUNCTION public.reserve_variant_stock(_product_id uuid, _size product_size, _quantity integer)
RETURNS TABLE(success boolean, available_stock integer, product_price numeric, product_name text, product_sku text, variant_sku_suffix text, is_active boolean)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  current_stock INTEGER;
  p_price NUMERIC;
  p_name TEXT;
  p_sku TEXT;
  p_active BOOLEAN;
  v_sku_suffix TEXT;
BEGIN
  SELECT price, name, sku, products.is_active INTO p_price, p_name, p_sku, p_active
  FROM public.products WHERE id = _product_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0::NUMERIC, ''::TEXT, NULL::TEXT, NULL::TEXT, false;
    RETURN;
  END IF;
  
  IF NOT p_active THEN
    RETURN QUERY SELECT false, 0, p_price, p_name, p_sku, NULL::TEXT, false;
    RETURN;
  END IF;
  
  SELECT pv.stock_quantity, pv.sku_suffix INTO current_stock, v_sku_suffix
  FROM public.product_variants pv
  WHERE pv.product_id = _product_id AND pv.size = _size FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, p_price, p_name, p_sku, NULL::TEXT, true;
    RETURN;
  END IF;
  
  IF current_stock < _quantity THEN
    RETURN QUERY SELECT false, current_stock, p_price, p_name, p_sku, v_sku_suffix, true;
    RETURN;
  END IF;
  
  UPDATE public.product_variants SET stock_quantity = stock_quantity - _quantity
  WHERE product_id = _product_id AND size = _size;
  
  UPDATE public.products SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0) FROM public.product_variants WHERE product_variants.product_id = _product_id
  ) WHERE id = _product_id;
  
  RETURN QUERY SELECT true, current_stock - _quantity, p_price, p_name, p_sku, v_sku_suffix, true;
END;
$$;

-- Restore variant stock function
CREATE OR REPLACE FUNCTION public.restore_variant_stock(_product_id uuid, _size product_size, _quantity integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.product_variants SET stock_quantity = stock_quantity + _quantity
  WHERE product_id = _product_id AND size = _size;
  
  UPDATE public.products SET stock_quantity = (
    SELECT COALESCE(SUM(stock_quantity), 0) FROM public.product_variants WHERE product_variants.product_id = _product_id
  ) WHERE id = _product_id;
END;
$$;

-- Check order rate limit function
CREATE OR REPLACE FUNCTION public.check_order_rate_limit(_ip_address TEXT, _customer_email TEXT, _max_orders_per_hour INTEGER DEFAULT 5)
RETURNS TABLE(allowed BOOLEAN, orders_in_last_hour INTEGER) AS $$
DECLARE
  ip_count INTEGER;
  email_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO ip_count FROM public.order_rate_limits
  WHERE ip_address = _ip_address AND created_at > now() - interval '1 hour';
  
  SELECT COUNT(*) INTO email_count FROM public.order_rate_limits
  WHERE customer_email = _customer_email AND created_at > now() - interval '1 hour';
  
  total_count := GREATEST(ip_count, email_count);
  
  IF total_count >= _max_orders_per_hour THEN
    RETURN QUERY SELECT false, total_count;
  ELSE
    RETURN QUERY SELECT true, total_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check duplicate order function
CREATE OR REPLACE FUNCTION public.check_duplicate_order(_customer_email TEXT, _total NUMERIC, _minutes INTEGER DEFAULT 5)
RETURNS BOOLEAN AS $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count FROM public.orders
  WHERE customer_email = _customer_email AND total = _total
    AND created_at > now() - (_minutes || ' minutes')::interval;
  RETURN duplicate_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Cleanup old rate limits function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.order_rate_limits WHERE created_at < now() - interval '24 hours';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_rate_limits_trigger ON public.order_rate_limits;
CREATE TRIGGER cleanup_rate_limits_trigger
  AFTER INSERT ON public.order_rate_limits
  FOR EACH STATEMENT EXECUTE FUNCTION public.cleanup_old_rate_limits();

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Setup complete!' as status,
  (SELECT COUNT(*) FROM public.user_approvals) as user_approvals_count,
  (SELECT COUNT(*) FROM public.orders) as orders_count,
  (SELECT COUNT(*) FROM public.products WHERE is_active = true) as active_products;
