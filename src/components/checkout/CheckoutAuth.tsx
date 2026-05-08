import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BASE_URL } from '@/config/constants';
import { Loader2, Eye, EyeOff, ShoppingBag } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { toast } = useToast();

  const attemptLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Allow users without an approval row during/after migration.
    if (data.user) {
      const { data: approval } = await supabase
        .from('user_approvals')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (approval?.status === 'pending' || approval?.status === 'rejected') {
        await supabase.auth.signOut();
        throw new Error('Your account is pending admin approval. Please wait for an admin to approve your account before logging in.');
      }
    }

    toast({
      title: 'Logged in!',
      description: 'Proceeding to checkout...',
    });
    onAuthenticated();
  };

  const attemptSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${BASE_URL}/checkout`,
      },
    });

    if (error) {
      // If user already exists, try logging in with the same credentials
      if (error.message?.includes('User already registered')) {
        toast({
          title: 'Account exists',
          description: 'Trying to log you in...',
        });
        try {
          await attemptLogin(email, password);
          return;
        } catch (loginError: unknown) {
          // Login failed, show appropriate message
          const loginMessage = getErrorMessage(loginError, '');
          if (loginMessage.includes('Invalid login credentials')) {
            throw new Error('An account with this email already exists. Please use your existing password to log in.');
          }
          throw loginError;
        }
      }
      throw error;
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      toast({
        title: 'Check your email',
        description: 'Please verify your email address to continue.',
      });
      return;
    }

    toast({
      title: 'Account created!',
      description: 'Your account is pending admin approval. You will be notified once approved. For now, you can continue as a guest.',
    });
    // Don't authenticate yet - they need approval first
    // onAuthenticated();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

      if (message.includes('Invalid login credentials')) {
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
        <CardTitle>{isLogin ? 'Login to Continue' : 'Create Account'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to your account to complete your order and track it later'
            : 'Create an account to track your orders and checkout faster next time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
              }}
              className="text-sm text-primary hover:underline"
              disabled={isSubmitting}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutAuth;
