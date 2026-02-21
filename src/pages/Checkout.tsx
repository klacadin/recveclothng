import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
// OTP verification removed - only COD requires it, but COD is hidden for now
import { SHIPPING_FEE, CONVENIENCE_FEE, TEST_VOUCHER_CODE, TEST_VOUCHER_DISCOUNT_PERCENT } from '@/config/constants';
import PhilippineAddressSelect from '@/components/checkout/PhilippineAddressSelect';
import { buildAddressString } from '@/hooks/usePhilippineAddress';
import { getProductDisplayImage } from '@/data/productImages';

const checkoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  customerEmail: z.string().email('Invalid email address').max(320, 'Email is too long'),
  customerPhone: z.string().min(1, 'Phone number is required').max(50, 'Phone number is too long'),
  streetAddress: z.string().min(1, 'Street address is required (house no., street, landmark)').max(500, 'Address is too long'),
  addressSelections: z.object({
    regionCode: z.string(),
    regionName: z.string().optional(),
    provinceCode: z.string(),
    provinceName: z.string().optional(),
    cityCode: z.string(),
    cityName: z.string().optional(),
    barangayCode: z.string(),
    barangayName: z.string().optional(),
  }),
  notes: z.string().max(500, 'Notes are too long').optional(),
  paymentMethod: z.enum(['cod', 'gcash', 'maya', 'bank_transfer']),
}).refine(
  (data) => {
    const a = data.addressSelections;
    const isNCR = a.regionCode === '130000000';
    if (isNCR) return !!(a.regionCode && a.cityCode && a.barangayCode);
    return !!(a.regionCode && a.provinceCode && a.cityCode && a.barangayCode);
  },
  { message: 'Please complete all address fields (region, city, barangay)', path: ['addressSelections'] }
);

