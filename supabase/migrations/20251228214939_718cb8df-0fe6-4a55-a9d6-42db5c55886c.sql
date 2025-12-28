-- Fix orders RLS: Restrict order viewing to admins only
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

-- Only admins can view all orders (customers don't have accounts for their orders in this flow)
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can create orders (from admin dashboard)
CREATE POLICY "Admins can insert orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix order_items RLS: Restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;

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