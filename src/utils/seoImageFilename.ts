/**
 * Build SEO-friendly image filenames for product uploads.
 * Example: reve-clothing-shrt-punk-punk-running-shirt.webp
 */

const BRAND_PREFIX = "reve-clothing";

export function slugifyForSeo(value: string, maxLen = 60): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen)
    .replace(/-+$/g, "");
}

export interface SeoImageFilenameOptions {
  /** Original upload name (fallback) */
  originalName?: string;
  /** Product / entity display name */
  name?: string | null;
  /** SKU or other stable code */
  sku?: string | null;
  /** Folder context e.g. product-images */
  folder?: string;
  /** Output extension without dot */
  ext?: string;
  /** Optional short unique suffix to avoid collisions */
  uniqueSuffix?: string | number;
}

/**
 * Returns a filename only (no folder), e.g. reve-clothing-shrt-punk-punk.webp
 */
export function buildSeoImageFilename(opts: SeoImageFilenameOptions = {}): string {
  const ext = (opts.ext || "webp").replace(/^\./, "").toLowerCase();
  const parts: string[] = [BRAND_PREFIX];

  if (opts.sku?.trim()) parts.push(slugifyForSeo(opts.sku, 40));
  if (opts.name?.trim()) parts.push(slugifyForSeo(opts.name, 50));

  if (parts.length === 1 && opts.originalName) {
    const base = opts.originalName.replace(/\.[^.]+$/, "");
    const slug = slugifyForSeo(base, 50);
    if (slug) parts.push(slug);
  }

  if (parts.length === 1) parts.push("image");

  if (opts.uniqueSuffix != null && String(opts.uniqueSuffix).length > 0) {
    parts.push(slugifyForSeo(String(opts.uniqueSuffix), 12) || String(opts.uniqueSuffix));
  }

  return `${parts.filter(Boolean).join("-").replace(/-+/g, "-")}.${ext}`;
}

/**
 * Pathname for Vercel Blob: `{folder}/{seo-filename}`
 */
export function buildSeoBlobPathname(opts: SeoImageFilenameOptions = {}): string {
  const folder = (opts.folder || "uploads").replace(/^\/+|\/+$/g, "");
  return `${folder}/${buildSeoImageFilename(opts)}`;
}
