import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MAX_UPLOAD_SIZE_BYTES } from '@/config/constants';
import { compressImageForUpload } from '@/utils/compressImageForUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, CheckCircle, ArrowLeft, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PendingOrder = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  proof_of_payment_url: string | null;
};

const UploadProof = () => {
  const [searchParams] = useSearchParams();
  const orderParam = searchParams.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(orderParam);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'lookup' | 'upload' | 'done'>('lookup');
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      toast({ title: 'Required', description: 'Enter order number and email.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-pending-order', {
        body: { order_number: orderNumber.trim(), customer_email: email.trim() },
      });
      if (data?.error) throw new Error(data.error);
      if (error) {
        let msg = error.message || 'Failed to find order';
        const cf = error as { context?: { json?: () => Promise<{ error?: string }> } };
        if (cf?.context?.json) {
          try {
            const body = await cf.context.json();
            if (body?.error) msg = body.error;
          } catch {
            // use msg as-is
          }
        }
        throw new Error(msg);
      }
      if (!data) throw new Error('Order not found. Check order number and email.');
      setOrder(data as PendingOrder);
      setStep('upload');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order not found. Check order number and email.';
      toast({ title: 'Find order failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast({ title: 'File too large', description: 'Max 2MB.', variant: 'destructive' });
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file || !order) return;
    setUploading(true);
    try {
      // Optimize images before upload (NON-NEGOTIABLE); PDFs use as-is
      const toSend = file.type.startsWith('image/')
        ? await compressImageForUpload(file, { maxSizeBytes: MAX_UPLOAD_SIZE_BYTES })
        : file;
      const uploadMimeType = toSend.type || (file.type.startsWith('image/') ? 'image/jpeg' : file.type);
      const uploadFileName = toSend !== file && uploadMimeType === 'image/jpeg'
        ? file.name.replace(/\.[^.]+$/, '.jpg')
        : file.name;

      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(toSend);
      });
      const { data, error } = await supabase.functions.invoke('upload-order-proof', {
        body: {
          order_number: order.order_number,
          customer_email: order.customer_email,
          file_base64: base64,
          file_name: uploadFileName,
          file_mime_type: uploadMimeType,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOrder(prev => prev ? { ...prev, proof_of_payment_url: data.proof_url } : null);
      setStep('done');
      toast({ title: 'Proof uploaded', description: 'We’ll confirm once we verify your payment.' });
    } catch (err: unknown) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <h1 className="text-2xl font-bold mb-2">Upload proof of payment</h1>
        <p className="text-muted-foreground mb-8">
          Enter your order number and email to upload a screenshot or receipt.
        </p>

        {step === 'lookup' && (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">Order number</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                    placeholder="e.g. ORD-20260204-1234"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Find order
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'upload' && order && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
              <p className="text-sm text-muted-foreground">Amount: ₱{Number(order.total).toLocaleString()}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.proof_of_payment_url ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Proof already uploaded. We’ll confirm soon.</span>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-4">
                  {previewUrl && (
                    <div className="rounded-lg overflow-hidden bg-muted aspect-video">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="proofFile" className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      Screenshot or receipt (JPG, PNG, PDF — max 2MB)
                    </Label>
                    <Input
                      id="proofFile"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf"
                      onChange={handleFileChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload proof
                  </Button>
                </form>
              )}
              <Button variant="outline" className="w-full" onClick={() => setStep('lookup')}>
                Use different order / email
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'done' && (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">Proof uploaded</h2>
              <p className="text-muted-foreground text-sm">
                We’ll verify your payment and update your order status. You can close this page.
              </p>
              <Button asChild>
                <Link to="/shop">Back to shop</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadProof;
