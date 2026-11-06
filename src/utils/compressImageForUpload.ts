/**
 * Client-side image compression for uploads.
 * NON-NEGOTIABLE: Always optimize to the smallest size without sacrificing visual quality.
 * Max upload after compression: 2MB (see MAX_UPLOAD_SIZE_BYTES in config/constants).
 */

import { MAX_UPLOAD_SIZE_BYTES } from "@/config/constants";

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
/** Prefer staying under this when possible (still under hard 2MB cap). */
const TARGET_SIZE_BYTES = 350 * 1024;
const START_QUALITY = 0.82;
const MIN_QUALITY = 0.55;

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
  /** Soft target — keep shrinking quality while above this (until MIN_QUALITY). */
  targetSizeBytes?: number;
  /** Preferred output MIME; falls back to JPEG if unsupported. */
  mimeType?: "image/webp" | "image/jpeg";
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b && b.size > 0) resolve(b);
        else reject(new Error("Image encoding failed"));
      },
      type,
      quality
    );
  });
}

async function encodeBest(
  canvas: HTMLCanvasElement,
  preferred: "image/webp" | "image/jpeg",
  quality: number
): Promise<{ blob: Blob; type: string }> {
  try {
    const blob = await canvasToBlob(canvas, preferred, quality);
    // Some browsers report success for webp but return empty/png fallback — trust type when present
    if (blob.type && blob.type !== preferred && preferred === "image/webp") {
      const jpeg = await canvasToBlob(canvas, "image/jpeg", quality);
      return { blob: jpeg, type: "image/jpeg" };
    }
    return { blob, type: preferred };
  } catch {
    const jpeg = await canvasToBlob(canvas, "image/jpeg", quality);
    return { blob: jpeg, type: "image/jpeg" };
  }
}

/**
 * Compress an image to the smallest practical size while preserving visual quality.
 * Always re-encodes (does not skip under the max size). Prefer WebP.
 */
export async function compressImageForUpload(
  file: File,
  options: CompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    quality = START_QUALITY,
    maxSizeBytes = MAX_UPLOAD_SIZE_BYTES,
    targetSizeBytes = TARGET_SIZE_BYTES,
    mimeType = "image/webp",
  } = options;

  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const img = await loadImage(file);
  try {
    let { width, height } = img;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    // White background for transparent PNG → JPEG/WebP (avoids black matte)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let q = quality;
    let { blob, type } = await encodeBest(canvas, mimeType, q);

    // Shrink toward soft target first, then hard max
    while (blob.size > targetSizeBytes && q > MIN_QUALITY + 0.05) {
      q = Math.max(MIN_QUALITY, q - 0.07);
      ({ blob, type } = await encodeBest(canvas, mimeType, q));
    }

    while (blob.size > maxSizeBytes && q > 0.35) {
      q -= 0.08;
      ({ blob, type } = await encodeBest(canvas, type === "image/webp" ? "image/webp" : "image/jpeg", q));
    }

    // Last resort: downscale canvas
    if (blob.size > maxSizeBytes) {
      const scale = Math.sqrt(maxSizeBytes / blob.size) * 0.92;
      const newW = Math.max(100, Math.round(width * scale));
      const newH = Math.max(100, Math.round(height * scale));
      canvas.width = newW;
      canvas.height = newH;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, newW, newH);
      ctx.drawImage(img, 0, 0, newW, newH);
      ({ blob } = await encodeBest(
        canvas,
        type === "image/webp" ? "image/webp" : "image/jpeg",
        0.72
      ));
    }

    // Prefer compressed result unless somehow larger than original AND already under target
    if (blob.size >= file.size && file.size <= targetSizeBytes && file.type === blob.type) {
      return file;
    }

    return blob;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
