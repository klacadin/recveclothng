# Checkout System Fix Guide

This guide fixes the checkout errors you're seeing:
- ❌ "Failed to send code" / "Failed to send a request to the Edge Function"
- ❌ "Verification failed" / "Invalid or expired code"
- ❌ "Order failed" / "Failed to send a request to the Edge Function"

## Root Cause
The checkout system requires database tables and Edge Functions that aren't deployed yet.

## Complete Fix (3 Steps)

### Step 1: Set up the OTP system

**1.1 Run the OTP migration**
- Open: [SQL Editor](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new)
- Copy all contents from: **`OTP_SETUP.sql`**
- Paste and run in SQL Editor
- ✅ This creates the `checkout_otps` table

**1.2 Deploy OTP Edge Functions**
```bash
npx supabase link --project-ref unaodlytdymouicuuywb
npx supabase functions deploy send-otp
npx supabase functions deploy verify-otp
```

**1.3 Set the Resend API key secret**
Already done: `RESEND_API_KEY=re_UKRcJqR7_F8JKzTGRw7FkkdPKf57n2csH`

---

### Step 2: Set up the Order system

**2.1 Run the Order system migration**
- Open: [SQL Editor](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new)
- Copy all contents from: **`ORDER_SYSTEM_SETUP.sql`**
- Paste and run in SQL Editor
- ✅ This creates:
  - `orders` and `order_items` tables
  - `product_variants` table (for size-specific stock)
  - `order_rate_limits` table (prevents spam)
  - Stock reservation functions (`reserve_variant_stock`, `restore_variant_stock`)
  - Rate limiting functions (`check_order_rate_limit`, `check_duplicate_order`)

**2.2 Deploy the create-order Edge Function**
```bash
npx supabase functions deploy create-order
```

Or via Dashboard:
- Go to: [Edge Functions](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/functions)
- Deploy **create-order** → paste code from `supabase/functions/create-order/index.ts`

⚠️ **Important:** If you already deployed `create-order` before, redeploy it now to include the updated size validation (XS, S, M, L, XL, 2XL, 3XL).

---

### Step 3: Sync product data (NOBODY collection)

**3.1 Run the product migration**
- Open: [SQL Editor](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new)
- Copy all contents from: **`supabase/migrations/20260130000000_sync_canonical_nobody_products.sql`**
- Paste and run in SQL Editor
- ✅ This:
  - Inserts/updates all 36 NOBODY products
  - Creates product variants with correct stock (10 for XS-XL, 5 for 2XL/3XL)
  - Sets product images and descriptions

---

## Testing the checkout flow

After completing all 3 steps:

1. **Add a product to cart** (e.g., "NOBODY Running Shirt - Yellow")
2. **Go to checkout** → fill in customer details
3. **Click "Send code"** → should receive email with 6-digit code ✅
4. **Enter the code** → should verify successfully ✅
5. **Place order** → should create order and show success ✅

---

## Quick Deploy (All-in-one)

If you have Supabase CLI set up:

```bash
# Link project
npx supabase link --project-ref unaodlytdymouicuuywb

# Deploy all Edge Functions
npx supabase functions deploy send-otp
npx supabase functions deploy verify-otp
npx supabase functions deploy create-order

# Set secrets (if not already set)
npx supabase secrets set RESEND_API_KEY=re_UKRcJqR7_F8JKzTGRw7FkkdPKf57n2csH
```

Then run the 3 SQL files in the SQL Editor (in order):
1. `OTP_SETUP.sql`
2. `ORDER_SYSTEM_SETUP.sql`
3. `supabase/migrations/20260130000000_sync_canonical_nobody_products.sql`

---

## Troubleshooting

**Still seeing "Failed to send code"?**
- Check that `send-otp` is deployed: [Functions Dashboard](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/functions)
- Check that `RESEND_API_KEY` secret is set: [Function Secrets](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/settings/functions)

**Still seeing "Invalid or expired code"?**
- Check that `verify-otp` is deployed
- Check that `OTP_SETUP.sql` was run successfully (table `checkout_otps` should exist)

**Still seeing "Order failed" or "Edge Function returned a non-2xx status code"?**
- Check that `create-order` is deployed: [Functions Dashboard](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/functions)
- Check that `ORDER_SYSTEM_SETUP.sql` was run successfully (tables `orders`, `order_items`, `product_variants`, `order_rate_limits` should exist)
- **Redeploy `create-order`** if you deployed it before the size fix (it now accepts XS, S, M, L, XL, 2XL, 3XL)
- Check browser console (F12) for detailed error messages — the error now shows the actual failure reason

---

## Files Created

- ✅ `OTP_SETUP.sql` - Creates OTP verification system
- ✅ `ORDER_SYSTEM_SETUP.sql` - Creates complete order processing system
- ✅ `CHECKOUT_FIX_GUIDE.md` - This file

## Related Files

- `supabase/functions/send-otp/index.ts` - Sends OTP codes via email
- `supabase/functions/verify-otp/index.ts` - Verifies OTP codes
- `supabase/functions/create-order/index.ts` - Creates orders with stock reservation
- `supabase/migrations/20260130000000_sync_canonical_nobody_products.sql` - Syncs NOBODY products
