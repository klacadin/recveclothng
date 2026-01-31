import { useState } from 'react';
import { getOptimizedImage } from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  fallback?: string;
}

/**
 * OptimizedImage component that uses WebP with fallback
 * Automatically loads WebP version if available, falls back to original
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  width,
  height,
  fallback,
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Try to use optimized version if available
  const optimized = getOptimizedImage(src);
  const webpSrc = optimized.webp;

  const handleError = () => {
    if (!error && webpSrc && imgSrc === webpSrc) {
      // WebP failed, try optimized JPG
      setImgSrc(optimized.fallback);
      setError(true);
    } else if (!error && imgSrc === optimized.fallback) {
      // Optimized JPG failed, use original
      setImgSrc(fallback || src);
      setError(true);
    }
  };

  // Use WebP if available and not in error state
  const currentSrc = !error && webpSrc ? webpSrc : imgSrc;

  return (
    <picture>
      {webpSrc && !error && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onError={handleError}
      />
    </picture>
  );
};

