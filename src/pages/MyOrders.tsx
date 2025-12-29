import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ArrowLeft, 
  Loader2, 
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: 'new' | 'paid' | 'packed' | 'shipped' | 'completed' | 'cancelled';
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'Order Placed', color: 'bg-blue-100 text-blue-800', icon: Clock },
  paid: { label: 'Payment Confirmed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  packed: { label: 'Being Prepared', color: 'bg-yellow-100 text-yellow-800', icon: PackageCheck },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  completed: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentLabels: Record<string, string> = {
  cod: 'Cash on Delivery',
  gcash: 'GCash',
  maya: 'Maya',
  bank_transfer: 'Bank Transfer',
};

const MyOrders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { state: { from: '/my-orders' } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            payment_method,
            subtotal,
            shipping_fee,
            total,
            shipping_address,
            created_at,
            updated_at,
            order_items (
              id,
              product_name,
              product_sku,
              quantity,
              unit_price,
              total_price
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">Track and view your order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                When you place an order, it will appear here.
              </p>
              <Button asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.new;
                const StatusIcon = status.icon;
                
                return (
                  <Card 
                    key={order.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{order.order_number}</span>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-PH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.order_items?.length || 0} item(s) • {paymentLabels[order.payment_method] || order.payment_method}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">₱{Number(order.total).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-medium">{selectedOrder.order_number}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={statusConfig[selectedOrder.status]?.color || ''}>
                        {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Items</p>
                      <div className="space-y-2">
                        {selectedOrder.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.product_name} × {item.quantity}
                            </span>
                            <span>₱{Number(item.total_price).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₱{Number(selectedOrder.subtotal).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₱{Number(selectedOrder.shipping_fee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₱{Number(selectedOrder.total).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Shipping Address</p>
                      <p className="text-sm">{selectedOrder.shipping_address}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="text-sm">{paymentLabels[selectedOrder.payment_method] || selectedOrder.payment_method}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select an order to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
