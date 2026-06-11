-- Set up Supabase Database Webhook for J&T waybill creation
-- Trigger: orders UPDATE when status -> 'preparing' or 'packed'
-- Calls: create-jt-waybill edge function

-- 1. Go to Supabase Dashboard → project txiwvjfdlxgwjtaibbpb
-- 2. Click "Database" → "Webhooks" (left sidebar)
-- 3. Create new webhook with these settings:

-- Name: orders-status-update-jt-waybill
-- Table: orders
-- Events: ✓ UPDATE
-- Webhook: 
--   POST to: https://[project-ref].functions.supabase.co/create-jt-waybill
--   Headers: Add custom header "x-jnt-webhook-secret" with value from Supabase secrets
-- Retry strategy: Exponential backoff, 5 retries

-- ALTERNATIVELY, if you have direct database access, run this to create the webhook:

-- Note: Supabase webhooks must be created via the dashboard, not via SQL.
-- However, here's the manual verification SQL:

-- Check if webhook is working by monitoring the realtime logs:
-- SELECT * FROM realtime.subscriptions WHERE table_name = 'orders' LIMIT 1;

-- Test the edge function directly:
-- curl -X POST https://[project-ref].functions.supabase.co/create-jt-waybill \
--   -H "Content-Type: application/json" \
--   -H "Authorization: Bearer [YOUR_AUTH_TOKEN]" \
--   -d '{"order_id":"[ORDER_ID]"}'

-- Configure these environment variables in Supabase Edge Function Secrets:
-- - JNT_API_ACCOUNT (J&T merchant account)
-- - JNT_PRIVATE_KEY (J&T API private key)
-- - JNT_API_URL (J&T order API endpoint, e.g., https://api.jtexpress.ph)
-- - JNT_WEBHOOK_SECRET (shared secret for webhook verification)
-- - JNT_API_ENABLED (set to "true" to enable J&T API calls)
-- - JNT_SENDER_NAME (default: REVE CLOTHING SHOP)
-- - JNT_SENDER_PHONE (default: 09554465207)
-- - JNT_SENDER_ADDRESS (default: p5 north pob. Maramag, Bukidnon)

-- Current configuration:
-- J&T Merchant Code: REVE123456 (see config/constants.ts)
-- Drop Point: SM City Cagayan de Oro
-- Default parcel weight: 0.5 kg
-- COD support: ✓ Yes (auto-filled for COD orders)
