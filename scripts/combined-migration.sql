-- =====================================================
-- Combined Migration Script for Supabase Project
-- Project ID: unaodlytdymouicuuywb
--
-- Auto-generated from supabase/migrations/*.sql
-- Run this in:
-- https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new
-- =====================================================

-- IMPORTANT:
-- - This script is generated in timestamp order.
-- - Review before execution on production.

-- =====================================================
-- Migration 1: 20250129000000_add_user_approval_system.sql
-- Source: supabase/migrations/20250129000000_add_user_approval_system.sql
-- =====================================================

-- Create user_approvals table to track user approval status
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

-- Create role enum and helper up front so later RLS policies can call has_role()
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Minimal roles table bootstrap so has_role() can be created immediately
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

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

-- Enable RLS on user_approvals
ALTER TABLE public.user_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_approvals (drop first so migration is idempotent)
DROP POLICY IF EXISTS "Users can view their own approval status" ON public.user_approvals;
CREATE POLICY "Users can view their own approval status"
ON public.user_approvals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all approval statuses" ON public.user_approvals;
CREATE POLICY "Admins can view all approval statuses"
ON public.user_approvals
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update approval statuses" ON public.user_approvals;
CREATE POLICY "Admins can update approval statuses"
ON public.user_approvals
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert approval records" ON public.user_approvals;
CREATE POLICY "System can insert approval records"
ON public.user_approvals
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to automatically create pending approval on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_approvals (user_id, status)
  VALUES (NEW.id, 'pending')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT status = 'approved' FROM public.user_approvals WHERE user_id = _user_id),
    false
  );
$$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_approvals_user_id ON public.user_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_approvals_status ON public.user_approvals(status);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.user_approvals TO authenticated;


-- =====================================================
-- Migration 2: 20251228213122_d7b1b660-3777-4c0c-b5ff-963862f04e0a.sql
-- Source: supabase/migrations/20251228213122_d7b1b660-3777-4c0c-b5ff-963862f04e0a.sql
-- =====================================================

-- Create products table for inventory management
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  category TEXT,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_logs table to track stock changes
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL CHECK (change_type IN ('restock', 'sale', 'adjustment', 'return')),
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read, authenticated write)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Create RLS policies for inventory_logs (authenticated only)
DROP POLICY IF EXISTS "Authenticated users can view inventory logs" ON public.inventory_logs;
CREATE POLICY "Authenticated users can view inventory logs" 
ON public.inventory_logs 
FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert inventory logs" ON public.inventory_logs;
CREATE POLICY "Authenticated users can insert inventory logs" 
ON public.inventory_logs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log inventory changes
CREATE OR REPLACE FUNCTION public.log_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stock_quantity != NEW.stock_quantity THEN
    INSERT INTO public.inventory_logs (
      product_id,
      change_type,
      quantity_change,
      previous_quantity,
      new_quantity,
      notes
    ) VALUES (
      NEW.id,
      CASE 
        WHEN NEW.stock_quantity > OLD.stock_quantity THEN 'restock'
        ELSE 'sale'
      END,
      NEW.stock_quantity - OLD.stock_quantity,
      OLD.stock_quantity,
      NEW.stock_quantity,
      'Automatic log from stock update'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically log inventory changes
DROP TRIGGER IF EXISTS log_product_inventory_change ON public.products;
CREATE TRIGGER log_product_inventory_change
AFTER UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.log_inventory_change();


-- =====================================================
-- Migration 3: 20251228213239_099e8a36-8111-4f24-8fd6-bdf28e11e49c.sql
-- Source: supabase/migrations/20251228213239_099e8a36-8111-4f24-8fd6-bdf28e11e49c.sql
-- =====================================================

-- Create app_role enum (idempotent: skip if already exists)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
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

-- RLS policies for user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));


-- =====================================================
-- Migration 4: 20251228213745_0500aa83-d321-4669-8113-9d1ba5ccac07.sql
-- Source: supabase/migrations/20251228213745_0500aa83-d321-4669-8113-9d1ba5ccac07.sql
-- =====================================================

-- Create order status enum (idempotent)
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('new', 'paid', 'packed', 'shipped', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create payment method enum (idempotent)
DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('cod', 'gcash', 'maya', 'bank_transfer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

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

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders RLS policies (authenticated users only)
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
CREATE POLICY "Authenticated users can insert orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
ON public.orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Order items RLS policies
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
CREATE POLICY "Authenticated users can view order items"
ON public.order_items FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
CREATE POLICY "Authenticated users can insert order items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;
CREATE POLICY "Authenticated users can update order items"
ON public.order_items FOR UPDATE TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;
CREATE POLICY "Admins can delete order items"
ON public.order_items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for orders updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-generate order number
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION public.generate_order_number();


-- =====================================================
-- Migration 5: 20251228214542_6c264398-e668-4101-8815-49d73372aafa.sql
-- Source: supabase/migrations/20251228214542_6c264398-e668-4101-8815-49d73372aafa.sql
-- =====================================================

-- Fix products RLS policies to restrict to admins only

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Create admin-only policies using the has_role function
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));


-- =====================================================
-- Migration 6: 20251228214939_718cb8df-0fe6-4a55-a9d6-42db5c55886c.sql
-- Source: supabase/migrations/20251228214939_718cb8df-0fe6-4a55-a9d6-42db5c55886c.sql
-- =====================================================

-- Fix orders RLS: Restrict order viewing to admins only
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

-- Only admins can view all orders (customers don't have accounts for their orders in this flow)
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can create orders (from admin dashboard)
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
CREATE POLICY "Admins can insert orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update orders
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix order_items RLS: Restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update order items" ON public.order_items;

-- Only admins can view order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can create order items
CREATE POLICY "Admins can insert order items" 
ON public.order_items 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update order items
CREATE POLICY "Admins can update order items" 
ON public.order_items 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix inventory_logs RLS: Restrict to admins only (contains business-sensitive data)
DROP POLICY IF EXISTS "Authenticated users can view inventory logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "Authenticated users can insert inventory logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "Admins can view inventory logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "Admins can insert inventory logs" ON public.inventory_logs;

-- Only admins can view inventory logs
CREATE POLICY "Admins can view inventory logs" 
ON public.inventory_logs 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert inventory logs (or the trigger)
CREATE POLICY "Admins can insert inventory logs" 
ON public.inventory_logs 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- =====================================================
-- Migration 7: 20251228215216_f396e934-aed5-4658-b571-bd882b7b2441.sql
-- Source: supabase/migrations/20251228215216_f396e934-aed5-4658-b571-bd882b7b2441.sql
-- =====================================================

-- Add server-side validation constraints for data integrity (idempotent: drop if exists then add)

-- Products table constraints
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_length;
ALTER TABLE public.products ADD CONSTRAINT products_name_length CHECK (length(name) <= 255);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_price_positive;
ALTER TABLE public.products ADD CONSTRAINT products_price_positive CHECK (price >= 0);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_stock_positive;
ALTER TABLE public.products ADD CONSTRAINT products_stock_positive CHECK (stock_quantity >= 0);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_threshold_positive;
ALTER TABLE public.products ADD CONSTRAINT products_threshold_positive CHECK (low_stock_threshold >= 0);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_length;
ALTER TABLE public.products ADD CONSTRAINT products_sku_length CHECK (sku IS NULL OR length(sku) <= 100);
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_length;
ALTER TABLE public.products ADD CONSTRAINT products_category_length CHECK (category IS NULL OR length(category) <= 100);

-- Orders table constraints
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_name_length;
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_name_length CHECK (length(customer_name) <= 255);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_email_format;
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_email_format CHECK (customer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_email_length;
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_email_length CHECK (length(customer_email) <= 320);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_shipping_address_length;
ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_address_length CHECK (length(shipping_address) <= 1000);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_phone_length;
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_phone_length CHECK (customer_phone IS NULL OR length(customer_phone) <= 50);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_subtotal_positive;
ALTER TABLE public.orders ADD CONSTRAINT orders_subtotal_positive CHECK (subtotal >= 0);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_total_positive;
ALTER TABLE public.orders ADD CONSTRAINT orders_total_positive CHECK (total >= 0);
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_shipping_fee_positive;
ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_fee_positive CHECK (shipping_fee >= 0);

-- Order items table constraints
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_name_length;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_name_length CHECK (length(product_name) <= 255);
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_quantity_positive;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_unit_price_positive;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_unit_price_positive CHECK (unit_price >= 0);
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_total_price_positive;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_total_price_positive CHECK (total_price >= 0);


-- =====================================================
-- Migration 8: 20251229081320_bef3f132-2f44-4e25-8f05-b641c44c39ca.sql
-- Source: supabase/migrations/20251229081320_bef3f132-2f44-4e25-8f05-b641c44c39ca.sql
-- =====================================================

-- Add images array column to products table for multiple product images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];


-- =====================================================
-- Migration 9: 20251229150418_79568509-d52e-445d-af8f-bae907ba0168.sql
-- Source: supabase/migrations/20251229150418_79568509-d52e-445d-af8f-bae907ba0168.sql
-- =====================================================

-- Create table for OTP codes
CREATE TABLE IF NOT EXISTS public.checkout_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checkout_otps ENABLE ROW LEVEL SECURITY;

-- Users can view their own OTPs
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.checkout_otps;
CREATE POLICY "Users can view their own OTPs"
ON public.checkout_otps
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own OTPs
DROP POLICY IF EXISTS "Users can insert their own OTPs" ON public.checkout_otps;
CREATE POLICY "Users can insert their own OTPs"
ON public.checkout_otps
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own OTPs
DROP POLICY IF EXISTS "Users can update their own OTPs" ON public.checkout_otps;
CREATE POLICY "Users can update their own OTPs"
ON public.checkout_otps
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_checkout_otps_user_email ON public.checkout_otps(user_id, email);

-- Cleanup old OTPs trigger function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.checkout_otps WHERE expires_at < now();
  RETURN NEW;
END;
$$;

-- Trigger to cleanup expired OTPs on new insert
DROP TRIGGER IF EXISTS cleanup_otps_on_insert ON public.checkout_otps;
CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.checkout_otps
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_expired_otps();


-- =====================================================
-- Migration 10: 20251229154543_0a809fe9-9ace-4e13-9303-1496fa5d9d28.sql
-- Source: supabase/migrations/20251229154543_0a809fe9-9ace-4e13-9303-1496fa5d9d28.sql
-- =====================================================

-- Create atomic stock reservation function to prevent race conditions
CREATE OR REPLACE FUNCTION public.reserve_product_stock(
  _product_id UUID,
  _quantity INTEGER
)
RETURNS TABLE(success BOOLEAN, available_stock INTEGER, product_price NUMERIC, product_name TEXT, product_sku TEXT, is_active BOOLEAN) AS $$
DECLARE
  current_stock INTEGER;
  p_price NUMERIC;
  p_name TEXT;
  p_sku TEXT;
  p_active BOOLEAN;
BEGIN
  -- Lock row and get current stock + price atomically
  SELECT stock_quantity, price, name, sku, products.is_active 
  INTO current_stock, p_price, p_name, p_sku, p_active
  FROM public.products
  WHERE id = _product_id
  FOR UPDATE;
  
  -- Check if product exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0::NUMERIC, ''::TEXT, NULL::TEXT, false;
    RETURN;
  END IF;
  
  -- Check if product is active
  IF NOT p_active THEN
    RETURN QUERY SELECT false, current_stock, p_price, p_name, p_sku, false;
    RETURN;
  END IF;
  
  -- Check if enough stock
  IF current_stock < _quantity THEN
    RETURN QUERY SELECT false, current_stock, p_price, p_name, p_sku, true;
    RETURN;
  END IF;
  
  -- Decrement stock atomically
  UPDATE public.products
  SET stock_quantity = stock_quantity - _quantity
  WHERE id = _product_id;
  
  RETURN QUERY SELECT true, current_stock - _quantity, p_price, p_name, p_sku, true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to restore stock if order fails
CREATE OR REPLACE FUNCTION public.restore_product_stock(
  _product_id UUID,
  _quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity + _quantity
  WHERE id = _product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create rate limiting table for order creation
CREATE TABLE IF NOT EXISTS public.order_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_order_rate_limits_ip_created 
ON public.order_rate_limits (ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_rate_limits_email_created 
ON public.order_rate_limits (customer_email, created_at DESC);

-- Enable RLS on rate limits table
ALTER TABLE public.order_rate_limits ENABLE ROW LEVEL SECURITY;

-- Clean up old rate limit entries (older than 24 hours)
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

-- Trigger to cleanup old rate limits on insert
DROP TRIGGER IF EXISTS cleanup_rate_limits_trigger ON public.order_rate_limits;
CREATE TRIGGER cleanup_rate_limits_trigger
  AFTER INSERT ON public.order_rate_limits
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_rate_limits();

-- Function to check rate limits
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
  -- Count orders from this IP in the last hour
  SELECT COUNT(*) INTO ip_count
  FROM public.order_rate_limits
  WHERE ip_address = _ip_address
    AND created_at > now() - interval '1 hour';
  
  -- Count orders from this email in the last hour
  SELECT COUNT(*) INTO email_count
  FROM public.order_rate_limits
  WHERE customer_email = _customer_email
    AND created_at > now() - interval '1 hour';
  
  -- Use the higher count
  total_count := GREATEST(ip_count, email_count);
  
  IF total_count >= _max_orders_per_hour THEN
    RETURN QUERY SELECT false, total_count;
  ELSE
    RETURN QUERY SELECT true, total_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check for duplicate orders
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


-- =====================================================
-- Migration 11: 20251229160729_5f8b8e61-874b-4f6e-a6b9-0ab4af658bb1.sql
-- Source: supabase/migrations/20251229160729_5f8b8e61-874b-4f6e-a6b9-0ab4af658bb1.sql
-- =====================================================

-- Add attempts column to checkout_otps table for brute-force protection
ALTER TABLE public.checkout_otps ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;


-- =====================================================
-- Migration 12: 20251229195204_41081dfe-cb13-4c9d-bfbd-b4f7a6cf5ece.sql
-- Source: supabase/migrations/20251229195204_41081dfe-cb13-4c9d-bfbd-b4f7a6cf5ece.sql
-- =====================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload product images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update product images
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete product images
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public read access to product images
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
CREATE POLICY "Product images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');


-- =====================================================
-- Migration 13: 20251229200036_2daf11ba-c093-433b-a9a3-2953dc205072.sql
-- Source: supabase/migrations/20251229200036_2daf11ba-c093-433b-a9a3-2953dc205072.sql
-- =====================================================

-- Add user_id column to orders table to link orders to authenticated users
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Add RLS policy for users to view their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (user_id = auth.uid());

-- Add RLS policy for users to view their own order items (via order lookup)
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);


-- =====================================================
-- Migration 14: 20251230030836_3cc27e43-1fb7-47e3-984b-9e37d090e8f7.sql
-- Source: supabase/migrations/20251230030836_3cc27e43-1fb7-47e3-984b-9e37d090e8f7.sql
-- =====================================================

-- Add proof of payment column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS proof_of_payment_url text,
ADD COLUMN IF NOT EXISTS proof_uploaded_at timestamp with time zone;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs bucket
DROP POLICY IF EXISTS "Users can upload their own payment proofs" ON storage.objects;
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can view their own payment proofs" ON storage.objects;
CREATE POLICY "Users can view their own payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Admins can view all payment proofs" ON storage.objects;
CREATE POLICY "Admins can view all payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND has_role(auth.uid(), 'admin')
);

-- Allow users to update their own orders with proof of payment
DROP POLICY IF EXISTS "Users can update proof of payment on their orders" ON public.orders;
CREATE POLICY "Users can update proof of payment on their orders"
ON public.orders FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- =====================================================
-- Migration 15: 20251230124149_46de2de0-4a7f-4203-be2c-2f8fe95e0fea.sql
-- Source: supabase/migrations/20251230124149_46de2de0-4a7f-4203-be2c-2f8fe95e0fea.sql
-- =====================================================

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


-- =====================================================
-- Migration 16: 20251230131949_334e25e3-ad82-4e71-92c0-cf135555280a.sql
-- Source: supabase/migrations/20251230131949_334e25e3-ad82-4e71-92c0-cf135555280a.sql
-- =====================================================

-- Add new size values to the product_size enum
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS 'XS' BEFORE 'S';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '2XL' AFTER 'XL';
ALTER TYPE public.product_size ADD VALUE IF NOT EXISTS '3XL' AFTER '2XL';


-- =====================================================
-- Migration 17: 20251230133141_9baaa806-c9d9-4efb-929d-2d52917673f9.sql
-- Source: supabase/migrations/20251230133141_9baaa806-c9d9-4efb-929d-2d52917673f9.sql
-- =====================================================

-- Drop existing policies that use 'public' role, then recreate with 'authenticated' role only (idempotent)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update proof of payment on their orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update proof of payment on their orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));


-- =====================================================
-- Migration 18: 20260101140944_fae4e0fb-1690-46df-8982-ad8958a9eda5.sql
-- Source: supabase/migrations/20260101140944_fae4e0fb-1690-46df-8982-ad8958a9eda5.sql
-- =====================================================

-- =====================================================
-- FIX 1: order_rate_limits - Add RLS policies (ERROR level)
-- This table is only accessed by edge functions with service role key,
-- but needs policies defined to not be completely inaccessible.
-- Adding admin-only access for visibility and cleanup.
-- =====================================================

DROP POLICY IF EXISTS "Admins can view rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can view rate limits"
ON public.order_rate_limits
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can insert rate limits"
ON public.order_rate_limits
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete rate limits" ON public.order_rate_limits;
CREATE POLICY "Admins can delete rate limits"
ON public.order_rate_limits
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX 2: checkout_otps - Remove user INSERT/UPDATE policies (WARN level)
-- OTPs must ONLY be created/modified via edge functions (service role).
-- Allowing client-side INSERT/UPDATE creates bypass vulnerability.
-- =====================================================

DROP POLICY IF EXISTS "Users can insert their own OTPs" ON public.checkout_otps;
DROP POLICY IF EXISTS "Users can update their own OTPs" ON public.checkout_otps;

-- Add admin policy for OTP management
DROP POLICY IF EXISTS "Admins can manage OTPs" ON public.checkout_otps;
CREATE POLICY "Admins can manage OTPs"
ON public.checkout_otps
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- =====================================================
-- Migration 19: 20260130000000_sync_canonical_nobody_products.sql
-- Source: supabase/migrations/20260130000000_sync_canonical_nobody_products.sql
-- =====================================================

-- Sync database with canonical NOBODY products (36 items from REVE CLOTHING spreadsheet).
-- 1) Deactivate products in old/unused categories.
-- 2) Upsert the 36 NOBODY products (Running Shirt, Running Shorts, Running Singlets, Running Long Sleeves).
-- 3) Ensure product_variants exist for each (XS, S, M, L, XL, 2XL, 3XL) and sync stock_quantity.

-- ---------------------------------------------------------------------------
-- 1. Deactivate products NOT in the canonical categories (hide dummy/old)
-- ---------------------------------------------------------------------------
UPDATE public.products
SET is_active = false
WHERE category IS NULL
   OR category NOT IN (
  'Running Shirt',
  'Running Shorts',
  'Running Singlets',
  'Running Long Sleeves'
);

-- ---------------------------------------------------------------------------
-- 2. Upsert canonical 36 NOBODY products (by sku)
-- image path: /assets/reve-clothing-products-batch1/<filename> or NULL
-- ---------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, sku, category, image_url, stock_quantity, low_stock_threshold, is_active)
VALUES
  ('Healthy Living - Dirty Lifestyle', '', 400, 'SHRT-HLDL', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-healty-living.webp', 0, 5, true),
  ('Yin & Yang', '', 400, 'SHRT-YY', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-yin-and-yang.webp', 0, 5, true),
  ('Black', '', 400, 'SHRT-BLK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-black.webp', 0, 5, true),
  ('Kru-Kru', '', 400, 'SHRT-KRU', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-kru-kru.webp', 0, 5, true),
  ('NBDY', '', 400, 'SHRT-NBDY', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-nbdy.webp', 0, 5, true),
  ('Orange', '', 400, 'SHRT-ORNG', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-orange.webp', 0, 5, true),
  ('Pink Floral', '', 400, 'SHRT-PNKF', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-pink-floral.webp', 0, 5, true),
  ('Punk', '', 400, 'SHRT-PUNK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-punk.webp', 0, 5, true),
  ('Black Crack', '', 400, 'SHRT-BCRK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-black-crak.webp', 0, 5, true),
  ('Jelly Fish', '', 400, 'SHRT-JLLYF', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-jelly-fish.webp', 0, 5, true),
  ('Peach', '', 400, 'SHRT-PCH', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-peach.webp', 0, 5, true),
  ('Mandala Pink', '', 400, 'SHRT-MNPNK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-manddala-pink.webp', 0, 5, true),
  ('Pink', '', 900, 'SHORT-PNK', 'Running Shorts', '/assets/reve-clothing-products-batch1/short-pink.webp', 0, 5, true),
  ('Black', '', 900, 'SHORT-BLK', 'Running Shorts', '/assets/reve-clothing-products-batch1/short-black-2.webp', 0, 5, true),
  ('Avocado', '', 350, 'SING-AVC', 'Running Singlets', NULL, 0, 5, true),
  ('Yin & Yang', '', 350, 'SING-YINY', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-yin-and-yang.webp', 0, 5, true),
  ('Color Splash', '', 350, 'SING-CLRSP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-white-colord.webp', 0, 5, true),
  ('Teal Blue', '', 350, 'SING-TLB', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-teel-blue.webp', 0, 5, true),
  ('Peach', '', 350, 'SING-PCH', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-peach.webp', 0, 5, true),
  ('Black-Green', '', 350, 'SING-BLKGR', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-black-green.webp', 0, 5, true),
  ('Black Tribal', '', 350, 'SING-BLKTRB', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-black-tribal.webp', 0, 5, true),
  ('Crush Colored', '', 350, 'SING-CRSHC', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-crush-colord.webp', 0, 5, true),
  ('Faith Over Fear', '', 350, 'SING-FAITH', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-faith-over-fear.webp', 0, 5, true),
  ('Green Ombre', '', 350, 'SING-GRNOM', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-green-ombrey.webp', 0, 5, true),
  ('Jellyfish', '', 350, 'SING-JLLY', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-jelleyfish.webp', 0, 5, true),
  ('Orange', '', 350, 'SING-ORNG', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-orange.webp', 0, 5, true),
  ('Pink Floral 1', '', 350, 'SING-PNKF1', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-floral.webp', 0, 5, true),
  ('Pink Floral 2', '', 350, 'SING-PNKF2', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-floral-2.webp', 0, 5, true),
  ('Pink Green', '', 350, 'SING-PNKGRN', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-green.webp', 0, 5, true),
  ('Pink Purple', '', 350, 'SING-PNKPRP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-purple.webp', 0, 5, true),
  ('Punk', '', 350, 'SING-PUNK', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-punk.webp', 0, 5, true),
  ('Purple', '', 350, 'SING-PRPL', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-purple.webp', 0, 5, true),
  ('Mandala Pink', '', 350, 'SING-MNDLP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-mandala-pink.webp', 0, 5, true),
  ('Denim', '', 350, 'SING-DNM', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-denim.webp', 0, 5, true),
  ('Tribal Grey', '', 600, 'LSLV-TRBG', 'Running Long Sleeves', NULL, 0, 5, true),
  ('Black', '', 600, 'LSLV-BLK', 'Running Long Sleeves', NULL, 0, 5, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 2b. Set description (SPECS + Why customers buy) per category from spreadsheet
-- ---------------------------------------------------------------------------
UPDATE public.products SET description = 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', updated_at = now()
WHERE category = 'Running Shirt';

UPDATE public.products SET description = 'Not-subli, reflectorized.

Why customers buy: Lightweight, Comfort, functional design.', updated_at = now()
WHERE category = 'Running Shorts';

UPDATE public.products SET description = 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', updated_at = now()
WHERE category = 'Running Singlets';

UPDATE public.products SET description = 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility, sun protection.', updated_at = now()
WHERE category = 'Running Long Sleeves';

-- ---------------------------------------------------------------------------
-- 3. Insert product_variants for canonical products
-- Stock: 10 for XS, S, M, L, XL; 5 for 2XL, 3XL (per spreadsheet).
-- ---------------------------------------------------------------------------
INSERT INTO public.product_variants (product_id, size, stock_quantity, low_stock_threshold, sku_suffix)
SELECT
  p.id,
  s.size,
  CASE WHEN s.size IN ('2XL', '3XL') THEN 5 ELSE 10 END,
  5,
  '-' || s.size
FROM public.products p
CROSS JOIN (
  VALUES
    ('XS'::product_size),
    ('S'::product_size),
    ('M'::product_size),
    ('L'::product_size),
    ('XL'::product_size),
    ('2XL'::product_size),
    ('3XL'::product_size)
) AS s(size)
WHERE p.sku IN (
  'SHRT-HLDL','SHRT-YY','SHRT-BLK','SHRT-KRU','SHRT-NBDY','SHRT-ORNG','SHRT-PNKF','SHRT-PUNK','SHRT-BCRK','SHRT-JLLYF','SHRT-PCH','SHRT-MNPNK',
  'SHORT-PNK','SHORT-BLK',
  'SING-AVC','SING-YINY','SING-CLRSP','SING-TLB','SING-PCH','SING-BLKGR','SING-BLKTRB','SING-CRSHC','SING-FAITH','SING-GRNOM','SING-JLLY','SING-ORNG',
  'SING-PNKF1','SING-PNKF2','SING-PNKGRN','SING-PNKPRP','SING-PUNK','SING-PRPL','SING-MNDLP','SING-DNM',
  'LSLV-TRBG','LSLV-BLK'
)
ON CONFLICT (product_id, size) DO UPDATE SET
  stock_quantity = EXCLUDED.stock_quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 4. Sync products.stock_quantity from sum of product_variants
-- ---------------------------------------------------------------------------
UPDATE public.products
SET stock_quantity = (
  SELECT COALESCE(SUM(stock_quantity), 0)
  FROM public.product_variants pv
  WHERE pv.product_id = products.id
)
WHERE sku IN (
  'SHRT-HLDL','SHRT-YY','SHRT-BLK','SHRT-KRU','SHRT-NBDY','SHRT-ORNG','SHRT-PNKF','SHRT-PUNK','SHRT-BCRK','SHRT-JLLYF','SHRT-PCH','SHRT-MNPNK',
  'SHORT-PNK','SHORT-BLK',
  'SING-AVC','SING-YINY','SING-CLRSP','SING-TLB','SING-PCH','SING-BLKGR','SING-BLKTRB','SING-CRSHC','SING-FAITH','SING-GRNOM','SING-JLLY','SING-ORNG',
  'SING-PNKF1','SING-PNKF2','SING-PNKGRN','SING-PNKPRP','SING-PUNK','SING-PRPL','SING-MNDLP','SING-DNM',
  'LSLV-TRBG','LSLV-BLK'
);


-- =====================================================
-- Migration 20: 20260130200000_create_categories_if_missing.sql
-- Source: supabase/migrations/20260130200000_create_categories_if_missing.sql
-- =====================================================

-- Create categories table if missing (app uses it via useCategories; add_category_codes expects it)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: public read, authenticated write (admin)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
CREATE POLICY "Authenticated users can manage categories"
ON public.categories FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger to keep updated_at in sync (reuse existing function if present)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =====================================================
-- Migration 21: 20260131000000_add_category_codes.sql
-- Source: supabase/migrations/20260131000000_add_category_codes.sql
-- =====================================================

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


-- =====================================================
-- Migration 22: 20260204000000_order_status_pending_payment_waybill.sql
-- Source: supabase/migrations/20260204000000_order_status_pending_payment_waybill.sql
-- =====================================================

-- Add new order statuses: pending_payment, preparing, for_pickup
-- Flow: pending_payment → (proof validated) preparing → (waybill printed) for_pickup → shipped/completed via J&T

ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'preparing';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'for_pickup';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'for_verification';

-- Add waybill number for J&T (set when store prints waybill; tracking from J&T API later)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS waybill_number text;

COMMENT ON COLUMN public.orders.waybill_number IS 'J&T waybill/tracking number; set when waybill is printed, status becomes for_pickup';

-- Reference number entered by store manager when verifying proof of payment
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_reference_number text;

COMMENT ON COLUMN public.orders.payment_reference_number IS 'Reference number entered by store manager when verifying proof of payment';


-- =====================================================
-- Migration 23: 20260204000001_add_xendit_payment_id.sql
-- Source: supabase/migrations/20260204000001_add_xendit_payment_id.sql
-- =====================================================

-- Add xendit_payment_id column to orders table
-- This stores the Xendit payment request ID for tracking payment status

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS xendit_payment_id text;

COMMENT ON COLUMN public.orders.xendit_payment_id IS 'Xendit Payment Request ID (e.g., pr-xxx) for tracking payment status via Xendit API';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_xendit_payment_id ON public.orders(xendit_payment_id) WHERE xendit_payment_id IS NOT NULL;


-- =====================================================
-- Migration 24: 20260204100000_add_articles.sql
-- Source: supabase/migrations/20260204100000_add_articles.sql
-- =====================================================

-- Articles for news/blog - manual entries and Facebook-synced posts
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'facebook')),
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles (source);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));


-- =====================================================
-- Migration 25: 20260204110000_add_contact_submissions.sql
-- Source: supabase/migrations/20260204110000_add_contact_submissions.sql
-- =====================================================

-- Contact form submissions for store manager to view
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (contact form submission)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can select (view inbox)
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- Only admins can update (mark as read)
CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));


-- =====================================================
-- Migration 26: 20260221000000_add_failed_status_and_cron.sql
-- Source: supabase/migrations/20260221000000_add_failed_status_and_cron.sql
-- =====================================================

-- Add 'failed' status for orders where payment was not completed within 2 hours
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'failed';


-- =====================================================
-- Migration 27: 20260221000001_schedule_fail_stale_cron.sql
-- Source: supabase/migrations/20260221000001_schedule_fail_stale_cron.sql
-- =====================================================

-- Cron: Mark pending_payment orders as failed after 2 hours (runs every 15 min)
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'fail-stale-pending-payments',
  '*/15 * * * *',
  $$UPDATE public.orders SET status = 'failed', updated_at = now() WHERE status = 'pending_payment' AND created_at < now() - interval '2 hours'$$
);


