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
