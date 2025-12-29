import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  customerName: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ email, customerName, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();

  const sendOTP = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email, customer_name: customerName },
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: 'Code Sent!',
        description: `We sent a verification code to ${email}`,
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
        body: { email, code: otp },
      });

      if (error) throw error;

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

  const resendOTP = async () => {
    setOtp('');
    await sendOTP();
  };

  // Auto-send OTP on mount
  useState(() => {
    if (!otpSent) {
      sendOTP();
    }
  });

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          {otpSent ? (
            <>We sent a 6-digit code to <strong>{email}</strong></>
          ) : (
            'Sending verification code...'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Code expires in 10 minutes. Check your spam folder if you don't see the email.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
