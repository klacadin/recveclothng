# J&T Express Order API

Reference from [J&T Developer Portal](https://developer.jet.co.id/documentation/index#Order) for future COD waybill integration.

---

## Overview

The J&T Order API is used to place orders from e-commerce platforms to J&T, which returns a **waybill number**. That waybill is then used for tracking and for printing shipping labels.

**Flow:** Customer orders → Partner sends order via API → J&T generates waybill → Partner provides waybill to customer.

---

## Integration Process

1. **Start** – Fill information form and select required APIs
2. **Cooperation Agreement** – Sign agreement with J&T
3. **Test API Integration** – Use sandbox credentials
4. **Mapping Process** – J&T maps your district/city/province to their area codes (required for Order API)
5. **Production Integration** – Switch to production credentials and endpoints
6. **Finish** – Go live; monthly reconciliation begins

---

## API Details (from documentation)

| Item | Value |
|------|-------|
| **Method** | POST |
| **Content-Type** | `application/x-www-form-urlencoded` |
| **Response** | JSON |
| **Authentication** | MD5 + Base64 signature |

### Endpoints (per region)

| Environment | Base URL (example) |
|-------------|--------------------|
| Test | `https://demoopenapi.jtjms-mx.com/webopenplatformapi` |
| Production | `https://openapi.jtjms-mx.com/webopenplatformapi` |

**Note:** Philippines may use a different domain (e.g. `jtjms-ph.com`). Confirm with J&T PH account manager.

### Credentials

- **apiAccount** – Merchant/customer code
- **privateKey** – API key for signature

### Request Parameters

- **data_param** – JSON string containing order data (order details, sender, receiver, COD amount, etc.)
- Signature is built from request data using MD5 and Base64 (exact algorithm in J&T docs)

---

## Order Parameters (typical)

From similar J&T integrations:

### Sender (merchant)
- Name, phone, full address
- Branch / drop point code (e.g. Maramag DP)

### Receiver (customer)
- Name, phone, full address
- City, province, postal/area code (mapped to J&T codes)

### Parcel
- Weight (kg)
- Dimensions (L × W × H, cm)
- Item description

### COD
- **COD amount** – Amount to collect from customer
- Currency (e.g. PHP)

### Order
- Reference/order number
- Service type (COD vs non-COD)
- Merchant/store code (e.g. CDO-V2534)

---

## REVE Clothing Context

| Item | Value |
|------|-------|
| Merchant | REVE CLOTHING SHOP |
| Store code | CDO-V2534 |
| Drop point | Maramag DP |
| VIP portal | https://vip.jtexpress.ph |
| Quick Order | https://vip.jtexpress.ph/order/quickOrder |
| Order Waybill | https://vip.jtexpress.ph/mange/orderWaybill |

---

## Waybill Automation (Implemented)

### Edge Function: `create-jt-waybill`

Invoked by:
1. **Database Webhook** – On `orders` UPDATE when status becomes `preparing` or `packed` and `waybill_number` is null
2. **Admin** – "Create waybill" button sends `{ order_id }` directly

### Environment Variables (Supabase Edge Function Secrets)

| Secret | Required | Description |
|--------|----------|-------------|
| `JNT_API_ENABLED` | No | Set to `true` to enable J&T API calls (default: disabled) |
| `JNT_API_ACCOUNT` | Yes (when enabled) | Merchant code (CDO-V2534) |
| `JNT_PRIVATE_KEY` | Yes (when enabled) | API key for signature |
| `JNT_API_URL` | Yes (when enabled) | Base URL (e.g. `https://demoopenapi.jtjms-mx.com/webopenplatformapi`) |
| `JNT_SENDER_NAME` | No | Default: REVE CLOTHING SHOP |
| `JNT_SENDER_PHONE` | No | Default: 09554465207 |
| `JNT_SENDER_ADDRESS` | No | Default: p5 north pob. Maramag, Bukidnon |

### Webhook Setup

See [DATABASE_WEBHOOK_SETUP.md](DATABASE_WEBHOOK_SETUP.md) for creating the Database Webhook in Supabase Dashboard.

---

## Next Steps for API Integration

1. **Obtain PH-specific API docs** – Request from J&T PH (support, account manager).
2. **Get PH endpoints** – Confirm base URL and Order API path for Philippines.
3. **Enable automation** – Set `JNT_API_ENABLED=true` and credentials when PH API is confirmed. (Edge Function already implemented.)
4. **Address mapping** – When marking order as “For pickup”, optionally create waybill via API or use manual Quick Order.

---

## References

- [J&T Developer Portal](https://developer.jet.co.id/documentation/index#Order)
- [J&T Express Philippines](https://www.jtexpress.ph/)
- [VIP Merchant Portal](https://vip.jtexpress.ph)