-- =====================================================
-- Migration 28: 20260221000002_add_payment_reminder_columns.sql
-- Source: supabase/migrations/20260221000002_add_payment_reminder_columns.sql
-- =====================================================

-- Add columns to track which payment reminder emails have been sent
-- Used by send-payment-reminders to avoid duplicate reminders at 30m, 60m, 90m

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_reminder_30_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_reminder_60_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_reminder_90_at TIMESTAMPTZ;

COMMENT ON COLUMN public.orders.payment_reminder_30_at IS 'When 30-min payment reminder email was sent (HitPay pending orders)';
COMMENT ON COLUMN public.orders.payment_reminder_60_at IS 'When 60-min payment reminder email was sent';
COMMENT ON COLUMN public.orders.payment_reminder_90_at IS 'When 90-min (final) payment reminder email was sent';


-- =====================================================
-- Migration 29: 20260222000000_create_vouchers.sql
-- Source: supabase/migrations/20260222000000_create_vouchers.sql
-- =====================================================

-- Vouchers table for discount codes
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(UPPER(code));
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON public.vouchers(is_active) WHERE is_active = true;

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Admins can manage vouchers (service role bypasses RLS for create-order/validation)
CREATE POLICY "Admins can select vouchers" ON public.vouchers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert vouchers" ON public.vouchers FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vouchers" ON public.vouchers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vouchers" ON public.vouchers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_vouchers_updated_at ON public.vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.vouchers IS 'Discount voucher codes for checkout';


