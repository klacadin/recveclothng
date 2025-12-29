import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import CheckoutAuth from '@/components/checkout/CheckoutAuth';
import OTPVerification from '@/components/checkout/OTPVerification';

const checkoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  customerEmail: z.string().email('Invalid email address').max(320, 'Email is too long'),
  customerPhone: z.string().max(50, 'Phone number is too long').optional(),
  shippingAddress: z.string().min(1, 'Shipping address is required').max(1000, 'Address is too long'),
  notes: z.string().max(500, 'Notes are too long').optional(),
  paymentMethod: z.enum(['cod', 'gcash', 'maya', 'bank_transfer']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const SHIPPING_FEE = 100;

type CheckoutStep = 'auth' | 'details' | 'otp' | 'processing';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<CheckoutStep>('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const total = subtotal + SHIPPING_FEE;

  // Initialize step based on auth state
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setStep('details');
        // Pre-fill email from user
        if (user.email && !formData.customerEmail) {
          setFormData(prev => ({ ...prev, customerEmail: user.email! }));
        }
      } else {
        setStep('auth');
      }
    }
  }, [user, authLoading]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }

    // Validate form
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Move to OTP verification
    setStep('otp');
  };

  const handleOTPVerified = async () => {
    setStep('processing');
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone || null,
        shipping_address: formData.shippingAddress,
        notes: formData.notes || null,
        payment_method: formData.paymentMethod,
        subtotal,
        shipping_fee: SHIPPING_FEE,
        total,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
        })),
      };

      // Create the order first
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData,
      });

      if (error) throw error;

      // For e-wallet payments (GCash/Maya), redirect to Xendit
      if (formData.paymentMethod === 'gcash' || formData.paymentMethod === 'maya') {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-xendit-payment', {
          body: {
            order_id: data.order_id,
            order_number: data.order_number,
            amount: data.total,
            customer_email: formData.customerEmail,
            customer_name: formData.customerName,
            payment_method: formData.paymentMethod,
            items: items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        });

        if (paymentError || !paymentData?.redirect_url) {
          throw new Error(paymentData?.error || 'Failed to create payment session');
        }

        // Clear cart and redirect to Xendit payment page
        clearCart();
        window.location.href = paymentData.redirect_url;
        return;
      }

      // For COD/Bank Transfer, go to confirmation page
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: `Your order number is ${data.order_number}. We'll contact you soon.`,
      });
      navigate('/order-confirmation', { state: { orderNumber: data.order_number } });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
      setStep('details');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products before checking out.</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            if (step === 'otp') {
              setStep('details');
            } else if (step === 'details' && !user) {
              setStep('auth');
            } else {
              navigate(-1);
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'auth' || user ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${user ? 'bg-primary text-primary-foreground' : step === 'auth' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
              {user ? <CheckCircle2 className="h-4 w-4" /> : '1'}
            </div>
            <span className="hidden sm:inline text-sm">Account</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'details' || step === 'otp' || step === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'otp' || step === 'processing' ? 'bg-primary text-primary-foreground' : step === 'details' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
              {step === 'otp' || step === 'processing' ? <CheckCircle2 className="h-4 w-4" /> : '2'}
            </div>
            <span className="hidden sm:inline text-sm">Details</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'otp' || step === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'processing' ? 'bg-primary text-primary-foreground' : step === 'otp' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
              {step === 'processing' ? <CheckCircle2 className="h-4 w-4" /> : '3'}
            </div>
            <span className="hidden sm:inline text-sm">Verify</span>
          </div>
        </div>

        {/* Auth Step */}
        {step === 'auth' && (
          <CheckoutAuth onAuthenticated={() => setStep('details')} />
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <OTPVerification
            email={formData.customerEmail}
            phone={formData.customerPhone}
            customerName={formData.customerName}
            onVerified={handleOTPVerified}
            onBack={() => setStep('details')}
          />
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium">Placing your order...</p>
              <p className="text-muted-foreground">Please wait while we process your order.</p>
            </CardContent>
          </Card>
        )}

        {/* Details Step */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleChange('customerName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleChange('customerEmail', e.target.value)}
                        placeholder="your@email.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.customerEmail}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => handleChange('customerPhone', e.target.value)}
                        placeholder="+63 9XX XXX XXXX"
                      />
                      {errors.customerPhone && (
                        <p className="text-sm text-destructive mt-1">{errors.customerPhone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shippingAddress">Shipping Address *</Label>
                      <Textarea
                        id="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={(e) => handleChange('shippingAddress', e.target.value)}
                        placeholder="Enter your complete shipping address"
                        rows={3}
                      />
                      {errors.shippingAddress && (
                        <p className="text-sm text-destructive mt-1">{errors.shippingAddress}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Order Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder="Any special instructions for your order"
                        rows={2}
                      />
                      {errors.notes && (
                        <p className="text-sm text-destructive mt-1">{errors.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleChange('paymentMethod', value)}
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg bg-primary/5">
                        <RadioGroupItem value="gcash" id="gcash" />
                        <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                          <span className="flex items-center gap-2">
                            GCash
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg bg-primary/5">
                        <RadioGroupItem value="maya" id="maya" />
                        <Label htmlFor="maya" className="flex-1 cursor-pointer">
                          <span className="flex items-center gap-2">
                            Maya
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                          Bank Transfer
                        </Label>
                      </div>
                    </RadioGroup>
                    {(formData.paymentMethod === 'gcash' || formData.paymentMethod === 'maya') && (
                      <p className="text-xs text-muted-foreground mt-2">
                        You'll be redirected to {formData.paymentMethod === 'gcash' ? 'GCash' : 'Maya'} to complete payment
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₱{product.price.toFixed(2)} × {quantity}
                          </p>
                        </div>
                        <p className="font-medium">₱{(product.price * quantity).toFixed(2)}</p>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₱{SHIPPING_FEE.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total</span>
                        <span>₱{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      Continue to Verification
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
