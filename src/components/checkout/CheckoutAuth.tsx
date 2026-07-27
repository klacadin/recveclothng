import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, ShoppingBag, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { getErrorMessage } from '@/utils/errors';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface CheckoutAuthProps {
  onAuthenticated: () => void;
}

const CheckoutAuth = ({ onAuthenticated }: CheckoutAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationKind, setVerificationKind] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; code?: string }>({});
  const { toast } = useToast();
  const {
    signIn,
    signUp,
    verifySignInCode,
    resendSignInCode,
    verifySignUpCode,
    resendSignUpCode,
    isLoading,
    authUnavailable,
  } = useAuth();
  const formDisabled = isSubmitting || isLoading || authUnavailable;

  const attemptLogin = async (email: string, password: string) => {
    const { error, approvalError, needsVerification: verifyNext } = await signIn(
      email,
      password
    );
    if (verifyNext) {
      setVerificationKind('signin');
      setNeedsVerification(true);
      setCode('');
      toast({
        title: 'Check your email',
        description: 'Enter the 6-digit verification code we sent (no link).',
      });
      return;
    }
    if (error) {
      if (approvalError) {
        throw new Error(
          error.message ||
          'Your account is pending admin approval. Please wait for an admin to approve your account before logging in.'
        );
      }
      throw error;
    }

    toast({
      title: 'Logged in!',
      description: 'Proceeding to checkout...',
    });
    onAuthenticated();
  };

  const attemptSignup = async (email: string, password: string) => {
    const { error, needsVerification: verifyNext } = await signUp(email, password);

    if (verifyNext) {
      setVerificationKind('signup');
      setNeedsVerification(true);
      setCode('');
      toast({
        title: 'Check your email',
        description: 'Enter the 6-digit verification code we sent (no link).',
      });
      return;
    }

    if (error) {
      const msg = error.message || '';
      if (
        msg.toLowerCase().includes('already') ||
        msg.toLowerCase().includes('exists') ||
        msg.toLowerCase().includes('identifier')
      ) {
        toast({
          title: 'Account exists',
          description: 'Trying to log you in...',
        });
        try {
          await attemptLogin(email, password);
          return;
        } catch (loginError: unknown) {
          const loginMessage = getErrorMessage(loginError, '');
          if (loginMessage.toLowerCase().includes('password') || loginMessage.toLowerCase().includes('credential')) {
            throw new Error(
              'An account with this email already exists. Please use your existing password to log in.'
            );
          }
          throw loginError;
        }
      }
      throw error;
    }

    toast({
      title: 'Account created!',
      description: 'You can continue checkout.',
    });
    onAuthenticated();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formDisabled) return;

    const trimmed = code.trim();
    if (!trimmed) {
      setErrors({ code: 'Enter the code from your email' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const { error } =
        verificationKind === 'signup'
          ? await verifySignUpCode(trimmed)
          : await verifySignInCode(trimmed);
      if (error) {
        toast({
          title: 'Verification failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      setNeedsVerification(false);
      toast({
        title: verificationKind === 'signup' ? 'Account verified!' : 'Logged in!',
        description: 'Proceeding to checkout...',
      });
      onAuthenticated();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (formDisabled) return;
    setIsSubmitting(true);
    try {
      const { error } =
        verificationKind === 'signup'
          ? await resendSignUpCode()
          : await resendSignInCode();
      if (error) {
        toast({
          title: 'Could not resend code',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Code sent',
        description: 'Check your email for a new 6-digit verification code.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isLoading || authUnavailable) {
      toast({
        title: authUnavailable ? 'Auth service unavailable' : 'Please wait',
        description: authUnavailable
          ? 'Clerk is not ready. Refresh the page and try again.'
          : 'Sign-in is still initializing…',
        variant: 'destructive',
      });
      return;
    }

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await attemptLogin(email, password);
      } else {
        await attemptSignup(email, password);
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      let message = getErrorMessage(error, 'Authentication failed. Please try again.');

      if (message.includes('Invalid login credentials') || message.toLowerCase().includes('incorrect')) {
        message = 'Invalid email or password. Please try again.';
      } else if (message.includes('already exists')) {
        setIsLogin(true);
      }

      toast({
        title: isLogin ? 'Login failed' : 'Signup failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>
          {needsVerification
            ? 'Verify your email'
            : isLogin
              ? 'Login to Continue'
              : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {needsVerification
            ? `Enter the code we sent to ${email}`
            : isLogin
              ? 'Sign in to your account to complete your order and track it later'
              : 'Create an account to track your orders and checkout faster next time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {authUnavailable && !isLoading && (
          <div className="mb-4 rounded-sm border border-destructive/40 bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">Auth service unavailable</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clerk did not finish loading. Refresh the page and try again.
            </p>
          </div>
        )}
        {!isLoading && needsVerification && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="rounded-sm border border-border bg-muted/40 p-3 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from your email. There is no verification link — use the
                code only.
              </p>
            </div>
            <div>
              <Label htmlFor="checkout-code">Verification code</Label>
              <Input
                id="checkout-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                disabled={formDisabled}
              />
              {errors.code && (
                <p className="text-sm text-destructive mt-1">{errors.code}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={formDisabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                'Verify and continue'
              )}
            </Button>
            <div className="flex flex-col gap-2 text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
                disabled={formDisabled}
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setNeedsVerification(false);
                  setCode('');
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:underline"
                disabled={formDisabled}
              >
                Back to password
              </button>
            </div>
          </form>
        )}
        {!isLoading && !needsVerification && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={formDisabled}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={formDisabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={formDisabled}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
              {isLogin && (
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={formDisabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setNeedsVerification(false);
                }}
                className="text-sm text-primary hover:underline"
                disabled={formDisabled}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutAuth;
