/**
 * Client-side image compression for uploads.
 * NON-NEGOTIABLE: All photos must be optimized to smallest size without sacrificing quality.
 * Max upload: 2MB (see MAX_UPLOAD_SIZE_BYTES in config/constants).
 */

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const DEFAULT_QUALITY = 0.85;

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

/**
 * Compress an image file to stay under maxSizeBytes while preserving visual quality.
 * Uses Canvas API to resize and re-encode as JPEG/WebP.
 */
export async function compressImageForUpload(
  file: File,
  options: CompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    quality = DEFAULT_QUALITY,
    maxSizeBytes = 2 * 1024 * 1024,
  } = options;

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const tryEncode = (q: number): Promise<Blob> =>
        new Promise((res, rej) => {
          canvas.toBlob(
            (b) => {
              if (b && b.size > 0) res(b);
              else rej(new Error('Image encoding failed'));
            },
            'image/jpeg',
            q
          );
        });

      const compress = async (): Promise<Blob> => {
        let blob = await tryEncode(quality);
        let q = quality;

        while (blob.size > maxSizeBytes && q > 0.1) {
          q -= 0.1;
          blob = await tryEncode(q);
        }

        if (blob.size > maxSizeBytes) {
          const scale = Math.sqrt(maxSizeBytes / blob.size);
          const newW = Math.max(100, Math.round(width * scale));
          const newH = Math.max(100, Math.round(height * scale));
          canvas.width = newW;
          canvas.height = newH;
          ctx.drawImage(img, 0, 0, newW, newH);
          blob = await tryEncode(0.8);
        }

        return blob;
      };

      compress()
        .then((blob) => {
          URL.revokeObjectURL(img.src);
          resolve(blob);
        })
        .catch((err) => {
          URL.revokeObjectURL(img.src);
          reject(err);
        });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
