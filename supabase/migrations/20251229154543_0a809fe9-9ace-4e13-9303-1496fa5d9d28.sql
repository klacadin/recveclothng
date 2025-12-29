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