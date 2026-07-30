CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid,
  user_id text,
  reviewer_name text NOT NULL,
  reviewer_email text NOT NULL,
  rating integer NOT NULL,
  comment text,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON product_reviews(product_id);
