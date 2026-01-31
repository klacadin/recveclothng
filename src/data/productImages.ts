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

/** Customer journey image (src/assets/reve-customer-journey.jpg) */
export const customerJourneyImage = new URL(
  "../assets/reve-customer-journey.jpg",
  import.meta.url
).href;
