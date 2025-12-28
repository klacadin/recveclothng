import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import type { OrderInsert, OrderItemInsert } from '@/hooks/useOrders';

interface OrderFormProps {
  onSubmit: (order: Omit<OrderInsert, 'order_number'>, items: Omit<OrderItemInsert, 'order_id'>[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface OrderItemForm {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const OrderForm = ({ onSubmit, onCancel, isSubmitting }: OrderFormProps) => {
  const { data: products = [] } = useProducts();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'cod' as 'cod' | 'gcash' | 'maya' | 'bank_transfer',
    notes: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([]);

  const addItem = () => {
    setOrderItems([...orderItems, {
      product_id: '',
      product_name: '',
      product_sku: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    }]);
  };

  const updateItem = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newItems = [...orderItems];
    newItems[index] = {
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku || '',
      quantity: 1,
      unit_price: Number(product.price),
      total_price: Number(product.price),
    };
    setOrderItems(newItems);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = quantity;
    newItems[index].total_price = newItems[index].unit_price * quantity;
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
  const shippingFee = 150;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: Omit<OrderInsert, 'order_number'> = {
      ...formData,
      subtotal,
      shipping_fee: shippingFee,
      total,
      status: 'new',
    };

    const items: Omit<OrderItemInsert, 'order_id'>[] = orderItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    onSubmit(order, items);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Create New Order</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value: 'cod' | 'gcash' | 'maya' | 'bank_transfer') => 
                    setFormData({ ...formData, payment_method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="gcash">GCash</SelectItem>
                    <SelectItem value="maya">Maya</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_address">Shipping Address *</Label>
              <Textarea
                id="shipping_address"
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                rows={2}
                required
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {orderItems.length === 0 ? (
              <div className="p-4 bg-secondary rounded-sm text-center text-muted-foreground">
                No items added yet. Click "Add Item" to add products.
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-sm">
                    <div className="flex-1">
                      <Select
                        value={item.product_id}
                        onValueChange={(value) => updateItem(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.is_active && p.stock_quantity > 0).map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ₱{Number(product.price).toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                      />
                    </div>
                    <div className="w-28 text-right font-medium">
                      ₱{item.total_price.toLocaleString()}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-secondary rounded-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">₱{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any special instructions..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || orderItems.length === 0} 
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
