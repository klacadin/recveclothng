/**
 * Image optimization utilities
 * Provides helper functions for using optimized images with WebP fallback
 */

export interface OptimizedImage {
  src: string;
  srcSet?: string;
  webp?: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * Get optimized image source with WebP support
 * @param imagePath - Path to the original image
 * @param optimizedDir - Directory containing optimized versions
 * @returns Object with WebP and fallback image paths
 */
export function getOptimizedImage(
  imagePath: string,
  optimizedDir: string = '/assets/optimized'
): { webp: string; fallback: string } {
  const fileName = imagePath.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '') || '';
  const basePath = imagePath.substring(0, imagePath.lastIndexOf('/'));

  return {
    webp: `${basePath}${optimizedDir}/${fileName}.webp`,
    fallback: `${basePath}${optimizedDir}/${fileName}-optimized.jpg`,
  };
}

/**
 * Generate responsive image srcset
 * @param basePath - Base path to the image
 * @param sizes - Array of sizes (e.g., [400, 800, 1200])
 * @returns srcset string
 */
export function generateSrcSet(basePath: string, sizes: number[]): string {
  return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
}

/**
 * Create a picture element with WebP fallback
 * This is a helper for generating the proper HTML structure
 */
export function createPictureElement(image: OptimizedImage): string {
  const { webp, src, alt, loading = 'lazy' } = image;
  
  if (webp) {
    return `
      <picture>
        <source srcset="${webp}" type="image/webp" />
        <img src="${src}" alt="${alt}" loading="${loading}" />
      </picture>
    `;
  }
  
  return `<img src="${src}" alt="${alt}" loading="${loading}" />`;
}