-- =====================================================
-- Migration 30: 20260223000000_voucher_product_category_scope.sql
-- Source: supabase/migrations/20260223000000_voucher_product_category_scope.sql
-- =====================================================

-- Add scope columns to vouchers: restrict discount to specific products or categories
-- When both product_ids and category_ids are empty, voucher applies to entire order

ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS product_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}';

COMMENT ON COLUMN public.vouchers.product_ids IS 'When non-empty: discount applies only to these product IDs';
COMMENT ON COLUMN public.vouchers.category_ids IS 'When non-empty: discount applies only to products in these categories (matches products.category to categories.name)';


-- =====================================================
-- Migration 31: 20260224000000_products_audit_columns.sql
-- Source: supabase/migrations/20260224000000_products_audit_columns.sql
-- =====================================================

-- Add audit columns to products: date/time added, last updated, and who made changes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS created_by_email TEXT,
  ADD COLUMN IF NOT EXISTS updated_by_email TEXT;

COMMENT ON COLUMN public.products.created_by_email IS 'Email of admin who created the product';
COMMENT ON COLUMN public.products.updated_by_email IS 'Email of admin who last updated the product';


-- =====================================================
-- Migration 32: 20260225000000_add_event_carousel.sql
-- Source: supabase/migrations/20260225000000_add_event_carousel.sql
-- =====================================================