type CheckoutFormData = z.infer<typeof checkoutSchema>;

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
    streetAddress: '',
    addressSelections: {
      regionCode: '',
      regionName: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      barangayCode: '',
      barangayName: '',
    },
    notes: '',
    paymentMethod: 'gcash',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);

  const isTestVoucher = voucherApplied && voucherCode.toUpperCase().trim() === TEST_VOUCHER_CODE;
  // Discount applies to subtotal only — never to shipping or convenience fee
  const discountAmount = isTestVoucher ? Math.floor(subtotal * (TEST_VOUCHER_DISCOUNT_PERCENT / 100)) : 0;
  const total = Math.max(1, subtotal - discountAmount + SHIPPING_FEE + CONVENIENCE_FEE);

  // Initialize step: allow guest checkout (skip auth), or go to details when logged in
  useEffect(() => {
    if (!authLoading) {
      setStep('details');
      if (user?.email && !formData.customerEmail) {
        setFormData(prev => ({ ...prev, customerEmail: user.email! }));
      }
      // COD is hidden - ensure a valid payment method is selected
      if (formData.paymentMethod === 'cod') {
        setFormData(prev => ({ ...prev, paymentMethod: 'gcash' }));
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

    // Skip OTP for online payments (GCash/Maya/Bank Transfer)
    // Only COD requires OTP, but COD is hidden, so skip OTP for all payment methods
    handleOTPVerified();
  };

  const handleOTPVerified = async () => {
    setStep('processing');
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        shipping_address: buildAddressString(formData.streetAddress, formData.addressSelections),
        notes: formData.notes || null,
        payment_method: formData.paymentMethod,
        subtotal,
        shipping_fee: SHIPPING_FEE,
        total,
        voucher_code: voucherApplied ? voucherCode.trim() : null,
        user_id: user?.id || null, // Link order to authenticated user
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
          size: item.size, // Include size for variant stock reservation
        })),
      };

      // Create order via direct fetch (avoids Supabase client JWT/session edge function errors)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const orderRes = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        let errorMessage = data?.error || data?.message || 'Failed to place order';
        if (orderRes.status === 409) errorMessage = 'A similar order was recently placed. Please wait a few minutes before ordering again.';
        else if (orderRes.status === 429) errorMessage = 'Too many orders. Please wait before placing another order.';
        else if (orderRes.status === 400) errorMessage = data?.error || 'Invalid order data. Please check your information and try again.';
        throw new Error(errorMessage);
      }

      if (!data?.order_id) {
        throw new Error(data?.error || 'Failed to create order');
      }

      // HitPay: create-order returns redirect_url for GCash/Maya/Bank Transfer (QR Ph)
      if (formData.paymentMethod === 'gcash' || formData.paymentMethod === 'maya' || formData.paymentMethod === 'bank_transfer') {
        if (data.redirect_url) {
          clearCart();
          window.location.href = data.redirect_url;
          return;
        }
        toast({
          title: 'Payment initiation failed',
          description: 'Could not create payment. Please try again or contact support.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        setStep('details');
        return;
      }

      // COD: go to confirmation (no proof needed)
      // Clear cart after order is successfully created
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: `Your order number is ${data.order_number}. We'll contact you soon.`,
      });
      navigate('/order-confirmation', { state: { orderNumber: data.order_number } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      toast({
        title: 'Order failed',
        description: errorMessage,
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
            if (step === 'processing') {
              // Don't allow going back during processing
              return;
            }
            navigate(-1);
          }}
          disabled={step === 'processing'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps: Details → Payment (OTP skipped for online payments) */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-primary">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
              {step === 'processing' ? <CheckCircle2 className="h-4 w-4" /> : '1'}
            </div>
            <span className="hidden sm:inline text-sm">Details</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
              {step === 'processing' ? <CheckCircle2 className="h-4 w-4" /> : '2'}
            </div>
            <span className="hidden sm:inline text-sm">Payment</span>
          </div>
        </div>

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
                      <Label htmlFor="customerPhone">Phone Number <span className="text-destructive">*</span></Label>
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
                      <Label htmlFor="streetAddress">Street Address *</Label>
                      <Input
                        id="streetAddress"
                        value={formData.streetAddress}
                        onChange={(e) => handleChange('streetAddress', e.target.value)}
                        placeholder="House/unit no., street, building, landmark"
                      />
                      {errors.streetAddress && (
                        <p className="text-sm text-destructive mt-1">{errors.streetAddress}</p>
                      )}
                    </div>

                    <div>
                      <Label>Location (Region to Barangay) *</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Select your address to ensure accurate J&T delivery
                      </p>
                      <PhilippineAddressSelect
                        value={formData.addressSelections}
                        onChange={(sel) => {
                          setFormData((prev) => ({ ...prev, addressSelections: { ...prev.addressSelections, ...sel } }));
                          if (errors.addressSelections) setErrors((prev) => ({ ...prev, addressSelections: undefined }));
                        }}
                      />
                      {errors.addressSelections && (
                        <p className="text-sm text-destructive mt-1">{errors.addressSelections}</p>
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
                      {/* COD is hidden for now - only online payments available */}
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
                    {(formData.paymentMethod === 'gcash' || formData.paymentMethod === 'maya' || formData.paymentMethod === 'bank_transfer') && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {formData.paymentMethod === 'gcash' && 'Opens GCash app.'}
                        {formData.paymentMethod === 'maya' && 'Opens Maya app.'}
                        {formData.paymentMethod === 'bank_transfer' && 'Pay via QR Ph—scan with your bank app.'}
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
                          <img
                            src={getProductDisplayImage(product)}
                            alt={product.name}
                            className="w-full h-full object-contain bg-secondary"
                          />
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
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Convenience fee</span>
                        <span>₱{CONVENIENCE_FEE.toFixed(2)}</span>
                      </div>
                      {/* Test voucher for low-cost payment testing */}
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Voucher code"
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value.toUpperCase());
                            setVoucherApplied(false);
                          }}
                          className="flex-1"
                          disabled={voucherApplied}
                        />
                        <Button
                          type="button"
                          variant={voucherApplied ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (voucherApplied) {
                              setVoucherApplied(false);
                              setVoucherCode('');
                              return;
                            }
                            const code = voucherCode.trim().toUpperCase();
                            if (code === TEST_VOUCHER_CODE) {
                              setVoucherApplied(true);
                              setVoucherCode(code);
                              toast({ title: 'Voucher applied!', description: `${TEST_VOUCHER_DISCOUNT_PERCENT}% off — for testing only.` });
                            } else if (code) {
                              toast({ title: 'Invalid voucher', description: 'Code not found.', variant: 'destructive' });
                            }
                          }}
                          disabled={!voucherCode.trim() && !voucherApplied}
                        >
                          {voucherApplied ? 'Remove' : 'Apply'}
                        </Button>
                      </div>
                      {voucherApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Voucher ({TEST_VOUCHER_CODE}) -{TEST_VOUCHER_DISCOUNT_PERCENT}%</span>
                          <span>-₱{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
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
                      {user ? 'Continue to Verification' : 'Proceed to Payment'}
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
