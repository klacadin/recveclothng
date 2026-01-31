# Product database and assets (canonical sources)

Use these as the single source of truth for products and imagery.

## Product database

- **File:** `C:\Documents\Reve\REVE CLOTHING - Spreadsheet3.xlsx`
- **Sheet:** Sheet1
- **Contents:** Categories (Running Shirt, Running Shorts, Running Singlets, Running Long Sleeves), product names, codes, prices, specs, sizes, convenience fee.
- **Sync to app:** Run `npm run products:sync` to regenerate `src/data/products-from-spreadsheet.json`. The script reads category-level **SPECS**, **WHY Customers Buy**, per-size stock (e.g. 10 for XS–XL, 5 for XXL/XXXL), and **Convenience Fee** (₱38) from the spreadsheet and attaches them to each product in that category.

## Product images (batch 1)

- **Folder:** `E:\Projects\reveclothing\recveclothng\src\assets\reve-clothing-products-batch1`
- **Formats:** `.webp` (tshirt-*, singlet-*, short-*)
- **Mapping:** Product CODE → filename is in `src/data/productImageMap.ts`. Add or change entries there when the spreadsheet or batch1 folder changes.

## Customer journey image

- **File:** `E:\Projects\reveclothing\recveclothng\src\assets\reve-customer-journey.jpg`
- **Use in app:** Import `customerJourneyImage` from `@/data/products` (or `@/data/productImages`) and use as `src` for an `<img>`.

## Regenerating product JSON

After editing the spreadsheet, run:

```bash
npm run products:sync
```

This writes `src/data/products-from-spreadsheet.json`. The NOBODY collection and `@/data/products` use this file plus `src/data/productImageMap.ts` for images.

## Supabase sync (database)

The app and Supabase are synced with the canonical 36 NOBODY products:

- **Migration:** `supabase/migrations/20260130000000_sync_canonical_nobody_products.sql`
  - Deactivates products in old categories (Sports & Performance Jerseys, etc.).
  - Upserts the 36 products by `sku` (e.g. SHRT-HLDL, SING-PCH) with name, category, price, image_url.
  - Inserts/updates `product_variants` (XS–3XL) and syncs `stock_quantity`.
- **Product detail:** `/product/:id` accepts either a UUID or a product code (e.g. `SHRT-YY`). `useProduct(id)` resolves by `sku` when `id` is not a UUID, so links from Shop and NOBODY collection work.

After changing the spreadsheet, run `npm run products:sync`, then re-run the migration (or apply equivalent SQL) if you want Supabase to match.

## Summary

| What            | Path |
|-----------------|------|
| Product DB      | `C:\Documents\Reve\REVE CLOTHING - Spreadsheet3.xlsx` |
| Product images  | `src/assets/reve-clothing-products-batch1/` |
| Customer journey| `src/assets/reve-customer-journey.jpg` |
| Supabase sync   | `supabase/migrations/20260130000000_sync_canonical_nobody_products.sql` |

**Checkout:** `src/config/constants.ts` defines `SHIPPING_FEE` (₱130) and `CONVENIENCE_FEE` (₱38). Total = subtotal + shipping + convenience fee. Product detail shows **Specs** and **Why customers buy** when `description` contains that text (set by the migration per category).
