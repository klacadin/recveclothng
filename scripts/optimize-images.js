/**
 * Image Optimization Script
 * Converts images to WebP format and creates optimized versions
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Note: Requires sharp to be installed: npm install -D sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../src/assets');
const outputDir = path.join(__dirname, '../src/assets/optimized');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function optimizeImages() {
    try {
        const files = fs.readdirSync(assetsDir);
        const imageFiles = files.filter(file =>
            imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
        );

        console.log(`Found ${imageFiles.length} images to optimize`);

        // Check if sharp is available
        let sharp;
        try {
            sharp = (await import('sharp')).default;
        } catch (error) {
            console.warn('⚠️  Sharp not installed. Install it with: npm install -D sharp');
            console.warn('   For now, creating a placeholder script. Images will need manual optimization.');
            return;
        }

        for (const file of imageFiles) {
            const inputPath = path.join(assetsDir, file);
            const baseName = path.parse(file).name;
            const webpPath = path.join(outputDir, `${baseName}.webp`);
            const jpgPath = path.join(outputDir, `${baseName}-optimized.jpg`);

            console.log(`Processing ${file}...`);

            // Generate WebP version
            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(webpPath);

            // Generate optimized JPG fallback
            await sharp(inputPath)
                .jpeg({ quality: 85, mozjpeg: true })
                .toFile(jpgPath);

            console.log(`✓ Created optimized versions for ${file}`);
        }

        console.log('\n✅ Image optimization complete!');
        console.log(`   Optimized images saved to: ${outputDir}`);
        console.log('\n📝 Next steps:');
        console.log('   1. Review optimized images');
        console.log('   2. Update image imports to use optimized versions');
        console.log('   3. Consider using <picture> elements with WebP fallback');
    } catch (error) {
        console.error('Error optimizing images:', error);
        process.exit(1);
    }
}

optimizeImages();

