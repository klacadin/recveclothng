-- =====================================================
-- DIAGNOSTIC: Check what's missing in your database
-- Run this in SQL Editor to see what needs fixing
-- =====================================================

-- Check if required types exist
SELECT 'app_role' as type_name, EXISTS(SELECT 1 FROM pg_type WHERE typname = 'app_role') as exists
UNION ALL
SELECT 'order_status', EXISTS(SELECT 1 FROM pg_type WHERE typname = 'order_status')
UNION ALL
SELECT 'payment_method', EXISTS(SELECT 1 FROM pg_type WHERE typname = 'payment_method')
UNION ALL
SELECT 'product_size', EXISTS(SELECT 1 FROM pg_type WHERE typname = 'product_size');

-- Check if required tables exist
SELECT 'user_roles' as table_name, EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') as exists
UNION ALL
SELECT 'orders', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'orders')
UNION ALL
SELECT 'order_items', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items')
UNION ALL
SELECT 'product_variants', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants')
UNION ALL
SELECT 'order_rate_limits', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'order_rate_limits')
UNION ALL
SELECT 'checkout_otps', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'checkout_otps')
UNION ALL
SELECT 'products', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'products');

-- Check if required functions exist
SELECT 'has_role' as function_name, EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'has_role') as exists
UNION ALL
SELECT 'update_updated_at_column', EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column')
UNION ALL
SELECT 'reserve_variant_stock', EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'reserve_variant_stock')
UNION ALL
SELECT 'restore_variant_stock', EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'restore_variant_stock')
UNION ALL
SELECT 'check_order_rate_limit', EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'check_order_rate_limit')
UNION ALL
SELECT 'check_duplicate_order', EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'check_duplicate_order');

-- Check product_size enum values (if it exists)
SELECT enumlabel as size_value
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'product_size'
ORDER BY e.enumsortorder;

-- Check product count
SELECT COUNT(*) as product_count FROM public.products WHERE is_active = true;

-- Check product_variants count
SELECT COUNT(*) as variant_count FROM public.product_variants;