-- Event carousel for "Join Us" / Upcoming Events section (up to 9 photos)
CREATE TABLE IF NOT EXISTS event_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_carousel_created ON event_carousel (created_at DESC);

-- RLS
ALTER TABLE event_carousel ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Event carousel is viewable by everyone"
  ON event_carousel FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert event carousel"
  ON event_carousel FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update event carousel"
  ON event_carousel FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can delete event carousel"
  ON event_carousel FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));


-- =====================================================
-- Migration 33: 20260226000000_user_approvals_email_name.sql
-- Source: supabase/migrations/20260226000000_user_approvals_email_name.sql
-- =====================================================

-- Store email and full_name in user_approvals so admins see who to approve (no edge function needed)
ALTER TABLE public.user_approvals
ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT;
-- Update trigger to populate email and full_name when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
DECLARE _email TEXT;
_full_name TEXT;
BEGIN _email := COALESCE(NEW.email, '');
_full_name := COALESCE(
  NEW.raw_user_meta_data->>'full_name',
  NEW.raw_user_meta_data->>'name',
  NEW.raw_user_meta_data->>'user_name',
  ''
);
INSERT INTO public.user_approvals (user_id, status, email, full_name)
VALUES (NEW.id, 'pending', _email, _full_name) ON CONFLICT (user_id) DO
UPDATE
SET email = COALESCE(
    NULLIF(TRIM(EXCLUDED.email), ''),
    user_approvals.email
  ),
  full_name = COALESCE(
    NULLIF(TRIM(EXCLUDED.full_name), ''),
    user_approvals.full_name
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Backfill existing rows from auth.users
UPDATE public.user_approvals ua
SET email = COALESCE(au.email, ''),
  full_name = COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'user_name',
    ''
  )
