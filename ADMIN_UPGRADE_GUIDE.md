# Admin Dashboard Upgrade Guide

## What's New

### 1. Category Management
- **New Categories tab** in the admin sidebar
- Create, edit, and delete categories
- Auto-generated URL slugs
- Category images support
- Active/inactive status toggle
- View product counts per category

### 2. Enhanced Product Form
- **Category dropdown** with all available categories
- Quick category selection (no more typing)
- Custom category option for one-off products
- Image upload with drag-and-drop
- Size-specific stock management

### 3. Streamlined Inventory (Already Implemented)
- Bulk actions toolbar (select multiple products)
- Activate/deactivate products in bulk
- Set category for multiple products at once
- Bulk delete with confirmation
- CSV export functionality
- Size-wise stock display in table

### 4. Order Management (Already Implemented)
- Order status dropdown with visual indicators
- Quick status updates
- Order details modal
- Delete orders with confirmation
- Search/filter orders

### 5. HitPay Payment Integration
- Replaces Xendit for GCash/Maya payments
- Automatic order status update on payment completion
- Webhook support for payment notifications
- Payment transaction tracking

---

## Deployment Steps

### Step 1: Run Database Migration

Open [SQL Editor](https://supabase.com/dashboard/project/unaodlytdymouicuuywb/sql/new) and run:

**File:** `ADMIN_UPGRADE.sql`

This creates:
- `categories` table with default REVE categories
- `payment_transactions` table for HitPay tracking
- Required indexes and RLS policies

### Step 2: Deploy HitPay Edge Functions

```bash
npx supabase functions deploy create-hitpay-payment
npx supabase functions deploy hitpay-webhook
```

### Step 3: Set HitPay Secrets

Get your API credentials from [HitPay Dashboard](https://dashboard.hit-pay.com/):

```bash
npx supabase secrets set HITPAY_API_KEY=your_api_key_here
npx supabase secrets set HITPAY_SALT=your_webhook_salt_here
npx supabase secrets set SITE_URL=https://reveclothingxnobody.com
```

**For testing (sandbox):**
```bash
npx supabase secrets set HITPAY_API_URL=https://api.sandbox.hit-pay.com/v1
```

**For production:**
```bash
npx supabase secrets set HITPAY_API_URL=https://api.hit-pay.com/v1
```

### Step 4: Configure HitPay Webhook

In your HitPay Dashboard:
1. Go to **Settings > API Keys**
2. Add webhook URL: `https://unaodlytdymouicuuywb.supabase.co/functions/v1/hitpay-webhook`
3. Copy the webhook salt and set it as `HITPAY_SALT` secret

---

## New Files Created

### Components
- `src/components/admin/CategoryManagement.tsx` - Category CRUD UI

### Hooks
- `src/hooks/useCategories.ts` - Category data hooks

### Edge Functions
- `supabase/functions/create-hitpay-payment/index.ts` - Create HitPay payment
- `supabase/functions/hitpay-webhook/index.ts` - Handle HitPay webhooks

### Database
- `ADMIN_UPGRADE.sql` - Categories and payment transactions tables

---

## Admin Dashboard Features

### Categories Tab
| Action | Description |
|--------|-------------|
| Add Category | Create new product category |
| Edit Category | Update name, slug, description, image |
| Delete Category | Remove category (products keep their category text) |
| Toggle Active | Show/hide category on storefront |

### Inventory Tab
| Action | Description |
|--------|-------------|
| Add Product | Create new product with category dropdown |
| Edit Product | Update all product details |
| Update Stock | Click stock number to edit size-wise quantities |
| Duplicate | Clone product with 0 stock |
| Bulk Select | Checkbox to select multiple products |
| Bulk Activate | Activate all selected products |
| Bulk Deactivate | Deactivate all selected products |
| Bulk Set Category | Assign category to all selected |
| Bulk Delete | Delete all selected products |
| Export CSV | Download inventory spreadsheet |

### Orders Tab
| Action | Description |
|--------|-------------|
| New Order | Create manual order |
| View Order | See full order details |
| Update Status | Change status via dropdown |
| Delete Order | Remove order with confirmation |
| Search | Filter by order number, customer |

---

## HitPay Payment Flow

1. **Customer selects GCash/Maya** at checkout
2. **Create order** via `create-order` Edge Function
3. **Create payment** via `create-hitpay-payment` Edge Function
4. **Redirect to HitPay** payment page
5. **Customer pays** using selected method
6. **HitPay webhook** notifies our server
7. **Order status updated** to "paid"
8. **Customer redirected** to order confirmation page

---

## Testing HitPay Integration

1. Use sandbox API URL for testing
2. Test with HitPay test cards/credentials
3. Verify webhook is receiving notifications
4. Check order status updates correctly

**Test Mode API URL:**
```
https://api.sandbox.hit-pay.com/v1
```

**Production API URL:**
```
https://api.hit-pay.com/v1
```

---

## Troubleshooting

### Categories not showing in Product Form
- Ensure `ADMIN_UPGRADE.sql` was run successfully
- Check browser console for errors
- Verify RLS policies allow SELECT on categories

### HitPay payment not redirecting
- Check `HITPAY_API_KEY` is set correctly
- Verify API URL matches your account type (sandbox/production)
- Check Edge Function logs for errors

### Webhook not updating order status
- Verify webhook URL is correct in HitPay dashboard
- Check `HITPAY_SALT` matches your HitPay settings
- Review `hitpay-webhook` function logs
