INSERT INTO "public"."categories" ("id", "name", "slug", "description", "image_url", "parent_id", "sort_order", "is_active", "created_at", "updated_at", "code") VALUES
	('54125b35-f191-4d52-9e35-d639f97e174e', 'Running Shorts', 'running-shorts', 'Performance running shorts', NULL, NULL, 3, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SHORT'),
	('688802f3-df60-444e-aa0a-a9d1e2f9a5d5', 'Running Singlets', 'running-singlets', 'Lightweight running singlets', NULL, NULL, 4, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SING'),
	('bec1254b-8067-458a-9767-6c3f7ec77da3', 'Running Long Sleeves', 'running-long-sleeves', 'Long sleeve running tops', NULL, NULL, 5, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'LSLV'),
	('e1feecae-189d-47aa-8955-d9980b9bd7fd', 'NOBODY Collection', 'nobody', 'The NOBODY collection - for unsung heroes of the track and trail', NULL, NULL, 1, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'NOBODY'),
	('3d2f9754-d60b-4232-aac2-68d18358654c', 'Running Shirt', 'running-shirt', 'Performance running shirts', NULL, NULL, 2, true, '2026-01-30 21:33:02.34498+00', '2026-02-23 13:14:49.451579+00', 'SHRT');

INSERT INTO "public"."products" ("id", "name", "description", "price", "sku", "category", "image_url", "stock_quantity", "low_stock_threshold", "is_active", "created_at", "updated_at", "images", "category_id", "created_by_email", "updated_by_email", "weight_grams") VALUES
	('4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'ALIVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-ALIVE', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857594210-dktmfr607bg.jpg', 47, 5, true, '2026-02-23 14:03:54.338592+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('b24c5751-02b0-47ad-a48e-8fbb546975e8', 'SNAKE SKIN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-SKN', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771858148810-0xxm9txu4799.jpg', 31, 5, true, '2026-02-23 14:49:16.148687+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('a7ffca5b-3387-4d77-b98b-b81c3e054440', 'BLUE DOTS', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-DTS', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846776802-4hop6xv1vhb.jpg', 50, 5, true, '2026-02-23 11:39:59.677848+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('227b9ec6-cb11-499c-b5f3-39379f3d113f', 'Peach', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PCH', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-peach.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('67f9b829-213a-4c80-93b5-7410bcf6870c', 'Pink Floral', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PNKF', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-pink-floral.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'Punk', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PUNK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-punk.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'Yin & Yang', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-YY', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-yin-and-yang.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'Black-Green', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BLKGR', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-black-green.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'Black Tribal', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BLKTRB', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-black-tribal.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('07d818b2-d717-4b49-b2db-ce3fba47276d', 'purple', '', 900.00, 'prl-shrt', 'Running Shorts', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087490346-x8bx4jvtap8.jpg', 19, 10, true, '2026-04-25 03:25:12.795502+00', '2026-04-26 04:36:27.247784+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('5a1c8f56-49ee-4561-85fc-a01f27d30838', 'Color Splash', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-CLRSP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-white-colord.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'Crush Colored', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-CRSHC', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-crush-colord.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'Denim', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-DNM', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-denim.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('e122281a-9904-4a57-b736-ae8bb52ad911', 'Green Ombre', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-GRNOM', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-green-ombrey.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('e1581541-7ebf-4116-85d7-ed09cc098fc3', 'Jellyfish', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-JLLY', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-jelleyfish.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('1e4d1968-6ac3-472b-b664-85505e185097', 'Mandala Pink', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-MNDLP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-mandala-pink.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('8968a92e-037f-4730-b29b-67286ae5f896', 'TRIBAL GRAY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'TRIB-GRY', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1776303489324-857vsefyo49.jpg', 30, 10, true, '2026-04-17 01:33:20.738848+00', '2026-05-02 11:00:51.441279+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'Orange', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ORNG', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-orange.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('852f1ab6-e10d-431e-921e-862bb0b36df1', 'Peach', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PCH', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-peach.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('b17d66cc-9d2a-453f-8142-c984f0b80643', 'Pink Floral 1', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKF1', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-floral.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('f6a0106a-4184-414d-be24-db5de0d820d0', 'Pink Floral 2', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKF2', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-floral-2.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'Pink Green', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKGRN', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-green.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('db737760-ae21-4062-9dd7-e2aa3a252d3b', 'orange', '', 900.00, 'orng-shrt', 'Running Shorts', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087546628-9i0rcd10f5.jpg', 20, 10, true, '2026-04-25 03:25:55.750008+00', '2026-04-25 03:25:56.047083+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'ANIMAL SKIN SHRT', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-ANML', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857577942-tr6wlfh3fe.jpg', 34, 5, true, '2026-02-23 14:04:49.943262+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('83ffc723-f8ce-47bb-be68-88c53e125afc', 'ORANGEEE SHIRT', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-ORAN', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771858517923-qsiycsi26e9.jpg', 33, 5, true, '2026-02-23 14:55:24.749801+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('0b27018b-ab82-436b-a362-c4c2090bd992', 'Pink Purple', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKPRP', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-pink-purple.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('ae76def5-65a8-4fee-a23f-7cfa605885cd', 'Purple', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PRPL', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-purple.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('d004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'Punk', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PUNK', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-punk.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'Avocado', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-AVC', 'Running Singlets', NULL, 60, 5, true, '2026-04-24 19:00:58.024047+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-FAITH', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-faith-over-fear.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('b618ec46-36e8-4655-8196-dd16248c6363', 'galaxy', '', 400.00, 'glxy-shrt', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777094788465-ahrddhud8wa.png', 35, 10, true, '2026-04-25 05:26:36.993673+00', '2026-04-25 05:26:37.423932+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'PEACOCK SHIRT', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PCK', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857871762-vfk2h341l.jpg', 34, 5, true, '2026-02-23 14:44:39.799145+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'BE CONFIDENT', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-CNFT', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857751237-sdn2nmey0x.jpg', 50, 10, true, '2026-02-23 13:54:47.132298+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'ABSTRACT BLUE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-ABST', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857561126-5dlmom2wsbw.jpg', 34, 10, true, '2026-02-23 14:06:05.205367+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'ANIMAL SKIN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ANML', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847076261-qyxzfkaei9f.jpg', 50, 5, true, '2026-02-23 11:44:50.585556+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('01e1ba4d-c149-48a3-8b70-ecd47908631a', 'BKDN INSPIRED', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BKDN', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454220250-6riwwqdgg6p.jpg', 33, 10, true, '2026-03-02 12:23:56.128411+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('55475375-cb6f-45a1-a394-c8c4521caf73', 'PNK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PINK', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454589290-8uskpyj6dkd.jpg', 32, 5, true, '2026-03-02 12:30:13.140468+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('ce02179e-0347-4d84-b47e-a815e6f75193', 'ONE PIECE BLK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-OPBLK', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857736085-ody9d8dyzc.jpg', 35, 10, true, '2026-02-23 13:57:48.657948+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('1808c102-5f94-4de2-8830-21221222d3e5', 'PINK RAZER', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PRZR', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857948669-0zxeg70zxjod.jpg', 35, 10, true, '2026-02-23 14:45:56.767544+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('889c26fa-83fd-4482-b97e-1ee55e98235d', 'Orange', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-ORNG', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-orange.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('05846b33-27dc-4bce-825a-b9ddcb99f08b', 'FOREST GREEN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-FRST', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454282053-bi460levvys.jpg', 33, 5, true, '2026-03-02 12:24:52.368714+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'DARK DRAGON', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-DRK', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857543956-c219fgza2s9.jpg', 33, 5, true, '2026-02-23 14:07:29.142865+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'STRIPES', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-VLET', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454659604-tqcm421e2rd.jpg', 33, 10, true, '2026-03-02 12:31:07.604257+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'GHOST', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-GHST', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847159700-iy4dgzvhpnm.jpg', 49, 5, true, '2026-02-23 11:46:13.53461+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('f98fefdd-d4e5-4982-87ed-c41010820662', 'PNK GREEN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'PNKGRN', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771845963141-op6lb336mt.jpg', 35, 2, true, '2026-02-23 11:27:17.930707+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-NBDY', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-nbdy.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('cccf3c5f-7f59-44b6-bd44-a78b21912875', 'PURPLE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PRPL', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771854712755-pl4ytrtnv3j.jpg', 45, 5, true, '2026-02-23 13:53:00.002972+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'SHINOBU', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-SHIN', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771858015868-rwoo3n0z02c.jpg', 34, 5, true, '2026-02-23 14:47:05.061908+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('bc40af57-01d5-45ec-9b55-4e743600d31c', 'PINK PURPLE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-PNK', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857524019-myws53qufp.jpg', 34, 5, true, '2026-02-23 14:08:08.721202+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('e2e15442-0e30-4ee7-a201-ef612f19b364', 'DEKU', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-DEKU', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857724631-ftedu9jkqsn.jpg', 35, 10, true, '2026-02-23 13:59:02.852924+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('647fe18d-25bf-4b29-8884-b0aa84926429', 'BLK PINK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-BLK ', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454551938-5cyr9uinoi5.jpg', 35, 5, true, '2026-03-02 12:29:21.183807+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('def2e56d-9e90-41e8-ad11-6152ea413802', 'COLORD SPLASH', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-SPSH', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771858090748-p2d2t0uk12c.jpg', 34, 10, true, '2026-02-23 14:48:19.210961+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'NEWS PAPER', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-NEWS', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857500199-hudpzyhggeg.jpg', 50, 5, true, '2026-02-23 14:08:41.278784+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('0261fee7-668e-49b8-8209-a0839fd6b0b3', 'IGURO OBANAI', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-IGUR', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857712029-xlerzqb0tmg.jpg', 35, 5, true, '2026-02-23 14:01:30.495414+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('fafba7aa-5791-4384-89af-52659b08281e', 'SHINOBU KOCHO', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-SHIN', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846241429-ire138l8kck.jpg', 69, 5, true, '2026-02-23 11:31:32.167524+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNKW', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454744643-dpvl7gm5fzl.jpg', 31, 10, true, '2026-03-02 12:32:34.36905+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('8461f7eb-bab3-4c38-b893-ff54805e0090', 'SNAKE SKIN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-SNKE', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847271228-z71n6if6js.jpg', 30, 5, true, '2026-02-23 11:48:05.467231+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('6d9de635-61b6-47c9-b5d0-4579ea281de2', 'ASH GRAY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ASHG', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454387961-i9xnubs0zd9.jpg', 35, 5, true, '2026-03-02 12:26:36.784971+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('ff0848d7-3ec9-4985-bd99-494f1374d222', 'ITACHI', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-ITAC', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857695735-32vfi21nijl.jpg', 35, 5, true, '2026-02-23 14:02:10.170343+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'BE YOUR OWN HERO', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, '', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772618280078-tlb89kcgmak.jpg', 59, 10, true, '2026-03-04 09:43:55.497557+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', 'master@reveclothingxnobody.com', 500),
	('a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'RUN WILD', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-WILD', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454431466-v9saejkxe5k.jpg', 34, 10, true, '2026-03-02 12:27:19.723587+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('acad96e4-a23d-441d-aa5d-69642a4431f8', 'NEWS PAPER', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-NEWS', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846315455-z8s702o8bwf.jpg', 70, 5, true, '2026-02-23 11:32:30.79719+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'TRIBAL GRAY', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-TRBL', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847597976-vglzwg9223f.jpg', 48, 5, true, '2026-02-23 11:53:34.516559+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('e06fa402-095c-4285-b00a-03ee01f16af6', 'NAMI', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-NAMI', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857675894-9hi6ve1xbnd.jpg', 35, 5, true, '2026-02-23 14:02:53.250423+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'VIBRANT', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-VIBR', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846565915-3lmg4tsby0m.jpg', 69, 5, true, '2026-02-23 11:36:24.18938+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('1881793e-cf72-40a3-ae1a-cf420847cdb7', 'RAINBOW', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-RNDB', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454473139-xmx6kw1iqpa.jpg', 34, 5, true, '2026-03-02 12:28:02.15454+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('ad01c859-f05d-4100-9054-d65a833a48e5', 'ABSTRACT BLUE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ABST', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847934638-0x3c8notq38.jpg', 54, 5, true, '2026-02-23 11:59:07.019465+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'ZORO', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHIRT-ZORO', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771857662743-2lwm5t4sex3.jpg', 35, 5, true, '2026-02-23 14:03:23.099071+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'ALIVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-ALV', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846611267-gss7p5huaqf.jpg', 69, 5, true, '2026-02-23 11:37:07.467033+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('176a70d0-6511-4453-84dc-bfe86f4e8345', 'PEACOCK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PEAC', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771848025056-yd7w8dp5mz.jpg', 50, 5, true, '2026-02-23 12:00:37.419901+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('38b32547-c8fa-4798-82c8-b24592bcb639', 'PINK APPLE GREEN', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-GRN', 'Running Shirt', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771848764599-b8lpwul2edr.jpg', 50, 5, true, '2026-02-23 12:13:31.649798+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('ac4b792e-765d-415d-9102-47a52526856e', 'SPLASH ORANGE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-SPLH', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846838198-8szbvfnxm3y.jpg', 50, 5, true, '2026-02-23 11:40:52.801563+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-WAVE', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454707304-t60vzw29ue.jpg', 26, 10, true, '2026-03-02 12:31:55.567906+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'RED STRIPES', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-STRP', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771846163812-gwf2axbpaud.jpg', 70, 5, true, '2026-02-23 11:30:24.041092+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('8f5c8e5a-3698-4126-8053-86ee500a110f', 'DARK DRAGON', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-DRGN', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1771847214032-084a7q0bh479.jpg', 50, 5, true, '2026-02-23 11:47:05.736192+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('a808e805-9e26-4a82-9ba9-7d73da37b192', 'FOREST PINK', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-PNK', 'Running Singlets', 'https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454335433-llejnqwt32j.jpg', 32, 5, true, '2026-03-02 12:25:45.033797+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, 'master@reveclothingxnobody.com', NULL, 500),
	('c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-HLDL', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-healty-living.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-KRU', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-kru-kru.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('d0121800-4083-49d2-983f-d12923831853', 'Black', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility, sun protection.', 600.00, 'LSLV-BLK', 'Running Long Sleeves', NULL, 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('57366eb0-b882-4e35-9586-cc157cdebfc0', 'Tribal Grey', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility, sun protection.', 600.00, 'LSLV-TRBG', 'Running Long Sleeves', NULL, 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('1f300cc8-58a6-415a-b89e-337d77423e63', 'Black', 'Not-subli, reflectorized.

Why customers buy: Lightweight, Comfort, functional design.', 900.00, 'SHORT-BLK', 'Running Shorts', '/assets/reve-clothing-products-batch1/short-black-2.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('61154afc-a88a-4f06-88e3-e8da1a279376', 'Pink', 'Not-subli, reflectorized.

Why customers buy: Lightweight, Comfort, functional design.', 900.00, 'SHORT-PNK', 'Running Shorts', '/assets/reve-clothing-products-batch1/short-pink.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'Black Crack', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-BCRK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-black-crak.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'Black', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-BLK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-black.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('823979b0-87c6-43e0-8c08-0182b57c279e', 'Jelly Fish', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-JLLYF', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-jelly-fish.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('669e7455-7c63-4385-a1b1-762aca8ccdfb', 'Mandala Pink', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: Comfort, Design, Craftmanship, Pulido nga tahi.', 400.00, 'SHRT-MNPNK', 'Running Shirt', '/assets/reve-clothing-products-batch1/tshirt-manddala-pink.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('71f892e2-a56d-42b9-80ad-1862fbfe9667', 'Yin & Yang', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-YINY', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-yin-and-yang.webp', 60, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500),
	('221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'Full-subli, butterfly mesh, breathable, Reflectorized.

Why customers buy: performance-focused, mobility.', 350.00, 'SING-TLB', 'Running Singlets', '/assets/reve-clothing-products-batch1/singlet-teel-blue.webp', 59, 5, true, '2026-01-30 19:36:06.517352+00', '2026-05-05 17:53:59.05638+00', '{}', NULL, NULL, NULL, 500);

INSERT INTO "public"."product_variants" ("id", "product_id", "size", "stock_quantity", "low_stock_threshold", "sku_suffix", "created_at", "updated_at") VALUES
	('31e70dec-7fca-47ef-b5ed-4f6bc29bdf76', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'XS', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
	('5f0132c7-da0e-4722-9d24-389eb2d62191', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'S', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
	('3b4cb3d0-37af-492c-b811-5255a0934bad', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'M', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
	('6c3e6ee5-2c77-489a-98c1-4e62cf112385', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'XL', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
	('e8550393-ca57-46cf-ab82-e86a556a178f', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', '2XL', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
	('a3bd4bcf-b613-4ec3-ac35-5dd2d262bdff', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', '3XL', 5, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-02-23 14:44:40.123204+00'),
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
	('94831ec3-611f-481d-b446-2254b32dd2e3', 'acad96e4-a23d-441d-aa5d-69642a4431f8', 'XS', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('03b52371-85a1-493d-a9b0-ed9b3d054c8b', 'acad96e4-a23d-441d-aa5d-69642a4431f8', 'S', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('b09d91c5-4015-4a2d-a5d8-e492466be83b', 'acad96e4-a23d-441d-aa5d-69642a4431f8', 'M', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('eba48a0d-c6ac-4d95-a06c-efffa76db3ec', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'L', 5, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('c4ccf44e-1244-42c0-8d6b-7e4a11dfe631', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', '2XL', 10, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.655153+00'),
	('6924577d-01d8-49c6-a6dd-3e04b92220d6', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'XS', 10, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-03-04 09:58:21.657363+00'),
	('ae6751f4-9a01-4e09-a0bb-b9a15225aee7', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'S', 4, 5, NULL, '2026-03-02 12:28:02.566247+00', '2026-03-09 04:13:21.458738+00'),
	('db3371ee-0b90-46be-a914-6cb7cfc4a9c1', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'XL', 5, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('07912475-47ed-4153-bb34-9ca30152b23a', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'S', 8, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-09 03:55:31.23634+00'),
	('4d4e8bab-eee3-442d-8bb6-3347b8526a37', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'L', 9, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-09 03:55:31.41995+00'),
	('a14d7097-bdf0-4d12-bf3a-0f34282315ca', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'M', 4, 10, NULL, '2026-03-04 09:43:55.899768+00', '2026-04-12 14:56:29.24905+00'),
	('c7f8c81f-4a34-4390-9e3d-9aad21dc2de4', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'L', 4, 5, NULL, '2026-02-23 14:44:40.123204+00', '2026-04-21 07:56:21.83905+00'),
	('c902e1dd-0f28-46e0-85e9-1b13df3731d5', '07d818b2-d717-4b49-b2db-ce3fba47276d', '2XL', 0, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('8d9aebcf-4160-4b39-9055-070a726aac88', '07d818b2-d717-4b49-b2db-ce3fba47276d', '3XL', 0, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-25 03:25:13.227158+00'),
	('bcf2b51e-328c-44a2-83a8-2dba8c3423e8', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'M', 4, 5, NULL, '2026-04-25 03:25:13.227158+00', '2026-04-26 04:36:27.247784+00'),
	('06c6665b-eed7-4701-9960-de4e18cb9ff3', '34e32551-c73d-4b74-9714-be3957490408', 'M', 9, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-05-02 04:14:10.436365+00'),
	('b7b611da-7f85-48f9-a60e-9d62149ae1ec', 'acad96e4-a23d-441d-aa5d-69642a4431f8', 'L', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('4f35aacb-8c4e-427d-bfb8-c320681b8731', 'acad96e4-a23d-441d-aa5d-69642a4431f8', 'XL', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('73371675-f943-4588-b8d0-3ee13d074bad', 'acad96e4-a23d-441d-aa5d-69642a4431f8', '2XL', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('0b4383cf-a6f9-498f-8126-5e3923475343', 'acad96e4-a23d-441d-aa5d-69642a4431f8', '3XL', 10, 5, NULL, '2026-02-23 11:32:31.200936+00', '2026-02-23 11:32:31.200936+00'),
	('b933798d-2aa0-41ba-b675-745aef55d187', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6426d3cc-c572-4b82-8975-489e2c5bc68c', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9a67253f-f1e7-4e2f-9a38-837b57e559f6', 'bc40af57-01d5-45ec-9b55-4e743600d31c', '2XL', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.34424+00'),
	('5cd824aa-1e00-461a-9621-c232e070ce7e', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'XS', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('04ad7e5c-04b6-4db1-9465-188c462a95ac', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'S', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('7b0cee4b-af08-4960-b1d9-73caab172ff0', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'XS', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.852763+00'),
	('5ce4fa0e-0d32-4cff-9d4d-d93cdf495f9f', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'XL', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.858337+00'),
	('0b3226d2-9720-4eaf-b596-be03b43c610f', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', '2XL', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.856317+00'),
	('9ab65d99-56e4-4186-9d2b-91d68d48f4a9', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'M', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.856881+00'),
	('42736f05-0a19-40e0-9e2d-a10448e4a42c', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'L', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.86161+00'),
	('077177c0-b242-4942-be1d-793101d12315', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', '3XL', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.862693+00'),
	('cda93bdb-7842-40bd-9f57-5867585d3050', '6d3e2ac8-f6f8-4fb3-a8e0-94080a886ec4', 'S', 5, 5, NULL, '2026-02-23 14:03:23.40744+00', '2026-02-23 14:41:07.861813+00'),
	('f5b07224-6fcc-4dff-9330-a7b85baac6b6', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'M', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('96c970d6-d39d-4c94-948f-33d53a208354', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'L', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('1fd9b693-5d48-4b99-a6ef-c0c89a810f57', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', 'XL', 5, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('b135c36f-21e2-49cc-bee8-7a5baf9e2097', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', '2XL', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('70369f6b-a31e-47be-8050-9f2a8cef50c1', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'XS', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('6b4d2a45-67cc-4cc1-8560-56d4f1c0ca2e', 'db737760-ae21-4062-9dd7-e2aa3a252d3b', '3XL', 0, 5, NULL, '2026-04-25 03:25:56.047083+00', '2026-04-25 03:25:56.047083+00'),
	('2a943c06-57a1-422d-911c-aedbc5acb6d4', '8968a92e-037f-4730-b29b-67286ae5f896', 'S', 3, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-05-02 11:00:51.441279+00'),
	('53c7629b-4544-4aba-b531-0ac122746b32', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'M', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('547d591f-7717-48aa-89a7-fde96cd137eb', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'L', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('1f0268d3-c4ca-4796-bc95-44986dd9bd21', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'XL', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('a83651b0-2c13-4919-9a19-03ac5bed1ae6', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', '2XL', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('e0bde580-6345-4efa-a118-80a2c73585b4', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', '3XL', 10, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-23 11:36:24.483754+00'),
	('ff5b7341-479f-4379-a9f4-2285dad732b1', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'XS', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('3d2c0844-4cd2-4d78-88a0-17124f08b646', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'M', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('c8166da6-1cee-4070-bcf4-9b0ff384909a', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'L', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('51868ac4-4cac-440d-8065-af0cf9b21c02', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'XL', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('ecd3eb33-b690-4f22-b562-033b8636b52a', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', '2XL', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('7f9be04a-9ee7-495a-8cb0-1d372e74d33f', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', '3XL', 10, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-02-23 11:37:07.751827+00'),
	('5d2afd0d-56d6-4c56-99e2-a92cf436cc0a', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'XS', 5, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('191dcfdc-10ff-449c-a9a6-74a749881ff4', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'S', 10, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('e20b9f51-4e37-4531-8764-ea6c410f2739', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'L', 10, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('2e191601-53b8-4218-a56a-f210ff21e71f', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'XL', 5, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('ba97182f-17dd-4238-8c8f-fa4e1ef817e1', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', '2XL', 5, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('f5b2132f-7c23-42d8-a441-17144cb8eec7', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', '3XL', 5, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-02-23 11:46:13.886225+00'),
	('2987e648-6ff3-4767-acd8-3ca998491b22', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'XS', 10, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('912d7964-fec3-4feb-a63d-0e12c960b028', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'S', 10, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('9492482c-7b55-47f5-be01-ca615837669d', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'M', 10, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('d1d66e5a-f909-4845-bc16-3d3217cb9c09', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'XL', 5, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('a9938be8-70e2-4502-b630-3960b326ae85', 'ad01c859-f05d-4100-9054-d65a833a48e5', '2XL', 5, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('20f7d78a-f999-466d-8020-e850c148c569', 'ad01c859-f05d-4100-9054-d65a833a48e5', '3XL', 5, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-02-23 11:59:07.334702+00'),
	('ee1780a1-8669-4187-9f94-dc6ece242c52', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'XS', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.318317+00'),
	('0c77670d-d2cb-4ca1-9e58-6e6e01f6e72c', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'S', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.318659+00'),
	('26169651-7f77-46cf-8f32-b8c68fb12449', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'XL', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.326666+00'),
	('6969c0aa-37b9-440f-b9e2-4e4af7679615', 'bc40af57-01d5-45ec-9b55-4e743600d31c', '3XL', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.324376+00'),
	('87f7832a-4116-49d3-80e0-a97d0dc056e2', '61154afc-a88a-4f06-88e3-e8da1a279376', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('58db1ea1-4e8e-46b7-9a60-811f0395fd7e', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'M', 5, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-02-23 14:38:51.332331+00'),
	('be1dc3cc-0e12-4aeb-9d9e-fe980c41750e', 'e2e15442-0e30-4ee7-a201-ef612f19b364', 'M', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.376082+00'),
	('ff8693a0-ea92-4427-8b43-ae5a8a2f6fae', 'e2e15442-0e30-4ee7-a201-ef612f19b364', 'XL', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.381931+00'),
	('bd3b8407-7eb8-4c32-bb67-8e3a6213a937', 'e2e15442-0e30-4ee7-a201-ef612f19b364', '2XL', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.388955+00'),
	('c171824f-f81f-467c-b3e9-2f82822042ca', 'e2e15442-0e30-4ee7-a201-ef612f19b364', 'L', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.392133+00'),
	('639070c0-d5a5-4f3c-b69e-55e1fda737bc', 'e2e15442-0e30-4ee7-a201-ef612f19b364', '3XL', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.391844+00'),
	('e4344aac-4ce5-4a2a-a2e6-e0a2b9edf191', 'e2e15442-0e30-4ee7-a201-ef612f19b364', 'S', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.393564+00'),
	('13cb29a8-5850-4532-bb9f-495547b78e19', 'e2e15442-0e30-4ee7-a201-ef612f19b364', 'XS', 5, 10, NULL, '2026-02-23 13:59:03.13665+00', '2026-02-23 14:42:08.396483+00'),
	('8c5e2334-e0db-4a0d-aca4-928b9fe57f65', '1808c102-5f94-4de2-8830-21221222d3e5', 'XS', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('84a6df56-8d72-4b34-91eb-1c2a89d8b7ba', '1808c102-5f94-4de2-8830-21221222d3e5', 'S', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('a3bf45e7-d119-402b-9b45-d95b9e4317ed', '1808c102-5f94-4de2-8830-21221222d3e5', 'M', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('6b69529e-627e-426b-87d5-21e6f5076147', '1808c102-5f94-4de2-8830-21221222d3e5', 'L', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('30043f1f-c4c8-4b28-a550-b80183975d14', '1808c102-5f94-4de2-8830-21221222d3e5', 'XL', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('c3e35de1-4745-4e3a-b2e4-d3bcbdbd7d52', '8968a92e-037f-4730-b29b-67286ae5f896', 'XS', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('6eb1b804-dc5b-41d9-9775-801530c5702e', '1808c102-5f94-4de2-8830-21221222d3e5', '2XL', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('6d86f70b-5584-45f6-95be-0cdfb86ccd0c', '1808c102-5f94-4de2-8830-21221222d3e5', '3XL', 5, 5, NULL, '2026-02-23 14:45:57.096652+00', '2026-02-23 14:45:57.096652+00'),
	('09a6a4bf-75c2-4d57-bec8-a2113d185099', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'S', 9, 5, NULL, '2026-02-23 11:36:24.483754+00', '2026-02-28 14:43:19.544018+00'),
	('fef2a7b1-f73c-45e5-9f7c-bcb336321704', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'S', 9, 5, NULL, '2026-02-23 11:37:07.751827+00', '2026-03-02 10:07:26.124823+00'),
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
	('1555d9d8-d9e8-448f-805b-fe39e5ec189e', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'M', 9, 5, NULL, '2026-02-23 11:46:13.886225+00', '2026-03-11 12:11:21.48431+00'),
	('d0f00218-93f6-401d-9e2a-1d9625088dca', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'L', 9, 5, NULL, '2026-02-23 11:59:07.334702+00', '2026-03-17 07:10:37.765501+00'),
	('e147dd6f-78ef-4462-a6b1-a4171b8525e1', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'S', 4, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-03-30 06:51:06.918646+00'),
	('04c12ad7-476b-492e-8587-b76f003cb6bf', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'XS', 4, 5, NULL, '2026-03-02 12:23:56.571808+00', '2026-04-01 12:42:48.867476+00'),
	('23314d22-5635-4fbe-9075-d775dc703f98', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'L', 4, 5, NULL, '2026-02-23 14:08:09.017081+00', '2026-04-21 07:56:22.067222+00'),
	('4a7b8fe7-c208-4a75-ad64-9f1f13165a23', 'b618ec46-36e8-4655-8196-dd16248c6363', 'XS', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('89e6da08-f8d2-4469-8ed5-e08c23a86144', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', 'XS', 5, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('2cca2588-7075-4df2-b790-85489b457119', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', 'S', 10, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('563cd0a8-5b3a-41c3-928b-9774479306e8', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', 'M', 10, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('912e1868-04bd-4b93-85dd-9790de8f5380', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', 'L', 10, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('4a310823-1aaf-4481-81fd-29b66ae982ad', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', 'XL', 5, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('744ef64e-d631-4425-8c7c-aa3094b413ce', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', '2XL', 5, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('507a5abe-b68d-466e-bfe6-c6fb39fbcb38', 'a7ffca5b-3387-4d77-b98b-b81c3e054440', '3XL', 5, 5, NULL, '2026-02-23 11:39:59.988591+00', '2026-02-23 11:39:59.988591+00'),
	('a7f74b3b-1f7f-4d64-bcdf-6954fe497299', '8f5c8e5a-3698-4126-8053-86ee500a110f', 'XS', 5, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('32c372d9-327b-4dc9-ad7e-d6f96d0d6f7f', '8f5c8e5a-3698-4126-8053-86ee500a110f', 'S', 10, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('945b3041-182e-494f-ad00-cf3447ff4ce8', '8f5c8e5a-3698-4126-8053-86ee500a110f', 'M', 10, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('a04b05bb-3853-493c-8296-baeb9e47fb0d', '8f5c8e5a-3698-4126-8053-86ee500a110f', 'L', 10, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('f6b2fbad-6f39-42e7-b24a-81977ccabc84', '8f5c8e5a-3698-4126-8053-86ee500a110f', 'XL', 5, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('f500ff28-dc38-4014-b375-290c1f4efdf7', '8f5c8e5a-3698-4126-8053-86ee500a110f', '2XL', 5, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('5b5410d2-fb17-4d71-b790-f205d7ba9e9b', '8f5c8e5a-3698-4126-8053-86ee500a110f', '3XL', 5, 5, NULL, '2026-02-23 11:47:06.083472+00', '2026-02-23 11:47:06.083472+00'),
	('8393a8d4-90db-4437-b413-0f635754581b', '176a70d0-6511-4453-84dc-bfe86f4e8345', 'XS', 5, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('10dacb13-33c2-4ee4-b853-9d895397890b', '176a70d0-6511-4453-84dc-bfe86f4e8345', 'S', 10, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('6a982b47-2d79-4e0d-a7f2-3dab5ed5d648', '176a70d0-6511-4453-84dc-bfe86f4e8345', 'M', 10, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('b7e8ff1e-49f4-44b8-a5f1-8503d90eee4a', '176a70d0-6511-4453-84dc-bfe86f4e8345', 'L', 10, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('63341f0b-9148-4ed8-885c-40352c1d2fd1', '176a70d0-6511-4453-84dc-bfe86f4e8345', 'XL', 5, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('034831b1-0248-486f-8132-e177e13f5d04', '176a70d0-6511-4453-84dc-bfe86f4e8345', '2XL', 5, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('af39ab43-009d-458b-b61c-fb6c8d8b6936', '176a70d0-6511-4453-84dc-bfe86f4e8345', '3XL', 5, 5, NULL, '2026-02-23 12:00:37.723772+00', '2026-02-23 12:00:37.723772+00'),
	('b7da1f1f-cfbf-4776-9c11-b7ed925a093a', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'L', 10, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-02-23 13:53:00.381463+00'),
	('35b6f823-3e8f-4da3-becc-fc3c1b2adf19', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'XL', 5, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-02-23 13:53:00.381463+00'),
	('856a4c1f-dc8c-4a8e-a2ce-7c767cbe7466', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', '2XL', 5, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-02-23 13:53:00.381463+00'),
	('2a173bde-b583-42fd-90e1-2b3592071db2', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', '3XL', 5, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-02-23 13:53:00.381463+00'),
	('caf5f1d3-d59e-46b0-ac65-01cc3e00f505', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'L', 10, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:25.970311+00'),
	('e06fab4f-ec89-4bf7-8992-f1fc40ace51c', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'M', 10, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:25.974796+00'),
	('0e12f072-5b49-41c9-94b2-b8f68e04ae77', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', '3XL', 5, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:25.979678+00'),
	('684cb414-d128-48e8-9c32-3b5c7fbec844', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'S', 10, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:25.980126+00'),
	('8305f76b-1a15-4eef-ac92-a2504e27ca05', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', '2XL', 5, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:26.330933+00'),
	('5550ea34-7689-4320-a520-bcb3272595d5', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'XL', 5, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:26.331859+00'),
	('12a35dd1-0b89-497e-a30f-099cc2211802', 'cc3e46a9-aef5-487f-80a7-71a0df72e88b', 'XS', 5, 5, NULL, '2026-02-23 14:08:41.612498+00', '2026-02-23 14:38:26.336219+00'),
	('33eedb0e-b19f-45cc-aa25-f4559ff87f19', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9b97a453-cd57-445d-af82-0ce0e2e17897', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'M', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.060739+00'),
	('869b01a6-4c24-40b6-a24c-aea9f4c5941e', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', '3XL', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.062836+00'),
	('b240091c-a02b-486b-bc25-23e4a6d01920', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', '2XL', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.063445+00'),
	('e650e089-658e-456f-a51e-5263255f1b51', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'XL', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.065485+00'),
	('efe732a5-d480-4102-8848-5129e347faaf', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'S', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.069906+00'),
	('d68b027f-2b9d-4add-a4f2-70edc1b1bd71', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'XS', 5, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-02-23 14:39:44.073195+00'),
	('a0c0c98f-83ee-4c5d-8d11-60e17c9129f2', '0261fee7-668e-49b8-8209-a0839fd6b0b3', 'XS', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.469373+00'),
	('5a73bc85-547e-42ab-8038-d225fbaacf2b', '0261fee7-668e-49b8-8209-a0839fd6b0b3', 'S', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.471109+00'),
	('ca85f567-fe66-4a92-bfd1-03e2eb154121', '0261fee7-668e-49b8-8209-a0839fd6b0b3', '3XL', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.478583+00'),
	('2022e7b4-5304-40f3-924f-3ddff29abd45', '0261fee7-668e-49b8-8209-a0839fd6b0b3', 'XL', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.477799+00'),
	('78261c12-3ef5-4baa-bb96-919368b0af68', '0261fee7-668e-49b8-8209-a0839fd6b0b3', 'L', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.478478+00'),
	('f981a6c1-b186-4440-87f8-08570f54d441', '0261fee7-668e-49b8-8209-a0839fd6b0b3', '2XL', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.489879+00'),
	('30578033-6b55-44a8-be0f-0e0c729100b9', '0261fee7-668e-49b8-8209-a0839fd6b0b3', 'M', 5, 5, NULL, '2026-02-23 14:01:30.927685+00', '2026-02-23 14:41:56.489879+00'),
	('d365ca64-8215-4cd3-a237-05d80809ef11', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'XS', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
	('55110a3f-4761-403b-9daa-727973464b2e', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'M', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
	('f24f0037-05ed-4724-8a74-65c45d4f91a3', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'L', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
	('d52073f3-11af-49bf-8a1a-e8914d79753d', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'XL', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
	('09bc2ab2-ddb7-45f9-bc5e-d3e616031e38', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', '2XL', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
	('0a70bec3-d558-446a-ab20-5663afd236da', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', '3XL', 5, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-02-23 14:47:05.365931+00'),
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
	('8a0a0e1c-6e8d-4aea-8a89-fa4d8e04ba38', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'S', 4, 5, NULL, '2026-02-23 14:47:05.365931+00', '2026-04-20 12:24:43.272824+00'),
	('ac89da43-463c-4d1a-b924-85b183b01765', '55475375-cb6f-45a1-a394-c8c4521caf73', 'XS', 3, 5, NULL, '2026-03-02 12:30:13.537304+00', '2026-04-06 12:30:12.974073+00'),
	('7f060b17-9318-4248-bc1f-09dea8bd07a4', '8968a92e-037f-4730-b29b-67286ae5f896', '2XL', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('625ab620-7365-41ba-af00-e9c396b4749b', '8968a92e-037f-4730-b29b-67286ae5f896', '3XL', 5, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-17 01:33:21.150331+00'),
	('cf8c1517-cdc3-4ab5-ae2c-0276a322c388', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'L', 4, 5, NULL, '2026-02-23 14:04:50.243199+00', '2026-04-21 07:56:21.0534+00'),
	('fea102f1-812b-4661-b835-5b35ff2ade1a', '8968a92e-037f-4730-b29b-67286ae5f896', 'L', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-21 07:56:22.282619+00'),
	('4a13baa6-6f0e-4826-bd8c-c25d36db00f1', 'b618ec46-36e8-4655-8196-dd16248c6363', 'S', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('c03881f4-5c02-4780-8368-1bf45817495c', 'b618ec46-36e8-4655-8196-dd16248c6363', 'M', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('2e27b224-1c21-4c78-b6ad-8fe88b856419', 'b618ec46-36e8-4655-8196-dd16248c6363', 'L', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('1ccd33bd-c9a6-4c3b-81d1-79bd67fdb23a', 'b618ec46-36e8-4655-8196-dd16248c6363', 'XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('24e73092-8f07-457d-b4c2-9f1c4adc714a', 'b618ec46-36e8-4655-8196-dd16248c6363', '2XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('d7eca29c-8f13-4276-bbc7-0d1526d1dc0b', 'b618ec46-36e8-4655-8196-dd16248c6363', '3XL', 5, 5, NULL, '2026-04-25 05:26:37.423932+00', '2026-04-25 05:26:37.423932+00'),
	('74ff59e9-dbec-4e2b-bee4-9cb5dcd7b675', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'M', 9, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-05-02 04:14:10.843667+00'),
	('c38c6326-169d-4f81-a4c2-6b1c328b08e3', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'S', 4, 5, NULL, '2026-03-02 12:24:52.707817+00', '2026-04-29 04:07:32.239796+00'),
	('99adbc66-2e22-4f0b-b205-f6988f43dde3', '8968a92e-037f-4730-b29b-67286ae5f896', 'XL', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-30 05:18:26.638467+00'),
	('75258677-506c-49fc-a982-473bde3a76f3', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'XS', 3, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-05-02 04:14:10.657457+00'),
	('abf46563-3624-4523-8f58-61966d40ebfd', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1d75bd93-eed9-48f6-8f2e-210ba1cf7f9b', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'S', 8, 5, NULL, '2026-02-23 13:53:00.381463+00', '2026-05-02 04:14:10.754897+00'),
	('8b4a3c1a-aee9-4c06-8f8a-05e938522f1f', 'f98fefdd-d4e5-4982-87ed-c41010820662', 'XS', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('074c88fb-c5be-454a-894a-cada209bf049', 'f98fefdd-d4e5-4982-87ed-c41010820662', 'S', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('c0163238-afc2-4dcf-a64a-a3f4da44e9a3', 'f98fefdd-d4e5-4982-87ed-c41010820662', 'M', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('da02a78a-ca94-415d-971e-9d6d03cdc8e4', 'f98fefdd-d4e5-4982-87ed-c41010820662', 'L', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('f4a0aeea-7dce-4263-90cd-b5a8f489124f', 'f98fefdd-d4e5-4982-87ed-c41010820662', 'XL', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('c20be622-6f66-45d5-9275-f60c96a34770', 'f98fefdd-d4e5-4982-87ed-c41010820662', '2XL', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('4a1996a4-69bf-4de9-bae0-f19e0523980d', 'f98fefdd-d4e5-4982-87ed-c41010820662', '3XL', 5, 5, NULL, '2026-02-23 11:27:18.333692+00', '2026-02-23 11:27:18.333692+00'),
	('7f1f237f-c516-40fc-bc17-2db9dc2739ea', 'ac4b792e-765d-415d-9102-47a52526856e', 'XS', 5, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('1d5d7013-d85e-4cb7-8e4c-721f191ad689', 'ac4b792e-765d-415d-9102-47a52526856e', 'S', 10, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('6c5f54e0-0c07-4f67-9700-bd6aef9f1e87', 'ac4b792e-765d-415d-9102-47a52526856e', 'M', 10, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('2f5cc446-c5d4-4c98-81c0-ff88e5c45466', 'ac4b792e-765d-415d-9102-47a52526856e', 'L', 10, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('b0aac23b-8729-4e27-9b0a-40c430a78ab9', 'ac4b792e-765d-415d-9102-47a52526856e', 'XL', 5, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('0fafd7ff-00b2-4343-b7ba-9d606902dc3e', 'ac4b792e-765d-415d-9102-47a52526856e', '2XL', 5, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('ebbddf14-ea01-4b9b-b5b1-18f3dd6bf858', 'ac4b792e-765d-415d-9102-47a52526856e', '3XL', 5, 5, NULL, '2026-02-23 11:40:53.102468+00', '2026-02-23 11:40:53.102468+00'),
	('2f3bb7a3-e42b-4f4e-8687-d90137109160', '8461f7eb-bab3-4c38-b893-ff54805e0090', 'XS', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('bbb3e7b2-e644-4189-a7f8-7dcb36263a64', '8461f7eb-bab3-4c38-b893-ff54805e0090', 'S', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('615eceaf-ec2a-4e0f-ac57-20b3418dbcd1', '8461f7eb-bab3-4c38-b893-ff54805e0090', 'M', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('a5d239fe-2a40-4d49-990e-49369ff7ccef', '8461f7eb-bab3-4c38-b893-ff54805e0090', 'L', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('eda77791-837c-4463-904a-fa3b20e87674', '8461f7eb-bab3-4c38-b893-ff54805e0090', 'XL', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('3f7bba20-58a9-4796-83c3-376bcb5b30aa', '8461f7eb-bab3-4c38-b893-ff54805e0090', '2XL', 5, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('21860053-d01f-49f6-bea2-781fb60198e4', '8461f7eb-bab3-4c38-b893-ff54805e0090', '3XL', 0, 5, NULL, '2026-02-23 11:48:05.771539+00', '2026-02-23 11:48:05.771539+00'),
	('d360438a-0c72-4c13-b25d-db8c01a6295d', '38b32547-c8fa-4798-82c8-b24592bcb639', 'XS', 5, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('0a83e47a-c8d5-4bf8-82bd-8fe29960db13', '38b32547-c8fa-4798-82c8-b24592bcb639', 'S', 10, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('a9f274b0-20d1-4189-b8d6-ca313ac1d510', '38b32547-c8fa-4798-82c8-b24592bcb639', 'M', 10, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('7e4da0bf-fb71-4265-95f3-9678a67025d4', '38b32547-c8fa-4798-82c8-b24592bcb639', 'L', 10, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('6bf2206e-ef98-4096-864c-ceb8b81d1b16', '38b32547-c8fa-4798-82c8-b24592bcb639', 'XL', 5, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('1ee9ae6f-3245-48e7-aed2-5f567e7bdad6', '38b32547-c8fa-4798-82c8-b24592bcb639', '2XL', 5, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('2a9b1b1b-a831-44ee-99cc-c820234c4807', '38b32547-c8fa-4798-82c8-b24592bcb639', '3XL', 5, 5, NULL, '2026-02-23 12:13:31.94704+00', '2026-02-23 12:13:31.94704+00'),
	('6023a325-1481-4ee3-a61b-6a2570454a72', '823979b0-87c6-43e0-8c08-0182b57c279e', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('626a5560-62d2-41eb-975c-96b6f74d68a7', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'S', 9, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-25 17:56:10.847138+00'),
	('8eb11ead-6a7f-4d93-9e36-c646ad4ada04', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'M', 4, 5, NULL, '2026-03-02 12:25:45.348113+00', '2026-04-26 04:36:27.578373+00'),
	('eb445c08-d023-42b1-bb78-eb6fb5f73316', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'S', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.668832+00'),
	('cac0f65f-0833-4c24-aaf2-2dcfec6b74e8', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', '3XL', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.673338+00'),
	('9efb5d9f-84e5-45eb-883a-61f441a03700', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', '2XL', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.669788+00'),
	('d39a24a5-9b45-47bb-8651-a910e8500dd1', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'XL', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.685115+00'),
	('28dd9704-62b2-493e-b71d-0b84230cdd91', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'XS', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.688886+00'),
	('a54f4a6b-aed4-4f86-bd0b-6d98fde489b0', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'L', 5, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-02-23 14:39:26.691794+00'),
	('67f4d41f-eb25-4aa1-a7f1-d9de315b9d4c', 'ff0848d7-3ec9-4985-bd99-494f1374d222', 'L', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.686937+00'),
	('066c4011-c785-43ad-b6b2-dea0c86deac6', 'ff0848d7-3ec9-4985-bd99-494f1374d222', 'M', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.686666+00'),
	('6cd58f40-3ee1-44dd-871c-a9bda8d32d3a', 'ff0848d7-3ec9-4985-bd99-494f1374d222', 'XL', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.683781+00'),
	('730d0d77-76cd-4cf7-9d3f-ef9395508f40', 'ff0848d7-3ec9-4985-bd99-494f1374d222', 'S', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.687368+00'),
	('d7af034c-06d1-45ad-a4aa-e58121561ee6', 'ff0848d7-3ec9-4985-bd99-494f1374d222', '3XL', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.694126+00'),
	('737bbebe-c549-4d17-8f38-08e9be8f9597', 'ff0848d7-3ec9-4985-bd99-494f1374d222', 'XS', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.699431+00'),
	('5016fe8b-4dd7-414e-9fc5-dbedd32911c0', 'ff0848d7-3ec9-4985-bd99-494f1374d222', '2XL', 5, 5, NULL, '2026-02-23 14:02:10.599212+00', '2026-02-23 14:41:42.802695+00'),
	('95abc4e5-b9be-4bb5-90a2-9f6edd23d17f', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'S', 10, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.30444+00'),
	('d09df0db-2504-4f9e-a732-2852263f107f', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'XS', 5, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.311044+00'),
	('c6503cae-0777-4907-8d58-ee60d797301a', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', '2XL', 5, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.316067+00'),
	('ace65667-c016-4ce8-91f4-08f525b876cb', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'M', 10, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.315958+00'),
	('2b19b478-15d5-4356-8692-6d3d1f8aaaa2', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'XL', 5, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.321588+00'),
	('5be3441f-0a0a-4b9d-89f4-85ddef960a6f', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', '3XL', 5, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.32308+00'),
	('19d6a7a1-9bf9-49a4-aecd-87f4478eab8f', '38bd0166-97f3-4e96-9ad7-99d6f5a402db', 'L', 10, 10, NULL, '2026-02-23 13:54:47.387119+00', '2026-02-23 14:42:35.327977+00'),
	('4a22cec2-0f86-4b83-911b-8aab2ea10af7', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'XS', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('4a1422b2-547f-45fa-b2ba-7a82296f6d49', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'S', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('7d3025a7-284e-4b66-904c-752ac1815c1d', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'M', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('362809fa-2909-4407-9de3-de319d1e5d24', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'L', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('45fe5286-7a2f-4a0d-aae3-669fb410dc6d', 'def2e56d-9e90-41e8-ad11-6152ea413802', '2XL', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('9cce1b0e-d9a5-4b77-98f5-577ecd073ce2', 'def2e56d-9e90-41e8-ad11-6152ea413802', '3XL', 5, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-02-23 14:48:19.568822+00'),
	('90d67440-5e6b-4438-951b-827bf28fa05a', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'XL', 4, 5, NULL, '2026-02-23 14:48:19.568822+00', '2026-03-01 12:45:58.670839+00'),
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
	('8d2a025e-779f-4314-91aa-c66b2dec7d22', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'M', 4, 10, NULL, '2026-02-23 14:06:05.51228+00', '2026-04-09 03:55:31.598564+00'),
	('6e5e166f-3a81-4536-894d-c85ce7caab05', '8968a92e-037f-4730-b29b-67286ae5f896', 'M', 4, 5, NULL, '2026-04-17 01:33:21.150331+00', '2026-04-19 02:09:28.446385+00'),
	('b6985e34-06c6-48a7-ad67-a6695e8c9f2a', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'XL', 9, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-30 05:18:26.774411+00'),
	('d087d42e-78ce-4d46-8f42-bf4a60ce0ecc', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'XS', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('a6bc42af-e5d0-4804-be23-a8079cd398f5', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'XS', 5, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-02-23 14:49:16.435764+00'),
	('33cdcd62-40b8-43c7-8b44-b7527c7c8e8e', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'S', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('c8cf08e6-a943-46a8-9905-ac61f53852bb', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'M', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('fc125030-4b18-4646-88e8-4a3844b8b5b8', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'L', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('39f589e2-4140-4032-bce5-8af8d7dec828', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('12d01def-25c2-45c2-a867-654154111ef1', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'S', 5, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-02-23 14:49:16.435764+00'),
	('91a4fa07-1e59-44a9-b9e6-875ddbfedbc6', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', 'XL', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('104d05e4-8c0d-408f-ab4b-6f32c7bd9699', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', '2XL', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('a8b3f02f-db66-43b8-affd-22c80d46c8de', '7f6d8989-48d3-4657-b6b5-25ccb7442eb3', '3XL', 10, 5, NULL, '2026-02-23 11:30:24.36044+00', '2026-02-23 11:30:24.36044+00'),
	('ad0e34ef-a327-414d-bfdc-e149be80a07c', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'XS', 5, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('04600f24-a844-4f10-b624-7bba8ba5009e', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'XL', 5, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-02-23 14:49:16.435764+00'),
	('78bcf3f1-1f35-4ac0-bc91-fadcf931bf65', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', '2XL', 5, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-02-23 14:49:16.435764+00'),
	('2d523e50-b54f-492f-89df-54aa6d47bb26', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', '3XL', 5, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-02-23 14:49:16.435764+00'),
	('f7dd0b4e-8feb-447b-9599-fd739af5186d', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
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
	('5cca3050-5519-4eae-9fe0-0e28a5d90381', 'fafba7aa-5791-4384-89af-52659b08281e', 'S', 9, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-04-30 05:18:26.467649+00'),
	('49b29a51-16ce-499b-9f73-b910058aafd8', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'S', 3, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-15 11:31:27.039837+00'),
	('2b3d0432-99a3-4a2d-9762-7071850376a7', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'XS', 4, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-03-30 08:33:10.762892+00'),
	('8eeb426f-e0e5-492a-9f72-cf87ad010c93', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'M', 3, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-04-06 14:33:57.097253+00'),
	('5154bcf2-a202-4569-89f0-852eb9f721a7', 'fafba7aa-5791-4384-89af-52659b08281e', 'XS', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('bd54c58a-0cb3-45fe-9fd6-718905256595', '56a0ca2e-bc0a-493a-abfc-6f8158929391', '2XL', 2, 5, NULL, '2026-03-02 12:31:55.922307+00', '2026-04-12 17:05:03.287519+00'),
	('2a301e8d-33fb-4bd1-a73f-c86f9abefcad', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'L', 3, 5, NULL, '2026-02-23 14:49:16.435764+00', '2026-04-21 07:56:21.628615+00'),
	('9a608237-c83b-47d5-bb6a-a3015b940f23', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ca814d48-fd42-4a57-91a4-e626240d9020', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9794f803-05cd-4c4b-827f-dd5afd5a05c0', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b000b85d-21f7-4b38-9b20-4bb1ec946918', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b8f81109-9dca-4e6b-94fb-e17e960e28ec', '227b9ec6-cb11-499c-b5f3-39379f3d113f', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e9415f70-bf0f-4503-b596-d295081aadf8', '227b9ec6-cb11-499c-b5f3-39379f3d113f', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('05fa4bad-56ed-4fa2-855b-1752d124035b', '61154afc-a88a-4f06-88e3-e8da1a279376', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('259db899-cdee-4c21-a414-e7b2161badea', 'fafba7aa-5791-4384-89af-52659b08281e', 'M', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('0ddcf1ea-e797-4cde-8591-6602d9719b6c', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'S', 9, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-04-25 17:56:10.420511+00'),
	('f128a01c-31ac-48a7-a30e-3ba1f776473d', '3532981c-4b88-440a-975b-4f219067be86', 'L', 4, 5, NULL, '2026-03-02 12:32:34.700013+00', '2026-03-28 14:11:44.137244+00'),
	('6ca56f6f-fa36-4d42-90a9-e6230931888e', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'M', 10, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-02-23 14:39:58.311035+00'),
	('ec3004ca-b69d-430d-9ba7-baa93c13729c', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', '3XL', 5, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-02-23 14:39:58.320789+00'),
	('db2f2ff5-03d3-4ddb-82fe-5bf3315a339d', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'XS', 5, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-02-23 14:39:58.340939+00'),
	('163e729c-076d-43a1-a37c-fc5ca43d1137', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', '2XL', 5, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-02-23 14:39:58.901601+00'),
	('693bac58-10a7-477c-810a-e82f8a01a8e6', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'L', 9, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-03-17 07:10:37.099223+00'),
	('6ab496d9-3d1e-44ee-a60f-29bbeb1f757e', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'S', 8, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-04-30 05:18:26.920764+00'),
	('131f2364-ad4b-4df7-8e43-15f87aa165b3', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'M', 4, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-05-02 04:14:10.565691+00'),
	('00b74517-2522-444f-94f9-3e4d1c7c2e07', 'fafba7aa-5791-4384-89af-52659b08281e', 'L', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('4afc4bad-3a91-4f5e-abb4-193f7d51bb8f', 'fafba7aa-5791-4384-89af-52659b08281e', 'XL', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('8bbfc36d-3067-47a0-878f-1ada4c93d0a2', 'fafba7aa-5791-4384-89af-52659b08281e', '2XL', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('664ea55e-828b-4e52-940d-40b824595f14', 'fafba7aa-5791-4384-89af-52659b08281e', '3XL', 10, 5, NULL, '2026-02-23 11:31:32.476985+00', '2026-02-23 11:31:32.476985+00'),
	('41592221-607c-4b84-b857-a304a096c753', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'S', 10, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('af94223a-db2a-499f-9a4a-253ad159dfd5', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'M', 10, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('82d36f33-472a-42c8-bb96-de0a6a8bb33c', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'L', 10, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('2d5e9095-4b9f-4d99-9ff0-ad1e4e7ae80e', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', 'XL', 5, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('227c6962-03ae-414d-82c1-c8f914057492', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', '2XL', 5, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('b16448ec-f9fb-487f-9a91-184920be0602', '7fe93e34-a4de-475f-841a-d47fc05c0bfd', '3XL', 5, 5, NULL, '2026-02-23 11:44:50.959111+00', '2026-02-23 11:44:50.959111+00'),
	('464b493b-644b-4850-b1ed-b7aeaf123f58', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'XS', 5, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('d3430f4d-41ae-47dd-92b7-529b924ae9ac', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'M', 10, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('56b5e241-f820-4ba4-8f23-fe23897b7be8', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'L', 10, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('0fd721ef-95e0-4ffd-bbc3-6cf916a173d6', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'XL', 5, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('6f230488-39ac-44f2-ba0e-b942a13ef253', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', '2XL', 5, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('29ae3214-f243-4f94-bd84-02af89826b45', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', '3XL', 5, 5, NULL, '2026-02-23 11:53:34.904487+00', '2026-02-23 11:53:34.904487+00'),
	('19043a35-feb8-487d-a294-26a18a2433e7', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'XL', 4, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-04-12 17:05:03.436915+00'),
	('5f71695a-ffb9-48b0-bee1-2f4d33adde07', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', '2XL', 5, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-02-23 14:39:09.851964+00'),
	('9e2db535-916e-4180-b1fc-904c693136a1', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', '3XL', 5, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-02-23 14:39:09.860674+00'),
	('d136cd4d-e419-4df8-824c-40726677707e', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'XS', 5, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-02-23 14:39:09.854641+00'),
	('72ccf8d0-02a8-40c9-ae68-ad0c1f91131b', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'S', 5, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-02-23 14:39:09.859712+00'),
	('3e30ea04-0e4b-4a5a-bed5-97fbf550e779', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'XL', 5, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-02-23 14:39:09.886303+00'),
	('8c899340-9a8c-4391-9382-c5b5cc671fa0', 'e06fa402-095c-4285-b00a-03ee01f16af6', 'L', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.702492+00'),
	('5811fbb2-bfd8-4118-ae84-6187c4bcb3f3', 'e06fa402-095c-4285-b00a-03ee01f16af6', 'XS', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.699551+00'),
	('2dc859fe-6d6c-465d-bc80-51967c4bda7d', 'e06fa402-095c-4285-b00a-03ee01f16af6', 'M', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.704281+00'),
	('6ba98922-c17a-4ba2-acd2-e0a0c9fc0280', 'e06fa402-095c-4285-b00a-03ee01f16af6', '2XL', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.710771+00'),
	('76d60cbd-c60e-4661-90f5-301e5a680064', 'e06fa402-095c-4285-b00a-03ee01f16af6', 'XL', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.711317+00'),
	('c4a6ad52-b5b3-49e1-8c02-dec3b21090d4', 'e06fa402-095c-4285-b00a-03ee01f16af6', '3XL', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.719072+00'),
	('74de308f-ec74-4bd9-91d6-6b218cb5e08f', 'e06fa402-095c-4285-b00a-03ee01f16af6', 'S', 5, 5, NULL, '2026-02-23 14:02:53.566531+00', '2026-02-23 14:41:19.710288+00'),
	('9e94a919-6222-418b-9429-73c75de8d07f', 'ce02179e-0347-4d84-b47e-a815e6f75193', 'S', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.295816+00'),
	('a96a1b82-ab76-40f9-9f57-c9d36f4a61ba', 'ce02179e-0347-4d84-b47e-a815e6f75193', 'XS', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.295816+00'),
	('41650d76-7b3e-4837-b05d-b1dc9dc80e43', 'ce02179e-0347-4d84-b47e-a815e6f75193', 'M', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.297816+00'),
	('eb9819ef-32da-4b4d-aa73-5efd838d99a6', 'ce02179e-0347-4d84-b47e-a815e6f75193', '3XL', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.304051+00'),
	('f2858687-e928-43cb-8c14-ea391497d7d9', 'ce02179e-0347-4d84-b47e-a815e6f75193', 'L', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.304221+00'),
	('ca1fe056-da2a-4674-a039-3f0927f7f6ff', 'ce02179e-0347-4d84-b47e-a815e6f75193', '2XL', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.309382+00'),
	('bbe2dd4d-07c5-46fa-adbb-24a9d1874913', 'ce02179e-0347-4d84-b47e-a815e6f75193', 'XL', 5, 10, NULL, '2026-02-23 13:57:48.891808+00', '2026-02-23 14:42:20.310925+00'),
	('0e373384-9899-4afa-94ff-9f01285031d2', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'XS', 5, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-02-23 14:55:25.109886+00'),
	('fe62c085-717b-4438-b11d-00eb045e5acb', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'S', 5, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-02-23 14:55:25.109886+00'),
	('5dfe2b82-96e3-4c49-b490-45ce5af7b58c', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'M', 5, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-02-23 14:55:25.109886+00'),
	('eb0a9c76-6bc4-46d4-8e7c-3a81ffbd7c0e', '83ffc723-f8ce-47bb-be68-88c53e125afc', '2XL', 5, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-02-23 14:55:25.109886+00'),
	('fe9307db-fd04-438c-8607-a242d6331bc3', '83ffc723-f8ce-47bb-be68-88c53e125afc', '3XL', 5, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-02-23 14:55:25.109886+00'),
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
	('f06cf8a3-d679-4138-a0e6-bd02552aeeec', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'XL', 4, 5, NULL, '2026-02-23 14:03:54.642594+00', '2026-03-17 07:10:36.934779+00'),
	('48b9ec60-c249-4f45-8c52-bfbe1cf7fa07', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'XS', 4, 5, NULL, '2026-03-02 12:27:20.061925+00', '2026-04-01 12:42:49.114755+00'),
	('67c53b1e-0a24-49ca-b08e-d48d2778016d', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'L', 4, 5, NULL, '2026-02-23 14:07:29.447273+00', '2026-04-08 14:39:42.353081+00'),
	('64d527de-413d-4f2c-a3e3-2b07a39cd4c8', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'L', 4, 5, NULL, '2026-02-23 14:55:25.109886+00', '2026-04-21 07:56:22.49939+00'),
	('53595262-26a3-45ac-849c-15f3be710a75', '1e4d1968-6ac3-472b-b664-85505e185097', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9d1a6526-77f1-4220-a929-4d07cbb61fef', '1e4d1968-6ac3-472b-b664-85505e185097', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('de291244-5cbc-4b80-9ed0-a0bc40feaf47', '1e4d1968-6ac3-472b-b664-85505e185097', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('fb1ff616-f2d1-4385-9378-c52c32c63362', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('26e4465a-ed22-4cf5-94e6-90c5ffba29f2', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c1f567fc-fc24-4b92-b315-495cdb7d855c', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f84be7f8-d95f-47f9-8347-d8e83435f5b1', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('70d642a8-f17a-4e46-9dfa-da143a003291', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bd040068-0e2d-4289-a0b9-7c05e3d88c7a', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d4c5f364-726c-4f14-b13c-fc121aaa0470', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'S', 9, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-25 17:56:11.36298+00'),
	('7238dd7b-4ff6-4c6a-a170-fcc47d31ccf4', '61154afc-a88a-4f06-88e3-e8da1a279376', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('98a14d1c-7dda-46d3-8bf8-b082d4f76881', '61154afc-a88a-4f06-88e3-e8da1a279376', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6799211c-5aaa-4ba0-8e2e-ea46fdd6dec1', '61154afc-a88a-4f06-88e3-e8da1a279376', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('359004f9-ba8e-4a9a-a215-d255d382d6af', '61154afc-a88a-4f06-88e3-e8da1a279376', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ef6105d6-88e9-456e-93bb-d4870d9c583a', '61154afc-a88a-4f06-88e3-e8da1a279376', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bcd0f3dd-e969-4424-9fca-6ef0d9fedc90', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7ab29264-1fd5-4212-8075-f05e7ba6e9d1', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('3db61da9-1bc5-4fd0-9c91-e6713548dd4f', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5a5a0ad0-7e22-4432-bbf7-f3ebd8d6d1e0', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9462f0ab-9659-421b-909a-eb19920a2efb', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7fb45181-92cd-4532-b405-6c1af72b85aa', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('289a946f-cedb-4670-997b-12caa9d28b92', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('68a297b4-a0b5-4a28-a1a9-6366afedf9be', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f813a82e-1967-454f-b69e-51af644d3d3a', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5369ae19-b908-4387-8ee0-75db40459634', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('744cba35-8985-475d-9a42-be926637b347', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7cd0f52a-7cb4-403d-8917-632e53219f3d', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0a14a0bd-276a-4943-83c7-66ca8ee7ad63', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('23d176f7-50ac-404a-a317-5c1bc4ee8021', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('31357cea-02f5-474a-ab5d-2bdf37e02c7d', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b745f8a1-6690-49e1-b5a7-d34a4b409e6e', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('acb16bf2-030a-4bd9-98fa-2c8497404ead', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('3da38d44-589e-449f-ad21-d10769701879', 'c84bd099-6666-4934-86ca-d77e802b23fb', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ded15a90-9bff-4313-92d3-33073583ea56', 'c84bd099-6666-4934-86ca-d77e802b23fb', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('198a9d0a-f65a-4632-a040-d53e6fd383c3', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4b93d766-4705-4c25-8dff-c8177a619787', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2f2cc7d7-bc03-43ca-97e1-d66c7fc2b6fb', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7d320978-a0bf-4bc7-9898-04ca67793b18', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2304df4e-35e5-41d1-9653-284ade0f490c', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('764d0d8b-e2ad-4fdd-9ba5-48abdc34b68d', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7ea79148-a17f-4e48-8579-868fefc21aa2', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5629d218-9b02-4329-8728-c5aee4ffac50', '1e4d1968-6ac3-472b-b664-85505e185097', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('8f970176-903a-4674-bd74-a18c17c636d5', '1e4d1968-6ac3-472b-b664-85505e185097', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ae49aefd-2bd0-40b7-85b3-700d4949d8c7', '1e4d1968-6ac3-472b-b664-85505e185097', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4841a4f2-ffb0-45f5-99a2-c926e4e089b2', '1e4d1968-6ac3-472b-b664-85505e185097', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('19f5a791-184e-4b6e-804e-1f47c3e6cc17', '221b7626-6e30-421a-8950-165f7ce719dd', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a78bb9e3-a1d9-409e-b5ed-7238aefbd622', '221b7626-6e30-421a-8950-165f7ce719dd', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e4df2055-d5fc-4e5f-9cb5-de6da14b628e', '221b7626-6e30-421a-8950-165f7ce719dd', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6688be9f-ee0e-4115-9f1f-b12364d2b25f', '221b7626-6e30-421a-8950-165f7ce719dd', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('352e6332-bf52-4983-9f13-df576cd19389', '221b7626-6e30-421a-8950-165f7ce719dd', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('721a837a-570f-4c8b-8597-edd8f70cb1b2', '221b7626-6e30-421a-8950-165f7ce719dd', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bffb01c9-8743-49ab-ba5d-fc310d2d9406', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4fcb07fd-2323-4e08-8049-d8de0cdac761', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6bcc2ce6-288c-40d4-af2e-94e72150922a', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('911212d3-7a2b-40e7-8da0-e0fe7931fbcb', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('8b14cc14-32d3-4b1c-9bb6-4056cdbe493f', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('13e53d8f-64f2-48cf-be66-3b3dcb3311bd', '669e7455-7c63-4385-a1b1-762aca8ccdfb', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c655ef0a-ec9b-4ca2-b1b5-03b89ce6d526', '669e7455-7c63-4385-a1b1-762aca8ccdfb', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0adda552-405b-4cf9-a949-0bc4e64e3326', '34e32551-c73d-4b74-9714-be3957490408', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4cfa6b3b-5fb0-4c10-91e0-abcc3978fe00', '34e32551-c73d-4b74-9714-be3957490408', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0e4b26df-9aab-4c11-8357-eaecb34e1442', '34e32551-c73d-4b74-9714-be3957490408', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ec4bc6f8-f843-49f3-a7bc-b3f180bd8cc8', '34e32551-c73d-4b74-9714-be3957490408', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c18c4b6b-da23-4ef5-b5da-f934c9e7a3de', '34e32551-c73d-4b74-9714-be3957490408', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4436cbf7-a405-4490-a491-9aae0b0d8cb7', '34e32551-c73d-4b74-9714-be3957490408', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('cf96f8e5-d589-4460-a994-df72f1a2320a', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('3b8530b6-9d62-4fdd-8013-2b3f18355de2', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e97e03fc-30f9-435f-993d-cd454cde30cd', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('327bdf0b-2523-4dc7-8799-b39a6e66e896', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c698ecab-b2b3-432f-aaaf-8b3b92e6d4dc', '889c26fa-83fd-4482-b97e-1ee55e98235d', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('72b4eab9-abc1-430f-a593-5feee70d9025', '889c26fa-83fd-4482-b97e-1ee55e98235d', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2abcf7f8-a3f8-44fd-956f-38439ec7d6d9', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('73169984-3d91-412e-82f1-ad1cdcfca4f4', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('68f2c662-fadc-4324-bc4b-9439aa742133', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bd9744f0-c56a-41be-abcc-7edddf9a6d03', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e65809b5-520d-49d5-a5ba-f588374948b2', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9c80dfa7-143f-4187-9ee1-23c900f45d76', '67f9b829-213a-4c80-93b5-7410bcf6870c', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c8b953a4-4aa7-4a86-a1ec-ebba3cd72b65', '67f9b829-213a-4c80-93b5-7410bcf6870c', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6af0c113-67b2-4421-a878-ff5541529e3f', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1c0b669f-3bbb-4df3-9855-eac47820d9ec', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2c4ddbd9-77f2-4075-8663-6506ce68c4bd', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b35f5c5c-9523-41f6-be68-8a9e3c639210', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a0c6aa1e-673d-404a-b081-cfc6b6bd9e05', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('613c58c6-7709-41ff-a61b-330cc31d7337', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('553a8164-dc4a-4f57-a34a-875d2118bb08', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2e07cce9-0361-48bd-a7fa-02c10931c744', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5f19e02d-caf5-4cdb-9559-12cf28d25eeb', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ed6db30d-dd31-48b6-af17-c271e124a01a', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1645452d-6878-45af-ba8c-7349f95c93e0', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('74c97949-62a3-4a08-bbb9-b026e2f3a3a4', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f6892118-e002-466e-bac9-302cb1660b19', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('395c2490-bc26-4ddc-8551-1ec5d31306f5', '823979b0-87c6-43e0-8c08-0182b57c279e', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ed8fc11a-2374-4575-b5ca-4b3d051d8e8c', '823979b0-87c6-43e0-8c08-0182b57c279e', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('44d08ccf-b6d9-4902-992b-9a1b43409809', '823979b0-87c6-43e0-8c08-0182b57c279e', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('335c24db-c204-4ab2-bbe2-2b2c70cb4cf0', '823979b0-87c6-43e0-8c08-0182b57c279e', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('30558f0d-f29c-47ab-8184-4c5f4da6ec38', '823979b0-87c6-43e0-8c08-0182b57c279e', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c103d0f9-dea0-4866-9f0b-d8ee723dfc99', '823979b0-87c6-43e0-8c08-0182b57c279e', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('42600fa3-30bd-4f97-99f2-a9bb02734192', '1f300cc8-58a6-415a-b89e-337d77423e63', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ca9162ab-099f-456e-9f55-74fada28ae83', '1f300cc8-58a6-415a-b89e-337d77423e63', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2dea89d6-2daa-40ac-92b0-7ddbfab57153', '1f300cc8-58a6-415a-b89e-337d77423e63', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e32c0b1e-bb3f-411a-a6e7-00c62e023f94', '1f300cc8-58a6-415a-b89e-337d77423e63', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2252966e-6819-4650-8223-66305387ebf6', '1f300cc8-58a6-415a-b89e-337d77423e63', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9045ed50-2db3-4b23-ad18-a56c5c8f9bd0', '1f300cc8-58a6-415a-b89e-337d77423e63', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e1d5e9bd-1014-4366-9d5f-08bfd9030032', '1f300cc8-58a6-415a-b89e-337d77423e63', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a487df08-3da1-41b1-9ff5-85aeb9841556', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2f21e769-be1a-48ae-aad6-49bec4a05426', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('237b3233-5b57-4d5b-9c1a-ca56c29da153', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('20229d63-8c57-4313-bab1-3b9e76aaf149', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('87eb27ca-92b8-403b-b934-1e50f50e54f0', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0c1fda09-95c6-4410-98e1-72b691213ea2', '5a1c8f56-49ee-4561-85fc-a01f27d30838', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ca189386-8633-4d4b-a212-a441544f6d33', '5a1c8f56-49ee-4561-85fc-a01f27d30838', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ba8d31fa-27c8-4a01-a71e-91ec8de1b059', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2d0b2757-669c-432c-bd3c-f21c9edaa99b', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a2641098-1817-49af-ad63-c573904ada19', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d962c366-cd4f-46de-9433-210b656e0a24', '221b7626-6e30-421a-8950-165f7ce719dd', 'M', 9, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-26 04:36:27.783878+00'),
	('9581fc67-a632-402e-a69f-a43995288135', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a546b449-47f5-4ec5-beff-c525fb1f2b3a', '852f1ab6-e10d-431e-921e-862bb0b36df1', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4dda86d9-3800-4941-beee-63f6095bde33', '852f1ab6-e10d-431e-921e-862bb0b36df1', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1326fde6-b2b2-4a15-9edc-60a06e86f0d1', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d1aa327c-e8d2-41c6-9d74-fdb5a151cd2a', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('08ca0385-cea6-47ec-b363-b9ae73306b0e', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4e58e06d-a79d-4a71-9542-fad8430c963d', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c0a7ef04-c735-4ac4-9040-0fca46e4340b', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('706d39b2-6d4c-4afa-a5b0-802a62146fe4', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4baf9463-3162-4f4e-b214-f94f96630c86', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ea1c9a3b-9f85-4df1-add7-83ecbde414d9', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('cf9c1f87-1dd2-4451-8cf9-99d192977166', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7bdb244c-f3eb-4185-9e39-2f5fc8207238', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('827aed98-727c-441a-ad7c-7a8d11c70949', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b29e0c3d-fb66-47c4-aa5b-3ffe5c018499', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e91b6074-cd3a-4566-b0f3-7e376f3e9573', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bc3489d5-0d1e-4a4e-8544-dadfd24a6828', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a9e89912-d2eb-4462-bf43-4624ba554779', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('916fbe6d-feb1-42be-9c24-e157be57e974', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1c60986c-6200-42e0-932c-942f6daa46ef', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0a2a19e2-a776-4447-9ffa-69a8d4be790b', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e07b6d91-0f6a-4d7a-94d7-872b8f774c99', '71f892e2-a56d-42b9-80ad-1862fbfe9667', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('3e23c090-66a8-4e7b-8f05-992818103e2d', '71f892e2-a56d-42b9-80ad-1862fbfe9667', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('eab861a8-cb7e-4e42-84e0-1b5ef4244b36', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9b4b941e-d351-4eb6-a47c-5062a7a2d0a9', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('8d96413d-1b30-41c5-9926-6960d29f8710', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('81c387f3-7599-43d4-b4e8-b64716d63707', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('93135149-5c3f-462a-9f9c-339743bc6d27', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('35bc9fb4-0ee9-4b57-97d0-5f86dbd074c8', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2285a930-e73c-4a94-8b35-5ffdbb84ddf0', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('071d6ed1-05f9-471e-a87c-62843f1da2a1', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('653ad91f-a9f5-4ff9-8724-30b960a85d6d', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('18b270e7-ef61-4986-b35c-91700f7613f5', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f1f46690-474a-4cb0-85a8-b8f0199443a4', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('450f1942-bea7-4cdf-8d6d-3e8a3736d70f', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0cc706a8-fb3a-43f9-997c-3e5f9c7996c6', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2a6d6373-d5b6-4aee-9fe7-6cb40858596e', '30101446-ef8a-4d32-bfd9-a5792188e943', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ac0f6d0e-f704-476b-820b-0b9fd27571fb', '30101446-ef8a-4d32-bfd9-a5792188e943', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ad6b9e9f-ca82-4f6c-b7e5-0108756cfb25', '30101446-ef8a-4d32-bfd9-a5792188e943', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('9ea926dc-960c-4dba-8c35-30a794aad16c', '30101446-ef8a-4d32-bfd9-a5792188e943', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0984ef09-13f0-4c6d-8926-2e4819d30e00', '30101446-ef8a-4d32-bfd9-a5792188e943', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('24d7defb-a5f9-4909-bb4b-610a1cc55d23', '30101446-ef8a-4d32-bfd9-a5792188e943', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d613052a-0db4-42e1-8256-8e4c267a69c4', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bd7e83f5-681b-4a16-9fb7-037026b46caf', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('cd12122c-a98e-492a-9a27-7ec8fe214d5d', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a76f7866-87f2-4dfb-af3b-32ad162e0d7a', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('247a1023-1b70-4182-97cf-c976107b7081', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('deff3577-5d3f-4eec-aadf-a9904a812c00', 'e122281a-9904-4a57-b736-ae8bb52ad911', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2652718a-46b7-472a-a960-392028853887', 'e122281a-9904-4a57-b736-ae8bb52ad911', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('05290cc7-6840-432d-9289-642fbe46bd85', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f39295db-83ac-435c-8369-cb723e803c19', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('c27ad8e5-9ead-4b7c-93a3-7331750b2159', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('195e2fa5-0249-4089-baa4-f7440200ca45', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5204818e-f6f8-4199-93c4-7933cf04bbcc', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('19ef143b-b679-452e-a58f-99845af25d0a', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('f7afccac-8ccd-457a-b8d0-af8b98e361fa', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4db5fc48-d98a-47b3-9cc0-9c3327acc1c1', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d7087eae-3329-491a-999c-f0d776abfa9a', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7b0943f0-f934-47dd-9dfc-7f02883c2a7a', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('a50b7794-463d-4296-a393-6d911c08852d', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('19f7c0bf-8b8a-4b98-8837-c7c535d615b8', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('d5d938a9-66e9-4262-aebe-30295038a903', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7d76de6a-84ee-4075-abd7-309647c1cd7f', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('40f87996-df9a-49e9-8e3c-f6439525eeb7', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('86a81fe7-2e9b-4235-a7aa-95f082da085a', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6b13931f-feee-4906-872e-007577ff1c18', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5fe336ba-c80f-48b7-93a9-7901bdfa208e', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('dd6750ef-5a53-4351-bcf2-225a72a24803', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7ab6ad1f-c2a1-4c5a-88cf-1e1f96c21a3d', 'b17d66cc-9d2a-453f-8142-c984f0b80643', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('42183b03-7774-45cb-8acb-7dae9432df99', 'b17d66cc-9d2a-453f-8142-c984f0b80643', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('cb82d209-9008-4591-bfb8-f2e54ddb46a3', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('53f6a761-7877-4231-a4b1-dd6a945681e2', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ab138d82-45bf-404f-84a7-65c278fbc2ab', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('0978aebd-2d00-43ca-b65b-160cb7447dae', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b14770f4-8b62-4580-ae06-8a0ffedb7832', 'f6a0106a-4184-414d-be24-db5de0d820d0', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7d28f66d-e2e1-42a3-a9e3-106809e34763', 'f6a0106a-4184-414d-be24-db5de0d820d0', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5432942c-9a99-40e2-8815-6e19a78a130b', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('4bdf639e-da0c-47ad-bf61-9602e0ed4b38', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('584f936b-2c69-4fc3-9a9b-5b7b6ce30f60', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('15867725-efe5-4e44-a6ba-47298b1b1c20', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('18772ac6-4289-47b0-adac-1231dcecb068', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('39f9479c-7d5c-42c3-9f14-aa0c9f16723b', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('b4b1075e-c173-4756-8af4-79c9d2c1e1a6', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('38f9f81f-8163-4616-ac15-646bf2470106', '0b27018b-ab82-436b-a362-c4c2090bd992', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('8f8c68ee-8521-4c80-a84a-44f521974675', '30101446-ef8a-4d32-bfd9-a5792188e943', 'M', 9, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-05-02 04:14:10.94667+00'),
	('76874a9c-2e17-4416-b2c0-d50a5bacc1c5', '0b27018b-ab82-436b-a362-c4c2090bd992', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ae74af14-6f2c-401d-9fdf-c574f99c1352', '0b27018b-ab82-436b-a362-c4c2090bd992', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('17b98e85-f1b5-4f72-82e7-57586b967a5a', '0b27018b-ab82-436b-a362-c4c2090bd992', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('904ae6bf-ee44-4188-b3ea-c04baa36112e', '0b27018b-ab82-436b-a362-c4c2090bd992', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('de460dec-546f-42f3-85f0-2f2017b1611f', '0b27018b-ab82-436b-a362-c4c2090bd992', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('150ca9f7-6cf0-4e29-a232-56d890b3e9b7', '0b27018b-ab82-436b-a362-c4c2090bd992', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('95710a32-42d5-4685-bd6f-8ae104970c52', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('eaf30d33-36a7-4b9e-b264-cca49e5f4b51', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'XS', 10, 5, '-XS', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('10e4ff97-1060-45cd-a53a-d144ffbf937c', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'S', 10, 5, '-S', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('beb47f1b-2ad9-4b66-bc19-ba631d6357f2', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'M', 10, 5, '-M', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('6a2c759f-f5fa-4380-9144-f303522a64ef', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'L', 10, 5, '-L', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('9905fa8c-d743-47fd-ab0c-00097d4bee59', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'XL', 10, 5, '-XL', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('e72c39c7-51e3-4c3c-90c0-ef27958bdbfd', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', '2XL', 5, 5, '-2XL', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('49003e90-50d2-42a3-aae5-0633b588b91b', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', '3XL', 5, 5, '-3XL', '2026-04-24 19:00:58.024047+00', '2026-04-24 19:00:58.024047+00'),
	('8c5e4c13-ca87-419e-bffe-c10b2a57a8aa', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('5d5799f6-0c4f-4260-8fee-626b60e714eb', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('ec582001-b0b3-4d10-9dda-2c081546b4e1', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('36247387-f33d-4b03-8648-ed0cd13dcab4', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('470ea400-7bc8-4944-95b5-cda972cb8db8', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('eb4add0a-ee38-4bde-a0f3-3e93e6f4f374', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e6ae88f8-034e-4343-8000-ca51e635a230', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('6bd3d0ba-f564-4c55-b8dc-733fce13082a', 'd0121800-4083-49d2-983f-d12923831853', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('bf8ca145-38c7-4ab6-8946-bd44c50ed626', 'd0121800-4083-49d2-983f-d12923831853', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('39c9fff5-80ae-4d42-a2aa-557d3f2b78a3', 'd0121800-4083-49d2-983f-d12923831853', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('09a2ae10-8ed6-41be-a494-ff3b1a726459', 'd0121800-4083-49d2-983f-d12923831853', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('e1dec393-08c5-48ae-a747-c78c6583012e', 'd0121800-4083-49d2-983f-d12923831853', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('155d38a8-ba4b-45ec-bd88-6b54f9b7513a', 'd0121800-4083-49d2-983f-d12923831853', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('903c8ec1-ccdb-4200-8603-7d13a157397b', 'd0121800-4083-49d2-983f-d12923831853', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('1facb96c-7033-4b00-a46b-1930dbee9dde', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'XS', 10, 5, '-XS', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('31a557b1-fdb5-4a76-9f39-10c41b342ce9', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'S', 10, 5, '-S', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('8f4ed3a7-914c-4a52-9e98-66748c23c4f2', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'M', 10, 5, '-M', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('739a90d8-8787-47ff-88e8-4f010a28a4a5', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'L', 10, 5, '-L', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('cedf812c-65ff-44e4-9e4d-6565e3b7a4a0', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'XL', 10, 5, '-XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('2f7bbf77-108b-4dd9-b08a-ecac6b2f91de', '57366eb0-b882-4e35-9586-cc157cdebfc0', '2XL', 5, 5, '-2XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00'),
	('7e010eb7-ddbc-4e08-a6b0-c9990ca2548d', '57366eb0-b882-4e35-9586-cc157cdebfc0', '3XL', 5, 5, '-3XL', '2026-01-30 19:36:06.517352+00', '2026-04-24 19:00:58.024047+00');