FROM auth.users au
WHERE ua.user_id = au.id
  AND (
    ua.email IS NULL
    OR ua.email = ''
    OR ua.full_name IS NULL
  );


-- =====================================================
-- Migration 34: 20260304000000_jt_waybill_database_webhook.sql
-- Source: supabase/migrations/20260304000000_jt_waybill_database_webhook.sql
-- =====================================================

-- JT Waybill Database Webhook
--
-- Create the webhook in Supabase Dashboard (Database -> Webhooks -> Create a new hook):
--
--   Name:     jt-waybill-on-orders-update
--   Table:    public.orders
--   Events:   Update
--   URL:      https://<PROJECT_REF>.supabase.co/functions/v1/create-jt-waybill
--   Method:   POST
--   Headers:  Content-Type: application/json
--             Authorization: Bearer <SERVICE_ROLE_KEY>
--
-- The create-jt-waybill Edge Function will:
-- - Process only when record.status IN ('preparing','packed') AND record.waybill_number IS NULL
-- - Call J&T Order API to create waybill
-- - UPDATE orders SET waybill_number = <result>, status = 'for_pickup'
--
-- See docs/DATABASE_WEBHOOK_SETUP.md and docs/JT_ORDER_API.md for details.


-- =====================================================
-- Migration 35: 20260318000000_add_product_weight_grams.sql
-- Source: supabase/migrations/20260318000000_add_product_weight_grams.sql
-- =====================================================

