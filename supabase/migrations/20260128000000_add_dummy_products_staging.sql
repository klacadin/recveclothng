-- Add dummy products for staging/testing
-- This migration inserts sample products with variants for testing purposes

-- Insert dummy products - 5 items per category (25 total products)

-- 1. Sports & Performance Jerseys (5 products)
INSERT INTO public.products (name, description, price, sku, category, image_url, stock_quantity, is_active)
VALUES
  (
    'Pickleball Performance Jersey - Full Sublimation',
    'High-performance pickleball jersey with full sublimation design. Moisture-wicking fabric and breathable mesh panels for optimal comfort during intense matches.',
    1499.00,
    'SPORTS-PB-JERSEY-001',
    'Sports & Performance Jerseys',
    '/assets/product-nobody-jersey.jpg',
    0,
    true
  ),
  (
    'Cycling Racing Jersey - Full Front Zipper',
    'Professional cycling jersey with full-front zipper for easy ventilation. Aerodynamic fit with rear pockets for essentials. Full sublimation design.',
    1699.00,
    'SPORTS-CYCLE-JERSEY-001',
    'Sports & Performance Jerseys',
    '/assets/product-nobody-jersey.jpg',
    0,
    true
  ),
  (
    'VCI Team Jersey - Custom Mockup',
    'Custom team jersey with player names and numbers. Full sublimation design featuring team colors and logos. Perfect for tournaments and team events.',
    1799.00,
    'SPORTS-VCI-JERSEY-001',
    'Sports & Performance Jerseys',
    '/assets/product-nobody-jersey.jpg',
    0,
    true
  ),
  (
    'ALS Team Jersey - Custom Design',
    'Team jersey with custom ALS design, player names, and numbers. High-quality sublimation printing with moisture-wicking performance fabric.',
    1799.00,
    'SPORTS-ALS-JERSEY-001',
    'Sports & Performance Jerseys',
    '/assets/product-nobody-jersey.jpg',
    0,
    true
  ),
  (
    'Racing Performance Jersey - Pro Series',
    'Professional racing jersey with full-front zipper and aerodynamic design. Full sublimation with reflective elements for safety.',
    1599.00,
    'SPORTS-RACE-JERSEY-001',
    'Sports & Performance Jerseys',
    '/assets/product-nobody-jersey.jpg',
    0,
    true
  ),

-- 2. Activewear & Training Gear - NUBODY Collection (5 products)
  (
    'NUBODY Athletic Tank Top - Performance',
    'Performance tank top from the NUBODY collection. Fitted design with technical patterns and moisture-wicking fabric for intense training sessions.',
    899.00,
    'NUBODY-TANK-001',
    'Activewear & Training Gear',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'NUBODY Fitted Performance Tee - Technical Pattern',
    'Fitted performance tee with technical patterns. Compression-style fit designed for training and fitness activities. NUBODY branded.',
    999.00,
    'NUBODY-TEE-FITTED-001',
    'Activewear & Training Gear',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'NUBODY Compression Shirt - Training',
    'Branded compression-style shirt perfect for training and workouts. Moisture-wicking technology with strategic ventilation zones.',
    1099.00,
    'NUBODY-COMPRESSION-001',
    'Activewear & Training Gear',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'NUBODY Performance Singlet - Athletic',
    'Lightweight athletic singlet from NUBODY collection. Designed for high-intensity training with breathable mesh fabric.',
    849.00,
    'NUBODY-SINGLET-001',
    'Activewear & Training Gear',
    '/assets/product-singlet-1.jpg',
    0,
    true
  ),
  (
    'NUBODY Training Tee - Classic Fit',
    'Classic fit training tee with NUBODY branding. Comfortable cotton blend perfect for gym sessions and daily workouts.',
    799.00,
    'NUBODY-TEE-CLASSIC-001',
    'Activewear & Training Gear',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),

