# JT Waybill Database Webhook Setup

This document describes how to create the Supabase Database Webhook that triggers automatic J&T waybill creation when an order becomes ready for shipping.

## Prerequisites

1. Edge Function `create-jt-waybill` deployed
2. Secrets configured: `JNT_API_ACCOUNT`, `JNT_PRIVATE_KEY`, `JNT_API_URL`, `JNT_API_ENABLED`
3. Supabase project with Database Webhooks enabled (pg_net)

## Create the Webhook

1. Go to **Supabase Dashboard** → **Database** → **Webhooks**
2. Click **Create a new hook**
3. Configure:

| Field | Value |
|-------|-------|
| Name | `jt-waybill-on-orders-update` |
| Table | `public.orders` |
| Events | **Update** |
| Type | HTTP Request |
| Method | POST |
| URL | `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/create-jt-waybill` |
| HTTP Headers | `Content-Type: application/json` |
| | `Authorization: Bearer <YOUR_SERVICE_ROLE_KEY>` |

4. Replace:
   - `<YOUR_PROJECT_REF>` with your Supabase project reference (e.g. `txiwvjfdlxgwjtaibbpb`)
   - `<YOUR_SERVICE_ROLE_KEY>` with your project's service role key (Settings → API)

5. Save the webhook

## Payload

Supabase sends a JSON payload on each `orders` UPDATE:

```json
{
  "type": "UPDATE",
  "table": "orders",
  "schema": "public",
  "record": { ...new row... },
  "old_record": { ...previous row... }
}
```

The Edge Function filters and only processes when:
- `record.status` is `preparing` or `packed`
- `record.waybill_number` is null
- `old_record.waybill_number` is null

## Testing

1. Update an order's status to `preparing` (e.g. from Admin)
2. Check Edge Function logs: Supabase Dashboard → Edge Functions → create-jt-waybill → Logs
3. If J&T API is configured, the order should receive a waybill and status `for_pickup`

## Troubleshooting

- **Webhook not firing:** Verify the webhook is enabled and the table/event match
- **401 Unauthorized:** Check the Authorization header uses the service role key (not anon key)
- **No waybill created:** Check `JNT_API_ENABLED=true` and credentials; see Edge Function logs
