import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_MB } from '@/config/constants';
import { compressImageForUpload } from '@/utils/compressImageForUpload';
import { buildSeoImageFilename } from '@/utils/seoImageFilename';

/** Soft ceiling for source files before compression (output must still be ≤ 2MB). */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export interface ImageUploadMeta {
  name?: string | null;
  sku?: string | null;
  folder?: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (
    file: File,
    meta: ImageUploadMeta = {}
  ): Promise<string | null> => {
    if (!file) return null;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
    ];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.tiff'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, WebP, GIF, SVG, BMP, or TIFF image.',
        variant: 'destructive',
      });
      return null;
    }

    if (file.size > MAX_SOURCE_BYTES) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 25MB.',
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    try {
      let toUpload: Blob = file;
      const isSvg = file.type === 'image/svg+xml' || fileExtension === '.svg';

      if (!isSvg) {
        try {
          toUpload = await compressImageForUpload(file, {
            maxSizeBytes: MAX_UPLOAD_SIZE_BYTES,
          });
        } catch {
          if (file.size <= MAX_UPLOAD_SIZE_BYTES) {
            toUpload = file;
          } else {
            throw new Error(
              'Image could not be optimized. Try a smaller file or different format.'
            );
          }
        }
      }

      if (toUpload.size > MAX_UPLOAD_SIZE_BYTES) {
        throw new Error(
          `Image is still over ${MAX_UPLOAD_SIZE_MB}MB after optimization. Try a smaller source image.`
        );
      }

      const outType = toUpload.type || file.type || 'image/webp';
      const ext = outType.includes('webp')
        ? 'webp'
        : outType.includes('png')
          ? 'png'
          : outType.includes('jpeg') || outType.includes('jpg')
            ? 'jpg'
            : 'webp';

      const seoName = buildSeoImageFilename({
        originalName: file.name,
        name: meta.name,
        sku: meta.sku,
        ext,
        uniqueSuffix: Date.now().toString(36).slice(-6),
      });

      const payload = new File([toUpload], seoName, { type: outType });

      const form = new FormData();
      form.append('file', payload);
      form.append('folder', meta.folder || 'product-images');
      if (meta.name) form.append('seoName', meta.name);
      if (meta.sku) form.append('seoSku', meta.sku);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          (json as { error?: string }).error || `Upload failed (${res.status})`
        );
      }
      const json = await res.json();
      if (!json.url) throw new Error('Upload did not return a URL');
      return json.url as string;
    } catch (error: unknown) {
      const msg =
        (error as { message?: string })?.message ??
        (error instanceof Error ? error.message : 'Failed to upload image');
      toast({
        title: 'Upload failed',
        description: msg,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    meta: ImageUploadMeta = {}
  ): Promise<string[]> => {
    const results: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, meta);
      if (url) results.push(url);
    }
    return results;
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
  };
};
