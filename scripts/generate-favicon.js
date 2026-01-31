/**
 * Favicon Generator Script
 * Generates favicon.ico and multiple sizes from a source image
 * Usage: node scripts/generate-favicon.js [path-to-image]
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default source image (can be overridden via command line argument)
const DEFAULT_SOURCE = path.join(__dirname, '../src/assets/reve-logo.jpg');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Favicon sizes to generate
const FAVICON_SIZES = [16, 32, 48, 64];

async function generateFavicon(sourceImage) {
  if (!fs.existsSync(sourceImage)) {
    console.error(`❌ Source image not found: ${sourceImage}`);
    console.log('\n📝 Usage: node scripts/generate-favicon.js [path-to-image]');
    console.log('   Example: node scripts/generate-favicon.js src/assets/reve-logo.jpg');
    process.exit(1);
  }

  console.log(`📸 Generating favicon from: ${sourceImage}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  try {
    // Generate individual PNG files for each size
    const pngFiles = [];
    for (const size of FAVICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`);
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      pngFiles.push(outputPath);
      console.log(`✓ Generated favicon-${size}x${size}.png`);
    }

    // Generate favicon.ico (multi-size ICO file)
    // Note: sharp doesn't support ICO format directly, so we'll create a high-quality PNG
    // and also create a 32x32 ICO-compatible version
    const faviconIcoPath = path.join(OUTPUT_DIR, 'favicon.ico');
    
    // Create a 32x32 version for favicon.ico
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconIcoPath.replace('.ico', '-32.png'));

    // For ICO format, we'll use the 32x32 PNG as favicon.ico
    // Most modern browsers support PNG favicons, so this works well
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconIcoPath);

    console.log(`✓ Generated favicon.ico (32x32 PNG format)`);

    // Generate apple-touch-icon (180x180)
    const appleTouchIconPath = path.join(OUTPUT_DIR, 'apple-touch-icon.png');
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for Apple
      })
      .png()
      .toFile(appleTouchIconPath);
    console.log(`✓ Generated apple-touch-icon.png (180x180)`);

    // Generate PWA icons (192x192 and 512x512)
    const pwa192Path = path.join(OUTPUT_DIR, 'icon-192.png');
    const pwa512Path = path.join(OUTPUT_DIR, 'icon-512.png');

    await sharp(sourceImage)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(pwa192Path);
    console.log(`✓ Generated icon-192.png`);

    await sharp(sourceImage)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(pwa512Path);
    console.log(`✓ Generated icon-512.png`);

    console.log('\n✅ Favicon generation complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review generated favicons in public/ folder');
    console.log('   2. Update index.html with favicon links');
    console.log('   3. Rebuild: npm run build');

  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

// Get source image from command line argument or use default
const sourceImage = process.argv[2] 
  ? path.resolve(process.argv[2])
  : DEFAULT_SOURCE;

generateFavicon(sourceImage);

