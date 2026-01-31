-- =====================================================
-- ADMIN DASHBOARD UPGRADE - Category Management
-- Run this in: https://supabase.com/dashboard/project/txiwvjfdlxgwjtaibbpb/sql/new
-- =====================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.slugify(text)
RETURNS text AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace($1, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
$$ LANGUAGE sql IMMUTABLE;

-- Insert default categories for REVE Clothing
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('NOBODY Collection', 'nobody', 'The NOBODY collection - for unsung heroes of the track and trail', 1),
  ('Running Shirts', 'running-shirts', 'Performance running shirts', 2),
  ('Running Shorts', 'running-shorts', 'Performance running shorts', 3),
  ('Running Singlets', 'running-singlets', 'Lightweight running singlets', 4),
  ('Running Long Sleeves', 'running-long-sleeves', 'Long sleeve running tops', 5)
ON CONFLICT (slug) DO NOTHING;

-- Add category_id foreign key to products table (if not exists)
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- Create index for category lookup on products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- =====================================================
-- HitPay Payment Integration Support
-- =====================================================

-- Add hitpay payment method to enum (if not already present)
DO $$ BEGIN
    ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'hitpay';
EXCEPTION WHEN others THEN null;
END $$;

-- Create payment_transactions table for HitPay tracking
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_id TEXT, -- HitPay payment request ID
  payment_reference TEXT, -- HitPay reference
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT, -- e.g., 'paymaya', 'gcash', 'card'
  provider TEXT NOT NULL DEFAULT 'hitpay',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Users can view their payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view their payment transactions" ON public.payment_transactions
FOR SELECT TO authenticated USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_email = auth.jwt()->>'email')
);

DROP POLICY IF EXISTS "Admins can manage payment transactions" ON public.payment_transactions;
CREATE POLICY "Admins can manage payment transactions" ON public.payment_transactions
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON public.payment_transactions(payment_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Verification
-- =====================================================
SELECT 'Admin upgrade complete!' as status,
  (SELECT COUNT(*) FROM public.categories) as categories_count;
