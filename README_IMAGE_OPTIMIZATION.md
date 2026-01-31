# Image Optimization Guide

This project includes tools and utilities for optimizing images to improve performance.

## Quick Start

### 1. Install Sharp (Required for optimization)

```bash
npm install -D sharp
```

### 2. Run Image Optimization

```bash
npm run optimize:images
```

This will:
- Convert all JPG/PNG images in `src/assets/` to WebP format
- Create optimized JPG fallbacks
- Save optimized images to `src/assets/optimized/`

## Using Optimized Images

### Option 1: Use OptimizedImage Component

```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/assets/product-hero-tee.jpg"
  alt="Hero Tee"
  className="w-full h-auto"
  loading="lazy"
/>
```

### Option 2: Manual Picture Element

```tsx
<picture>
  <source srcSet="/assets/optimized/product-hero-tee.webp" type="image/webp" />
  <img 
    src="/assets/optimized/product-hero-tee-optimized.jpg" 
    alt="Hero Tee"
    loading="lazy"
  />
</picture>
```

### Option 3: Use Utility Functions

```tsx
import { getOptimizedImage } from '@/utils/imageOptimization';

const { webp, fallback } = getOptimizedImage('/assets/product.jpg');
```

## Best Practices

1. **Always provide alt text** for accessibility
2. **Use lazy loading** for below-the-fold images
3. **Specify width/height** to prevent layout shift**
4. **Use appropriate formats**: WebP for photos, PNG for graphics with transparency
5. **Optimize before upload**: Compress images before adding to the project

## Image Sizes

Recommended sizes:
- **Hero images**: 1920x1080 (max)
- **Product images**: 1200x1600 (3:4 aspect ratio)
- **Thumbnails**: 400x400
- **Icons/Logos**: 512x512

## Manual Optimization

If you prefer manual optimization:

1. Use tools like:
   - [Squoosh](https://squoosh.app/) - Online image optimizer
   - [ImageOptim](https://imageoptim.com/) - Desktop app
   - [Sharp CLI](https://sharp.pixelplumbing.com/) - Command line

2. Target file sizes:
   - WebP: 70-85% quality
   - JPG: 80-90% quality
   - PNG: Use only when transparency needed

## Future Enhancements

- Automatic image optimization in build process
- Responsive image srcset generation
- CDN integration for image delivery
- Lazy loading with intersection observer

