import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, QrCode, Upload, MessageSquare } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber;
  const needsProof = location.state?.needsProof;
  const total = location.state?.total;
  const paymentMethod = location.state?.paymentMethod as string | undefined;
  const customerEmail = location.state?.customerEmail;
  const customerName = location.state?.customerName;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
            <p className="text-muted-foreground">
              {needsProof
                ? 'Pay via QR below, then upload proof of payment to complete your order.'
                : "Thank you for your order. We'll process it as soon as possible."}
            </p>
          </div>

          {orderNumber && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-xl font-mono font-bold">{orderNumber}</p>
            </div>
          )}

          {needsProof && total != null && (
            <div className="space-y-4 text-left border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <QrCode className="h-5 w-5" />
                Pay via QR
              </div>
              <p className="text-sm text-muted-foreground">
                Pay <strong className="text-foreground">₱{Number(total).toLocaleString()}</strong> using GCash, Maya, or bank transfer. Use the QR code at our store or pay to our registered number (details in your confirmation email).
              </p>
              <p className="text-sm text-muted-foreground">
                After paying, upload a screenshot or photo of your receipt so we can confirm and prepare your order.
              </p>
              <Button asChild className="w-full">
                <Link to={`/upload-proof?order=${encodeURIComponent(orderNumber || '')}`}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload proof of payment
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Save your order number <strong className="text-foreground">{orderNumber}</strong>. You can upload proof later from the link in your email or by visiting Upload proof and entering your order number and email.
              </p>
            </div>
          )}

          {!needsProof && (
            <div className="text-sm text-muted-foreground">
              <p>We'll send you an email confirmation shortly.</p>
              {paymentMethod === 'cod' && (
                <p className="mt-1 font-medium text-foreground">Pay the J&T courier in cash when your order arrives.</p>
              )}
              <p className="mt-1">You can track your order status using your order number.</p>
            </div>
          )}

          <a
            href="https://forms.gle/1B1K1UFaQReJEpnv5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm text-accent hover:underline"
          >
            <MessageSquare className="h-4 w-4" />
            Share your feedback
          </a>

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
