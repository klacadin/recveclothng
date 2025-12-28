-- Add server-side validation constraints for data integrity

-- Products table constraints
ALTER TABLE public.products 
ADD CONSTRAINT products_name_length CHECK (length(name) <= 255);

ALTER TABLE public.products 
ADD CONSTRAINT products_price_positive CHECK (price >= 0);

ALTER TABLE public.products 
ADD CONSTRAINT products_stock_positive CHECK (stock_quantity >= 0);

ALTER TABLE public.products 
ADD CONSTRAINT products_threshold_positive CHECK (low_stock_threshold >= 0);

ALTER TABLE public.products 
ADD CONSTRAINT products_sku_length CHECK (sku IS NULL OR length(sku) <= 100);

ALTER TABLE public.products 
ADD CONSTRAINT products_category_length CHECK (category IS NULL OR length(category) <= 100);

-- Orders table constraints
ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_name_length CHECK (length(customer_name) <= 255);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_email_format CHECK (customer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_email_length CHECK (length(customer_email) <= 320);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_shipping_address_length CHECK (length(shipping_address) <= 1000);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_phone_length CHECK (customer_phone IS NULL OR length(customer_phone) <= 50);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_subtotal_positive CHECK (subtotal >= 0);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_total_positive CHECK (total >= 0);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_shipping_fee_positive CHECK (shipping_fee >= 0);

-- Order items table constraints
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_name_length CHECK (length(product_name) <= 255);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_unit_price_positive CHECK (unit_price >= 0);

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_total_price_positive CHECK (total_price >= 0);