# J&T Waybill Database Webhook Setup

This document describes how to create the Supabase Database Webhook that triggers automatic J&T waybill creation when an order becomes ready for shipping.

## Prerequisites

1. Edge Function `create-jt-waybill` deployed ✓
2. Secrets configured: `JNT_API_ACCOUNT`, `JNT_PRIVATE_KEY`, `JNT_API_URL`, `JNT_API_ENABLED`
3. Supabase project with Database Webhooks enabled (pg_net)

## Create the Webhook

### Step 1: Access Supabase Dashboard
1. Go to **https://app.supabase.com**
2. Select project `txiwvjfdlxgwjtaibbpb`
3. Navigate to **Database** (left sidebar) → **Webhooks**

### Step 2: Create New Hook
1. Click **Create a new hook** button
2. Configure the webhook with these settings:

| Field | Value |
|-------|-------|
| **Name** | `jt-waybill-on-orders-update` |
| **Table** | `public.orders` |
| **Events** | ✓ Update |
| **Type** | HTTP Request |
| **Method** | POST |
| **URL** | `https://txiwvjfdlxgwjtaibbpb.supabase.co/functions/v1/create-jt-waybill` |

### Step 3: Add Headers

Click **Add header** and add these two headers:

**Header 1:**
- Key: `Content-Type`
- Value: `application/json`

**Header 2:**
- Key: `Authorization`
- Value: `Bearer [YOUR_SERVICE_ROLE_KEY]`

### Step 4: Get Your Service Role Key

1. Go to **Settings** (left sidebar, bottom)
2. Click **API** tab
3. Under "Project API keys", find **Service role key** (marked as `service_role`)
4. Copy the full key (starts with `eyJ...`)
5. Paste into the Authorization header

### Step 5: Save Webhook

Click **Save** to enable the webhook.

## Configure Edge Function Secrets

The Edge Function needs J&T API credentials to work. Add these to **Edge Functions → Secrets**:

### Step 1: Access Edge Functions Secrets
1. Go to **Edge Functions** (left sidebar)
2. Select `create-jt-waybill`
3. Click **Secrets** tab

### Step 2: Add J&T Credentials

Add these environment variables:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `JNT_API_ENABLED` | `true` | Enable J&T API calls (set to `false` to test webhook without API) |
| `JNT_API_ACCOUNT` | `[from J&T]` | Your J&T merchant account ID (get from J&T Sales) |
| `JNT_PRIVATE_KEY` | `[from J&T]` | Your J&T API private key for request signing (get from J&T Sales) |
| `JNT_API_URL` | `https://api.jtexpress.ph` | J&T Order API endpoint (may vary by region) |
| `JNT_WEBHOOK_SECRET` | `[your-secret]` | Shared secret for webhook verification (use any strong string) |
| `JNT_SENDER_NAME` | `REVE CLOTHING SHOP` | Default sender name (optional, has default) |
| `JNT_SENDER_PHONE` | `09554465207` | Default sender phone (optional, has default) |
| `JNT_SENDER_ADDRESS` | `p5 north pob. Maramag, Bukidnon` | Default sender address (optional, has default) |

**To Get J&T Credentials:**
- Contact J&T Sales: merchant@jtexpress.ph or 1-800-18-7225
- Request: "API integration for merchant code CDO-V2534 (REVE CLOTHING SHOP)"
- They will provide `JNT_API_ACCOUNT` and `JNT_PRIVATE_KEY`

## Webhook Payload Format

Supabase sends this JSON on each `orders` UPDATE:

```json
{
  "type": "UPDATE",
  "table": "orders",
  "schema": "public",
  "record": {
    "id": "uuid",
    "order_number": "ORD-20260612-0001",
    "status": "preparing",
    "waybill_number": null,
    ...
  },
  "old_record": {
    "id": "uuid",
    "status": "paid",
    "waybill_number": null,
    ...
  }
}
```

## Auto-Processing Rules

The Edge Function **automatically** creates a waybill when **ALL** these are true:

1. ✓ Order status changed to `preparing` or `packed`
2. ✓ Order has NO waybill number yet (`waybill_number` is null)
3. ✓ J&T API is enabled (`JNT_API_ENABLED=true`)
4. ✓ Credentials are configured

