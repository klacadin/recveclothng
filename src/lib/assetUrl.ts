/**
 * Normalize Vite string URLs and Next.js StaticImageData to a usable src string.
 */
export type AssetImport =
  | string
  | { src: string }
  | { default: string | { src: string } };

export function assetUrl(img: AssetImport | null | undefined): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object") {
    if ("src" in img && typeof img.src === "string") return img.src;
    if ("default" in img) {
      const d = img.default;
      if (typeof d === "string") return d;
      if (d && typeof d === "object" && typeof d.src === "string") return d.src;
    }
  }
  return "";
}
