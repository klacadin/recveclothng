# Product database and assets (canonical sources)

Use these as the single source of truth for products and imagery.

## Product database

- **File:** `C:\Documents\Reve\REVE CLOTHING - Spreadsheet3.xlsx`
- **Sheet:** Sheet1
- **Contents:** Categories (Running Shirt, Running Shorts, Running Singlets, Running Long Sleeves), product names, codes, prices, specs, sizes, convenience fee.
- **Sync to app:** Run `node scripts/read-product-spreadsheet.js` to regenerate `src/data/products-from-spreadsheet.json`. The app uses this JSON plus the image map to build the NOBODY product list.

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

## Summary

| What            | Path |
|-----------------|------|
| Product DB      | `C:\Documents\Reve\REVE CLOTHING - Spreadsheet3.xlsx` |
| Product images  | `src/assets/reve-clothing-products-batch1/` |
| Customer journey| `src/assets/reve-customer-journey.jpg` |

**Note:** NOBODY product cards link to `/product/:id` (id = product code, e.g. `SHRT-YY`). The product detail page currently loads from Supabase; to show NOBODY products there, add a fallback in `ProductDetail` using `getProductById(id)` from `@/data/products`.
