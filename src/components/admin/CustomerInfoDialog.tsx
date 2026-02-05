import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, UserCheck, UserX, Loader2 } from "lucide-react";
import type { OrderWithItems } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfoDialogProps {
  order: OrderWithItems | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserInfo {
  account_name: string | null;
  account_email: string | null;
  account_created_at: string | null;
  total_orders: number;
}

const CustomerInfoDialog = ({ order, open, onOpenChange }: CustomerInfoDialogProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  useEffect(() => {
    if (!order || !order.user_id || !open) {
      setUserInfo(null);
      return;
    }

    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true);
      try {
        // Fetch user account information
        const { data: userData, error: userError } = await supabase.functions.invoke('get-user-emails', {
          body: { user_ids: [order.user_id] },
        });

        if (userError) throw userError;

        // Fetch total orders for this customer
        const { count, error: countError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', order.user_id);

        if (countError) throw countError;

        const users = userData?.users || {};
        const user = users[order.user_id];

        setUserInfo({
          account_name: user?.full_name || null,
          account_email: user?.email || null,
          account_created_at: user?.created_at || null,
          total_orders: count || 0,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserInfo({
          account_name: null,
          account_email: null,
          account_created_at: null,
          total_orders: 0,
        });
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, [order?.user_id, open]);

  if (!order) return null;

  const hasAccount = !!order.user_id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </DialogTitle>
          <DialogDescription>
            Order #{order.order_number} - Customer Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Status */}
          <div className="p-4 bg-secondary rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {hasAccount ? (
                  <>
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-foreground">Registered Customer</span>
                  </>
                ) : (
                  <>
                    <UserX className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-foreground">Guest Customer</span>
                  </>
                )}
              </div>
              <Badge className={hasAccount ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                {hasAccount ? "Has Account" : "Guest Checkout"}
              </Badge>
            </div>
            {hasAccount && (
              <div className="space-y-2 pt-2 border-t border-border">
                {isLoadingUserInfo ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading account information...
                  </div>
                ) : userInfo ? (
                  <>
                    {userInfo.account_name && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Account Name</p>
                        <p className="text-sm text-foreground">{userInfo.account_name}</p>
                      </div>
                    )}
                    {userInfo.account_email && userInfo.account_email !== order.customer_email && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Account Email</p>
                        <p className="text-sm text-foreground break-all">{userInfo.account_email}</p>
                      </div>
                    )}
                    {userInfo.total_orders > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
                        <p className="text-sm text-foreground">{userInfo.total_orders} order{userInfo.total_orders !== 1 ? 's' : ''}</p>
                      </div>
                    )}
                    {userInfo.account_created_at && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                        <p className="text-sm text-foreground">
                          {new Date(userInfo.account_created_at).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Order Contact Information */}
          <div className="p-4 bg-muted/50 rounded-sm">
            <p className="text-sm font-semibold text-foreground mb-3">Order Contact Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name (for this order)</p>
                    <p className="text-foreground">{order.customer_name}</p>
                    {hasAccount && userInfo?.account_name && userInfo.account_name !== order.customer_name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Different from account name: {userInfo.account_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email (for this order)</p>
                    <p className="text-foreground break-all">{order.customer_email}</p>
                    {hasAccount && userInfo?.account_email && userInfo.account_email !== order.customer_email && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Different from account email: {userInfo.account_email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-foreground">{order.customer_phone || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                    <p className="text-foreground text-sm whitespace-pre-wrap">{order.shipping_address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="text-foreground">
                      {new Date(order.created_at).toLocaleString('en-PH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">Order Items</p>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-2 bg-secondary rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × ₱{Number(item.unit_price).toLocaleString()}
                        {item.size && (
                          <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                            Size: {item.size}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      ₱{Number(item.total_price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₱{Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">₱{Number(order.shipping_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total</span>
                  <span>₱{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerInfoDialog;
