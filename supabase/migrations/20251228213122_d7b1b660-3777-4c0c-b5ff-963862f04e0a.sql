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