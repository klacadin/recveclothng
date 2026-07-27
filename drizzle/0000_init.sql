-- Vercel Postgres schema for REVE Clothing (migrated off Supabase)
-- Run via: npm run db:push   OR   psql $DATABASE_URL -f drizzle/0000_init.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DO $$ BEGIN CREATE TYPE order_status AS ENUM (
  'new',
  'pending_payment',
  'for_verification',
  'paid',
  'preparing',
  'packed',
  'shipped',
  'for_pickup',
  'completed',
  'cancelled',
  'failed'
);
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('cod', 'gcash', 'maya', 'bank_transfer');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE product_size AS ENUM (
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  'XXL',
  'XXXL'
);
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN CREATE TYPE affiliate_status AS ENUM ('active', 'inactive', 'pending');
EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(12, 2) NOT NULL DEFAULT 0,
  sku text,
  category text,
  image_url text,
  images text [],
  stock_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  weight_grams integer,
  is_active boolean NOT NULL DEFAULT true,
  created_by_email text,
  updated_by_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size product_size NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  sku_suffix text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_product_size_idx ON product_variants(product_id, size);
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  code text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text,
  code text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  status affiliate_status NOT NULL DEFAULT 'active',
  commission_rate numeric(5, 4) NOT NULL DEFAULT 0.1500,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS affiliates_code_idx ON affiliates(code);
CREATE UNIQUE INDEX IF NOT EXISTS affiliates_email_idx ON affiliates(email);
CREATE INDEX IF NOT EXISTS affiliates_clerk_user_id_idx ON affiliates(clerk_user_id);
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address text NOT NULL,
  status order_status NOT NULL DEFAULT 'new',
  payment_method payment_method NOT NULL DEFAULT 'gcash',
  subtotal numeric(12, 2) NOT NULL DEFAULT 0,
  shipping_fee numeric(12, 2) NOT NULL DEFAULT 0,
  total numeric(12, 2) NOT NULL DEFAULT 0,
  notes text,
  proof_of_payment_url text,
  proof_uploaded_at timestamptz,
  payment_reference_number text,
  hitpay_payment_id text,
  waybill_number text,
  user_id text,
  affiliate_id uuid REFERENCES affiliates(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_affiliate_id_idx ON orders(affiliate_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL DEFAULT 1,
  size text,
  unit_price numeric(12, 2) NOT NULL,
  total_price numeric(12, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  order_subtotal numeric(12, 2) NOT NULL,
  commission_rate numeric(5, 4) NOT NULL,
  commission_amount numeric(12, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS affiliate_commissions_order_idx ON affiliate_commissions(order_id);
CREATE TABLE IF NOT EXISTS user_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by text,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS user_approvals_clerk_user_id_idx ON user_approvals(clerk_user_id);
CREATE TABLE IF NOT EXISTS vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric(12, 2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  source text NOT NULL DEFAULT 'manual',
  source_url text,
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS event_carousel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  customer_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);