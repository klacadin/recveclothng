"use client";

import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useSignIn } from "@clerk/nextjs/legacy";
import { getErrorMessage } from "@/utils/errors";

const passwordSchema = z
  .object({
    code: z.string().min(4, "Enter the code from your email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function toClerkError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "errors" in err) {
    const first = (
      err as { errors?: { longMessage?: string; message?: string }[] }
    ).errors?.[0];
    return first?.longMessage || first?.message || "Reset failed";
  }
  return getErrorMessage(err, "Failed to reset password. Please try again.");
}

function ResetPasswordUnavailable() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Password reset unavailable</CardTitle>
          <CardDescription>
            Clerk authentication is not configured for this environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/admin/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ClerkResetPassword() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    code?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse({
      code,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors: {
        code?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as "code" | "password" | "confirmPassword";
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!isLoaded || !signIn || !setActive) {
      toast({
        title: "Reset failed",
        description: "Auth service unavailable. Refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
      });

      if (attempt.status === "needs_new_password") {
        const reset = await signIn.resetPassword({ password });
        if (reset.status === "complete" && reset.createdSessionId) {
          await setActive({ session: reset.createdSessionId });
        }
      } else if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
      } else {
        const reset = await signIn.resetPassword({ password });
        if (reset.status === "complete" && reset.createdSessionId) {
          await setActive({ session: reset.createdSessionId });
        }
      }

      toast({
        title: "Password updated!",
        description: "Your password has been reset successfully.",
      });
      navigate("/admin/login");
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset failed",
        description: toClerkError(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailHint = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {emailHint
              ? `Enter the code sent to ${emailHint} and choose a new password.`
              : "Enter the email code and your new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Reset code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                disabled={isSubmitting}
              />
              {errors.code && (
                <p className="text-sm text-destructive mt-1">{errors.code}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                <p className="text-sm text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isLoaded}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link to="/forgot-password">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Request a new code
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const ResetPassword = () =>
  clerkEnabled ? <ClerkResetPassword /> : <ResetPasswordUnavailable />;

export default ResetPassword;