If J&T API fails, the waybill is NOT created, but you can still:
- Use Admin button "Create waybill" to retry
- Enter waybill manually via Admin UI

## Testing the Webhook

### Test 1: Verify Webhook is Firing

1. Go to **Database** → **Webhooks** → `jt-waybill-on-orders-update`
2. Check "Recent events" tab at the bottom
3. Update any order's status to `preparing` in Admin
4. You should see a new event listed

### Test 2: Check Edge Function Logs

1. Go to **Edge Functions** → `create-jt-waybill`
2. Click **Logs** tab
3. Update an order status to `preparing`
4. Logs should show the webhook invocation

**Expected log output:**
```
J&T API response: 200 { waybill_no: "JT123456789", ... }
```

Or if J&T API not configured:
```
J&T API disabled (JNT_API_ENABLED not true). Skipping waybill creation.
```

### Test 3: Verify Order Status Changes

After webhook fires:
1. Go to **Admin** → **Orders**
2. Find the order you updated
3. If J&T API succeeded, status should be `for_pickup` and waybill_number populated
4. If API not configured, status stays `packed` but webhook still fired

## Troubleshooting

### Webhook Not Firing

**Problem:** Webhook doesn't appear in "Recent events"

**Solutions:**
1. Verify webhook is **enabled** (toggle switch at top)
2. Verify table is `public.orders` (not `orders`)
3. Verify event is set to **Update** (not Insert/Delete)
4. Try updating a different order field (e.g. `notes`) to test

### 401 Unauthorized Error

**Problem:** Webhook logs show `401 Unauthorized`

**Solutions:**
1. Check Authorization header has **service role key** (not anon key)
2. Service role key should be ~200 characters long, starts with `eyJ`
3. Verify no extra spaces in the header value
4. Copy-paste fresh from Settings → API

### No Waybill Created

**Problem:** Webhook fires but no waybill appears

**Solutions:**
1. Check Edge Function logs for error messages
2. Verify `JNT_API_ENABLED=true` in Edge Function Secrets
3. Verify J&T credentials are correct: `JNT_API_ACCOUNT`, `JNT_PRIVATE_KEY`, `JNT_API_URL`
4. If credentials wrong, J&T API returns error (see logs)
5. Check order status is exactly `preparing` or `packed`
6. Check order doesn't already have `waybill_number`

### J&T API Returns Error

**Problem:** Logs show J&T API error response

**Solutions:**
1. Verify merchant account is active with J&T
2. Check J&T credentials haven't expired
3. Verify API endpoint is correct for your region (may not be `api.jtexpress.ph`)
4. Contact J&T Support with the error response from logs

## Manual Waybill Creation (Fallback)

If J&T API is not working, you can create waybills manually:

1. Go to **Admin** → **Orders**
2. Find the order (status should be `packed` or `preparing`)
3. Click **View** to open order detail
4. Scroll to **J&T waybill** section
5. Click **Create waybill** button (attempts J&T API)
   - If successful: waybill_number is populated
   - If failed: add manually in the input field
6. Enter waybill number from J&T VIP portal (https://vip.jtexpress.ph/mange/orderWaybill)
7. Click **Print waybill & mark for pickup**
8. Order status changes to `for_pickup`

## J&T VIP Portal Links

Once orders have waybill numbers, manage them in J&T VIP:

- **Create Shipment:** https://vip.jtexpress.ph/order/quickOrder
- **Manage & Print Waybills:** https://vip.jtexpress.ph/mange/orderWaybill

## Summary

| Component | Status | Action |
|-----------|--------|--------|
| Edge Function `create-jt-waybill` | ✓ Deployed | None |
| Database Webhook | ⏳ Manual setup | Follow steps above |
| J&T API Credentials | ⏳ Pending | Contact J&T Sales |
| Edge Function Secrets | ⏳ Manual setup | Add credentials once received |
| Admin "Create waybill" button | ✓ Ready | Available once secrets configured |
| Manual waybill entry | ✓ Ready | Available anytime |

Once all steps are complete, orders will **automatically** receive waybills when status → `preparing` or `packed`.
