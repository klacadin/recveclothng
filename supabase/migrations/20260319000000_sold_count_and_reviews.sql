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