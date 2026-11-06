# REVE Uploaded Product Image Migration - Blocked

Date: 2026-05-07

## Status

The restored product rows were migrated from the previous Supabase database, but their image binaries could not be migrated.

Previous project:

- `txiwvjfdlxgwjtaibbpb`
- Supabase project name: `reve clothing`

Current project:

- `unaodlytdymouicuuywb`
- Supabase project name: `Reve Clothing V2`

## Blocker

The old Supabase Storage service is restricted:

```text
HTTP 402 Payment Required
Service for this project is restricted due to the following violations: exceed_cached_egress_quota.
```

This blocks both:

- public storage URL download
- Supabase Storage CLI listing/copying

Because the binary files cannot be read from the old project, they cannot be uploaded to the new project yet.

## Image URLs Still On Old Storage

```text
BKDN INSPIRED | SING-BKDN | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454220250-6riwwqdgg6p.jpg
FOREST GREEN | SING-FRST | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454282053-bi460levvys.jpg
FOREST PINK | SING-PNK | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454335433-llejnqwt32j.jpg
ASH GRAY | SING-ASHG | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454387961-i9xnubs0zd9.jpg
RUN WILD | SING-WILD | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454431466-v9saejkxe5k.jpg
RAINBOW | SING-RNDB | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454473139-xmx6kw1iqpa.jpg
BLK PINK | SING-BLK | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454551938-5cyr9uinoi5.jpg
PNK | SING-PINK | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454589290-8uskpyj6dkd.jpg
STRIPES | SING-VLET | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454659604-tqcm421e2rd.jpg
WHITE WAVE | SING-WAVE | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454707304-t60vzw29ue.jpg
PINK WAVE | SING-PNKW | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772454744643-dpvl7gm5fzl.jpg
BE YOUR OWN HERO | no SKU | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1772618280078-tlb89kcgmak.jpg
TRIBAL GRAY | TRIB-GRY | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1776303489324-857vsefyo49.jpg
purple | prl-shrt | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087490346-x8bx4jvtap8.jpg
orange | orng-shrt | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777087546628-9i0rcd10f5.jpg
galaxy | glxy-shrt | https://txiwvjfdlxgwjtaibbpb.supabase.co/storage/v1/object/public/product-images/products/1777094788465-ahrddhud8wa.png
```

## Next Options

1. Restore access to the old Supabase project by resolving the egress quota restriction, then rerun the image transfer.
2. Provide the original 16 product image files, then upload them to the current `product-images` bucket and update `products.image_url`.
3. Temporarily replace these image URLs with available local product assets, if exact original images are not required.

