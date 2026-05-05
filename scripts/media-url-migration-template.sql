-- Media URL migration template (Supabase SQL Editor)
-- Purpose: Replace Supabase Storage URLs with cPanel/CDN URLs.
--
-- HOW TO USE
-- 1) Replace old_base and new_base in the params CTE.
-- 2) Run ONLY the preview SELECT block first.
-- 3) If counts look correct, run the UPDATE block.
-- 4) Validate app pages after update.
-- =====================================================
-- 1) PREVIEW COUNTS (NO DATA CHANGES)
-- =====================================================
WITH params AS (
  SELECT 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
    'https://reveclothingxnobody.com/media/'::text AS new_base
)
SELECT 'products.image_url' AS target,
  COUNT(*) AS matched
FROM public.products p,
  params
WHERE p.image_url IS NOT NULL
  AND p.image_url LIKE params.old_base || '%'
UNION ALL
SELECT 'articles.image_url' AS target,
  COUNT(*) AS matched
FROM public.articles a,
  params
WHERE a.image_url IS NOT NULL
  AND a.image_url LIKE params.old_base || '%'
UNION ALL
SELECT 'categories.image_url' AS target,
  COUNT(*) AS matched
FROM public.categories c,
  params
WHERE c.image_url IS NOT NULL
  AND c.image_url LIKE params.old_base || '%'
UNION ALL
SELECT 'event_carousel.image_url' AS target,
  COUNT(*) AS matched
FROM public.event_carousel e,
  params
WHERE e.image_url IS NOT NULL
  AND e.image_url LIKE params.old_base || '%'
UNION ALL
SELECT 'orders.proof_of_payment_url' AS target,
  COUNT(*) AS matched
FROM public.orders o,
  params
WHERE o.proof_of_payment_url IS NOT NULL
  AND o.proof_of_payment_url LIKE params.old_base || '%';
-- =====================================================
-- 2) APPLY CHANGES (UNCOMMENT TO RUN)
-- =====================================================
/*
 BEGIN;
 
 WITH params AS (
 SELECT
 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
 'https://reveclothingxnobody.com/media/'::text AS new_base
 )
 UPDATE public.products p
 SET image_url = regexp_replace(p.image_url, '^' || params.old_base, params.new_base)
 FROM params
 WHERE p.image_url IS NOT NULL
 AND p.image_url LIKE params.old_base || '%';
 
 WITH params AS (
 SELECT
 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
 'https://reveclothingxnobody.com/media/'::text AS new_base
 )
 UPDATE public.articles a
 SET image_url = regexp_replace(a.image_url, '^' || params.old_base, params.new_base)
 FROM params
 WHERE a.image_url IS NOT NULL
 AND a.image_url LIKE params.old_base || '%';
 
 WITH params AS (
 SELECT
 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
 'https://reveclothingxnobody.com/media/'::text AS new_base
 )
 UPDATE public.categories c
 SET image_url = regexp_replace(c.image_url, '^' || params.old_base, params.new_base)
 FROM params
 WHERE c.image_url IS NOT NULL
 AND c.image_url LIKE params.old_base || '%';
 
 WITH params AS (
 SELECT
 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
 'https://reveclothingxnobody.com/media/'::text AS new_base
 )
 UPDATE public.event_carousel e
 SET image_url = regexp_replace(e.image_url, '^' || params.old_base, params.new_base)
 FROM params
 WHERE e.image_url IS NOT NULL
 AND e.image_url LIKE params.old_base || '%';
 
 WITH params AS (
 SELECT
 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/'::text AS old_base,
 'https://reveclothingxnobody.com/media/'::text AS new_base
 )
 UPDATE public.orders o
 SET proof_of_payment_url = regexp_replace(o.proof_of_payment_url, '^' || params.old_base, params.new_base)
 FROM params
 WHERE o.proof_of_payment_url IS NOT NULL
 AND o.proof_of_payment_url LIKE params.old_base || '%';
 
 COMMIT;
 */