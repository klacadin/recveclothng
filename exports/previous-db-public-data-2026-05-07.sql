SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict sIx2BTj2U5LbJOJW0acD3VvIOfU5d1wLYlaEzdCjL5luwtEWb669P9cPTWbmHEh

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "slug", "description", "image_url", "parent_id", "sort_order", "is_active", "created_at", "updated_at", "code") VALUES
	('54125b35-f191-4d52-9e35-d639f97e174e', 'Running Shorts', 'running-shorts', 'Performance running shorts', NULL, NULL, 3, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SHORT'),
	('688802f3-df60-444e-aa0a-a9d1e2f9a5d5', 'Running Singlets', 'running-singlets', 'Lightweight running singlets', NULL, NULL, 4, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'SING'),
	('bec1254b-8067-458a-9767-6c3f7ec77da3', 'Running Long Sleeves', 'running-long-sleeves', 'Long sleeve running tops', NULL, NULL, 5, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'LSLV'),
	('e1feecae-189d-47aa-8955-d9980b9bd7fd', 'NOBODY Collection', 'nobody', 'The NOBODY collection - for unsung heroes of the track and trail', NULL, NULL, 1, true, '2026-01-30 21:33:02.34498+00', '2026-01-30 22:24:50.858973+00', 'NOBODY'),
	('3d2f9754-d60b-4232-aac2-68d18358654c', 'Running Shirt', 'running-shirt', 'Performance running shirts', NULL, NULL, 2, true, '2026-01-30 21:33:02.34498+00', '2026-02-23 13:14:49.451579+00', 'SHRT');


--
-- Data for Name: checkout_otps; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."checkout_otps" ("id", "user_id", "email", "code", "expires_at", "verified", "created_at", "attempts") VALUES
	('8f4eab2e-21f7-4b75-91ae-3d96914a9f2e', '9a8b7d6f-762a-4eeb-810e-11e90af3f0ed', 'kerenlacadin@icloud.com', '158056', '2026-02-20 17:40:44.613+00', false, '2026-02-20 17:30:44.735782+00', 0),
	('8c5331ff-7379-4f86-961d-fe570389fb76', '9a8b7d6f-762a-4eeb-810e-11e90af3f0ed', '+639176358505', '928485', '2026-02-20 17:40:57.475+00', false, '2026-02-20 17:30:57.529174+00', 0);


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."contact_submissions" ("id", "name", "email", "phone", "subject", "message", "read_at", "created_at") VALUES
	('2e91c1d4-c721-4a1a-acb9-78e086ea4bd9', 'testing', 'khlacadin@gmail.com', '0935-983-03-97', 'teesty', 'test sddgsfhgfhbfdh', '2026-02-23 14:49:16.853+00', '2026-02-23 14:48:45.226649+00'),
	('8b08fe96-9f5a-4ac7-9bfd-37fb341c2303', 'Brandon Boyd Rubin', 'rbrandonboyd23@gmail.com', '09168540106', 'Giveaway Entry – Win a Free Singlet', 'I would like to enter the free singlet giveaway.', '2026-02-24 05:26:22.961+00', '2026-02-24 03:27:13.633282+00'),
	('5468417d-48be-4258-97fc-7a8baac84a59', 'Eric John Denosta', 'ejdenosta@gmail.com', '09070995062', 'My Order', 'Good evening po how many day ma deliver sa Davao City? ', NULL, '2026-03-07 14:13:43.943182+00'),
	('eb9e26bf-2cb4-41b6-b240-f74788abde4b', 'JUANEL BAGUIO', 'juanelbaguio@gmail.com', '0977 804 5657', 'LIKAY SUGO JERSEY', 'Good day, pila ang downpayment kung mag patahi mi ug jersey? salamat
', NULL, '2026-04-10 12:06:20.82418+00'),
	('69a6f6c1-309e-44d5-a41d-dea36e7ffb22', 'Raizzah Mel Matutes', 'mel.raizzah@gmail.com', '09173004211', 'Track my order', 'Hello, what’s the status of my order? here is my tracking number ORD-20260420-8948', NULL, '2026-04-21 17:27:30.407702+00');


--
-- Data for Name: event_carousel; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

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


--
-- Data for Name: inventory_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."inventory_logs" ("id", "product_id", "change_type", "quantity_change", "previous_quantity", "new_quantity", "notes", "created_at") VALUES
	('86d46d4f-b9f8-4f81-91d2-d05ecf0c8763', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('e80939d5-ae90-4e66-b081-096b264b9add', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('befcd1be-ba6a-43a0-814a-4a9c7bdf68a0', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('5a853786-302d-411b-8feb-13f5c4499446', '34e32551-c73d-4b74-9714-be3957490408', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('f8ad910c-e47b-4c8c-b7c4-feb8984588dd', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('436e36f9-a1c8-452d-a509-5208f3c3c674', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('206dbde6-c9e8-4591-a91c-6092bb38ca6d', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('4ae9b640-a1c3-4faa-9e06-4aeefa815ac8', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('24d02866-6cc4-4b4f-9180-ea76131f5ecc', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('b8038c7b-9624-46c9-bee4-39b7db4d50b4', '823979b0-87c6-43e0-8c08-0182b57c279e', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('b3655679-5afd-4a76-bec8-899250ef71d3', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('d13e9598-7349-45d6-8005-2d75b623e3b9', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('acd2726c-d849-46d1-a398-be4566cc7b24', '61154afc-a88a-4f06-88e3-e8da1a279376', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('ea3d9f08-6760-49c3-8dae-83fc3a1dcaf6', '1f300cc8-58a6-415a-b89e-337d77423e63', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('8d3d59b1-01bd-4d08-a8f8-09a0c345e29b', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('91786024-a163-47d9-ace2-c26f5a9d7c1b', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('144e88cb-1f31-4c75-8835-a3e6de4a87f6', '221b7626-6e30-421a-8950-165f7ce719dd', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('c188d9f0-726c-4ad3-81d7-8419c3626076', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('096d5012-37c2-45c0-bbe2-8cb81130c574', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('8fa6d598-8b34-4102-b023-ea750de70438', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('c3e76244-a3fb-4d15-94a5-34f2e05e18cc', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('54a3ef37-dc3b-476b-8865-277912022d0b', '30101446-ef8a-4d32-bfd9-a5792188e943', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('8a8df757-86dc-462f-ba5f-8047112a5d94', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('2efbb6a6-2abf-4ad3-93ce-0aeae0a052e4', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('527277c6-4410-4837-8993-6a36c843ae21', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('97cbc08b-78dd-49c6-bc73-4b825522de21', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('41edb2d1-ec47-4b0d-ad4b-f996ae3e4134', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('0ba53379-951f-471a-9a38-7574d240be42', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('60ac9f69-a60a-41e0-81af-080bff6bd13c', '0b27018b-ab82-436b-a362-c4c2090bd992', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('5b845c2a-6679-4fcb-a10e-7e6142e1762f', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('760a3ca2-0f3c-4f29-aeb1-f1094a6e7516', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('92b4e13e-1d70-4af9-9e6f-f26a1fd9e28c', '1e4d1968-6ac3-472b-b664-85505e185097', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('744d7779-0d47-4960-915c-c2dab24a9209', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('72dad3cb-0440-434f-80eb-b509d91c0822', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('d0fbce4c-ee90-45b6-8bc2-4c64450d9aaf', 'd0121800-4083-49d2-983f-d12923831853', 'restock', 70, 0, 70, 'Automatic log from stock update', '2026-01-30 19:36:06.517352+00'),
	('a5523b10-ff2e-4df0-aa37-674c05bad5dc', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('68673f48-039d-4e47-b61c-7ea794606ecf', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('90ce69a4-0a8c-481d-a4f0-a9ddef998e0f', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('66eea941-c83d-4d31-a83a-88a4efd067e7', '823979b0-87c6-43e0-8c08-0182b57c279e', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('e1447b53-b9ca-4dc1-95eb-2897f6dba28c', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('2deae56c-d147-4cde-90f4-2cf100d75a3a', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('e4ac6ac9-f719-4182-9cb3-de4447a0a989', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('aa61c43f-6d3c-45f1-8e37-a65c78caee7e', '1f300cc8-58a6-415a-b89e-337d77423e63', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('876ea2a4-b619-4550-b0a6-56d6ad9de8e6', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('64c558d2-b534-4b47-8105-719cd296395c', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('eac839c9-3a26-4029-9b25-f9b3bab035b5', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('6701e1a4-e9b4-464b-8edd-c5daede8de87', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('1a865d51-707b-462e-befc-253179fcb50a', 'e122281a-9904-4a57-b736-ae8bb52ad911', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('2c772427-72e8-4c04-ad26-332e3269898a', 'e1581541-7ebf-4116-85d7-ed09cc098fc3', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('a0bff498-61b5-4a72-90bf-d3798421e589', '1638cf8a-b4fe-4a43-812b-cbe96452f8b7', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('327ae5d8-3fce-4f87-8ba5-d063ad58a779', 'b17d66cc-9d2a-453f-8142-c984f0b80643', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('49604153-0c1c-4335-be74-924b532bf957', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('ee05c44f-00a1-44b6-a033-8ac3c9d57902', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('0780baf3-ff8c-4eac-b10b-d871c62220d6', '0b27018b-ab82-436b-a362-c4c2090bd992', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('073aed88-e3bd-44c7-9c6b-78ad71de51a9', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('22d97cb2-27ea-4fa0-8429-6feccb47e534', 'ae76def5-65a8-4fee-a23f-7cfa605885cd', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('0b210235-1a7d-4133-bfa2-699d39e59554', '1e4d1968-6ac3-472b-b664-85505e185097', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('eba0c2f2-fddc-41e0-b0f8-391e3d0b08d2', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('607fac31-26a3-41f6-b1d0-d3d7ddf57cdd', '71f892e2-a56d-42b9-80ad-1862fbfe9667', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('b507fcb3-bb16-48ad-bd56-5f1226a8ca3b', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('aab72af8-a4a4-464b-9ac6-4b43875cc015', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('797723a9-2f86-4cf2-9a93-b58b6d9d317a', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('1a76d9c4-49af-4b7a-846d-5596581b51c3', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('5ad90661-1200-41f6-a5ef-9ef39dfb92a9', 'd0121800-4083-49d2-983f-d12923831853', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('900cc28f-e9da-4470-93c1-64046b4c85f6', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('2229f545-92d7-447f-826b-54cf9cb7060b', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('d6870850-06d0-43d6-85cd-ca8552381c92', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('657ce6cb-547c-44ed-9621-b15f6fecac11', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('7bab0b85-7c2d-4bcb-92d5-f1629fc68840', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('6497d3ae-897e-4060-b835-7fa08ab3d1f7', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -10, 70, 60, 'Automatic log from stock update', '2026-01-30 19:48:09.828702+00'),
	('bf9fb824-ead3-44f7-a539-c47cb935d07e', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-01-30 21:19:07.060667+00'),
	('b9b1f5df-4347-4e2d-9b22-ac23c8af631c', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-01-30 21:19:07.191411+00'),
	('436c3c2f-6525-4e66-80e4-ceb9c93ac9d1', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-01-30 22:08:06.113517+00'),
	('b48cb4a4-b5c6-4a7a-9f19-a65972132016', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'sale', -1, 48, 47, 'Automatic log from stock update', '2026-04-25 17:56:10.420511+00'),
	('3c2044b8-d8d5-4963-b14f-2035b29677af', '823979b0-87c6-43e0-8c08-0182b57c279e', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-01 10:32:22.896229+00'),
	('345d312c-bf75-48e7-98d2-525b845a4b62', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-02 15:35:00.048187+00'),
	('53f01033-03a8-48db-ae6a-107e8422578a', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-02 15:35:00.246869+00'),
	('b493a8cb-c52d-4bb7-bc16-cef1b5895cd1', '823979b0-87c6-43e0-8c08-0182b57c279e', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-03 23:08:04.471938+00'),
	('df6b9fb6-dde8-4181-9cfc-e3a0a01b14f7', '823979b0-87c6-43e0-8c08-0182b57c279e', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-03 23:16:50.22433+00'),
	('8e377960-5069-478d-9e8a-70d78ddbc620', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-03 23:24:49.373877+00'),
	('17c7a080-e2fd-4e32-8cf2-ee011e1c07e4', '823979b0-87c6-43e0-8c08-0182b57c279e', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-03 23:42:34.524619+00'),
	('6c761788-9573-49f2-859c-fef3386e8633', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-04-25 17:56:10.847138+00'),
	('01e7c5f3-cf62-40e1-9303-f6160a78585e', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'sale', -1, 20, 19, 'Automatic log from stock update', '2026-04-26 04:36:27.247784+00'),
	('04e8f171-fc9b-4594-a646-d7bd2f523459', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-04-26 04:36:27.578373+00'),
	('7e6beca2-e2b3-41a7-b84d-368b74934d71', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-29 04:07:32.239796+00'),
	('3428b108-6c8c-40f8-9282-c7013843f864', '8968a92e-037f-4730-b29b-67286ae5f896', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-04-30 05:18:26.638467+00'),
	('64b76943-1289-4bd6-ac00-f9d783e0d1af', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-02-04 00:10:02.629513+00'),
	('c0024ed6-7d11-4b55-90f5-3abf78bd0384', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'restock', 3, 57, 60, 'Automatic log from stock update', '2026-02-04 00:10:02.629513+00'),
	('ff76af36-7fd9-409c-89bf-f7c5cfe50cf9', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-02-04 00:10:02.629513+00'),
	('e1b7b3a2-795d-4440-ab96-941c90d37600', '823979b0-87c6-43e0-8c08-0182b57c279e', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-02-04 00:10:02.629513+00'),
	('e0c4ce2f-c9d7-47b1-b00d-bb4a7a5dcce1', '36af90ef-80a5-4a8e-b013-c50d16cc1b9d', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-02-04 00:10:02.629513+00'),
	('72b3a125-0985-4899-89f7-3e84d7709b17', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 08:44:31.857746+00'),
	('7f2ee86e-0d14-488e-b00c-140fb5d9f34c', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 08:45:11.872828+00'),
	('52e91d6f-88f6-49fb-a386-00d0c7fa8bba', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:15:12.869511+00'),
	('270c3d70-8b87-4adc-a3e8-cb4d903c8afb', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:17:19.83536+00'),
	('9a53fc27-8673-4851-9785-81181565acbf', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:24:17.284337+00'),
	('068a5942-8a58-42f6-add4-86203b19fb29', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:33:45.916315+00'),
	('1408d31f-3cab-4796-8bfc-763463de6164', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:33:46.103092+00'),
	('e412acf0-1d73-47ec-9107-5e812f87b0a5', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 11:38:20.7635+00'),
	('9bf5723f-4197-4602-8bf5-05412b60d2e5', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 11:48:27.612302+00'),
	('e8fc8b0d-a1a5-4b30-8486-d1cc0232ef75', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-04 11:56:31.962443+00'),
	('7b23085d-1f18-4e89-b8df-000d6c148d5d', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-04 12:57:20.6421+00'),
	('3abaed8e-2759-4890-9d08-9bd4866dda0b', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 12:57:21.179416+00'),
	('08188c28-dc16-4d02-80d8-f4b1a3c249d5', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-04 12:59:39.850853+00'),
	('47914a2f-1245-46f4-80d2-b294de4d7fd3', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-04 12:59:39.986556+00'),
	('48beab77-e96f-4907-bc2f-40df2339a1d8', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -1, 56, 55, 'Automatic log from stock update', '2026-02-04 14:26:11.989735+00'),
	('be35d99e-33a5-4257-92c1-4126e927b997', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-04 14:26:12.157733+00'),
	('5282e836-1701-4c40-9dea-858e164c0b3f', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 14:51:07.478483+00'),
	('d92924a9-06ba-4ae9-8370-325a4a66379b', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 17:35:40.733559+00'),
	('45ab7c51-2531-42bc-bf4d-652bc3c8f13a', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 17:35:40.928384+00'),
	('f2ecf820-807d-4580-b94e-f3033526fc10', '1f300cc8-58a6-415a-b89e-337d77423e63', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 17:35:41.058226+00'),
	('3e94f4dd-6bfb-4b07-b401-9638b92c9a01', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-04 17:39:40.391523+00'),
	('78ba7e7a-c6f7-4ee3-bede-4bd09afb8864', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 18:16:59.655434+00'),
	('ecb31465-0d56-4639-92a3-8270038b1647', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 18:16:59.797268+00'),
	('09b49cc9-8f20-426b-9745-96fc5f0aeb98', '1f300cc8-58a6-415a-b89e-337d77423e63', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-04 18:16:59.926298+00'),
	('805c7911-6bef-4c91-aee4-4439ea8bfa09', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-05 01:47:45.602075+00'),
	('40aec84a-a7f6-4376-9ffa-cb2976cf8534', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-05 05:02:05.448276+00'),
	('60891a5f-cf86-4b9b-8be8-d0104004a987', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-05 05:02:23.540103+00'),
	('25ae9460-ffd4-4c73-8358-6eab53577a50', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-05 06:38:58.475883+00'),
	('4f3d14ad-2d7a-4d28-93b5-11c46210df09', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-05 06:38:58.686383+00'),
	('51651d9d-d514-40a9-95cb-0c9a978c5761', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-05 08:21:28.664431+00'),
	('e576ab67-4168-49a7-9929-68275e689b7f', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-05 13:54:21.998495+00'),
	('c82dada7-8c73-45ad-beb0-2bbc1e1e2cfc', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-06 05:11:33.945134+00'),
	('1fde444a-89f7-472e-b8e8-2dc0c3947c7a', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-06 05:11:34.15273+00'),
	('23cadc48-669e-4f58-a26a-76b8cbd78d88', '1f300cc8-58a6-415a-b89e-337d77423e63', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-06 05:11:34.322206+00'),
	('3773ff69-194e-4554-b49a-1e73f2366777', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-06 22:08:45.995128+00'),
	('813ce529-fb3e-46cf-a83e-c8d579ac7dc5', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-07 14:05:14.856253+00'),
	('7fd9340a-cd11-405c-b6e3-83dd027d71d5', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-07 16:06:05.874902+00'),
	('73e88730-0a87-4832-a20f-1d3b6797e4c6', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-08 01:14:14.328527+00'),
	('4ee08f1e-f02f-40e9-9ae1-08ffdfba6e2f', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-08 04:48:38.154525+00'),
	('57417ee9-0917-496f-bf19-c7ecea260181', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-11 06:21:18.557001+00'),
	('c98a43ad-cdd3-4e8f-918a-4e6d4eebe746', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-11 06:21:18.749282+00'),
	('7a3af077-90a2-45a1-9548-fc37cee6d66b', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-12 06:26:48.323317+00'),
	('38f27b51-930f-481f-b36b-cc52223e4078', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-12 06:26:48.565574+00'),
	('6512f438-da74-49f9-b4cd-700fb6afe110', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-12 06:26:48.752757+00'),
	('ca70df01-0f9d-4bba-aa0a-5c5fa9666808', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-12 06:26:49.230064+00'),
	('4a2db2d6-ef62-4918-a509-a66e4e6fb14e', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-15 16:59:38.732172+00'),
	('213598cf-419f-412e-ad6a-1a21f2a58930', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-15 16:59:38.909683+00'),
	('a9203727-4149-4cc8-80e5-19b2519e0a06', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 56, 55, 'Automatic log from stock update', '2026-02-15 16:59:39.068938+00'),
	('bcc01708-6faa-4ed2-b6c9-15aac14acba7', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 55, 54, 'Automatic log from stock update', '2026-02-17 05:13:45.041661+00'),
	('40263ba8-199c-4910-a073-61e189ac9616', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 56, 55, 'Automatic log from stock update', '2026-02-17 05:13:45.269797+00'),
	('87633f2c-bc0b-4b1b-a787-f399155a7c5d', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-18 23:49:49.791231+00'),
	('91274a6e-81c2-43d7-b0fe-0770b074ee54', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-18 23:49:49.941254+00'),
	('e1863b2e-012d-43f8-b654-2d687169da64', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 55, 54, 'Automatic log from stock update', '2026-02-20 11:56:25.64737+00'),
	('76619afe-a6c6-46e3-a027-2b5cef53fcbd', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-20 11:56:25.855888+00'),
	('70d7b92a-5658-4ec6-b4cd-0224533ffa38', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-20 17:08:21.605817+00'),
	('14265a87-5505-4f86-901c-ba02b243c143', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 54, 53, 'Automatic log from stock update', '2026-02-20 17:11:26.452122+00'),
	('8fa28550-f29b-4dff-a3c2-f852785e8b9b', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 53, 52, 'Automatic log from stock update', '2026-02-20 17:16:58.05012+00'),
	('5e2909e0-fd3c-4e57-b6f3-f1fdd2a629d1', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 52, 51, 'Automatic log from stock update', '2026-02-20 17:20:34.097251+00'),
	('9221fdc6-543f-430a-b0d1-af96075dbcbd', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 51, 50, 'Automatic log from stock update', '2026-02-20 17:22:53.412694+00'),
	('5a167ad7-4f83-404f-898e-536abab3ec6e', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-02-20 17:41:43.363749+00'),
	('6955aa24-ef74-4fe6-b715-88e13c4cfbe9', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-21 05:06:26.854532+00'),
	('83cfbf81-6d37-44c2-944e-9c68af110ffa', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 49, 48, 'Automatic log from stock update', '2026-02-21 13:09:38.579967+00'),
	('10f669f8-77a2-46d8-943b-97bb89535f05', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 48, 47, 'Automatic log from stock update', '2026-02-21 13:17:24.663523+00'),
	('e9b02f0d-54a1-4489-acc1-eb73d152b7f5', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 47, 46, 'Automatic log from stock update', '2026-02-21 13:25:16.698788+00'),
	('f16edbb4-3109-4815-8313-e81b18e65641', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 46, 45, 'Automatic log from stock update', '2026-02-21 13:43:53.102168+00'),
	('acacf3fc-bbfe-4cb1-a3c8-2f93f3bc2e5a', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 45, 44, 'Automatic log from stock update', '2026-02-21 13:47:26.70954+00'),
	('b1259054-878e-4db8-831d-6f564fe79f04', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 44, 43, 'Automatic log from stock update', '2026-02-21 13:48:37.105306+00'),
	('c1543643-b413-4215-87df-570d3eb9a952', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 43, 42, 'Automatic log from stock update', '2026-02-21 14:01:16.486326+00'),
	('8c2892a1-7698-4cda-a080-06f2296a58a0', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 42, 41, 'Automatic log from stock update', '2026-02-21 14:06:05.076046+00'),
	('50a3e12b-ac6f-4959-9153-a2688e817b1e', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-21 14:38:14.725494+00'),
	('e7421928-556e-4c9e-9d96-ba72a9614253', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-21 14:55:07.895204+00'),
	('0aa123e6-f5c8-417e-aec6-d55cc4a59eec', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-02-21 16:06:33.743888+00'),
	('6bd8a432-f3a7-47b2-a401-4ee96c91b102', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-21 16:08:47.361279+00'),
	('562df391-7366-4198-934d-a43df48ebf83', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 41, 40, 'Automatic log from stock update', '2026-02-22 14:42:42.014221+00'),
	('ba3feac3-5515-41e7-8dd7-a46939f987b8', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 40, 39, 'Automatic log from stock update', '2026-02-23 13:38:38.055329+00'),
	('a6fe129a-4781-441d-a529-973ff636744e', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-24 00:11:15.246483+00'),
	('0a4998fd-31e8-4e86-9206-f526eb026fb5', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-02-24 00:11:15.436559+00'),
	('5cf8f52c-ab90-4aec-84c6-ea4d553afb1e', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-24 00:44:54.068802+00'),
	('d88cae24-da1c-42c0-b4a9-b9cf8f05c63e', '1e4d1968-6ac3-472b-b664-85505e185097', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-24 00:44:54.216046+00'),
	('94f92287-43bb-4145-9c52-4ebf1df7d2e3', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-02-25 16:53:48.542969+00'),
	('91a0fe54-b4f0-4aa9-b1b0-0c010d8baa50', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 54, 53, 'Automatic log from stock update', '2026-02-28 00:32:26.021047+00'),
	('e8b380b8-8dd0-4ee1-ad3f-6b31ab747274', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-02-28 14:43:19.330325+00'),
	('91daa5c5-2be5-4c41-9d6f-9d5b041c413c', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'sale', -1, 70, 69, 'Automatic log from stock update', '2026-02-28 14:43:19.544018+00'),
	('ed1389a9-9323-4eba-a288-9be372c74dc6', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-02-28 14:43:19.71355+00'),
	('06514ffd-d428-40fa-a1e1-9ff07bd9b388', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-01 12:45:58.670839+00'),
	('e1707215-8278-4a57-b251-272346a8b39c', 'd0121800-4083-49d2-983f-d12923831853', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-03-01 12:45:58.802139+00'),
	('420acd8c-f4da-4285-8745-76702af306c1', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-03-02 10:07:25.928322+00'),
	('b503d919-ac18-4880-86ba-0fd392c1cc40', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'sale', -1, 70, 69, 'Automatic log from stock update', '2026-03-02 10:07:26.124823+00'),
	('fd2b3872-c34d-4033-a507-2d2ef10445a0', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 68, 0, 68, 'Automatic log from stock update', '2026-03-04 09:58:20.808282+00'),
	('8c81aff9-ba67-4fd1-aed8-751e91db3dbe', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'sale', -60, 68, 8, 'Automatic log from stock update', '2026-03-04 09:58:21.229114+00'),
	('7c9e0f4b-8bbc-4264-9fec-7e38d6afc8ad', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 2, 8, 10, 'Automatic log from stock update', '2026-03-04 09:58:21.240233+00'),
	('d3ca18f6-deed-4c63-8077-be6ca9f295cb', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 28, 10, 38, 'Automatic log from stock update', '2026-03-04 09:58:21.643097+00'),
	('b9d0813a-abe9-409d-99ed-47c7aa554259', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 10, 38, 48, 'Automatic log from stock update', '2026-03-04 09:58:21.655153+00'),
	('fe91b3ee-5908-463f-8670-b66b148ab2f9', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 10, 48, 58, 'Automatic log from stock update', '2026-03-04 09:58:21.657363+00'),
	('478cf58b-3d12-48b1-89fd-ca8b58327e98', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-05 14:52:01.519196+00'),
	('26a9f349-ad08-48eb-98e7-d9d20be1924d', '3532981c-4b88-440a-975b-4f219067be86', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-05 14:52:01.687249+00'),
	('19b25179-ecf2-47de-a36b-8eb2759b54b2', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 56, 55, 'Automatic log from stock update', '2026-03-05 14:52:01.80786+00'),
	('cc600261-27b0-4f18-9ada-108ba47f8039', '3532981c-4b88-440a-975b-4f219067be86', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-03-07 04:06:28.557175+00'),
	('29a911f8-f664-483d-8554-5460261d22c0', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 39, 38, 'Automatic log from stock update', '2026-03-07 05:38:33.920732+00'),
	('95a4d4d4-0c9b-4f1d-9314-738fb36f88ad', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 38, 37, 'Automatic log from stock update', '2026-03-07 14:09:15.767396+00'),
	('23f7d5db-e30e-472a-81fa-210adffdc52c', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 56, 55, 'Automatic log from stock update', '2026-03-07 20:48:36.408352+00'),
	('bdde792d-896a-48b1-b31d-11966716f93a', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-09 04:13:20.858472+00'),
	('e9f886e5-3e7f-4f23-92bd-bd0f542c3848', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-03-09 04:13:21.163294+00'),
	('26ddd810-8f33-46c1-ace1-09e2744d1252', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-09 04:13:21.458738+00'),
	('2e34f249-5bc9-485f-b9c3-9fdf4cc337c7', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-03-09 04:13:21.634872+00'),
	('5b9fb36b-d9ef-4809-9f0c-6d3a09d8537d', '3532981c-4b88-440a-975b-4f219067be86', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-03-09 04:13:21.837285+00'),
	('82887260-69db-4a48-98fc-6613b4e25bc5', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-03-11 12:11:21.112803+00'),
	('a6f40dc7-e342-4b03-ad73-80c30f0c5f4d', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-03-11 12:11:21.31896+00'),
	('eda875c5-d8b6-45af-b22b-fda3fbdabcda', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-03-11 12:11:21.48431+00'),
	('d00feecd-dba6-40e7-95ac-2a4c181b1432', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-03-15 11:31:27.039837+00'),
	('a2871722-fec5-411a-8583-b5537ad547bc', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -2, 53, 51, 'Automatic log from stock update', '2026-03-17 07:10:36.734449+00'),
	('417072dc-35a9-4f35-a9b3-3a589df9077e', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-03-17 07:10:36.934779+00'),
	('b5056410-f332-4981-9c88-101ea836ef96', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'sale', -1, 49, 48, 'Automatic log from stock update', '2026-03-17 07:10:37.099223+00'),
	('7514f904-59de-449b-b317-f688320f19bd', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-03-17 07:10:37.255837+00'),
	('ebee5e60-e02d-44ff-bd1d-0afa49059d76', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-03-17 07:10:37.414769+00'),
	('f1e956fd-8c63-4c01-a25a-ca04a904708a', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-17 07:10:37.580671+00'),
	('8864d63e-d813-497f-9719-745680abb9b2', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'sale', -1, 55, 54, 'Automatic log from stock update', '2026-03-17 07:10:37.765501+00'),
	('0152653b-9fb0-4d99-9901-b626f933ca1f', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 55, 54, 'Automatic log from stock update', '2026-03-17 07:10:37.92253+00'),
	('ea6cded5-8760-4232-bead-cbce0218c9df', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-03-17 07:10:38.081452+00'),
	('7297af9a-13ce-40e5-877a-ad27985b6ec2', '3532981c-4b88-440a-975b-4f219067be86', 'sale', -1, 32, 31, 'Automatic log from stock update', '2026-03-28 14:11:44.137244+00'),
	('00eb673a-d045-4f3a-9db5-6d2ef84854ae', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-30 06:51:06.918646+00'),
	('9537c3e6-2dee-40a0-a3fa-026a6670f2e4', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-03-30 08:33:10.762892+00'),
	('ce21676b-25d8-4e55-a8b9-9868244c061a', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-03-30 08:33:10.917311+00'),
	('c40cb290-7201-4256-88db-e1a5cd2f1808', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-31 06:23:04.198473+00'),
	('5feb0ac8-0984-4726-810d-21fd89d36247', '55475375-cb6f-45a1-a394-c8c4521caf73', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-03-31 06:23:04.406756+00'),
	('19bc6c80-b51f-4266-9eec-36c35c315056', '55475375-cb6f-45a1-a394-c8c4521caf73', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-03-31 08:32:17.670916+00'),
	('c3dfdd58-bce7-4cc9-a4ab-5bab49577080', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-01 12:42:48.867476+00'),
	('9f3a0961-08ff-4c7f-b125-b8da8dca8aae', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 54, 53, 'Automatic log from stock update', '2026-04-01 12:42:49.002698+00'),
	('b6872e60-fbaf-40fa-b977-5b6b585666a9', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-01 12:42:49.114755+00'),
	('f64d5c61-6cbc-4f22-853f-81d50c29f1bd', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 37, 36, 'Automatic log from stock update', '2026-04-05 13:18:26.129383+00'),
	('94a4fb07-ece7-4fea-bdee-ccafbab93da8', '55475375-cb6f-45a1-a394-c8c4521caf73', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-04-06 12:30:12.974073+00'),
	('0212e20d-7a61-4745-8a62-38734727250b', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-06 12:30:13.458811+00'),
	('a975c52c-5362-4452-9841-619261a87fce', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-04-06 12:30:13.636459+00'),
	('1d841853-5e7a-468d-bcbb-6029af75fafe', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-06 14:27:13.385515+00'),
	('fad414eb-f7e3-4a6c-b3db-f922443ea418', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'sale', -1, 33, 32, 'Automatic log from stock update', '2026-04-06 14:33:57.097253+00'),
	('e4506d1b-bcea-4395-970b-0073546f3ccf', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'sale', -1, 57, 56, 'Automatic log from stock update', '2026-04-07 11:53:16.200118+00'),
	('b20067b9-1b20-4ef7-97f6-b03884a6e402', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 53, 52, 'Automatic log from stock update', '2026-04-07 11:53:16.320207+00'),
	('088110f4-35f5-48d3-b59b-9e11e997d858', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'sale', -1, 59, 58, 'Automatic log from stock update', '2026-04-08 14:39:41.721705+00'),
	('2d05a49d-8512-450a-be81-fbdc6579547d', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-08 14:39:42.353081+00'),
	('30a9a8a2-10bc-4c34-895d-a9383da12276', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 51, 50, 'Automatic log from stock update', '2026-04-08 14:39:42.681574+00'),
	('d102e6d0-1f61-421c-8463-81303a136e43', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'restock', 9, 58, 67, 'Automatic log from stock update', '2026-04-08 14:39:42.999092+00'),
	('5c5ab3d1-7240-4072-bc0f-eb248eddd3c2', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-04-08 14:39:43.256822+00'),
	('e1db8dc1-e779-4be7-9c7a-f8dd5353fccb', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'sale', -1, 58, 57, 'Automatic log from stock update', '2026-04-09 03:55:30.815253+00'),
	('37de1a5a-7541-4d0e-96b4-a9688ef647be', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-04-09 03:55:31.047242+00'),
	('1d57090b-c25b-44c5-8135-874e473e0916', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'sale', -1, 67, 66, 'Automatic log from stock update', '2026-04-09 03:55:31.23634+00'),
	('d45d52ea-43cc-4ba1-ad41-e44da5e57ffe', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'sale', -1, 66, 65, 'Automatic log from stock update', '2026-04-09 03:55:31.41995+00'),
	('a54596c9-c699-4164-925f-dec9d1b9f849', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-09 03:55:31.598564+00'),
	('39bcefd2-d186-4508-87b9-09935c2da826', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'sale', -6, 65, 59, 'Automatic log from stock update', '2026-04-12 14:56:29.24905+00'),
	('2be71b9e-1dca-47bb-9695-dd022234f30b', '61154afc-a88a-4f06-88e3-e8da1a279376', 'sale', -4, 55, 51, 'Automatic log from stock update', '2026-04-12 14:56:29.409349+00'),
	('a9f554e0-8495-469c-88f4-13333519541a', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -3, 32, 29, 'Automatic log from stock update', '2026-04-12 17:05:03.287519+00'),
	('9a9bf44b-c8a2-4dab-979d-f58e3ed2e64a', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-12 17:05:03.436915+00'),
	('fd8e42c0-2c52-4661-b8f5-e914a0a77cf2', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -2, 29, 27, 'Automatic log from stock update', '2026-04-15 04:23:09.445243+00'),
	('3bbcb175-676b-4e97-8000-e274386995f0', '8968a92e-037f-4730-b29b-67286ae5f896', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-19 02:09:28.446385+00'),
	('b706cca7-7d49-49d8-87db-9f4daada1349', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-20 12:24:43.272824+00'),
	('75fff9e7-3faf-4a53-bbe0-30fca9543bce', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-21 07:56:21.0534+00'),
	('1eebe841-61be-4d10-99d9-4a4ae3764209', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'sale', -1, 32, 31, 'Automatic log from stock update', '2026-04-21 07:56:21.628615+00'),
	('adf2fd2a-6ccb-4a48-83a0-2351d905cbf7', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-21 07:56:21.83905+00'),
	('e1f75da3-2a4c-4e5d-8523-eef8787411c5', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'sale', -1, 35, 34, 'Automatic log from stock update', '2026-04-21 07:56:22.067222+00'),
	('f80c69da-bbdd-4672-bf4b-c1467bffcf91', '8968a92e-037f-4730-b29b-67286ae5f896', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-21 07:56:22.282619+00'),
	('d06ca13a-fc68-4b8d-8525-a427dd2c4f0a', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-04-21 07:56:22.49939+00'),
	('59e1c3b5-73d9-499d-b009-db4588cf9582', '61154afc-a88a-4f06-88e3-e8da1a279376', 'restock', 9, 51, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('fdfe9356-7ea7-41dd-96b7-7addb75dad00', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'restock', 3, 57, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('f2342657-3d60-4c18-a6d6-6f243b5d125f', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('caab060d-28c7-4444-9bed-185fdca4b435', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'restock', 3, 57, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('584d51cf-ba30-4b5c-9156-aaa3826aca74', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'restock', 24, 36, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('bc1e21c1-ce97-4a11-8031-6edba712e2da', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'restock', 2, 58, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('56dc825f-5210-47a7-9c1d-485dce33b5fc', '1e4d1968-6ac3-472b-b664-85505e185097', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('3fe6dcc6-c87f-4252-a375-f7266b50431d', '221b7626-6e30-421a-8950-165f7ce719dd', 'restock', 8, 52, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('0e5c7565-7d12-4b6a-8a48-7a80f0408eb2', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'restock', 2, 58, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('2a57c0c1-3acc-4f53-b270-462632570cec', '34e32551-c73d-4b74-9714-be3957490408', 'restock', 5, 55, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('945f4c08-1316-446f-a244-252930403106', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('956f31f0-df49-4c5d-8ddb-4725c90af3bc', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('a23948ce-3bd2-4ccb-852f-5056eb0b04bd', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('129d4191-c0d5-46f7-a290-c77aaec34ac1', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('9e076261-cd2e-4e01-b037-86014cccb8f0', '1f300cc8-58a6-415a-b89e-337d77423e63', 'restock', 3, 57, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('b0d40745-f204-4786-a4fd-44195ed446a0', '5a1c8f56-49ee-4561-85fc-a01f27d30838', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('01ca468f-52c1-4219-812b-2fdb17aa63ae', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'restock', 2, 58, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('18b76265-8e34-4bf0-8ef8-fad69639737c', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'restock', 3, 57, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('ad5e2f15-32cf-4b0a-9392-c230c285d5ed', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'restock', 2, 58, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('4a6907f4-5b4a-4da5-8ee0-86fd15ad2b0a', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'restock', 11, 49, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('81cebdf2-a10e-495d-ab5c-2bd177fb6b52', '30101446-ef8a-4d32-bfd9-a5792188e943', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('82e709c4-5153-4d1d-a3f5-6f9159b72ea5', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('30260eac-d7f0-433f-bd3b-d6ba416bc175', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'restock', 4, 56, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('f492861c-91df-4713-b69e-9f69d4444177', '455dd4ae-726c-45ae-84cc-25ff3a1060ae', 'restock', 60, 0, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('26d091a5-ce63-4812-82d4-b14a6af616f4', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('f23b7346-8220-46d7-ac16-63c31b73665b', 'd0121800-4083-49d2-983f-d12923831853', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('cf8b5262-3601-4e49-8d72-4c41a4612a0f', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'restock', 1, 59, 60, 'Automatic log from stock update', '2026-04-24 19:00:58.024047+00'),
	('dcf3d414-bbee-4486-9217-ef71a04cbbd2', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'sale', -1, 50, 49, 'Automatic log from stock update', '2026-04-25 17:56:10.664473+00'),
	('fd98e184-155b-42c4-9b4d-f3f3c9651042', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-04-25 17:56:11.36298+00'),
	('191763ac-4c14-4de0-aaf6-8498feacb276', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'sale', -1, 27, 26, 'Automatic log from stock update', '2026-04-26 04:36:27.407087+00'),
	('e5412de5-b4a3-498c-a093-af4f454afec4', '221b7626-6e30-421a-8950-165f7ce719dd', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-04-26 04:36:27.783878+00'),
	('fce4be73-b4be-4959-b478-6380d45dbd9a', 'fafba7aa-5791-4384-89af-52659b08281e', 'sale', -1, 70, 69, 'Automatic log from stock update', '2026-04-30 05:18:26.467649+00'),
	('766cbe91-9c85-4ab7-ab8e-40cda8830aa6', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-04-30 05:18:26.774411+00'),
	('060bdc98-96bc-4d63-9166-606d3ff1cb65', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'sale', -1, 49, 48, 'Automatic log from stock update', '2026-04-30 05:18:26.920764+00'),
	('9af1d39e-13b4-488a-85b3-0d66506e352d', '34e32551-c73d-4b74-9714-be3957490408', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-05-02 04:14:10.436365+00'),
	('1e3e77f4-94c1-4494-884b-e96e55239d9c', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'sale', -1, 34, 33, 'Automatic log from stock update', '2026-05-02 04:14:10.565691+00'),
	('d36e6948-ae5b-43de-af5a-9496f40b8f28', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'sale', -2, 49, 47, 'Automatic log from stock update', '2026-05-02 04:14:10.657457+00'),
	('2f17241d-592d-4a57-918f-37b2e627e761', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'sale', -1, 47, 46, 'Automatic log from stock update', '2026-05-02 04:14:10.754897+00'),
	('952e4ed5-b535-46b1-8ac7-ba2deadf4e46', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'sale', -1, 46, 45, 'Automatic log from stock update', '2026-05-02 04:14:10.843667+00'),
	('4fb70077-cdbe-4a6f-830f-a6f19ba5c233', '30101446-ef8a-4d32-bfd9-a5792188e943', 'sale', -1, 60, 59, 'Automatic log from stock update', '2026-05-02 04:14:10.94667+00'),
	('3fb5ca8f-d339-4f2d-86a9-ae5c4b0aade9', '8968a92e-037f-4730-b29b-67286ae5f896', 'sale', -1, 32, 31, 'Automatic log from stock update', '2026-05-02 10:55:15.762504+00'),
	('ee8024a0-3e87-4c92-980f-210c3b013f86', '8968a92e-037f-4730-b29b-67286ae5f896', 'sale', -1, 31, 30, 'Automatic log from stock update', '2026-05-02 11:00:51.441279+00');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("id", "order_number", "customer_name", "customer_email", "customer_phone", "shipping_address", "status", "payment_method", "subtotal", "shipping_fee", "total", "notes", "created_at", "updated_at", "user_id", "proof_of_payment_url", "proof_uploaded_at", "waybill_number", "payment_reference_number", "xendit_payment_id", "payment_reminder_30_at", "payment_reminder_60_at", "payment_reminder_90_at") VALUES
	('f6296202-1a4d-45bc-a1ef-9c1d2d6fe5cc', 'ORD-20260221-9979', 'Keeee', 'khlacadin@devcon.ph', '9176358505', 'Minihor, Manuto, Quezon, Bukidnon, Northern Mindanao', 'paid', 'gcash', 400.00, 130.00, 6.00, NULL, '2026-02-21 14:06:05.501646+00', '2026-02-21 14:07:13.534091+00', NULL, NULL, NULL, NULL, 'a1223433-97cc-403e-8aa6-5ba3f8ae8c26', 'a1223431-b25c-43ed-b73a-a843321b811e', NULL, NULL, NULL),
	('43df90a4-c68a-4f01-b53f-daf727de8d37', 'ORD-20260221-6892', 'Jennifer Lopez', 'reveclothing214@gmail.com', '09554465207', 'Purok 2A, North Poblacion, Maramag Bukidnon, Philippines, North Poblacion, Maramag, Bukidnon, Northern Mindanao', 'paid', 'gcash', 400.00, 130.00, 6.00, NULL, '2026-02-21 14:55:08.771801+00', '2026-02-21 14:56:07.927915+00', NULL, NULL, NULL, NULL, 'a12245bf-0dcf-43a8-a944-436d69be908b', 'a12245bd-7f0e-4f47-9780-8ea92cfd3967', NULL, NULL, NULL),
	('b7e56bdd-6942-4752-9498-050c312ba61e', 'ORD-20260228-5546', 'BENJIE P. MATILDO', 'benjiematildo2025@gmail.com', '09638737329', 'Brgy.cagniog cassette subdivision p2, surigao city ,surigao del norte, Cagniog, City of Surigao, Surigao Del Norte, Caraga', 'failed', 'gcash', 400.00, 130.00, 530.00, NULL, '2026-02-28 00:32:26.347524+00', '2026-02-28 02:45:00.273446+00', NULL, NULL, NULL, NULL, NULL, 'a12f2618-bef5-4088-9e9c-6d1a3ce8882f', NULL, NULL, NULL),
	('43c86c7f-5b6a-4378-a3cf-7898ff3d557d', 'ORD-20260221-7551', 'Cris Virtucio', 'cvirtucio42@gmail.com', '09569646510', 'p4 santa cruz, Poblacion, City of Valencia, Bukidnon, Northern Mindanao', 'paid', 'maya', 350.00, 130.00, 5.00, NULL, '2026-02-21 16:08:47.742823+00', '2026-02-21 16:10:15.865764+00', NULL, NULL, NULL, NULL, 'a1226014-6179-45aa-8706-29d1027e0fc8', 'a1226013-5c67-49eb-a650-00e49f4d3082', NULL, NULL, NULL),
	('3653de13-20d6-4ada-8381-e81d7d282100', 'ORD-20260208-1499', 'Leoben Manayon', 'lemansmanayon@gmail.com', '9563961480', 'RER PHASE 1 BLOCK 5 ANASTACIO NERI ST. KAUSWAGAN, Kauswagan, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'gcash', 400.00, 130.00, 530.00, NULL, '2026-02-08 01:14:14.993612+00', '2026-02-09 07:34:21.5476+00', '8ad9fbe2-2db4-4db2-9ac1-de009e7b7a8e', NULL, NULL, NULL, NULL, 'pr-73ffc070-ca3d-448c-845e-f357a57db4d0', NULL, NULL, NULL),
	('1e19f465-9c99-45b9-a33f-fbac8d20f969', 'ORD-20260305-5354', 'Maricel Barde', 'maricelbarde@gmail.com', '09177153947', 'B12L14 CALLALILY ST PHASE 1, PINEWOOD SUBD. SAN JOSE MALAYBALAY CITU, San Jose, City of Malaybalay, Bukidnon, Northern Mindanao', 'shipped', 'gcash', 1050.00, 130.00, 1180.00, NULL, '2026-03-05 14:52:02.024358+00', '2026-03-09 09:50:13.406514+00', NULL, NULL, NULL, NULL, 'a13a6871-4e37-4eb0-8520-f2d4a853d121', 'a13a686e-c396-469e-8ec1-0e4280f17f83', NULL, NULL, NULL),
	('913af06b-db4a-49f5-aacf-96ef28491f7c', 'ORD-20260311-8083', 'Quincy Joquino', 'quincyjoquino@gmail.com', '+639692916568', 'Polomolok Fire Station, zenia street,poblacion, Poblacion, Polomolok, South Cotabato, SOCCSKSARGEN', 'shipped', 'gcash', 1300.00, 130.00, 1430.00, 'fast delivery please', '2026-03-11 12:11:21.832058+00', '2026-03-13 06:44:08.980823+00', NULL, NULL, NULL, NULL, 'a14640e4-7801-4761-864e-4f5f9f24edd5', 'a14640e1-842a-491b-99ac-cd98a5bb47a8', NULL, NULL, NULL),
	('19e98958-e714-4e9d-8d4d-53af483724ed', 'ORD-20260301-4185', 'Jennifer Batu', 'jennifer.acalista@gmail.com', '09260285575', 'Purok 4B, Aglayan, City of Malaybalay, Bukidnon, Northern Mindanao', 'shipped', 'gcash', 1000.00, 130.00, 1130.00, NULL, '2026-03-01 12:45:59.011812+00', '2026-03-03 06:28:14.192116+00', NULL, NULL, NULL, NULL, 'a1322f6b-f34b-4626-bab6-6c31a31a4762', 'a1322f6a-c863-4ef8-8834-7b6e480d7075', NULL, NULL, NULL),
	('518a08e4-7426-4b8a-88eb-7d4ca67b76df', 'ORD-20260224-4868', 'Erbie Joy Navarro', 'erbienavarro@gmail.com', '09955236013', 'P-1, Cabulohan, Cabanglasan, Bukidnon, Northern Mindanao', 'shipped', 'gcash', 700.00, 130.00, 830.00, NULL, '2026-02-24 00:44:54.500084+00', '2026-02-26 03:27:53.410916+00', NULL, NULL, NULL, '113263132', 'a1271eac-ab84-4bc0-a47b-087175ade9f7', 'a1271e9e-b4c0-491f-9142-6f5bd50fa59a', NULL, NULL, NULL),
	('cfa0c9be-a64c-435a-bf70-283a69635c12', 'ORD-20260206-8828', 'Mark Jade Acaso', 'acasomarkjade18@gmail.com', '09913738211', 'Davao Del Norte Electric Cooperative Inc. KM 100 National Highway, San Jose (Pob.), Montevista, Davao De Oro, Davao Region', 'shipped', 'gcash', 1700.00, 130.00, 1830.00, NULL, '2026-02-06 05:11:34.671513+00', '2026-02-07 05:45:46.787964+00', NULL, NULL, NULL, NULL, NULL, 'pr-0be518fe-0042-4e26-9535-7e6b8de5a315', NULL, NULL, NULL),
	('33a6cc6a-a364-4fa5-b314-49a4647dec2a', 'ORD-20260307-7176', 'Mohammad Bin Monir', 'binmonirdecampong@gmail.com', '9631419544', 'Blk 27 lot 8 vamenta subdivision. Barra, opol, Barra, Opol, Misamis Oriental, Northern Mindanao', 'shipped', 'cod', 400.00, 130.00, 530.00, NULL, '2026-03-07 20:48:36.68285+00', '2026-03-11 06:28:26.054439+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('84729017-a035-4ffa-9362-6dcf65bf8940', 'ORD-20260331-4619', 'Edgar Adarlo', 'indio_edz@gmail.com', '+639462111111', 'CT WAREHOUSE COMPLEX c/o HIJ DURIAN, Sinawal, City of General Santos, South Cotabato, SOCCSKSARGEN', 'shipped', 'cod', 700.00, 115.00, 815.00, NULL, '2026-03-31 06:23:05.033013+00', '2026-04-06 01:36:40.988752+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('778eb807-671f-49ef-8cea-619e7b2d9d8d', 'ORD-20260406-9004', 'Saints Santos', 'sjk274500@gmail.com', '09073852623', 'Poblacion 1 brgy ems barrio, Bgy. 2 - Em''s Barrio South (Pob.), City of Legazpi, Albay, Bicol Region', 'shipped', 'cod', 1100.00, 205.00, 1305.00, 'Singlet Female cut po yong tshir po male cut. Thankyou po', '2026-04-06 12:30:13.993936+00', '2026-04-07 08:21:52.855077+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('508f9c94-c594-49d5-b57c-360113c9e736', 'ORD-20260317-4212', 'Mark Jason C Mapalo', 'markjasonmapalo@gmail.com', '09554603847', 'Zone 3 Sugbongcogon, Tagoloan, Misamis Oriental, Sugbongcogon, Tagoloan, Misamis Oriental, Northern Mindanao', 'shipped', 'cod', 3800.00, 130.00, 3930.00, 'Lorenzo Shipping Corporation Sugbongcogon, Tagoloan, Misamis Oriental diri nalng palihog nga address e deliver salamat', '2026-03-17 07:10:38.446047+00', '2026-03-20 15:23:10.07272+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('f354db5a-2b1b-4444-990c-87b1785f7d6e', 'ORD-20260205-1071', 'Leslie Jean Legara ', 'legaralesliejean@gmail.com', '09096505464', 'Ideal vision Center , Limketkai Mall Brgy., Lapasan, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'for_verification', 'gcash', 800.00, 130.00, 930.00, 'Xendit Payment ID: undefined', '2026-02-05 06:38:59.051621+00', '2026-02-05 08:44:28.489156+00', NULL, NULL, NULL, NULL, '123', NULL, NULL, NULL, NULL),
	('2ab18f5a-a430-4f62-bdd7-5574b5e8ec22', 'ORD-20260207-9268', 'Leoben Manayon', 'lemansmanayon@gmail.com', '+639563961480', 'RER PHASE 1 BLOCK 5 ANASTACIO NERI ST. KAUSWAGAN, Kauswagan, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'gcash', 400.00, 130.00, 530.00, NULL, '2026-02-07 16:06:06.219005+00', '2026-02-09 07:34:24.541257+00', '8ad9fbe2-2db4-4db2-9ac1-de009e7b7a8e', NULL, NULL, NULL, NULL, 'pr-2b6965a6-c974-4f9c-9538-45de9c9e6937', NULL, NULL, NULL),
	('300af00f-7a25-4f5a-b365-63c131fb92c3', 'ORD-20260330-2303', 'Nicole Diaz', 'diaznicsz.12@gmail.com', '09622488452', 'atbang La Memoria, Barangay 10 (Pob.), City of Malaybalay, Bukidnon, Northern Mindanao', 'completed', 'cod', 350.00, 115.00, 465.00, NULL, '2026-03-30 06:51:07.590912+00', '2026-04-01 06:15:23.904947+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1e89fada-85fc-4f8f-b0cc-1a027c81f515', 'ORD-20260207-4729', 'Nicoli Briones', 'nicolibriones10@gmail.com', '09061523492', 'C/o Department of Labor and Employment-X Trinidad Bldg., Corrales Avenue, Barangay 29 (Pob.), City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'gcash', 350.00, 130.00, 480.00, NULL, '2026-02-07 14:05:15.250539+00', '2026-02-09 07:34:28.717224+00', NULL, NULL, NULL, NULL, NULL, 'pr-2d6761f1-ecbe-45cf-8f55-6a0207448a30', NULL, NULL, NULL),
	('59ece472-7497-441f-a3d6-1b6c7b87a992', 'ORD-20260406-7236', 'Jan Rantz Somcio', 'janrantzsomcio@gmail.com', '09069530204', '1 Azucena St., Carmen, CDO (Ortiz Store, atbang West City Central School), Carmen, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'gcash', 400.00, 115.00, 515.00, NULL, '2026-04-06 14:33:57.393551+00', '2026-04-07 08:21:48.505067+00', 'e059419e-b250-4a8f-88a4-b22db3ab9cc3', NULL, NULL, NULL, 'a17ac177-31b1-4f61-b659-e9f2714590ac', 'a17ac175-e4f9-478b-ba8e-8864e5aabf49', NULL, NULL, NULL),
	('246a9ef8-79ed-4b35-9714-c51f49cf5f35', 'ORD-20260401-2550', 'marivic Butal Lubang ', 'Lubangvic82@gmail.com', '09485717367', 'purok pag asa, Canlanipa, City of Surigao, Surigao Del Norte, Caraga', 'shipped', 'cod', 1050.00, 205.00, 1255.00, NULL, '2026-04-01 12:42:49.334014+00', '2026-04-07 08:22:00.797772+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('c6b6f8ed-13e6-458f-8c11-981a675dabe6', 'ORD-20260408-6068', 'Charlotte R. Jabagat', 'rodrigocharlotte@ymail.com', '+639209564772', 'P6 tces, Poblacion, Tubod, Lanao Del Norte, Northern Mindanao', 'failed', 'gcash', 2000.00, 230.00, 2230.00, NULL, '2026-04-08 14:39:43.675511+00', '2026-04-08 16:45:00.23027+00', NULL, NULL, NULL, NULL, NULL, 'a17ec97f-becc-4f58-b00b-fd044a0712a7', NULL, NULL, NULL),
	('10ed5803-dbb2-4fcf-a843-9a46cacbf852', 'ORD-20260425-2104', 'SHANTELLE SUE S REYES', 'suesanchezseyer@gmail.com', '09565678120', '117, Gomez Condeza Street, Barangay 14 (Pob.), City of Gingoog, Misamis Oriental, Northern Mindanao', 'preparing', 'cod', 1600.00, 180.00, 1818.00, 'TWO GREEN GATES, BESIDE A LIGHT POST, GREEN ROOF.', '2026-04-25 17:56:11.738864+00', '2026-04-30 00:53:33.56554+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('f28f46f3-2cde-45d1-9716-e547f241984f', 'ORD-20260206-6656', 'Aaron Roy Tagailo Munez', 'artmunez@gmail.com', '+639606258048', 'B12 L12 SUGARLAND SUBD PHASE 1, Lumbo, City of Valencia, Bukidnon, Northern Mindanao', 'failed', 'bank_transfer', 400.00, 130.00, 530.00, NULL, '2026-02-06 22:08:46.488114+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('6a75448a-41f1-4d18-8af1-c7bbad93d405', 'ORD-20260208-5547', 'Aicie Q Sarno', 'aiciesarno17@gmail.com', '9631440230', 'P2, Roxas, San Isidro, Surigao Del Norte, Caraga', 'failed', 'gcash', 400.00, 130.00, 530.00, 'Tapad sa Catholic Church', '2026-02-08 04:48:38.412605+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, 'pr-ebf1cb9a-76d6-4743-8c12-98d8e920f3df', NULL, NULL, NULL),
	('86cd2580-2faf-4182-94fc-465e8a72a460', 'ORD-20260211-5082', 'Jian valdez', 'jianvaldez14@gmail.com', '09650759799', 'Sugarland subdivision phase 1 lot 1 block 1, Lumbo, City of Valencia, Bukidnon, Northern Mindanao', 'failed', 'gcash', 800.00, 130.00, 930.00, NULL, '2026-02-11 06:21:19.032694+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, 'pr-c89f75fe-88a6-4a58-bf24-26da7fb8c4f3', NULL, NULL, NULL),
	('c2603d7c-16d3-4990-b697-a489c392a55a', 'ORD-20260212-5166', 'Mary Grace Sinining', 'grace.sinining22@gmail.com', '+639672261054', 'Ground Floor, Quattrain Bldg., Mcarthur Highway, Matina, Davao City, 8000, Matina Crossing, City of Davao, Davao Del Sur, Davao Region', 'failed', 'bank_transfer', 1500.00, 130.00, 1630.00, NULL, '2026-02-12 06:26:49.6089+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('5f930349-6a50-47bc-bd77-cb05a839cfc8', 'ORD-20260215-8700', 'Michael vern mabale', 'skalabern@gmail.com', '09923035094', 'Purok 4c baroy streey brgy lanao kidapawan city north cotabato, Lanao, City of Kidapawan, Cotabato, SOCCSKSARGEN', 'failed', 'bank_transfer', 1100.00, 130.00, 1230.00, NULL, '2026-02-15 16:59:39.358111+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('66321cbd-fa9f-48cb-baef-db3ff483299f', 'ORD-20260217-5902', 'BENJIE PAHIT MATILDO', 'benjiematildo88@gmail.com', '+639638737329', 'Brgy. Cagniog Sitio cayutan casetta village, Surigao City, Cagniog, City of Surigao, Surigao Del Norte, Caraga', 'failed', 'gcash', 800.00, 130.00, 930.00, NULL, '2026-02-17 05:13:45.628262+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, 'pr-70484f24-ef19-40d1-ab20-beb5b1858e86', NULL, NULL, NULL),
	('460b14f8-f829-48dc-96a1-79e2a5031e70', 'ORD-20260218-5125', 'Erbie Joy Navarro', 'erbietabz86@gmail.com', '9955236013', 'P-1, Cabulohan, Cabanglasan, Bukidnon, Northern Mindanao', 'failed', 'gcash', 700.00, 130.00, 830.00, NULL, '2026-02-18 23:49:50.138692+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, 'pr-5ae00022-5da8-422a-9854-25b24541d34c', NULL, NULL, NULL),
	('98e56a30-3229-4923-a499-8deb85bdef23', 'ORD-20260220-2912', 'Leslie Jean Legara ', 'legaralesliejean@gmail.com', '09096505464', 'Ideal vision Center , Limketkai Mall Brgy., Lapasan, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'failed', 'maya', 800.00, 130.00, 930.00, 'IDEAL VISION CENTER,  Limketkai Mall.  BRGY. LAPASAN CAGAYAN DE ORO CITY ', '2026-02-20 11:56:26.510258+00', '2026-02-21 13:00:00.141113+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('42d84332-7ce7-491a-b834-5167bf73df08', 'ORD-20260221-9919', 'ever lopez', 'reveclothing214@gmail.com', '09554465207', 'purok 2a north pobalacion, North Poblacion, Maramag, Bukidnon, Northern Mindanao', 'failed', 'gcash', 350.00, 130.00, 480.00, NULL, '2026-02-21 14:38:15.065493+00', '2026-02-21 16:45:00.166512+00', NULL, NULL, NULL, NULL, NULL, 'a1223fb1-ca10-421b-b4ca-0e80bb8fb8e3', NULL, NULL, NULL),
	('f61d879a-2b3d-4036-94f1-bc45fb74abdf', 'ORD-20260221-0478', 'cris virtucio', 'cvirtucio42@gmail.com', '09569646510', 'purok 4 santa cruz Virtucio Junkshop, Poblacion, City of Valencia, Bukidnon, Northern Mindanao', 'failed', 'maya', 350.00, 130.00, 480.00, NULL, '2026-02-21 16:06:34.178617+00', '2026-02-21 18:15:00.201486+00', NULL, NULL, NULL, NULL, NULL, 'a1225f47-b3b0-4f2a-a8b9-859bb63c4e0d', NULL, NULL, NULL),
	('67b31e37-026a-4203-9a4c-31e600f6723e', 'ORD-20260228-9367', 'JENALD JAMES JIMENEZ HERNANDEZ', 'jhernandez@cmc.edu.ph', '+639912510381', 'Old Pc Barracks Kidapawan city, Sudapin, City of Kidapawan, Cotabato, SOCCSKSARGEN', 'shipped', 'gcash', 1050.00, 130.00, 970.00, NULL, '2026-02-28 14:43:20.368488+00', '2026-03-03 06:28:17.161818+00', NULL, NULL, NULL, NULL, 'a1305668-bdcf-41f3-b782-54684a6f9ade', 'a1305667-2860-4420-a109-efdbbf5ee0b6', NULL, NULL, NULL),
	('5bcfbeb1-c35c-48c3-95d5-43af4f8696b9', 'ORD-20260224-5462', 'Erbie Joy Navarro', 'erbienavarro@gmail.com', '09955236013', 'P-1, Cabulohan, Cabanglasan, Bukidnon, Northern Mindanao', 'failed', 'gcash', 700.00, 130.00, 830.00, NULL, '2026-02-24 00:11:15.714191+00', '2026-02-24 02:15:00.251288+00', NULL, NULL, NULL, NULL, NULL, 'a1271296-7bc3-401e-90e1-9fa4f99fda1d', NULL, NULL, NULL),
	('084083bf-44c2-40e3-b4d9-646856b6e53e', 'ORD-20260225-3857', 'ker', 'bd@haturiko.tech', '9359830397', 'sd, Sinaysayan, Kitaotao, Bukidnon, Northern Mindanao', 'failed', 'gcash', 400.00, 130.00, 134.00, NULL, '2026-02-25 16:53:49.076066+00', '2026-02-25 19:00:00.277349+00', NULL, NULL, NULL, NULL, NULL, 'a12a7c1d-3ac9-41b8-8a2b-c573ae916372', NULL, NULL, NULL),
	('b63f26a6-b388-4c04-acc8-76305f38dd19', 'ORD-20260307-1755', 'keren happuch', 'khlacadin@gmail.com', '9359830397', 'df, Manuto, Quezon, Bukidnon, Northern Mindanao', 'new', 'cod', 350.00, 130.00, 480.00, NULL, '2026-03-07 04:06:28.853897+00', '2026-03-07 04:06:28.853897+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('eee25e6c-4c3c-4e05-b648-28d3c4349b9f', 'ORD-20260302-5772', 'Reyniel Lilawan Baluca', 'janbebercbaluca@gmail.com', '9938446686', 'Purok 6 Mibantang Quezon Bukidnon, Mibantang, Quezon, Bukidnon, Northern Mindanao', 'failed', 'gcash', 700.00, 130.00, 830.00, 'Baluca street ra ', '2026-03-02 10:07:26.642164+00', '2026-03-02 12:15:00.261126+00', NULL, NULL, NULL, NULL, NULL, 'a133f9b4-0273-4fb6-a519-1015d2865885', NULL, NULL, NULL),
	('bddaeb87-5f06-4da1-ba03-adc766c89060', 'ORD-20260328-9920', 'keren happuch', 'khlacadin@gmail.com', '9359830397', 'blgy 1b, Manuto, Quezon, Bukidnon, Northern Mindanao', 'paid', 'gcash', 350.00, 130.00, 134.00, NULL, '2026-03-28 14:11:44.698759+00', '2026-03-28 14:16:22.314139+00', NULL, NULL, NULL, NULL, 'a1689eaa-6caf-4844-895d-80111e4ea971', 'a1689ea8-d228-46e9-bf68-3fe7b3f1d616', NULL, NULL, NULL),
	('c1e74578-4fe2-4980-b372-0ad47011571b', 'ORD-20260330-6438', 'Quennie Belle Quilog', 'quenniequilog@gmail.com', '+639089849598', 'Blok6 lot10, VLTE BACAYAN CEBU CITY, Bacayan, City of Cebu, Cebu, Central Visayas', 'shipped', 'cod', 700.00, 115.00, 815.00, NULL, '2026-03-30 08:33:11.226265+00', '2026-04-06 01:36:45.55605+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('f2f799cb-5261-49e0-b66e-29041147db24', 'ORD-20260309-8773', 'LESLIE JOY BEDA', 'bunolesliejoy19@gmail.com', '+639632322732', 'FS DE LEON PAWNSHOP PUBLIC MARKET POBLACION MATALAM NORTH COTABATO, Poblacion, Matalam, Cotabato, SOCCSKSARGEN', 'shipped', 'gcash', 1800.00, 130.00, 1930.00, NULL, '2026-03-09 04:13:22.243107+00', '2026-03-11 02:17:59.318085+00', NULL, NULL, NULL, NULL, 'a1418ff9-8b92-420f-86f6-0472492a8170', 'a1418ff7-a350-4ea3-80b5-b1b199fc0067', NULL, NULL, NULL),
	('640ed446-e495-44ef-9bc8-e0171285c453', 'ORD-20260307-3819', 'Eric John Denosta', 'ericdenosta@gmail.com', '09070995062', '230 Diamond St. PEHA, Vicente Hizon Sr., City of Davao, Davao Del Sur, Davao Region', 'shipped', 'cod', 400.00, 130.00, 530.00, NULL, '2026-03-07 14:09:16.100613+00', '2026-03-11 06:28:31.349815+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('11129f5a-315c-467e-bc8e-539b4daea16e', 'ORD-20260315-2045', 'Carl Cymer C. Villasor', 'cvillasor372@gmail.com', '09639682563', 'Kayaga, Acacia Soft drinks trading, infront of mahad school, Kayaga, Kabacan, Cotabato, SOCCSKSARGEN', 'shipped', 'cod', 350.00, 130.00, 480.00, 'acacia soft drinks  trading, infront of mahad church', '2026-03-15 11:31:27.534062+00', '2026-03-17 14:46:55.642495+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('2525c940-1d23-4850-ae9c-349bdad9c067', 'ORD-20260331-7532', 'HANNAH DAVE Caballero', 'hannahomambac@gmail.com', '09538933368', 'Toril, Crossing Bayabas, City of Davao, Davao Del Sur, Davao Region', 'cancelled', 'cod', 350.00, 115.00, 465.00, 'BF Industries Toril Davao City near crossing traffic light', '2026-03-31 08:32:18.033115+00', '2026-04-06 01:37:04.980364+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('5d240864-c397-49d3-b870-84605a36db7f', 'ORD-20260405-0090', 'Rex mahunyag', 'mahunyagrex@gmail.com', '09366121438', 'Zone 2 upper baikingon iponan, Baikingon, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'cod', 400.00, 115.00, 515.00, 'Zone2 baikingon, Naay tindahan na dako capuy store tawag dayun ug nanaka para mo gawas ko.', '2026-04-05 13:18:26.408786+00', '2026-04-07 08:21:57.657371+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('bf916ed4-60d0-4c3b-92ff-a9a4bf9dd4e6', 'ORD-20260426-9092', 'Lovella Carino', 'lovellavenus@icloud.com', '9178925212', 'Prk1A Katidtuan Kabacan North Cotabato 9407, Katidtuan, Kabacan, Cotabato, SOCCSKSARGEN', 'shipped', 'cod', 1950.00, 180.00, 2168.00, NULL, '2026-04-26 04:36:28.050039+00', '2026-04-29 02:12:44.375915+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('3501ba5d-227f-4903-b718-1a6e9e354ede', 'ORD-20260409-0179', 'Charlotte R. Jabagat', 'rodrigocharlotte@ymail.com', '+639209564772', 'P6 TCES, Poblacion, Tubod, Lanao Del Norte, Northern Mindanao', 'shipped', 'gcash', 2000.00, 230.00, 2230.00, NULL, '2026-04-09 03:55:31.977236+00', '2026-04-16 01:23:46.014329+00', NULL, NULL, NULL, NULL, 'a17fe61e-a3eb-4d7b-8d08-2e03e73047b7', 'a17fe619-f6bd-48e2-bdff-da1ed3eabc27', NULL, NULL, NULL),
	('48b42a4f-cffc-4e06-b588-6d44ef3adde8', 'ORD-20260407-8598', 'Caumban Julyette ', 'julycaumban@gmail.com', '09982064297', 'Purok 5 Central Barangay Hall, Poblacion, Kalilangan, Bukidnon, Northern Mindanao', 'shipped', 'cod', 750.00, 115.00, 865.00, NULL, '2026-04-07 11:53:16.531079+00', '2026-04-16 01:23:54.847557+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('c6fadf37-9242-40c5-bf9c-b3ad88564a75', 'ORD-20260421-8680', 'Jan Rantz Somcio', 'janrantzsomcio@gmail.com', '09069530204', 'Ilaya, Carmen, Ortiz Store atbang West City Central School, Carmen, City of Cagayan De Oro, Misamis Oriental, Northern Mindanao', 'shipped', 'gcash', 2400.00, 250.00, 2650.00, 'Same tela and mesh sa snake skin pls, large tanan. Salamat', '2026-04-21 07:56:22.895122+00', '2026-04-27 03:03:03.315837+00', 'e059419e-b250-4a8f-88a4-b22db3ab9cc3', NULL, NULL, NULL, 'a198600e-b22c-4d20-b3df-d49178c65afb', 'a198600b-64bd-4f0d-b7bd-924ba368b21a', NULL, NULL, NULL),
	('269fdbb6-d4b6-4614-8938-c73beecdcaf2', 'ORD-20260420-8948', 'Raizzah Mel Matutes', 'mel.raizzah@gmail.com', '09173004211', 'Zone 2 (Dalan kilid sa The Garden Hotel), Barangay 1 (Pob.), City of Malaybalay, Bukidnon, Northern Mindanao', 'shipped', 'cod', 400.00, 130.00, 530.00, NULL, '2026-04-20 12:24:43.815599+00', '2026-04-27 03:03:06.22596+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('7ce56de5-c0ca-41fc-8124-4b2bd24d192c', 'ORD-20260429-9736', 'Romnick dela peña ', 'delapenaromnick19@gmail.com', '09198695656', 'P2 lower bucac, Bucac, City of Bayugan, Agusan Del Sur, Caraga', 'shipped', 'cod', 350.00, 130.00, 518.00, NULL, '2026-04-29 04:07:32.547395+00', '2026-05-02 02:09:27.858487+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('2b381593-dd28-44dc-8a70-2127e3131c32', 'ORD-20260430-9134', 'Jasper James Zapanta', 'jasper.tonix@gmail.com', '09050377687', 'Purok 4, Casisang, Casisang, City of Malaybalay, Bukidnon, Northern Mindanao', 'preparing', 'cod', 1500.00, 180.00, 1718.00, NULL, '2026-04-30 05:18:27.170619+00', '2026-05-01 02:20:17.969471+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('5edfda18-6094-4c29-b395-b308fada1b32', 'ORD-20260502-9705', 'HARREL WILLIAM MORING', 'harrelmoring@gmail.com', '+639559558297', 'PUROK 5, PUERTO SAYRE HI-WAY (QUARINTINAS), Alae, Manolo Fortich, Bukidnon, Northern Mindanao', 'failed', 'gcash', 2750.00, 250.00, 3038.00, 'LIKOD SA QUARINTINAS AMONG BALAY', '2026-05-02 04:14:11.163602+00', '2026-05-02 06:15:00.186092+00', NULL, NULL, NULL, NULL, NULL, 'a1ae3166-95d7-45ba-9a45-50265f74062f', NULL, NULL, NULL),
	('ebb1b66c-1f4b-4582-af72-b4a6f1ba1803', 'ORD-20260505-9387', 'keren happuch', 'khlacadin@gmail.com', '9359830397', 'Imported historical order', 'new', 'cod', 350.00, 130.00, 518.00, 'Imported from previous sales export dated 2026-05-05.', '2026-05-05 17:50:01.83+00', '2026-05-05 17:50:01.83+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_items" ("id", "order_id", "product_id", "product_name", "product_sku", "quantity", "unit_price", "total_price", "created_at", "size") VALUES
	('95e451c6-b9f2-486e-b24e-ec0ab0c298f7', '5bcfbeb1-c35c-48c3-95d5-43af4f8696b9', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'Peach', 'SING-PCH--S', 1, 350.00, 350.00, '2026-02-24 00:11:15.976362+00', 'S'),
	('c9153d5a-bef7-47e4-a591-2c7516972ca7', '5bcfbeb1-c35c-48c3-95d5-43af4f8696b9', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'Pink Floral 2', 'SING-PNKF2--S', 1, 350.00, 350.00, '2026-02-24 00:11:15.976362+00', 'S'),
	('04ec1097-a125-4f93-ac27-fff2a4090cde', '518a08e4-7426-4b8a-88eb-7d4ca67b76df', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'Pink Floral 2', 'SING-PNKF2--S', 1, 350.00, 350.00, '2026-02-24 00:44:54.633194+00', 'S'),
	('d3dc4cc2-e177-4ce5-875d-76aecd17199e', '518a08e4-7426-4b8a-88eb-7d4ca67b76df', '1e4d1968-6ac3-472b-b664-85505e185097', 'Mandala Pink', 'SING-MNDLP--S', 1, 350.00, 350.00, '2026-02-24 00:44:54.633194+00', 'S'),
	('03b1e353-f7f6-487b-933d-7c71ef27ad16', '084083bf-44c2-40e3-b4d9-646856b6e53e', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'SNAKE SKIN', 'SHRT-SKN', 1, 400.00, 400.00, '2026-02-25 16:53:49.216347+00', 'L'),
	('319accdd-8cc1-4294-b312-f0160233ab8b', 'b7e56bdd-6942-4752-9498-050c312ba61e', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 1, 400.00, 400.00, '2026-02-28 00:32:26.476679+00', 'L'),
	('9af2021a-ec80-44e5-8b4a-6bad19374d5f', '67b31e37-026a-4203-9a4c-31e600f6723e', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'Denim', 'SING-DNM--S', 1, 350.00, 350.00, '2026-02-28 14:43:20.507112+00', 'S'),
	('a9ed5c84-b377-4094-af5a-545d8def505a', '67b31e37-026a-4203-9a4c-31e600f6723e', '77df9eb6-54f2-4b41-ac29-8c301d0fb2c6', 'VIBRANT', 'SING-VIBR', 1, 350.00, 350.00, '2026-02-28 14:43:20.507112+00', 'S'),
	('3627c380-75c4-4db2-b81f-ae33a5a60c0f', '67b31e37-026a-4203-9a4c-31e600f6723e', 'd004d4c5-03bc-4ccc-ace7-e5baa5493b2a', 'Punk', 'SING-PUNK--XS', 1, 350.00, 350.00, '2026-02-28 14:43:20.507112+00', 'XS'),
	('a41e9ef7-1e8d-440e-b197-a7debbb17867', '19e98958-e714-4e9d-8d4d-53af483724ed', 'def2e56d-9e90-41e8-ad11-6152ea413802', 'COLORD SPLASH', 'SHIRT-SPSH', 1, 400.00, 400.00, '2026-03-01 12:45:59.125857+00', 'XL'),
	('8b234987-1e7d-4d23-bf01-04f92bdc3063', '19e98958-e714-4e9d-8d4d-53af483724ed', 'd0121800-4083-49d2-983f-d12923831853', 'Black', 'LSLV-BLK--XL', 1, 600.00, 600.00, '2026-03-01 12:45:59.125857+00', 'XL'),
	('8a217a75-8a35-41df-9f13-3f4c3a3bcbbf', 'eee25e6c-4c3c-4e05-b648-28d3c4349b9f', '30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'SING-FAITH--S', 1, 350.00, 350.00, '2026-03-02 10:07:26.857362+00', 'S'),
	('ecf166ec-a69f-4939-9655-7937dd184114', 'eee25e6c-4c3c-4e05-b648-28d3c4349b9f', '4d5a4b55-2e2f-4605-b0f7-416a75956c72', 'ALIVE', 'SING-ALV', 1, 350.00, 350.00, '2026-03-02 10:07:26.857362+00', 'S'),
	('eeed9936-c67c-4ff0-b2fe-5f8569845417', '1e19f465-9c99-45b9-a33f-fbac8d20f969', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'FOREST PINK', 'SING-PNK', 1, 350.00, 350.00, '2026-03-05 14:52:02.13676+00', 'XS'),
	('bfc5e8ca-6165-4efb-b2f7-7d722f87a46a', '1e19f465-9c99-45b9-a33f-fbac8d20f969', '3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'SING-PNKW', 1, 350.00, 350.00, '2026-03-05 14:52:02.13676+00', 'XS'),
	('6d43f88b-4eac-4454-8da0-45f41efcb65f', '1e19f465-9c99-45b9-a33f-fbac8d20f969', '221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'SING-TLB--S', 1, 350.00, 350.00, '2026-03-05 14:52:02.13676+00', 'S'),
	('2b8bc6b7-c073-4776-a89c-e094f91175ad', 'b63f26a6-b388-4c04-acc8-76305f38dd19', '3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'SING-PNKW', 1, 350.00, 350.00, '2026-03-07 04:06:29.003374+00', 'M'),
	('a8ac8f22-be48-4596-8964-dbfddfc470f1', '640ed446-e495-44ef-9bc8-e0171285c453', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--XL', 1, 400.00, 400.00, '2026-03-07 14:09:16.262748+00', 'XL'),
	('5db7d8c0-d2b8-4400-ac0c-fdeae66f1118', '33a6cc6a-a364-4fa5-b314-49a4647dec2a', '34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'SHRT-KRU--S', 1, 400.00, 400.00, '2026-03-07 20:48:36.822028+00', 'S'),
	('c56dc750-e7cb-437e-a5ff-0a0c4a802a30', 'f2f799cb-5261-49e0-b66e-29041147db24', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'SING-WAVE', 1, 350.00, 350.00, '2026-03-09 04:13:22.427862+00', 'S'),
	('e5f95739-9e84-4fa0-affe-63741a9cca19', 'f2f799cb-5261-49e0-b66e-29041147db24', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'FOREST PINK', 'SING-PNK', 1, 350.00, 350.00, '2026-03-09 04:13:22.427862+00', 'S'),
	('2107cf81-7a75-4277-a8f4-70b7e7b531aa', 'f2f799cb-5261-49e0-b66e-29041147db24', '1881793e-cf72-40a3-ae1a-cf420847cdb7', 'RAINBOW', 'SING-RNDB', 1, 350.00, 350.00, '2026-03-09 04:13:22.427862+00', 'S'),
	('1586ac74-3e3d-4d4b-bec6-d433e66f9869', 'f2f799cb-5261-49e0-b66e-29041147db24', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'Mandala Pink', 'SHRT-MNPNK--M', 1, 400.00, 400.00, '2026-03-09 04:13:22.427862+00', 'M'),
	('b9745993-6fdf-4132-b131-15dd56773884', 'f2f799cb-5261-49e0-b66e-29041147db24', '3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'SING-PNKW', 1, 350.00, 350.00, '2026-03-09 04:13:22.427862+00', 'M'),
	('d2ce09f2-fbde-4832-93e4-506e24e4c4c5', '913af06b-db4a-49f5-aacf-96ef28491f7c', '57366eb0-b882-4e35-9586-cc157cdebfc0', 'Tribal Grey', 'LSLV-TRBG--M', 1, 600.00, 600.00, '2026-03-11 12:11:22.017461+00', 'M'),
	('e2ea4460-034f-408d-81a6-a9382063ded8', '913af06b-db4a-49f5-aacf-96ef28491f7c', 'abb3b3d6-4dc4-453a-b592-6c11288a1d3d', 'Black Tribal', 'SING-BLKTRB--M', 1, 350.00, 350.00, '2026-03-11 12:11:22.017461+00', 'M'),
	('72c8a06e-a719-48fa-8d62-2f9f10ea8cfa', '913af06b-db4a-49f5-aacf-96ef28491f7c', '1f9c9bac-5359-4851-a8d9-c1362dd7c7f8', 'GHOST', 'SING-GHST', 1, 350.00, 350.00, '2026-03-11 12:11:22.017461+00', 'M'),
	('072f63c5-1f55-4156-9b14-72a4eb249b28', '11129f5a-315c-467e-bc8e-539b4daea16e', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'SING-WAVE', 1, 350.00, 350.00, '2026-03-15 11:31:27.865188+00', 'S'),
	('4f33af21-f764-472f-90a3-f80aae299469', 'f354db5a-2b1b-4444-990c-87b1785f7d6e', '34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'SHRT-KRU--M', 1, 400.00, 400.00, '2026-02-05 06:38:59.240017+00', 'M'),
	('7ccf3c7f-8ff0-419c-9a2a-edacc4dcd947', 'f354db5a-2b1b-4444-990c-87b1785f7d6e', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--M', 1, 400.00, 400.00, '2026-02-05 06:38:59.240017+00', 'M'),
	('00c61d3d-4d56-4ccd-b82e-84d228b63c10', 'cfa0c9be-a64c-435a-bf70-283a69635c12', '7ad81be1-fa3a-4a9d-a2e2-7b90607179bc', 'Punk', 'SHRT-PUNK--L', 1, 400.00, 400.00, '2026-02-06 05:11:34.859126+00', 'L'),
	('4e3c3697-b5fd-494d-b88f-045aeae25ca2', 'cfa0c9be-a64c-435a-bf70-283a69635c12', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--L', 1, 400.00, 400.00, '2026-02-06 05:11:34.859126+00', 'L'),
	('ad8cb872-d95d-4d94-99dd-298c68a29309', 'cfa0c9be-a64c-435a-bf70-283a69635c12', '1f300cc8-58a6-415a-b89e-337d77423e63', 'Black', 'SHORT-BLK--M', 1, 900.00, 900.00, '2026-02-06 05:11:34.859126+00', 'M'),
	('fd0edb4a-bfba-483d-9c28-af25c4010381', 'f28f46f3-2cde-45d1-9716-e547f241984f', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--2XL', 1, 400.00, 400.00, '2026-02-06 22:08:46.672982+00', '2XL'),
	('11f430ae-faf2-4bf1-a7a3-2ab9a88a4d22', '1e89fada-85fc-4f8f-b0cc-1a027c81f515', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'Denim', 'SING-DNM--S', 1, 350.00, 350.00, '2026-02-07 14:05:15.430853+00', 'S'),
	('ec0c42f4-fef2-42a4-a00e-a4d0525a67b1', '2ab18f5a-a430-4f62-bdd7-5574b5e8ec22', '34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'SHRT-KRU--XL', 1, 400.00, 400.00, '2026-02-07 16:06:06.366028+00', 'XL'),
	('67714783-b814-49fe-8d58-9b9c20ad81d7', '3653de13-20d6-4ada-8381-e81d7d282100', '34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'SHRT-KRU--XL', 1, 400.00, 400.00, '2026-02-08 01:14:15.281647+00', 'XL'),
	('b9b48314-0184-4721-936d-31e9c43ff1cc', '6a75448a-41f1-4d18-8af1-c7bbad93d405', '67f9b829-213a-4c80-93b5-7410bcf6870c', 'Pink Floral', 'SHRT-PNKF--XS', 1, 400.00, 400.00, '2026-02-08 04:48:38.531751+00', 'XS'),
	('f56406b6-17f9-442a-9ad8-d0a292f3640b', '86cd2580-2faf-4182-94fc-465e8a72a460', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--L', 1, 400.00, 400.00, '2026-02-11 06:21:19.17107+00', 'L'),
	('31f76a01-5367-49bb-ac04-b3f583757042', '86cd2580-2faf-4182-94fc-465e8a72a460', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 1, 400.00, 400.00, '2026-02-11 06:21:19.17107+00', 'L'),
	('d0215459-969e-4db8-a47f-8ace027e2861', 'c2603d7c-16d3-4990-b697-a489c392a55a', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'Black-Green', 'SING-BLKGR--XS', 1, 350.00, 350.00, '2026-02-12 06:26:49.797334+00', 'XS'),
	('35be62cd-2f1b-4934-ae33-e6110b20707f', 'c2603d7c-16d3-4990-b697-a489c392a55a', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'Yin & Yang', 'SHRT-YY--S', 1, 400.00, 400.00, '2026-02-12 06:26:49.797334+00', 'S'),
	('72ac4ba7-deaa-44f7-a6c8-02c8c50431ac', 'c2603d7c-16d3-4990-b697-a489c392a55a', 'b03ba3a6-b371-4ffb-86f2-65cdf0adf54c', 'Yin & Yang', 'SHRT-YY--M', 1, 400.00, 400.00, '2026-02-12 06:26:49.797334+00', 'M'),
	('7ef443c4-15f0-42c1-a007-21e2a75f5208', 'c2603d7c-16d3-4990-b697-a489c392a55a', '734b2aee-fbf2-41ed-b2da-caf0f5056c10', 'Crush Colored', 'SING-CRSHC--XS', 1, 350.00, 350.00, '2026-02-12 06:26:49.797334+00', 'XS'),
	('7454232d-c485-4aff-88c6-ba13c1b88fc7', '5f930349-6a50-47bc-bd77-cb05a839cfc8', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'Black-Green', 'SING-BLKGR--L', 1, 350.00, 350.00, '2026-02-15 16:59:39.513775+00', 'L'),
	('0ddb9894-abc3-44f2-93d7-0ef7eee43df0', '5f930349-6a50-47bc-bd77-cb05a839cfc8', 'eb31ecc3-a65b-46d7-9c3d-263be0d93d3e', 'Denim', 'SING-DNM--L', 1, 350.00, 350.00, '2026-02-15 16:59:39.513775+00', 'L'),
	('51a4fa4a-ac58-44e3-b0bf-97727759ffb2', '5f930349-6a50-47bc-bd77-cb05a839cfc8', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--L', 1, 400.00, 400.00, '2026-02-15 16:59:39.513775+00', 'L'),
	('c8fcfd11-7949-4206-8926-1a50969cd82e', '66321cbd-fa9f-48cb-baef-db3ff483299f', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--L', 1, 400.00, 400.00, '2026-02-17 05:13:45.814886+00', 'L'),
	('55d38383-6d69-42ac-bb02-8c2ac0de2b1e', '66321cbd-fa9f-48cb-baef-db3ff483299f', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 1, 400.00, 400.00, '2026-02-17 05:13:45.814886+00', 'L'),
	('7d044f18-8e9b-414e-b29e-9b45d4b2d70e', '460b14f8-f829-48dc-96a1-79e2a5031e70', 'baff0d53-2b11-4e09-adb3-f5e64b8555b4', 'Black-Green', 'SING-BLKGR--S', 1, 350.00, 350.00, '2026-02-18 23:49:50.255088+00', 'S'),
	('e1c4a4a7-e1be-4c2e-8282-d602a871660f', '460b14f8-f829-48dc-96a1-79e2a5031e70', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'Pink Floral 2', 'SING-PNKF2--S', 1, 350.00, 350.00, '2026-02-18 23:49:50.255088+00', 'S'),
	('d41fd875-616c-492f-bf86-07ab74243162', '98e56a30-3229-4923-a499-8deb85bdef23', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--S', 1, 400.00, 400.00, '2026-02-20 11:56:26.703294+00', 'S'),
	('a4bb1387-5aad-475b-9a61-0518154f1636', '98e56a30-3229-4923-a499-8deb85bdef23', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'Peach', 'SHRT-PCH--S', 1, 400.00, 400.00, '2026-02-20 11:56:26.703294+00', 'S'),
	('94cad876-c5e0-481f-b355-674e94e8d15a', 'f6296202-1a4d-45bc-a1ef-9c1d2d6fe5cc', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--M', 1, 400.00, 400.00, '2026-02-21 14:06:05.685943+00', 'M'),
	('790c40ed-9b9d-4155-969f-21b7957480f1', '42d84332-7ce7-491a-b834-5167bf73df08', 'f6a0106a-4184-414d-be24-db5de0d820d0', 'Pink Floral 2', 'SING-PNKF2--XL', 1, 350.00, 350.00, '2026-02-21 14:38:15.254958+00', 'XL'),
	('dc32322b-60fd-4ae6-a1c3-09f3f0625488', '43df90a4-c68a-4f01-b53f-daf727de8d37', 'cd59d39e-a9c6-432a-bc0e-7800465b9d57', 'SHINOBU KOCHO', 'SHRT-BCRK--XL', 1, 400.00, 400.00, '2026-02-21 14:55:08.976649+00', 'XL'),
	('8fdedee7-f2d9-44ac-a069-b33a85e6f940', 'f61d879a-2b3d-4036-94f1-bc45fb74abdf', '30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'SING-FAITH--L', 1, 350.00, 350.00, '2026-02-21 16:06:34.350617+00', 'L'),
	('3874d4db-5348-4446-8529-398f7667f645', '43c86c7f-5b6a-4378-a3cf-7898ff3d557d', '30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'SING-FAITH--L', 1, 350.00, 350.00, '2026-02-21 16:08:47.901147+00', 'L'),
	('4ce4472f-d682-44af-a826-d72ad2147dcd', '508f9c94-c594-49d5-b57c-360113c9e736', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 2, 400.00, 800.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('2d7690fa-9498-4c40-9ca7-57ad6a5e2960', '508f9c94-c594-49d5-b57c-360113c9e736', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'ALIVE', 'SHIRT-ALIVE', 1, 400.00, 400.00, '2026-03-17 07:10:38.629904+00', 'XL'),
	('5bb706f7-46a9-43e0-a1f1-79a26f7b36b8', '508f9c94-c594-49d5-b57c-360113c9e736', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'ALIVE', 'SHIRT-ALIVE', 1, 400.00, 400.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('da5faf16-0e59-452d-b175-86e5a2f1bb08', '508f9c94-c594-49d5-b57c-360113c9e736', '669e7455-7c63-4385-a1b1-762aca8ccdfb', 'Mandala Pink', 'SHRT-MNPNK--L', 1, 400.00, 400.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('720b455f-7183-463b-a91b-aec6a56a5dcd', '508f9c94-c594-49d5-b57c-360113c9e736', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'Orange', 'SHRT-ORNG--M', 1, 400.00, 400.00, '2026-03-17 07:10:38.629904+00', 'M'),
	('d5424e71-41e5-45a4-baf6-2c94ca4655ab', '508f9c94-c594-49d5-b57c-360113c9e736', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'FOREST GREEN', 'SING-FRST', 1, 350.00, 350.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('6c46fe55-7264-46a0-b2ac-2b0243ec457e', '508f9c94-c594-49d5-b57c-360113c9e736', 'ad01c859-f05d-4100-9054-d65a833a48e5', 'ABSTRACT BLUE', 'SING-ABST', 1, 350.00, 350.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('8b3ba26f-2b2d-41a2-88aa-3d3eadf3ed43', '508f9c94-c594-49d5-b57c-360113c9e736', '221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'SING-TLB--L', 1, 350.00, 350.00, '2026-03-17 07:10:38.629904+00', 'L'),
	('544ecea1-dfe0-4bdb-af7f-eb44aff5f6af', '508f9c94-c594-49d5-b57c-360113c9e736', '852f1ab6-e10d-431e-921e-862bb0b36df1', 'Peach', 'SING-PCH--M', 1, 350.00, 350.00, '2026-03-17 07:10:38.629904+00', 'M'),
	('a97c8719-f769-4c50-8560-e635dc8982b2', 'bddaeb87-5f06-4da1-ba03-adc766c89060', '3532981c-4b88-440a-975b-4f219067be86', 'PINK WAVE', 'SING-PNKW', 1, 350.00, 350.00, '2026-03-28 14:11:44.870931+00', 'L'),
	('1ac60ce7-aa7c-4344-bcf5-e059bc17e634', '300af00f-7a25-4f5a-b365-63c131fb92c3', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'BKDN INSPIRED', 'SING-BKDN', 1, 350.00, 350.00, '2026-03-30 06:51:07.773198+00', 'S'),
	('76c2b762-86a5-4c7f-9d01-b6cd383a789e', 'c1e74578-4fe2-4980-b372-0ad47011571b', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'SING-WAVE', 1, 350.00, 350.00, '2026-03-30 08:33:11.370972+00', 'XS'),
	('bb70e108-bed1-4c57-aac5-6fb281a414d5', 'c1e74578-4fe2-4980-b372-0ad47011571b', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'TRIBAL GRAY', 'SING-TRBL', 1, 350.00, 350.00, '2026-03-30 08:33:11.370972+00', 'S'),
	('cf4035a5-0021-4b10-a8d5-41ada8c93d10', '84729017-a035-4ffa-9362-6dcf65bf8940', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'STRIPES', 'SING-VLET', 1, 350.00, 350.00, '2026-03-31 06:23:05.219324+00', 'S'),
	('c00339ad-2b18-49a1-b16a-1e36350b39ff', '84729017-a035-4ffa-9362-6dcf65bf8940', '55475375-cb6f-45a1-a394-c8c4521caf73', 'PNK', 'SING-PINK', 1, 350.00, 350.00, '2026-03-31 06:23:05.219324+00', 'S'),
	('cc9461ce-f924-4451-b124-7d22d2285124', '2525c940-1d23-4850-ae9c-349bdad9c067', '55475375-cb6f-45a1-a394-c8c4521caf73', 'PNK', 'SING-PINK', 1, 350.00, 350.00, '2026-03-31 08:32:18.21901+00', 'XS'),
	('35cf9077-fc6e-4f64-a1fd-0f0a3c6a098d', '246a9ef8-79ed-4b35-9714-c51f49cf5f35', '01e1ba4d-c149-48a3-8b70-ecd47908631a', 'BKDN INSPIRED', 'SING-BKDN', 1, 350.00, 350.00, '2026-04-01 12:42:49.463009+00', 'XS'),
	('30cfe2eb-d46c-4553-9ba1-95eb317e8b06', '246a9ef8-79ed-4b35-9714-c51f49cf5f35', '221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'SING-TLB--XS', 1, 350.00, 350.00, '2026-04-01 12:42:49.463009+00', 'XS'),
	('7e1766c2-8da1-48da-832d-c5bd90785a8f', '246a9ef8-79ed-4b35-9714-c51f49cf5f35', 'a1ea6f27-0e38-4c8b-99cb-c7a9225a555b', 'RUN WILD', 'SING-WILD', 1, 350.00, 350.00, '2026-04-01 12:42:49.463009+00', 'XS'),
	('c9a6e7af-7bc5-427a-8aa0-cab44d7eabec', '5d240864-c397-49d3-b870-84605a36db7f', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--XL', 1, 400.00, 400.00, '2026-04-05 13:18:26.55172+00', 'XL'),
	('da6d2e9b-52c5-43c9-9fa6-46b96117e590', '778eb807-671f-49ef-8cea-619e7b2d9d8d', '55475375-cb6f-45a1-a394-c8c4521caf73', 'PNK', 'SING-PINK', 1, 350.00, 350.00, '2026-04-06 12:30:14.192236+00', 'XS'),
	('685db109-3940-4f6e-adff-73e765971b15', '778eb807-671f-49ef-8cea-619e7b2d9d8d', '86ecfb51-bfd9-484c-83fe-c1c14bc47840', 'STRIPES', 'SING-VLET', 1, 350.00, 350.00, '2026-04-06 12:30:14.192236+00', 'XS'),
	('a881f775-ba7b-424a-8745-665562859a63', '778eb807-671f-49ef-8cea-619e7b2d9d8d', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'Orange', 'SHRT-ORNG--S', 1, 400.00, 400.00, '2026-04-06 12:30:14.192236+00', 'S'),
	('ff77e358-2f25-4ab5-a826-edc6a9400ee0', '59ece472-7497-441f-a3d6-1b6c7b87a992', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'SNAKE SKIN', 'SHRT-SKN', 1, 400.00, 400.00, '2026-04-06 14:33:57.541141+00', 'M'),
	('b27e0730-1c4f-4a7e-a79b-79b4beb41d9f', '48b42a4f-cffc-4e06-b588-6d44ef3adde8', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'Orange', 'SHRT-ORNG--M', 1, 400.00, 400.00, '2026-04-07 11:53:16.64892+00', 'M'),
	('1d61c580-03c8-4b74-95fa-b5e7c8265ca4', '48b42a4f-cffc-4e06-b588-6d44ef3adde8', '221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'SING-TLB--L', 1, 350.00, 350.00, '2026-04-07 11:53:16.64892+00', 'L'),
	('fa4cc81b-d3ff-48d8-a331-19c0651c7cc8', 'c6b6f8ed-13e6-458f-8c11-981a675dabe6', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'Peach', 'SHRT-PCH--S', 1, 400.00, 400.00, '2026-04-08 14:39:43.88215+00', 'S'),
	('96f917f7-859d-4edd-b709-cb2f4506ff23', 'c6b6f8ed-13e6-458f-8c11-981a675dabe6', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'DARK DRAGON', 'SHRT-DRK', 1, 400.00, 400.00, '2026-04-08 14:39:43.88215+00', 'L'),
	('2493ea5e-9b56-438e-90f0-e9ec30e1a6c0', 'c6b6f8ed-13e6-458f-8c11-981a675dabe6', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 1, 400.00, 400.00, '2026-04-08 14:39:43.88215+00', 'L'),
	('f5c3bd96-6cf2-4b06-be05-814c7ae47e0c', 'c6b6f8ed-13e6-458f-8c11-981a675dabe6', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'BE YOUR OWN HERO', NULL, 1, 400.00, 400.00, '2026-04-08 14:39:43.88215+00', 'S'),
	('2dbe8b62-e2b2-48b3-b29c-011fb8d3bae9', 'c6b6f8ed-13e6-458f-8c11-981a675dabe6', 'cc0efa0d-de92-49e7-830c-b18612ca4f0d', 'Black', 'SHRT-BLK--M', 1, 400.00, 400.00, '2026-04-08 14:39:43.88215+00', 'M'),
	('b36d2745-bec7-4a36-970c-dfc77fc21962', '3501ba5d-227f-4903-b718-1a6e9e354ede', '227b9ec6-cb11-499c-b5f3-39379f3d113f', 'Peach', 'SHRT-PCH--S', 1, 400.00, 400.00, '2026-04-09 03:55:32.181686+00', 'S'),
	('29cff147-ff07-4dc5-83b3-b54dca4280c6', '3501ba5d-227f-4903-b718-1a6e9e354ede', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--L', 1, 400.00, 400.00, '2026-04-09 03:55:32.181686+00', 'L'),
	('2e9f8e61-8be5-4b57-9c64-956c41a4cb9f', '3501ba5d-227f-4903-b718-1a6e9e354ede', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'BE YOUR OWN HERO', NULL, 1, 400.00, 400.00, '2026-04-09 03:55:32.181686+00', 'S'),
	('eea885fd-0e99-49c8-928a-90bd0667488a', '3501ba5d-227f-4903-b718-1a6e9e354ede', '0b1614a3-1bb8-40ab-9d1a-428e86c3117b', 'BE YOUR OWN HERO', NULL, 1, 400.00, 400.00, '2026-04-09 03:55:32.181686+00', 'L'),
	('312781f9-89e5-4b0b-8fbc-fde1c7b82c5f', '3501ba5d-227f-4903-b718-1a6e9e354ede', '11bd1f67-643a-4b38-ae0c-e6f960f7361d', 'ABSTRACT BLUE', 'SHIRT-ABST', 1, 400.00, 400.00, '2026-04-09 03:55:32.181686+00', 'M'),
	('8689a568-20f9-4e6c-86cd-dc7b4aab7085', '269fdbb6-d4b6-4614-8938-c73beecdcaf2', 'a2a6d3c7-e49b-48e5-b3e7-fc8241a4f2ca', 'SHINOBU', 'SHRT-SHIN', 1, 400.00, 400.00, '2026-04-20 12:24:44.027432+00', 'S'),
	('75dacd9b-da02-4655-ab33-ed4f17705707', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', '9279c8a3-9b99-4dfc-ae2b-98129358a5c3', 'ANIMAL SKIN SHRT', 'SHRT-ANML', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('c9d70289-1ced-44fa-9115-e1ce46dbc780', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', 'b24c5751-02b0-47ad-a48e-8fbb546975e8', 'SNAKE SKIN', 'SHRT-SKN', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('df965ea5-2ba9-4cd4-b946-755b36f5d790', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', '8c0fd042-ffc7-48d0-a6c3-75fe42380021', 'PEACOCK SHIRT', 'SHRT-PCK', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('1f479067-8e9a-4945-98ed-7d4d7c0fa9e1', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', 'bc40af57-01d5-45ec-9b55-4e743600d31c', 'PINK PURPLE', 'SHRT-PNK', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('0efa5ebf-c4ff-4285-9ea7-3d34c5400659', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', '8968a92e-037f-4730-b29b-67286ae5f896', 'TRIBAL GRAY', 'TRIB-GRY', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('dc4f581d-9967-4e99-8313-319bae8f5e4a', 'c6fadf37-9242-40c5-bf9c-b3ad88564a75', '83ffc723-f8ce-47bb-be68-88c53e125afc', 'ORANGEEE SHIRT', 'SHRT-ORAN', 1, 400.00, 400.00, '2026-04-21 07:56:23.107855+00', 'L'),
	('ebdad5a1-b84a-4b7b-a535-2bdada2ab289', '10ed5803-dbb2-4fcf-a843-9a46cacbf852', '4f5cf915-c865-44b5-86ad-f4cfa5d51462', 'ALIVE', 'SHIRT-ALIVE', 1, 400.00, 400.00, '2026-04-25 17:56:11.92869+00', 'S'),
	('d57366e7-cbd7-4c16-8867-9a640431b2b8', '10ed5803-dbb2-4fcf-a843-9a46cacbf852', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'PURPLE', 'SHRT-PRPL', 1, 400.00, 400.00, '2026-04-25 17:56:11.92869+00', 'S'),
	('888fa83f-f831-4917-b03a-b52873f2e68c', '10ed5803-dbb2-4fcf-a843-9a46cacbf852', '889c26fa-83fd-4482-b97e-1ee55e98235d', 'Orange', 'SHRT-ORNG--S', 1, 400.00, 400.00, '2026-04-25 17:56:11.92869+00', 'S'),
	('4efccc10-05be-4b50-ba5d-12389d0e8cba', '10ed5803-dbb2-4fcf-a843-9a46cacbf852', 'c84bd099-6666-4934-86ca-d77e802b23fb', 'Healthy Living - Dirty Lifestyle', 'SHRT-HLDL--S', 1, 400.00, 400.00, '2026-04-25 17:56:11.92869+00', 'S'),
	('c12952d9-d3e8-479d-b907-9f0267ceb701', 'bf916ed4-60d0-4c3b-92ff-a9a4bf9dd4e6', '07d818b2-d717-4b49-b2db-ce3fba47276d', 'purple', 'prl-shrt', 1, 900.00, 900.00, '2026-04-26 04:36:28.160764+00', 'M'),
	('f993aa92-22a5-42e8-a206-86a7a422c0ba', 'bf916ed4-60d0-4c3b-92ff-a9a4bf9dd4e6', '56a0ca2e-bc0a-493a-abfc-6f8158929391', 'WHITE WAVE', 'SING-WAVE', 1, 350.00, 350.00, '2026-04-26 04:36:28.160764+00', 'M'),
	('2367843e-6eed-43fd-a4ee-a320c9a75e71', 'bf916ed4-60d0-4c3b-92ff-a9a4bf9dd4e6', 'a808e805-9e26-4a82-9ba9-7d73da37b192', 'FOREST PINK', 'SING-PNK', 1, 350.00, 350.00, '2026-04-26 04:36:28.160764+00', 'M'),
	('6143fd51-c62b-4078-8179-f46a4e010251', 'bf916ed4-60d0-4c3b-92ff-a9a4bf9dd4e6', '221b7626-6e30-421a-8950-165f7ce719dd', 'Teal Blue', 'SING-TLB--M', 1, 350.00, 350.00, '2026-04-26 04:36:28.160764+00', 'M'),
	('7d0cd60c-57d3-4baf-a38a-347161cf2699', '7ce56de5-c0ca-41fc-8124-4b2bd24d192c', '05846b33-27dc-4bce-825a-b9ddcb99f08b', 'FOREST GREEN', 'SING-FRST', 1, 350.00, 350.00, '2026-04-29 04:07:32.671767+00', 'S'),
	('37658762-9661-4ab4-9578-4c59e9b8fd86', '2b381593-dd28-44dc-8a70-2127e3131c32', 'fafba7aa-5791-4384-89af-52659b08281e', 'SHINOBU KOCHO', 'SING-SHIN', 1, 350.00, 350.00, '2026-04-30 05:18:27.309068+00', 'S'),
	('141fbff1-c3c5-4bb9-89ec-fb7059c3fcf6', '2b381593-dd28-44dc-8a70-2127e3131c32', '8968a92e-037f-4730-b29b-67286ae5f896', 'TRIBAL GRAY', 'TRIB-GRY', 1, 400.00, 400.00, '2026-04-30 05:18:27.309068+00', 'XL'),
	('23b0f10a-b65a-4cd4-b722-381651300bdd', '2b381593-dd28-44dc-8a70-2127e3131c32', 'a23cf6af-3ad6-4019-923d-8268c92c2df1', 'NBDY', 'SHRT-NBDY--XL', 1, 400.00, 400.00, '2026-04-30 05:18:27.309068+00', 'XL'),
	('67893f83-c890-4d0b-a6b6-62d03bbaf621', '2b381593-dd28-44dc-8a70-2127e3131c32', '7e9c5452-58a4-4c36-b4a3-9e6f521a9f6f', 'TRIBAL GRAY', 'SING-TRBL', 1, 350.00, 350.00, '2026-04-30 05:18:27.309068+00', 'S'),
	('aace48c4-abe8-42bb-b57d-0a6adabe18ab', '5edfda18-6094-4c29-b395-b308fada1b32', '34e32551-c73d-4b74-9714-be3957490408', 'Kru-Kru', 'SHRT-KRU--M', 1, 400.00, 400.00, '2026-05-02 04:14:11.269988+00', 'M'),
	('df08639a-a9b7-4455-be4c-969da8b895fe', '5edfda18-6094-4c29-b395-b308fada1b32', 'aecc2a54-e16f-4859-94c2-d2bfd77dbd9f', 'DARK DRAGON', 'SHRT-DRK', 1, 400.00, 400.00, '2026-05-02 04:14:11.269988+00', 'M'),
	('dc202ae1-bc03-4676-b269-b8365c5d307a', '5edfda18-6094-4c29-b395-b308fada1b32', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'PURPLE', 'SHRT-PRPL', 2, 400.00, 800.00, '2026-05-02 04:14:11.269988+00', 'XS'),
	('65dcd265-94ac-4be9-862f-e04efbff2865', '5edfda18-6094-4c29-b395-b308fada1b32', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'PURPLE', 'SHRT-PRPL', 1, 400.00, 400.00, '2026-05-02 04:14:11.269988+00', 'S'),
	('d450b03d-b9f1-4270-8f85-aceaef304617', '5edfda18-6094-4c29-b395-b308fada1b32', 'cccf3c5f-7f59-44b6-bd44-a78b21912875', 'PURPLE', 'SHRT-PRPL', 1, 400.00, 400.00, '2026-05-02 04:14:11.269988+00', 'M'),
	('f90e125a-d2b7-42b3-8776-44b59c8107e7', '5edfda18-6094-4c29-b395-b308fada1b32', '30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'SING-FAITH--M', 1, 350.00, 350.00, '2026-05-02 04:14:11.269988+00', 'M'),
	('54b9d9b5-fd8d-45a0-a099-74ba50b46119', 'ebb1b66c-1f4b-4582-af72-b4a6f1ba1803', '30101446-ef8a-4d32-bfd9-a5792188e943', 'Faith Over Fear', 'SING-FAITH--M', 1, 350.00, 350.00, '2026-05-05 17:50:01.83+00', 'M');


--
-- Data for Name: order_rate_limits; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_rate_limits" ("id", "ip_address", "customer_email", "created_at") VALUES
	('6a027267-2f38-49bc-9537-41cbb4962930', '206.62.40.102', 'harrelmoring@gmail.com', '2026-05-02 04:14:11.052371+00'),
	('9ba7a406-f9df-41e8-b2a6-b77c6f074677', '143.44.193.58', 'reveclothing214@gmail.com', '2026-05-02 10:55:15.995393+00'),
	('188d7c11-5201-4657-927b-db086a017235', '143.44.193.58', 'reveclothing214@gmail.com', '2026-05-02 11:00:52.282258+00');


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

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


--
-- Data for Name: user_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_approvals" ("id", "user_id", "status", "approved_by", "approved_at", "rejection_reason", "created_at", "updated_at", "email", "full_name") VALUES
	('561efd04-a575-4048-9acd-cb6630d0cb15', '44261744-571b-4b69-86d9-d57984bdb1e6', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-04-16 00:57:54.406+00', NULL, '2026-04-13 04:01:24.374079+00', '2026-04-16 00:57:54.406+00', 'caiilozada@gmail.com', ''),
	('1b920327-95c9-4341-8d1c-d1a199ca7c0f', '9a8b7d6f-762a-4eeb-810e-11e90af3f0ed', 'approved', NULL, NULL, NULL, '2026-01-30 21:16:26.704727+00', '2026-01-30 21:16:26.704727+00', 'kerenlacadin@icloud.com', ''),
	('9e4b8fd8-7385-4a87-b295-dc99551d9d49', 'be2171db-8a58-4b8a-87cb-d6574df00bca', 'approved', NULL, NULL, NULL, '2026-02-01 23:16:33.114393+00', '2026-02-01 23:16:33.114393+00', 'gerigdigproland@gmail.com', ''),
	('420eb488-d04c-4012-a47e-935ae517b664', '4d87651e-b544-4620-a681-d7cae879879e', 'approved', '78382d5f-ea73-4027-aeb2-e81db5690756', '2026-02-04 02:12:36.57+00', NULL, '2026-02-04 02:11:35.752428+00', '2026-02-04 02:12:36.57+00', 'master@reveclothingxnobody.com', ''),
	('306c7be5-20cc-47b6-bfaf-b1e1274916d7', '21139392-8cb8-42e6-885a-ddb5b5f31f7f', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-05 14:55:21.953+00', NULL, '2026-02-05 14:37:27.955019+00', '2026-02-05 14:55:21.953+00', 'jianvaldez14@gmail.com', ''),
	('09f3358a-829e-42e2-b4c1-0b5fc7b02869', '4cc8ab8c-d087-40cc-a78b-2da739c7caed', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-05 14:55:26.843+00', NULL, '2026-02-05 06:35:37.496698+00', '2026-02-05 14:55:26.843+00', 'legaralesliejean@gmail.com', ''),
	('086a493c-68ca-4af4-bc8b-a595bc2e87ca', '71a2e7a7-4af0-4266-81c2-43e60878c88c', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-05 14:55:28.282+00', NULL, '2026-02-05 14:26:16.840323+00', '2026-02-05 14:55:28.282+00', 'dark.cokie01@gmail.com', ''),
	('00a581b3-8938-43d2-8244-1451c4cdeedc', 'f9d0289a-7bec-4bac-bcd0-6e347f599277', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-07 05:45:34.786+00', NULL, '2026-02-07 00:16:40.144956+00', '2026-02-07 05:45:34.786+00', 'cunadocharissemay@gmail.com', ''),
	('64c5b256-daef-40bb-9ebb-6d76225cdcbc', 'b47983d9-4eaa-49f7-ab39-77e3c396da00', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-07 05:45:36.77+00', NULL, '2026-02-05 21:49:21.021592+00', '2026-02-07 05:45:36.77+00', 'allenrose.estudillo@deped.gov.ph', ''),
	('a5291810-a405-45f3-a3ab-3791b933f413', '8ad9fbe2-2db4-4db2-9ac1-de009e7b7a8e', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-07 13:44:07.105+00', NULL, '2026-02-07 13:14:17.987317+00', '2026-02-07 13:44:07.105+00', 'lemansmanayon@gmail.com', ''),
	('a9e7d51b-7cfe-410e-9f8e-5c2c0e0d9831', '43857249-f4bd-4f72-b769-1268d7e896b4', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-13 00:04:31.183+00', NULL, '2026-02-12 06:06:26.803285+00', '2026-02-13 00:04:31.184+00', 'grace.sinining22@gmail.com', ''),
	('9fe9a8fa-8222-4a58-97bb-9eaca72cd393', '97918e18-91a4-49ea-a575-4109e606275f', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-14 14:16:10.94+00', NULL, '2026-02-14 06:54:13.010412+00', '2026-02-14 14:16:10.94+00', 'earl.workspace@gmail.com', ''),
	('c7bcc64a-a702-43d4-b8d8-6391e82c4c21', '9b109b82-81a3-41a8-a69e-fefad0c38002', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-16 10:14:32.896+00', NULL, '2026-02-15 17:02:00.516444+00', '2026-02-16 10:14:32.896+00', 'skalabern@gmail.com', ''),
	('24b8ac6b-fcf6-4ce9-a24a-244a764ae4fb', '990f9d8a-6e83-41a1-bc64-463d5ad0683d', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-18 07:23:22.505+00', NULL, '2026-02-17 02:30:10.454869+00', '2026-02-18 07:23:22.505+00', 'acmjames23@gmail.com', ''),
	('aba6a603-ed59-4a2a-9943-173473a6ac69', 'a3593d7b-b35c-4b23-a103-1b2a4f4deb84', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-04-16 00:57:55.854+00', NULL, '2026-04-13 03:11:04.378534+00', '2026-04-16 00:57:55.854+00', 'stephenflorlumapas@gmail.com', ''),
	('8c576c6d-1ca5-4d48-b861-caedf15f0dca', 'f8dd7ffc-abea-4e77-a2a7-05aca84d7526', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-02-27 12:27:15.413+00', NULL, '2026-02-24 01:30:28.122743+00', '2026-02-27 12:27:15.413+00', 'makiee.boii@gmail.com', ''),
	('de0ea273-8acf-48af-81d3-4a2abe534d77', 'ab6a5557-6b33-4c29-a048-c76ceff4c3bc', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-09 11:15:03.604+00', NULL, '2026-03-07 14:11:32.182097+00', '2026-03-09 11:15:03.604+00', 'ejdenosta@gmail.com', ''),
	('86b314e4-d391-421a-a792-c2d02caf3104', '9b1a2425-acad-41b1-958a-d81d8a497226', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-09 11:15:05.546+00', NULL, '2026-03-07 09:18:51.930898+00', '2026-03-09 11:15:05.546+00', 'delapenarunel@gmail.com', ''),
	('7a3c065a-366e-4b97-8f9c-81731f7a0adc', '181653b8-a4cb-4764-a772-fa5998045ec1', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-09 11:15:07.472+00', NULL, '2026-03-07 14:10:46.304354+00', '2026-03-09 11:15:07.472+00', 'ericdenosta@gmail.com', ''),
	('5d0a92e2-5d39-4cc1-bb93-c21042c7d170', '42a4ef68-8175-41f0-9145-6aa047ba61e4', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-10 01:32:31.587+00', NULL, '2026-03-09 13:34:24.673324+00', '2026-03-10 01:32:31.587+00', 'rainjamero@gmail.com', ''),
	('7fe926d1-4f19-4b0f-8144-3dcb30280d7b', '65be2655-11bb-4e05-8998-c2e761b02934', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-17 14:48:08.519+00', NULL, '2026-03-16 07:00:00.316146+00', '2026-03-17 14:48:08.519+00', 'markjasonmapalo@gmail.com', ''),
	('bbc03bb2-817b-49ef-b72a-e025eab85474', '7400e2b6-6ab0-4d42-b56f-378fcebb1803', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-03-30 10:57:58.906+00', NULL, '2026-03-30 06:53:24.791736+00', '2026-03-30 10:57:58.906+00', 'diaznicsz.12@gmail.com', ''),
	('30e5ab9d-f7ed-4e18-adff-d7539f3d1be8', 'e059419e-b250-4a8f-88a4-b22db3ab9cc3', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-04-01 06:15:38.304+00', NULL, '2026-03-30 15:49:04.680991+00', '2026-04-01 06:15:38.304+00', 'boang1998@gmail.com', ''),
	('03204cc7-83f6-47df-8dfc-6196da57fd01', '4d99c1a0-f7d4-404a-91b0-b03aef2e759c', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-04-16 00:57:57.535+00', NULL, '2026-04-10 12:06:56.957615+00', '2026-04-16 00:57:57.535+00', 'juanelbaguio@gmail.com', ''),
	('02476908-7e16-471e-9d4a-3460f5bc8109', 'ca8aadd2-1746-4213-92d0-0c3755421f27', 'approved', '4d87651e-b544-4620-a681-d7cae879879e', '2026-05-02 05:01:27.085+00', NULL, '2026-04-18 06:21:45.951556+00', '2026-05-02 05:01:27.085+00', 'luckyreyrosalijos@gmail.com', ''),
	('ccef814d-9bf5-4cc4-af95-9fc0d5009740', '78382d5f-ea73-4027-aeb2-e81db5690756', 'approved', NULL, NULL, NULL, '2026-01-30 22:15:50.875294+00', '2026-01-30 22:15:50.875294+00', 'khlacadin@gmail.com', ''),
	('120dfc41-111b-439d-b653-6ffe1a73b4ac', '03baa7b2-4cf3-4bac-85fd-b82e05cb16ed', 'approved', NULL, NULL, NULL, '2026-01-31 00:57:42.49132+00', '2026-01-31 00:57:42.49132+00', 'reveclothing214@gmail.com', '');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('5618e1ba-8047-47f5-a637-3fec20cfb39f', '78382d5f-ea73-4027-aeb2-e81db5690756', 'admin', '2026-01-30 22:16:02.389704+00'),
	('566adb7b-3795-49a1-95d2-52616984bbbb', '03baa7b2-4cf3-4bac-85fd-b82e05cb16ed', 'admin', '2026-01-31 10:04:46.282313+00'),
	('1513e1fb-1b4f-4e78-826b-1eb93acb6615', '4d87651e-b544-4620-a681-d7cae879879e', 'admin', '2026-02-04 03:25:29.732107+00');


--
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vouchers" ("id", "code", "discount_type", "discount_value", "min_order_amount", "expires_at", "is_active", "max_uses", "times_used", "description", "created_at", "updated_at", "product_ids", "category_ids") VALUES
	('ac720901-2a9a-4782-ad15-331420567544', 'WELCOME', 'percent', 100.00, NULL, NULL, true, NULL, 1, NULL, '2026-02-22 14:39:48.513273+00', '2026-02-23 13:38:38.366757+00', '{}', '{}'),
	('be2afd73-ed77-4304-9b41-c67a12caa9bb', 'TEST99', 'percent', 99.00, NULL, NULL, true, NULL, 5, NULL, '2026-02-22 14:42:07.088663+00', '2026-05-02 11:00:52.103439+00', '{}', '{}');


--
-- PostgreSQL database dump complete
--

-- \unrestrict sIx2BTj2U5LbJOJW0acD3VvIOfU5d1wLYlaEzdCjL5luwtEWb669P9cPTWbmHEh

RESET ALL;
