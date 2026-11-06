-- Recovered REVE-uploaded products from previous Supabase project txiwvjfdlxgwjtaibbpb
-- Generated on 2026-05-07. Source dump: exports/previous-db-public-data-2026-05-07.sql
-- Scope: products where created_by_email = master@reveclothingxnobody.com plus their variants.

BEGIN;


INSERT INTO "public"."categories" ("id", "name", "slug", "description", "image_url", "parent_id", "sort_order", "is_active", "created_at", "updated_at", "code") VALUES
	('54125b35-f191-4d52-9e35-d639f97e174e', 'Running Shorts', 'running-shorts', 'Performance running shorts', NULL, NULL, 3, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SHORT'),
	('688802f3-df60-444e-aa0a-a9d1e2f9a5d5', 'Running Singlets', 'running-singlets', 'Lightweight running singlets', NULL, NULL, 4, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SING'),
	('bec1254b-8067-458a-9767-6c3f7ec77da3', 'Running Long Sleeves', 'running-long-sleeves', 'Long sleeve running tops', NULL, NULL, 5, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'LSLV'),
	('e1feecae-189d-47aa-8955-d9980b9bd7fd', 'NOBODY Collection', 'nobody', 'The NOBODY collection - for unsung heroes of the track and trail', NULL, NULL, 1, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'NOBODY'),
	('3d2f9754-d60b-4232-aac2-68d18358654c', 'Running Shirt', 'running-shirt', 'Performance running shirts', NULL, NULL, 2, true, '2026-01-30 21:33:02.34498+00', '2026-02-23 13:14:49.451579+00', 'SHRT')
ON CONFLICT (id) DO UPDATE SET
	name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, image_url = EXCLUDED.image_url, parent_id = EXCLUDED.parent_id, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active, updated_at = EXCLUDED.updated_at, code = EXCLUDED.code;

INSERT INTO "public"."products" ("id", "name", "description", "price", "sku", "category", "image_url", "stock_quantity", "low_stock_threshold", "is_active", "created_at", "updated_at", "images", "created_by_email", "updated_by_email", "weight_grams") VALUES
	('07d818b2-d717-4b49-b2db-ce3fba47276d', 'purple', '', 900.00, 'prl-shrt', 'Running Shorts', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087490346-x8bx4jvtap8.jpg', 19, 10, true, '2026-04-25 03:25:12.795502+00', '2026-04-26 04:36:27.247784+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('8968a92e-037f-4730-b29b-67286ae5f896', 'TRIBAL GRAY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'TRIB-GRY', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1776303489324-857vsefyo49.jpg', 30, 10, true, '2026-04-17 01:33:20.738848+00', '2026-05-02 11:00:51.441279+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('db737760-ae21-4062-9dd7-e2aa3a252d3b', 'orange', '', 900.00, 'orng-shrt', 'Running Shorts', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087546628-9i0rcd10f5.jpg', 20, 10, true, '2026-04-25 03:25:55.750008+00', '2026-04-25 03:25:56.047083+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('b618ec46-36e8-4655-8196-dd16248c6363', 'galaxy', '', 400.00, 'glxy-shrt', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777094788465-ahrddhud8wa.png', 35, 10, true, '2026-04-25 05:26:36.993673+00', '2026-04-25 05:26:37.423932+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('01e1ba4d-c149-48a3-8b70-ecd47908631a', 'BKDN INSPIRED', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BKDN', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454220250-6riwwqdgg6p.jpg', 33, 10, true, '2026-03-02 12:23:56.128411+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('55475375-cb6f-45a1-a394-c8c4521caf73', 'PNK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PINK', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454589290-8uskpyj6dkd.jpg', 32, 5, true, '2026-03-02 12:30:13.140468+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('05846b33-27dc-4bce-825a-b9ddcb99f08b', 'FOREST GREEN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-FRST', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454282053-bi460levvys.jpg', 33, 5, true, '2026-03-02 12:24:52.368714+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'STRIPES', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-VLET', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454659604-tqcm421e2rd.jpg', 33, 10, true, '2026-03-02 12:31:07.604257+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('647fe18d-25bf-4b29-8884-b0aa84926429', 'BLK PINK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BLK ', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454551938-5cyr9uinoi5.jpg', 35, 5, true, '2026-03-02 12:29:21.183807+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKW', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454744643-dpvl7gm5fzl.jpg', 31, 10, true, '2026-03-02 12:32:34.36905+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('6d9de635-61b6-47c9-b5d0-4579ea281de2', 'ASH GRAY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ASHG', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454387961-i9xnubs0zd9.jpg', 35, 5, true, '2026-03-02 12:26:36.784971+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'BE YOUR OWN HERO', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, '', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772618280078-tlb89kcgmak.jpg', 59, 10, true, '2026-03-04 09:43:55.497557+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', 'master@reveclothingxnobody.com', 500),
	('a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'RUN WILD', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-WILD', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454431466-v9saejkxe5k.jpg', 34, 10, true, '2026-03-02 12:27:19.723587+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('1881793e-cf72-40a3-ae1a-cf420847cdb7', 'RAINBOW', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-RNDB', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454473139-xmx6kw1iqpa.jpg', 34, 5, true, '2026-03-02 12:28:02.15454+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-WAVE', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454707304-t60vzw29ue.jpg', 26, 10, true, '2026-03-02 12:31:55.567906+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500),
	('a808e805-9e26-4a82-9ba9-7d73da37b192', 'FOREST PINK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNK', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454335433-llejnqwt32j.jpg', 32, 5, true, '2026-03-02 12:25:45.033797+00', '2026-05-05 17:53:59.05638+00', '{}', 'master@reveclothingxnobody.com', NULL, 500)
ON CONFLICT (id) DO UPDATE SET
	name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, sku = EXCLUDED.sku, category = EXCLUDED.category, image_url = EXCLUDED.image_url, stock_quantity = EXCLUDED.stock_quantity, low_stock_threshold = EXCLUDED.low_stock_threshold, is_active = EXCLUDED.is_active, updated_at = EXCLUDED.updated_at, images = EXCLUDED.images, created_by_email = EXCLUDED.created_by_email, updated_by_email = EXCLUDED.updated_by_email, weight_grams = EXCLUDED.weight_grams;

INSERT INTO "public"."product_variants" ("id", "product_id", "size", "stock_quantity", "low_stock_threshold", "sku_suffix", "created_at", "updated_at") VALUES
	('94627ff9-6cb6-4094-8548-748095fb293e', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'XS', 0, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('45b9695e-8e76-40b8-b3b1-72ce8238774e', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'XS', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('2d26d39d-18e0-4305-9eaf-2ca9d92fcd19', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'M', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('bca0c4f1-d97f-46a5-8b2e-1b6a519df54c', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'L', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('71af94fd-6f5d-40bd-854e-22a08bcc4ac2', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'XL', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('c3483e70-4a22-4ced-879e-f2b0d8e618b7', '1881793e-cf72-40a3-ae1a-cf420847cdb7', '2XL', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('edd53fc8-aef8-4a01-ac10-612bc7bef64b', '1881793e-cf72-40a3-ae1a-cf420847cdb7', '3XL', 5, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-02 12:28:02.566247+00'),
	('07197f1a-0af4-4282-93ba-d52928a8eaff', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', '3XL', 8, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.229114+00'),
	('7ac3425a-ad48-43b9-81ee-2cec5ee62cc9', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'S', 5, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('87d90113-3ff7-49e2-a2c9-58a8c46e153c', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'XL', 10, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.240233+00'),
	('eba48a0d-c6ac-4d95-a06c-efffa76db3ec', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'L', 5, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('c4ccf44e-1244-42c0-8d6b-7e4a11dfe631', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', '2XL', 10, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.655153+00'),
	('6924577d-01d8-49c6-a6dd-3e04b92220d6', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'XS', 10, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.657363+00'),
	('ae6751f4-9a01-4e09-a0bb-b9a15225aee7', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'S', 4, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-09 04:13:21.458738+00'),
	('db3371ee-0b90-46be-a914-6cb7cfc4a9c1', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'XL', 5, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('07912475-47ed-4153-bb34-9ca30152b23a', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'S', 8, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-09 03:55:31.23634+00'),
	('4d4e8bab-eee3-442d-8bb6-3347b8526a37', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'L', 9, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-09 03:55:31.41995+00'),
	('a14d7097-bdf0-4d12-bf3a-0f34282315ca', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'M', 4, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-12 14:56:29.24905+00'),
	('c902e1dd-0f28-46e0-85e9-1b13df3731d5', '07d818b2-d717-4b49-b2db-ce3fba47276d', '2XL', 0, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('8d9aebcf-4160-4b39-9055-070a726aac88', '07d818b2-d717-4b49-b2db-ce3fba47276d', '3XL', 0, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('bcf2b51e-328c-44a2-83a8-2dba8c3423e8', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'M', 4, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-26 04:36:27.247784+00'),
	('5cd824aa-1e00-461a-9621-c232e070ce7e', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'XS', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('04ad7e5c-04b6-4db1-9465-188c462a95ac', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'S', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('f5b07224-6fcc-4dff-9330-a7b85baac6b6', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'M', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('96c970d6-d39d-4c94-948f-33d53a208354', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'L', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('1fd9b693-5d48-4b99-a6ef-c0c89a810f57', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'XL', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('b135c36f-21e2-49cc-bee8-7a5baf9e2097', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', '2XL', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('6b4d2a45-67cc-4cc1-8560-56d4f1c0ca2e', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', '3XL', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('2a943c06-57a1-422d-911c-aedbc5acb6d4', '8968a92e-037f-4730-b29b-67286ae5f896', 'S', 3, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-05-02 11:00:51.441279+00'),
	('c3e35de1-4745-4e3a-b2e4-d3bcbdbd7d52', '8968a92e-037f-4730-b29b-67286ae5f896', 'XS', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('c6b56a62-c7dc-45d1-a84e-b710e294414f', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'M', 5, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-02 12:23:56.571808+00'),
	('4db319b8-1ebb-45d5-b035-31c3fc1bb095', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'L', 5, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-02 12:23:56.571808+00'),
	('860879be-71f4-4111-ad9a-7e1686cf740a', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'XL', 5, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-02 12:23:56.571808+00'),
	('05f3f084-b062-4c61-abb6-3f652d5cddd6', '01e1ba4d-c149-48a3-8b70-ecd47908631a', '2XL', 5, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-02 12:23:56.571808+00'),
	('db5d9392-2671-4848-864c-3c254d20a3e0', '01e1ba4d-c149-48a3-8b70-ecd47908631a', '3XL', 5, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-02 12:23:56.571808+00'),
	('6d3c730b-301b-497b-9cbf-b39d89ee8592', '647fe18d-25bf-4b29-8884-b0aa84926429', 'XS', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('3df56703-0b56-40c1-8680-0243018ba144', '647fe18d-25bf-4b29-8884-b0aa84926429', 'S', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('14e4e028-85a7-4964-a5e1-f16908500c68', '647fe18d-25bf-4b29-8884-b0aa84926429', 'M', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('2fb661e0-e2eb-42a9-ae0c-dd3d5b18875a', '647fe18d-25bf-4b29-8884-b0aa84926429', 'L', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('73b3fedf-4b91-4e7f-9499-dac560823937', '647fe18d-25bf-4b29-8884-b0aa84926429', 'XL', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('3c58f3f7-5ab2-464a-a723-f5ecd0e85571', '647fe18d-25bf-4b29-8884-b0aa84926429', '2XL', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('f6dc5195-a7a4-455c-8e37-8298e2df99bc', '647fe18d-25bf-4b29-8884-b0aa84926429', '3XL', 5, 5, NULL, '2026-03-02 12:29:21.49998+00', '2026-03-02 12:29:21.49998+00'),
	('e147dd6f-78ef-4462-a6b1-a4171b8525e1', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'S', 4, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-30 06:51:06.918646+00'),
	('04c12ad7-476b-492e-8587-b76f003cb6bf', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'XS', 4, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-04-01 12:42:48.867476+00'),
	('4a7b8fe7-c208-4a75-ad64-9f1f13165a23', 'b618ec46-36e8-4655-8196-dd16248c6363', 'XS', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('31e3e83b-0058-4c72-a2a4-e957d29f1fe3', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'XS', 5, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-02 12:24:52.707817+00'),
	('e9b67a72-3108-4218-b768-667324708cfd', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'M', 5, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-02 12:24:52.707817+00'),
	('17e7e098-4502-48c2-8715-84e45777e8d5', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'XL', 5, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-02 12:24:52.707817+00'),
	('db028ee8-260f-4da7-b730-b103870ef966', '05846b33-27dc-4bce-825a-b9ddcb99f08b', '2XL', 5, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-02 12:24:52.707817+00'),
	('69cf2f69-8e8d-4548-b3e0-5231da5d0f1f', '05846b33-27dc-4bce-825a-b9ddcb99f08b', '3XL', 5, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-02 12:24:52.707817+00'),
	('52d2c33f-5c8e-4e09-8926-70f1b3f5a14a', '55475375-cb6f-45a1-a394-c8c4521caf73', 'M', 5, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-02 12:30:13.537304+00'),
	('084d7b52-4336-48cd-8ba3-16f84fa6a144', '55475375-cb6f-45a1-a394-c8c4521caf73', 'L', 5, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-02 12:30:13.537304+00'),
	('29082f99-9ee9-434f-be15-8c672a5ae06c', '55475375-cb6f-45a1-a394-c8c4521caf73', 'XL', 5, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-02 12:30:13.537304+00'),
	('174ae767-0f6d-405c-94ae-b64a75f06f07', '55475375-cb6f-45a1-a394-c8c4521caf73', '2XL', 5, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-02 12:30:13.537304+00'),
	('837ac00f-3d14-489e-bc9d-e7715b28965e', '55475375-cb6f-45a1-a394-c8c4521caf73', '3XL', 5, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-02 12:30:13.537304+00'),
	('4ffab9dd-14af-4e88-9180-b3ff88071bdd', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'L', 4, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-03-17 07:10:37.580671+00'),
	('eb5d2a93-9773-46e7-b3b7-c2036760b95c', '55475375-cb6f-45a1-a394-c8c4521caf73', 'S', 4, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-03-31 06:23:04.406756+00'),
	('ac89da43-463c-4d1a-b924-85b183b01765', '55475375-cb6f-45a1-a394-c8c4521caf73', 'XS', 3, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-04-06 12:30:12.974073+00'),
	('7f060b17-9318-4248-bc1f-09dea8bd07a4', '8968a92e-037f-4730-b29b-67286ae5f896', '2XL', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('625ab620-7365-41ba-af00-e9c396b4749b', '8968a92e-037f-4730-b29b-67286ae5f896', '3XL', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('fea102f1-812b-4661-b835-5b35ff2ade1a', '8968a92e-037f-4730-b29b-67286ae5f896', 'L', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-21 07:56:22.282619+00'),
	('4a13baa6-6f0e-4826-bd8c-c25d36db00f1', 'b618ec46-36e8-4655-8196-dd16248c6363', 'S', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('c03881f4-5c02-4780-8368-1bf45817495c', 'b618ec46-36e8-4655-8196-dd16248c6363', 'M', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('2e27b224-1c21-4c78-b6ad-8fe88b856419', 'b618ec46-36e8-4655-8196-dd16248c6363', 'L', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('1ccd33bd-c9a6-4c3b-81d1-79bd67fdb23a', 'b618ec46-36e8-4655-8196-dd16248c6363', 'XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('24e73092-8f07-457d-b4c2-9f1c4adc714a', 'b618ec46-36e8-4655-8196-dd16248c6363', '2XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('d7eca29c-8f13-4276-bbc7-0d1526d1dc0b', 'b618ec46-36e8-4655-8196-dd16248c6363', '3XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('c38c6326-169d-4f81-a4c2-6b1c328b08e3', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'S', 4, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-04-29 04:07:32.239796+00'),
	('99adbc66-2e22-4f0b-b205-f6988f43dde3', '8968a92e-037f-4730-b29b-67286ae5f896', 'XL', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-30 05:18:26.638467+00'),
	('8eb11ead-6a7f-4d93-9e36-c646ad4ada04', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'M', 4, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-04-26 04:36:27.578373+00'),
	('67fb67e8-3b13-4d16-aa75-7d706b34ca92', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'L', 5, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-02 12:25:45.348113+00'),
	('e3b8b87c-2dbf-4d07-afb4-61ebd61c144e', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'XL', 5, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-02 12:25:45.348113+00'),
	('b2a9226d-ee50-4c5c-9225-803c5e759d69', 'a808e805-9e26-4a82-9ba9-7d73da37b192', '2XL', 5, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-02 12:25:45.348113+00'),
	('b1520633-4e78-4fc0-9619-fdae899141ed', 'a808e805-9e26-4a82-9ba9-7d73da37b192', '3XL', 5, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-02 12:25:45.348113+00'),
	('34d1beed-5e7a-4da6-9278-48d82077d163', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'M', 5, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-02 12:31:08.036884+00'),
	('29157672-06ff-4caa-98c0-f7559aefc2b3', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'L', 5, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-02 12:31:08.036884+00'),
	('9172e190-3b5a-4bf5-8d83-5ca0193a518a', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'XL', 5, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-02 12:31:08.036884+00'),
	('9f20ba9d-880b-4038-a5a6-62a90f23afcf', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', '2XL', 5, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-02 12:31:08.036884+00'),
	('df5854a5-c3c4-40e9-b7a8-60075033cffd', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', '3XL', 5, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-02 12:31:08.036884+00'),
	('96a27036-0297-4706-9972-546bdc1adaa5', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'XS', 4, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-05 14:52:01.519196+00'),
	('5af1cae0-9b48-4882-8a82-949696232572', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'S', 4, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-03-09 04:13:21.163294+00'),
	('4aabdbfa-6db2-439e-bafe-1b91065945fc', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'S', 4, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-03-31 06:23:04.198473+00'),
	('36657986-c0c1-4db0-af3d-c6649d9e49ed', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'XS', 4, 5, NULL, '2026-03-02 12:31:08.036884+00', '2026-04-06 12:30:13.458811+00'),
	('6e5e166f-3a81-4536-894d-c85ce7caab05', '8968a92e-037f-4730-b29b-67286ae5f896', 'M', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-19 02:09:28.446385+00'),
	('7fb10391-6e32-46bf-8ded-cf335093d9b5', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'M', 2, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-04-26 04:36:27.407087+00'),
	('a23d4ebf-47ca-45c9-98e6-4a24bfd40ca1', '6d9de635-61b6-47c9-b5d0-4579ea281de2', 'XS', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('e6f2d6a1-5381-4765-bd68-e9f912602ea8', '6d9de635-61b6-47c9-b5d0-4579ea281de2', 'S', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('f5a3c64b-4ba8-4134-ac10-524be15e326f', '6d9de635-61b6-47c9-b5d0-4579ea281de2', 'M', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('0242e61e-b9c7-4cc6-8852-535ec0eb649e', '6d9de635-61b6-47c9-b5d0-4579ea281de2', 'L', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('12c76471-60ef-4d0e-8841-1de6299815d6', '6d9de635-61b6-47c9-b5d0-4579ea281de2', 'XL', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('b498ff7f-a664-42bc-adfb-923d1442d32e', '6d9de635-61b6-47c9-b5d0-4579ea281de2', '2XL', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('48a2ceb2-0e5b-4fc6-b918-6166774fa9ce', '6d9de635-61b6-47c9-b5d0-4579ea281de2', '3XL', 5, 5, NULL, '2026-03-02 12:26:37.116948+00', '2026-03-02 12:26:37.116948+00'),
	('5d1a54c9-e0db-45ed-a7e9-cd433989207e', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'L', 5, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-02 12:31:55.922307+00'),
	('b1438746-56b6-4ee9-9729-4bda97259022', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'XL', 5, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-02 12:31:55.922307+00'),
	('cf4a02f6-4bbd-4d4a-a1bc-56d17cf1c756', '56a0ca2e-bc0a-493a-abfc-6f8158929391', '3XL', 5, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-02 12:31:55.922307+00'),
	('49b29a51-16ce-499b-9f73-b910058aafd8', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'S', 3, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-15 11:31:27.039837+00'),
	('2b3d0432-99a3-4a2d-9762-7071850376a7', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'XS', 4, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-30 08:33:10.762892+00'),
	('bd54c58a-0cb3-45fe-9fd6-718905256595', '56a0ca2e-bc0a-493a-abfc-6f8158929391', '2XL', 2, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-04-12 17:05:03.287519+00'),
	('f128a01c-31ac-48a7-a30e-3ba1f776473d', '3532981c-4b88-440a-975b-4f219067be86', 'L', 4, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-28 14:11:44.137244+00'),
	('d69076ed-5bf3-456c-b899-8d4b16af442c', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'S', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('81252bc7-0eb5-448f-a024-72189a688242', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'M', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('7847aa2e-cc25-41b2-b99a-1f3f1cf080f7', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'L', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('ae982a5a-6064-4fca-a82f-1d786e8278eb', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'XL', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('4073274e-9a1a-4117-a2c5-d6dcfef0a229', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', '2XL', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('6b639234-10c0-4ded-9494-1366a076a9f4', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', '3XL', 5, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-03-02 12:27:20.061925+00'),
	('d24f8a13-7097-4c1e-acec-4fd84e25f688', '3532981c-4b88-440a-975b-4f219067be86', 'S', 5, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-02 12:32:34.700013+00'),
	('353d1757-2269-40b7-adbd-1b2fcf9f3b99', '3532981c-4b88-440a-975b-4f219067be86', 'XL', 5, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-02 12:32:34.700013+00'),
	('6e6f6fca-f873-4e13-9cfc-2a4fe567d185', '3532981c-4b88-440a-975b-4f219067be86', '2XL', 5, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-02 12:32:34.700013+00'),
	('8c880dbb-ec03-4785-92c7-e9e0e129195e', '3532981c-4b88-440a-975b-4f219067be86', '3XL', 5, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-02 12:32:34.700013+00'),
	('71ab9dc7-f856-4674-ba47-a36373492146', '3532981c-4b88-440a-975b-4f219067be86', 'XS', 4, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-05 14:52:01.687249+00'),
	('b6eea6e3-f7ca-4a51-b097-752741314eb9', '3532981c-4b88-440a-975b-4f219067be86', 'M', 3, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-09 04:13:21.837285+00'),
	('48b9ec60-c249-4f45-8c52-bfbe1cf7fa07', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'XS', 4, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-04-01 12:42:49.114755+00')
ON CONFLICT (id) DO UPDATE SET
	product_id = EXCLUDED.product_id, size = EXCLUDED.size, stock_quantity = EXCLUDED.stock_quantity, low_stock_threshold = EXCLUDED.low_stock_threshold, sku_suffix = EXCLUDED.sku_suffix, updated_at = EXCLUDED.updated_at;


COMMIT;