-- 3. Graphic & Lifestyle Apparel (5 products)
  (
    'Obanai Iguro Anime Collection Tee',
    'Unique anime-inspired design featuring Obanai Iguro. Soft cotton blend with vibrant print. Perfect for anime fans and casual wear.',
    999.00,
    'GRAPHIC-ANIME-OBANAI-001',
    'Graphic & Lifestyle Apparel',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'Faith Over Fear Statement Tee',
    'Motivational statement tee with "Faith Over Fear" design. Inspirational message printed on comfortable cotton fabric.',
    899.00,
    'GRAPHIC-FAITH-FEAR-001',
    'Graphic & Lifestyle Apparel',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'Health Living Dirt Lifestyle Tee',
    'Unique lifestyle tee with "Health Living Dirt" design. Casual fit perfect for everyday wear with a bold statement.',
    899.00,
    'GRAPHIC-HEALTH-DIRT-001',
    'Graphic & Lifestyle Apparel',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'Anime Collection Graphic Tee - Series 1',
    'Limited edition anime collection tee featuring unique character designs. High-quality print on premium cotton.',
    1099.00,
    'GRAPHIC-ANIME-SERIES1-001',
    'Graphic & Lifestyle Apparel',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),
  (
    'Motivational Statement Tee - Warrior',
    'Bold motivational design with warrior theme. Perfect for those who embrace an active lifestyle and positive mindset.',
    949.00,
    'GRAPHIC-WARRIOR-001',
    'Graphic & Lifestyle Apparel',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),

-- 4. Corporate & Event Wear (5 products)
  (
    'Dylane Hardware & Construction Supply Polo',
    'Professional sublimated polo featuring Dylane Hardware & Construction Supply logo. Business-casual design perfect for corporate events.',
    1299.00,
    'CORP-DYLANE-POLO-001',
    'Corporate & Event Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Corporate Logo Polo - Custom Sublimation',
    'Custom sublimated polo with business logo. Professional appearance suitable for corporate events, trade shows, and team building.',
    1199.00,
    'CORP-POLO-CUSTOM-001',
    'Corporate & Event Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Event Merchandise Polo - Organization',
    'Organization polo with custom logo and design. Perfect for company events, conferences, and branded merchandise.',
    1249.00,
    'CORP-EVENT-POLO-001',
    'Corporate & Event Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Business Team Polo - Custom Design',
    'Custom team polo with business branding. Moisture-wicking fabric with professional appearance for corporate teams.',
    1349.00,
    'CORP-TEAM-POLO-001',
    'Corporate & Event Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Corporate Event Tee - Logo Branded',
    'Professional event tee with corporate logo. Comfortable fit for company events, launches, and team activities.',
    799.00,
    'CORP-EVENT-TEE-001',
    'Corporate & Event Wear',
    '/assets/product-hero-tee.jpg',
    0,
    true
  ),

