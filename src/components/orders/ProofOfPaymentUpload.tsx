import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle, ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProofOfPaymentUploadProps {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  userId: string;
  existingProofUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

const ProofOfPaymentUpload = ({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  total,
  userId,
  existingProofUrl,
  onUploadComplete,
}: ProofOfPaymentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - support common image and document formats
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'application/pdf',
      'image/gif'
    ];
    
    // Also check file extension as fallback
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.gif'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, WebP, GIF image or PDF file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB for better quality)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${orderId}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      const proofUrl = urlData.publicUrl;

      // Update order with proof URL
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          proof_of_payment_url: proofUrl,
          proof_uploaded_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Notify admin (non-blocking)
      supabase.functions.invoke('notify-payment-proof', {
        body: {
          order_id: orderId,
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          total,
          proof_url: proofUrl,
        },
      }).catch(console.error);

      toast({
        title: 'Proof uploaded successfully',
        description: 'The store has been notified of your payment.',
      });

      onUploadComplete(proofUrl);
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload proof of payment.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (existingProofUrl) {
    return (
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800 dark:text-green-200">Proof of Payment Uploaded</p>
              <p className="text-sm text-green-600 dark:text-green-400">Waiting for store confirmation</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => window.open(existingProofUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Upload proof of payment (screenshot or receipt)</span>
        </div>

        {previewUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="object-contain w-full h-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="proof-upload" className="sr-only">
            Upload proof of payment
          </Label>
          <div className="flex gap-2">
            <Input
              id="proof-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex-1"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPG, PNG, WebP, GIF, PDF (max 10MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProofOfPaymentUpload;
