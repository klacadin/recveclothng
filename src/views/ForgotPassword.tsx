"use client";

import { useState } from "react";
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
import { BASE_URL } from "@/config/constants";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/nextjs/legacy";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ForgotPasswordUnavailable() {
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

function ClerkForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoaded, signIn } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isLoaded || !signIn) {
        throw new Error(
          "Auth service unavailable. Refresh the page and try again."
        );
      }

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We sent you a password reset code.",
      });
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      let errorMessage = "Failed to send reset email. Please try again.";
      if (err instanceof Error) errorMessage = err.message;
      else if (err && typeof err === "object" && "errors" in err) {
        const first = (
          err as { errors?: { longMessage?: string; message?: string }[] }
        ).errors?.[0];
        errorMessage = first?.longMessage || first?.message || errorMessage;
      }
      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We sent a password reset code to <strong>{email}</strong>. Open
              the email, then continue to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Button asChild className="w-full">
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
              >
                Enter reset code
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              Try a different email
            </Button>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send a reset code (
            {BASE_URL.replace(/^https?:\/\//, "")}).
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
                placeholder="admin@example.com"
                disabled={isSubmitting || !isLoaded}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
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
                  Sending...
                </>
              ) : (
                "Send reset code"
              )}
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/admin/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const ForgotPassword = () =>
  clerkEnabled ? <ClerkForgotPassword /> : <ForgotPasswordUnavailable />;

export default ForgotPassword;