-- Add product weight for shipping calculations (J&T weight tiers)
-- Stored in grams to avoid floating point issues.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight_grams integer;
-- Sensible default for apparel if missing (can be edited in Admin):
-- 250g per item (t-shirt/singlet range). Adjust per product as needed.
UPDATE public.products
SET weight_grams = COALESCE(weight_grams, 250)
WHERE weight_grams IS NULL;
-- Basic guardrail
ALTER TABLE public.products
ADD CONSTRAINT products_weight_grams_positive CHECK (
        weight_grams IS NULL
        OR weight_grams > 0
    );


-- =====================================================
-- Migration 36: 20260319000000_sold_count_and_reviews.sql
-- Source: supabase/migrations/20260319000000_sold_count_and_reviews.sql
-- =====================================================

-- Sold count: RPC that returns quantity sold per product (from completed/shipped orders).
-- Runs with definer rights so anon/authenticated can call it without reading orders directly.
CREATE OR REPLACE FUNCTION public.get_products_sold_counts(product_ids uuid []) RETURNS TABLE(product_id uuid, sold_count bigint) LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
SELECT oi.product_id,
  COALESCE(SUM(oi.quantity), 0)::bigint
FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
WHERE o.status IN ('shipped', 'completed')
  AND oi.product_id IS NOT NULL
  AND (
    product_ids IS NULL
    OR cardinality(product_ids) = 0
    OR oi.product_id = ANY(product_ids)
  )