-- 5. Protective & Outdoor Wear (5 products)
  (
    'T2C Pro Gear Sun-Shield - Long Sleeve',
    'Professional sun-shield with hood and extended sleeves. UPF protection designed for outdoor activities and sun exposure.',
    1699.00,
    'OUTDOOR-T2C-SUNSHIELD-001',
    'Protective & Outdoor Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Performance Hoodie - Long Sleeve',
    'Long-sleeve performance hoodie with extended sleeves for protection. Perfect for outdoor training and cooler weather activities.',
    1499.00,
    'OUTDOOR-HOODIE-PERF-001',
    'Protective & Outdoor Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Outdoor Sun Protection Hoodie',
    'Sun protection hoodie with hood and long sleeves. Lightweight fabric with UPF rating for extended outdoor exposure.',
    1599.00,
    'OUTDOOR-SUN-HOODIE-001',
    'Protective & Outdoor Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Trail Running Hoodie - Extended Sleeves',
    'Trail running hoodie with extended sleeves and hood. Moisture-wicking fabric designed for outdoor adventures.',
    1399.00,
    'OUTDOOR-TRAIL-HOODIE-001',
    'Protective & Outdoor Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  ),
  (
    'Outdoor Performance Longsleeve',
    'Long-sleeve performance top with protective features. Ideal for hiking, trail running, and outdoor sports.',
    1299.00,
    'OUTDOOR-LS-PERF-001',
    'Protective & Outdoor Wear',
    '/assets/product-jersey-1.jpg',
    0,
    true
  )
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants with stock (10 units per size) for each product
-- Get product IDs and insert variants for sizes S, M, L, XL
INSERT INTO public.product_variants (product_id, size, stock_quantity, low_stock_threshold, sku_suffix)
SELECT 
  p.id,
  s.size,
  10, -- 10 units per size as requested
  5,
  '-' || s.size
FROM public.products p
CROSS JOIN (VALUES ('S'::product_size), ('M'::product_size), ('L'::product_size), ('XL'::product_size)) AS s(size)
WHERE p.sku IN (
  -- Sports & Performance Jerseys
  'SPORTS-PB-JERSEY-001',
  'SPORTS-CYCLE-JERSEY-001',
  'SPORTS-VCI-JERSEY-001',
  'SPORTS-ALS-JERSEY-001',
  'SPORTS-RACE-JERSEY-001',
  -- NUBODY Collection
  'NUBODY-TANK-001',
  'NUBODY-TEE-FITTED-001',
  'NUBODY-COMPRESSION-001',
  'NUBODY-SINGLET-001',
  'NUBODY-TEE-CLASSIC-001',
  -- Graphic & Lifestyle
  'GRAPHIC-ANIME-OBANAI-001',
  'GRAPHIC-FAITH-FEAR-001',
  'GRAPHIC-HEALTH-DIRT-001',
  'GRAPHIC-ANIME-SERIES1-001',
  'GRAPHIC-WARRIOR-001',
  -- Corporate & Event
  'CORP-DYLANE-POLO-001',
  'CORP-POLO-CUSTOM-001',
  'CORP-EVENT-POLO-001',
  'CORP-TEAM-POLO-001',
  'CORP-EVENT-TEE-001',
  -- Protective & Outdoor
  'OUTDOOR-T2C-SUNSHIELD-001',
  'OUTDOOR-HOODIE-PERF-001',
  'OUTDOOR-SUN-HOODIE-001',
  'OUTDOOR-TRAIL-HOODIE-001',
  'OUTDOOR-LS-PERF-001'
)
ON CONFLICT (product_id, size) DO NOTHING;

-- Sync product stock_quantity from variants
UPDATE public.products
SET stock_quantity = (
  SELECT COALESCE(SUM(stock_quantity), 0)
  FROM public.product_variants
  WHERE product_variants.product_id = products.id
)
WHERE sku IN (
  'SPORTS-PB-JERSEY-001',
  'SPORTS-CYCLE-JERSEY-001',
  'SPORTS-VCI-JERSEY-001',
  'SPORTS-ALS-JERSEY-001',
  'SPORTS-RACE-JERSEY-001',
  'NUBODY-TANK-001',
  'NUBODY-TEE-FITTED-001',
  'NUBODY-COMPRESSION-001',
  'NUBODY-SINGLET-001',
  'NUBODY-TEE-CLASSIC-001',
  'GRAPHIC-ANIME-OBANAI-001',
  'GRAPHIC-FAITH-FEAR-001',
  'GRAPHIC-HEALTH-DIRT-001',
  'GRAPHIC-ANIME-SERIES1-001',
  'GRAPHIC-WARRIOR-001',
  'CORP-DYLANE-POLO-001',
  'CORP-POLO-CUSTOM-001',
  'CORP-EVENT-POLO-001',
  'CORP-TEAM-POLO-001',
  'CORP-EVENT-TEE-001',
  'OUTDOOR-T2C-SUNSHIELD-001',
  'OUTDOOR-HOODIE-PERF-001',
  'OUTDOOR-SUN-HOODIE-001',
  'OUTDOOR-TRAIL-HOODIE-001',
  'OUTDOOR-LS-PERF-001'
);
