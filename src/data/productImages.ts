import { productCodeToImageFilename } from "./productImageMap";

/**
 * Resolve product image URL from filename in src/assets/reve-clothing-products-batch1/
 */
const batch1 = import.meta.glob<string>(
  "../assets/reve-clothing-products-batch1/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const batch1ByFilename = Object.fromEntries(
  Object.entries(batch1).map(([path, url]) => {
    const filename = path.split("/").pop() ?? "";
    return [filename, url];
  })
);

export function getProductImageUrl(filename: string): string {
  if (!filename) return "";
  return batch1ByFilename[filename] ?? "";
}

const PLACEHOLDER = "/placeholder.svg";

const BATCH1_PATH_PREFIX = "/assets/reve-clothing-products-batch1/";

/**
 * Resolve image_url from DB: paths like /assets/reve-clothing-products-batch1/foo.webp
 * don't exist in build (Vite hashes them). Extract filename and use Vite's resolved URL.
 * Export for ProductDetail gallery.
 */
export function resolveProductImageUrl(imageUrl: string): string {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith(BATCH1_PATH_PREFIX) || trimmed.includes("reve-clothing-products-batch1/")) {
    const filename = trimmed.split("/").pop() ?? trimmed;
    const resolved = getProductImageUrl(filename);
    if (resolved) return resolved;
  }
  if (trimmed.endsWith(".webp")) {
    const resolved = getProductImageUrl(trimmed.split("/").pop() ?? trimmed);
    if (resolved) return resolved;
  }
  return trimmed;
}

/**
 * Get best image URL for a product (Supabase Product or any with image_url/sku).
 * Prefers image_url (resolved), then sku→asset map, then placeholder.
 */
export function getProductDisplayImage(product: {
  image_url?: string | null;
  sku?: string | null;
  images?: string[] | null;
}): string {
  const fromImageUrl = resolveProductImageUrl(product.image_url || "");
  if (fromImageUrl) return fromImageUrl;
  if (product.images?.length && product.images[0]?.trim()) {
    const fromImages = resolveProductImageUrl(product.images[0]);
    if (fromImages) return fromImages;
  }
  if (product.sku) {
    const filename = productCodeToImageFilename[product.sku];
    const url = filename ? getProductImageUrl(filename) : "";
    if (url) return url;
  }
  return PLACEHOLDER;
}

/** Customer journey image (src/assets/reve-customer-journey.jpg) */
export const customerJourneyImage = new URL(
  "../assets/reve-customer-journey.jpg",
  import.meta.url
).href;