GROUP BY oi.product_id;
$$;
COMMENT ON FUNCTION public.get_products_sold_counts(uuid []) IS 'Returns sold quantity per product from shipped/completed orders. Callable by anon/authenticated.';
GRANT EXECUTE ON FUNCTION public.get_products_sold_counts(uuid []) TO anon;
GRANT EXECUTE ON FUNCTION public.get_products_sold_counts(uuid []) TO authenticated;
-- Product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE
  SET NULL,
    user_id uuid,
    reviewer_name text NOT NULL,
    reviewer_email text NOT NULL,
    rating smallint NOT NULL CHECK (
      rating >= 1
      AND rating <= 5
    ),
    comment text,
    is_approved boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_approved ON public.product_reviews (product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created ON public.product_reviews (product_id, created_at DESC);
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
-- Anyone can read approved reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.product_reviews;
CREATE POLICY "Anyone can read approved reviews" ON public.product_reviews FOR
SELECT TO anon,
  authenticated USING (is_approved = true);
-- Anyone (anon or authenticated) can insert a review
DROP POLICY IF EXISTS "Anyone can submit review" ON public.product_reviews;
CREATE POLICY "Anyone can submit review" ON public.product_reviews FOR
INSERT TO anon,
  authenticated WITH CHECK (true);
-- Only admins can update (e.g. approve/unapprove) or delete
DROP POLICY IF EXISTS "Admins can update product_reviews" ON public.product_reviews;
CREATE POLICY "Admins can update product_reviews" ON public.product_reviews FOR
UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete product_reviews" ON public.product_reviews;
CREATE POLICY "Admins can delete product_reviews" ON public.product_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- =====================================================
-- Migration 37: 20260328120000_set_all_products_weight_500.sql
-- Source: supabase/migrations/20260328120000_set_all_products_weight_500.sql
-- =====================================================

-- Set every catalog item to 0.5 kg (500 g) for J&T shipping calculations.
UPDATE public.products
SET weight_grams = 500
WHERE weight_grams IS DISTINCT FROM 500;


-- =====================================================
-- Migration 38: 20260417120000_ensure_products_weight_grams.sql
-- Source: supabase/migrations/20260417120000_ensure_products_weight_grams.sql
-- =====================================================

-- Repair: some environments never applied 20260318000000_add_product_weight_grams.sql.
-- Fully idempotent so `db push` / remote apply is safe.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight_grams integer;
UPDATE public.products
SET weight_grams = COALESCE(weight_grams, 250)
WHERE weight_grams IS NULL;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM pg_constraint
  WHERE conname = 'products_weight_grams_positive'
) THEN
ALTER TABLE public.products
ADD CONSTRAINT products_weight_grams_positive CHECK (
    weight_grams IS NULL
    OR weight_grams > 0
  );
END IF;
END $$;


-- =====================================================
-- Migration 39: 20260506000000_backfill_existing_auth_users.sql
-- Source: supabase/migrations/20260506000000_backfill_existing_auth_users.sql
-- =====================================================

-- Backfill approval rows for existing users after project migration.
-- Existing authenticated users without an approval row should not be blocked.
INSERT INTO public.user_approvals (user_id, status)
SELECT u.id, 'approved'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_approvals ua
  WHERE ua.user_id = u.id
);

-- Restore the known admin account used by the app documentation.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'khlacadin@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_approvals (user_id, status)
SELECT id, 'approved'
FROM auth.users
WHERE email = 'khlacadin@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET status = 'approved';

