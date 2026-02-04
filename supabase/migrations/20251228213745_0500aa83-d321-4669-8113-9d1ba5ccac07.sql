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