import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MAX_UPLOAD_SIZE_BYTES } from '@/config/constants';
import { compressImageForUpload } from '@/utils/compressImageForUpload';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    // Validate file type - support common image formats
    const validTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/tiff'
    ];
    
    // Also check file extension as fallback
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

    // Validate file size (max 2MB - NON-NEGOTIABLE)
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast({
        title: 'File too large',
        description: `Please upload an image smaller than 2MB.`,
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    try {
      // Optimize image before upload (NON-NEGOTIABLE); fallback to original if compress fails
      let toUpload: File | Blob;
      try {
        toUpload = await compressImageForUpload(file, { maxSizeBytes: MAX_UPLOAD_SIZE_BYTES });
      } catch {
        if (file.size <= MAX_UPLOAD_SIZE_BYTES) {
          toUpload = file;
        } else {
          throw new Error('Image could not be processed. Try a smaller file (under 2MB) or different format.');
        }
      }
      const fileExt = (toUpload instanceof File ? toUpload.name : file.name).split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const payload = toUpload instanceof File ? toUpload : new File([toUpload], fileName, { type: toUpload.type || file.type });

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, payload, { contentType: payload.type || file.type });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: unknown) {
      const msg = (error as { message?: string })?.message ?? (error instanceof Error ? error.message : 'Failed to upload image');
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

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
  };
};
