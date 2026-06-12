# J&T Integration Checklist

Follow this checklist to get J&T waybill automation working end-to-end.

## Phase 1: Get J&T Credentials (1-2 business days)

- [ ] Contact J&T Express Sales
  - Email: merchant@jtexpress.ph
  - Phone: 1-800-18-7225 (toll-free)
  - Subject: "API Integration Request - Merchant CDO-V2534"

- [ ] Request Information
  - [ ] API Account ID / Merchant Account
  - [ ] Private Key (for request signing)
  - [ ] API Base URL (e.g., https://api.jtexpress.ph)
  - [ ] API Documentation (request/response formats)
  - [ ] Webhook/Callback URL format (if they send webhooks)

- [ ] Save credentials securely
  - [ ] Store JNT_API_ACCOUNT somewhere safe (password manager, Vault, etc.)
  - [ ] Store JNT_PRIVATE_KEY somewhere safe (never commit to git)
  - [ ] Store JNT_API_URL
  - [ ] Store JNT_WEBHOOK_SECRET (create a strong random string)

## Phase 2: Configure Supabase Secrets (15 min)

- [ ] Open Supabase Dashboard
  - Project: txiwvjfdlxgwjtaibbpb
  - Navigate: Edge Functions → create-jt-waybill → Secrets

- [ ] Add J&T Credentials
  - [ ] `JNT_API_ENABLED` = `true`
  - [ ] `JNT_API_ACCOUNT` = [from J&T]
  - [ ] `JNT_PRIVATE_KEY` = [from J&T]
  - [ ] `JNT_API_URL` = [from J&T, e.g., https://api.jtexpress.ph]
  - [ ] `JNT_WEBHOOK_SECRET` = [your strong random string]

- [ ] Optional Defaults (can skip if using defaults)
  - [ ] `JNT_SENDER_NAME` = REVE CLOTHING SHOP
  - [ ] `JNT_SENDER_PHONE` = 09554465207
  - [ ] `JNT_SENDER_ADDRESS` = p5 north pob. Maramag, Bukidnon

- [ ] Verify secrets saved
  - [ ] Refresh the page
  - [ ] All secrets should still be listed (values hidden for security)

## Phase 3: Create Database Webhook (10 min)

- [ ] Open Supabase Dashboard
  - Navigate: Database → Webhooks

- [ ] Create New Hook
  - [ ] Click "Create a new hook"
  - [ ] Name: `jt-waybill-on-orders-update`
  - [ ] Table: `public.orders`
  - [ ] Events: Check only **Update**
  - [ ] Type: HTTP Request
  - [ ] Method: POST
  - [ ] URL: `https://txiwvjfdlxgwjtaibbpb.supabase.co/functions/v1/create-jt-waybill`

- [ ] Add Headers
  - [ ] Header 1: `Content-Type: application/json`
  - [ ] Header 2: `Authorization: Bearer [SERVICE_ROLE_KEY]`
    - Get service role key from: Settings → API → Service role key

- [ ] Save webhook
  - [ ] Click Save
  - [ ] Webhook should be enabled (green toggle)

## Phase 4: Test Webhook (15 min)

- [ ] Test 1: Verify webhook is firing
  - [ ] Go to Database → Webhooks → jt-waybill-on-orders-update
  - [ ] Click "Recent events" tab
  - [ ] Go to Admin → Orders
  - [ ] Find any order, change its status to `preparing`
  - [ ] Check Recent events - should show a new event
  - [ ] ✓ If you see an event, webhook is firing

- [ ] Test 2: Check Edge Function logs
  - [ ] Go to Edge Functions → create-jt-waybill → Logs
  - [ ] Change order status again to `packed` (in Admin → Orders)
  - [ ] Watch Logs tab for entries
  - [ ] Expected output: `J&T API response: 200 { waybill_no: "..." }`
  - [ ] ✓ If you see this, J&T API call succeeded

- [ ] Test 3: Verify waybill was created
  - [ ] Go to Admin → Orders
  - [ ] Find the order you just updated
  - [ ] Click "View" to open detail
  - [ ] Scroll to "J&T waybill" section
  - [ ] Check if waybill_number is populated
  - [ ] Check if status changed to `for_pickup`
  - [ ] ✓ If both are true, integration is working!

## Phase 5: Deploy & Monitor (ongoing)

- [ ] Verify live site works
  - [ ] Current deployment: live001 branch on Vercel
  - [ ] Site: https://reveclothingxnobody.com
  - [ ] Admin URL: https://reveclothingxnobody.com/admin/login

- [ ] Test order workflow
  - [ ] Place a test order with COD payment
  - [ ] Admin marks order as `preparing`
  - [ ] Webhook should auto-create waybill
  - [ ] Waybill appears in order detail

- [ ] Set up monitoring
  - [ ] Monitor Edge Function logs daily (first week)
  - [ ] Check for J&T API errors in logs
  - [ ] If errors: contact J&T support with error message

- [ ] Fallback for manual waybill entry
  - [ ] If J&T API fails, admin can manually enter waybill number
  - [ ] Admin → Orders → View → J&T waybill section
  - [ ] Click "Print waybill & mark for pickup"
  - [ ] Order will be marked for J&T pickup

## Troubleshooting

### Webhook not showing in Recent events
- [ ] Verify webhook is enabled (green toggle)
- [ ] Verify table is `public.orders` (not just `orders`)
- [ ] Verify event is **Update** (not Insert/Delete)
- [ ] Try updating order notes field to test

### Authorization error (401)
- [ ] Check you're using **service role key** (not anon key)
- [ ] Service role key is ~200 chars, starts with `eyJ`
- [ ] No extra spaces in Authorization header
- [ ] Copy fresh from Settings → API

### No waybill created
- [ ] Check Edge Function logs for errors
- [ ] Verify J&T secrets are set: JNT_API_ACCOUNT, JNT_PRIVATE_KEY, JNT_API_URL
- [ ] Verify JNT_API_ENABLED=true
- [ ] Check order status is exactly `preparing` or `packed`
- [ ] Check order doesn't already have waybill_number

### J&T API error
- [ ] Check merchant account is active
- [ ] Verify credentials are correct
- [ ] Verify API URL is correct for your region
- [ ] Contact J&T: merchant@jtexpress.ph with error message

## Success Criteria

✓ All items checked = Integration is live and working

- [ ] J&T credentials obtained
- [ ] Supabase secrets configured
- [ ] Database webhook created
- [ ] Webhook firing (Recent events visible)
- [ ] Edge Function logs show J&T API calls
- [ ] Waybill numbers auto-populate on orders
- [ ] Orders auto-status-change to `for_pickup`
- [ ] Manual waybill fallback works (if needed)
- [ ] Live site handles full order workflow

## Support

**For issues:**
- Check logs: Edge Functions → create-jt-waybill → Logs
- Read: docs/DATABASE_WEBHOOK_SETUP.md (troubleshooting section)
- Contact J&T: merchant@jtexpress.ph

**For new feature requests:**
- J&T API supports tracking webhooks → can implement order status sync
- AfterShip integration → for tracking links
- Print waybill directly → via J&T API (if supported)
