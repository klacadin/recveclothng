import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Phone, RefreshCw } from 'lucide-react';

type VerificationMethod = 'email' | 'sms';

interface OTPVerificationProps {
  email: string;
  phone?: string;
  customerName: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ email, phone, customerName, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [method, setMethod] = useState<VerificationMethod>('email');
  const [currentIdentifier, setCurrentIdentifier] = useState(email);
  const { toast } = useToast();

  const hasPhone = phone && phone.trim().length >= 10;

  const sendOTP = async (selectedMethod: VerificationMethod = method) => {
    setIsSending(true);
    try {
      const body: Record<string, string> = {
        customer_name: customerName,
        method: selectedMethod,
      };

      if (selectedMethod === 'email') {
        body.email = email;
        setCurrentIdentifier(email);
      } else {
        body.phone = phone!;
        setCurrentIdentifier(phone!);
      }

      const { data, error } = await supabase.functions.invoke('send-otp', {
        body,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: 'Code Sent!',
        description: selectedMethod === 'email' 
          ? `We sent a verification code to ${email}`
          : `We sent a verification code to ${phone}`,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Failed to send code',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { identifier: currentIdentifier, code: otp },
      });

      if (error) {
        // Try to extract the actual error message from the response
        let errorMessage = 'Invalid or expired code. Please try again.';
        if (error.context?.body) {
          try {
            const errorBody = await error.context.body.json();
            if (errorBody?.error) {
              errorMessage = errorBody.error;
            }
          } catch {
            // Use default message if parsing fails
          }
        }
        throw new Error(errorMessage);
      }

      if (data.verified) {
        toast({
          title: 'Verified!',
          description: 'Your order is being placed.',
        });
        onVerified();
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Verification failed',
        description: error.message || 'Invalid or expired code. Please try again.',
        variant: 'destructive',
      });
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMethodChange = (newMethod: VerificationMethod) => {
    setMethod(newMethod);
    setOtp('');
    setOtpSent(false);
  };

  const resendOTP = async () => {
    setOtp('');
    await sendOTP(method);
  };

  // Auto-send OTP on mount
  useEffect(() => {
    if (!otpSent) {
      sendOTP();
    }
  }, []);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          {method === 'email' ? (
            <Mail className="h-6 w-6 text-primary" />
          ) : (
            <Phone className="h-6 w-6 text-primary" />
          )}
        </div>
        <CardTitle>Verify Your Order</CardTitle>
        <CardDescription>
          {otpSent ? (
            method === 'email' ? (
              <>We sent a 6-digit code to <strong>{email}</strong></>
            ) : (
              <>We sent a 6-digit code to <strong>{phone}</strong></>
            )
          ) : (
            'Sending verification code...'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection - only show if phone is available */}
        {hasPhone && !otpSent && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Send code via:</Label>
            <RadioGroup
              value={method}
              onValueChange={(value) => handleMethodChange(value as VerificationMethod)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="method-email" />
                <Label htmlFor="method-email" className="cursor-pointer flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="method-sms" />
                <Label htmlFor="method-sms" className="cursor-pointer flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  SMS
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {isSending && !otpSent ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button
                onClick={verifyOTP}
                className="w-full"
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Place Order'
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={resendOTP}
                  className="flex-1"
                  disabled={isSending || isVerifying}
                >
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Resend
                </Button>
              </div>

              {/* Switch method after OTP sent */}
              {hasPhone && otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    const newMethod = method === 'email' ? 'sms' : 'email';
                    setMethod(newMethod);
                    setOtp('');
                    setOtpSent(false);
                    sendOTP(newMethod);
                  }}
                  className="w-full text-sm text-primary hover:underline"
                  disabled={isSending || isVerifying}
                >
                  {method === 'email' 
                    ? "Didn't receive email? Try SMS instead" 
                    : "Didn't receive SMS? Try email instead"}
                </button>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Code expires in 10 minutes. 
              {method === 'email' && ' Check your spam folder if you don\'t see the email.'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
