import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We couldn't process your payment. Don't worry, your order has been saved
              and you can try again.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Common reasons for payment failure:</p>
              <ul className="text-left list-disc list-inside space-y-1">
                <li>Insufficient balance in your e-wallet</li>
                <li>Transaction was cancelled</li>
                <li>Session expired</li>
                <li>Network connection issues</li>
              </ul>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button onClick={() => navigate('/checkout')} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/shop')} className="w-full">
                Continue Shopping
              </Button>
              <p className="text-xs text-muted-foreground pt-2">
                Need help? Contact us via Facebook Messenger
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailed;
