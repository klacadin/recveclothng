-- Import previous sales export from exports/sales-orders-2026-05-05.csv
-- and exports/sales-order-items-2026-05-05.csv.
--
-- Idempotent: orders are upserted by order_number and order items are inserted
-- only when the same order/product/size/price line does not already exist.

WITH imported_order AS (
  INSERT INTO public.orders (
    order_number,
    created_at,
    updated_at,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    status,
    payment_method,
    subtotal,
    shipping_fee,
    total,
    waybill_number,
    payment_reference_number,
    proof_of_payment_url,
    notes,
    user_id
  )
  VALUES (
    'ORD-20260505-9387',
    '2026-05-05T17:50:01.830Z',
    '2026-05-05T17:50:01.830Z',
    'keren happuch',
    'khlacadin@gmail.com',
    '9359830397',
    'Imported historical order',
    'new'::public.order_status,
    'cod'::public.payment_method,
    350,
    130,
    518,
    NULL,
    NULL,
    NULL,
    'Imported from previous sales export dated 2026-05-05.',
    NULL
  )
  ON CONFLICT (order_number) DO UPDATE SET
    updated_at = EXCLUDED.updated_at,
    customer_name = EXCLUDED.customer_name,
    customer_email = EXCLUDED.customer_email,
    customer_phone = EXCLUDED.customer_phone,
    status = EXCLUDED.status,
    payment_method = EXCLUDED.payment_method,
    subtotal = EXCLUDED.subtotal,
    shipping_fee = EXCLUDED.shipping_fee,
    total = EXCLUDED.total,
    waybill_number = EXCLUDED.waybill_number,
    payment_reference_number = EXCLUDED.payment_reference_number,
    proof_of_payment_url = EXCLUDED.proof_of_payment_url,
    notes = EXCLUDED.notes
  RETURNING id
)
INSERT INTO public.order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  size,
  quantity,
  unit_price,
  total_price,
  created_at
)
SELECT
  imported_order.id,
  (
    SELECT p.id
    FROM public.products p
    WHERE p.id = '5553b0c8-4906-4de4-b731-00eaf18790ac'::uuid
       OR p.sku = 'SING-FAITH'
    ORDER BY CASE WHEN p.id = '5553b0c8-4906-4de4-b731-00eaf18790ac'::uuid THEN 0 ELSE 1 END
    LIMIT 1
  ),
  'Faith Over Fear',
  'SING-FAITH--M',
  'M',
  1,
  350,
  350,
  '2026-05-05T17:50:01.830Z'
FROM imported_order
WHERE NOT EXISTS (
  SELECT 1
  FROM public.order_items oi
  WHERE oi.order_id = imported_order.id
    AND oi.product_name = 'Faith Over Fear'
    AND oi.product_sku = 'SING-FAITH--M'
    AND oi.size = 'M'
    AND oi.quantity = 1
    AND oi.unit_price = 350
    AND oi.total_price = 350
);
