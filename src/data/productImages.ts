import { productCodeToImageFilename } from "./productImageMap";
import { assetUrl } from "@/lib/assetUrl";

/**
 * Local batch assets — populated via webpack context when available (Next/Vite).
 * Prefer DB image_url / Blob URLs in production.
 */
const batch1ByFilename: Record<string, string> = {};

try {
  // Webpack / Next.js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ctx = require.context(
    "../assets/reve-clothing-products-batch1",
    false,
    /\.webp$/
  ) as { keys: () => string[]; (id: string): unknown };
  for (const key of ctx.keys()) {
    const filename = key.replace("./", "");
    const url = assetUrl(ctx(key) as Parameters<typeof assetUrl>[0]);
    if (url) batch1ByFilename[filename] = url;
  }
} catch {
  // Vite / environments without require.context — leave empty; remote URLs still work
}

export function getProductImageUrl(filename: string): string {
  if (!filename) return "";
  return batch1ByFilename[filename] ?? "";
}

const PLACEHOLDER = "/placeholder.svg";
const BATCH1_PATH_PREFIX = "/assets/reve-clothing-products-batch1/";

export function resolveProductImageUrl(imageUrl: string): string {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return "";

  // Old external storage URL from the pre-Blob catalog; treat as missing.
  if (trimmed.includes("supabase.co")) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith(BATCH1_PATH_PREFIX) || trimmed.includes("reve-clothing-products-batch1/")) {
    const filename = trimmed.split("/").pop() ?? trimmed;
    const resolved = getProductImageUrl(filename);
    if (resolved) return resolved;
    // Static files copied to public/ for Next.js
    if (filename) return `${BATCH1_PATH_PREFIX}${filename}`;
  }
  if (trimmed.endsWith(".webp")) {
    const filename = trimmed.split("/").pop() ?? trimmed;
    const resolved = getProductImageUrl(filename);
    if (resolved) return resolved;
  }
  // Site-relative paths
  if (trimmed.startsWith("/")) return trimmed;
  return trimmed;
}

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

export const customerJourneyImage = "/placeholder.svg";
