import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, ShoppingBag } from 'lucide-react';

interface OrderData {
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      // Poll for order status update (webhook may take a moment)
      let attempts = 0;
      const maxAttempts = 10;

      const checkOrder = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('order_number, customer_name, total, status')
          .eq('id', orderId)
          .single();

        if (!error && data) {
          setOrder(data);
          // If status is still 'new', webhook hasn't processed yet
          if (data.status === 'new' && attempts < maxAttempts) {
            attempts++;
            setTimeout(checkOrder, 2000);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };

      await checkOrder();
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {order ? (
              <>
                <p className="text-muted-foreground">
                  Thank you, <span className="font-medium text-foreground">{order.customer_name}</span>!
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-xl font-bold">{order.order_number}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-xl font-bold">₱{order.total.toFixed(2)}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email with your order details.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Your payment has been processed. Check your email for order details.
              </p>
            )}
            
            <div className="pt-4 space-y-2">
              <Button onClick={() => navigate('/shop')} className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
