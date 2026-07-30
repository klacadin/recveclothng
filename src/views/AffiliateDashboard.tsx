"use client";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link2, Loader2, ShieldCheck } from "lucide-react";
import {
  AFFILIATE_CODE_LENGTH,
  AFFILIATE_DASHBOARD_PATH,
  AFFILIATE_JOIN_PATH,
  AFFILIATE_LOGIN_PATH,
  affiliateShareUrl,
  isValidAffiliateCode,
  normalizeAffiliateCode,
} from "@/lib/affiliate-constants";
import { getErrorMessage } from "@/utils/errors";

type Commission = {
  id: string;
  orderNumber: string;
  orderSubtotal: string;
  commissionRate: string;
  commissionAmount: string;
  createdAt: string;
};

type Stats = {
  confirmedOrders: number;
  totalSales: number;
  totalEarnings: number;
};

type Affiliate = {
  id: string;
  code: string;
  name: string;
  status: string;
  commissionRate: string;
};

function affiliateLink(code: string) {
  return affiliateShareUrl(code);
}

function userEmail(user: { email?: string } | null): string {
  return (user?.email || "").trim().toLowerCase();
}

export default function AffiliateDashboard() {
  const {
    user,
    isLoading: authLoading,
    authUnavailable,
    signIn,
    signUp,
    verifySignInCode,
    resendSignInCode,
    verifySignUpCode,
    resendSignUpCode,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const legacyAction = searchParams.get("action");

  const pathMode: "login" | "register" | "dashboard" =
    location.pathname === AFFILIATE_LOGIN_PATH
      ? "login"
      : location.pathname === AFFILIATE_JOIN_PATH
        ? "register"
        : "dashboard";

  const [authMode, setAuthMode] = useState<"login" | "register">(
    pathMode === "register" ? "register" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  /** Which pending flow the email code belongs to */
  const [verificationKind, setVerificationKind] = useState<"signin" | "signup">(
    "signin"
  );
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [desiredCode, setDesiredCode] = useState("");
  const [savingCode, setSavingCode] = useState(false);

  const formDisabled = authSubmitting || authLoading || authUnavailable;

  // Canonical paths + legacy ?action= redirects
  useEffect(() => {
    if (location.pathname === "/affiliate") {
      if (legacyAction === "login") {
        navigate(AFFILIATE_LOGIN_PATH, { replace: true });
        return;
      }
      if (legacyAction === "register") {
        navigate(AFFILIATE_JOIN_PATH, { replace: true });
        return;
      }
      navigate(AFFILIATE_DASHBOARD_PATH, { replace: true });
      return;
    }
    if (legacyAction === "login" || legacyAction === "register") {
      navigate(
        legacyAction === "login" ? AFFILIATE_LOGIN_PATH : AFFILIATE_JOIN_PATH,
        { replace: true }
      );
    }
  }, [location.pathname, legacyAction, navigate]);

  useEffect(() => {
    if (pathMode === "login" || pathMode === "dashboard") setAuthMode("login");
    if (pathMode === "register") setAuthMode("register");
  }, [pathMode]);

  useEffect(() => {
    if (user && (pathMode === "login" || pathMode === "register")) {
      navigate(AFFILIATE_DASHBOARD_PATH, { replace: true });
    }
  }, [user, pathMode, navigate]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliate");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to load");
      setAffiliate(data.affiliate ?? null);
      setStats(data.stats);
      setCommissions(data.commissions || []);
      setMessage(data.message || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) void load();
    else {
      setLoading(false);
      setAffiliate(null);
    }
  }, [user]);

  const goToDashboard = () => {
    navigate(AFFILIATE_DASHBOARD_PATH, { replace: true });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authLoading || authUnavailable) {
      setAuthError(
        authUnavailable
          ? "Auth service unavailable. Refresh and try again."
          : "Sign-in is still initializing…"
      );
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password || password.length < 6) {
      setAuthError("Enter a valid email and a password (at least 6 characters).");
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authMode === "login") {
        const { error: err, needsVerification: verifyNext } = await signIn(
          trimmedEmail,
          password
        );
        if (verifyNext) {
          setVerificationKind("signin");
          setNeedsVerification(true);
          setAuthCode("");
          return;
        }
        if (err) throw err;
        goToDashboard();
      } else {
        const { error: err, needsVerification: verifyNext } = await signUp(
          trimmedEmail,
          password
        );
        if (verifyNext) {
          setVerificationKind("signup");
          setNeedsVerification(true);
          setAuthCode("");
          return;
        }
        if (err) {
          const msg = err.message || "";
          if (
            msg.toLowerCase().includes("already") ||
            msg.toLowerCase().includes("exists") ||
            msg.toLowerCase().includes("identifier")
          ) {
            // Account exists — try signing in instead
            const login = await signIn(trimmedEmail, password);
            if (login.needsVerification) {
              setVerificationKind("signin");
              setNeedsVerification(true);
              setAuthCode("");
              setAuthMode("login");
              navigate(AFFILIATE_LOGIN_PATH, { replace: true });
              return;
            }
            if (login.error) throw login.error;
            goToDashboard();
            return;
          }
          throw err;
        }
        goToDashboard();
      }
    } catch (err: unknown) {
      setAuthError(getErrorMessage(err, "Authentication failed. Please try again."));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = authCode.trim();
    if (!trimmed) {
      setAuthError("Enter the 6-digit verification code from your email.");
      return;
    }
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const { error: err } =
        verificationKind === "signup"
          ? await verifySignUpCode(trimmed)
          : await verifySignInCode(trimmed);
      if (err) throw err;
      setNeedsVerification(false);
      goToDashboard();
    } catch (err: unknown) {
      setAuthError(getErrorMessage(err, "Verification failed."));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResend = async () => {
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const { error: err } =
        verificationKind === "signup"
          ? await resendSignUpCode()
          : await resendSignInCode();
      if (err) throw err;
    } catch (err: unknown) {
      setAuthError(getErrorMessage(err, "Could not resend code."));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const register = async () => {
    if (!user) return;
    const code = normalizeAffiliateCode(desiredCode);
    if (!isValidAffiliateCode(code)) {
      setError(`Pick an 8-character code (a–z, 0–9). Example: reve2026`);
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const emailAddr = userEmail(user as { email?: string });
      if (!emailAddr) {
        throw new Error("Your account has no email yet. Refresh and try again.");
      }
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          self: true,
          name:
            displayName.trim() ||
            emailAddr.split("@")[0] ||
            "Affiliate",
          email: emailAddr,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          [data.error, data.detail].filter(Boolean).join(" — ") || "Failed to register"
        );
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to register");
    } finally {
      setCreating(false);
    }
  };

  const saveCode = async () => {
    const code = normalizeAffiliateCode(desiredCode);
    if (!isValidAffiliateCode(code)) {
      setError(`Code must be exactly ${AFFILIATE_CODE_LENGTH} characters (a–z, 0–9)`);
      return;
    }
    setSavingCode(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          [data.error, data.detail].filter(Boolean).join(" — ") || "Failed to update code"
        );
      }
      setAffiliate(data.affiliate);
      setMessage(data.message || null);
      setDesiredCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update code");
    } finally {
      setSavingCode(false);
    }
  };

  const link = affiliate?.status === "active" ? affiliateLink(affiliate.code) : "";

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = affiliate?.status;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container pt-24 pb-12 px-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Affiliate program</h1>
        <p className="text-muted-foreground text-sm mb-6 max-w-xl">
          Earn commission on product subtotal for confirmed paid orders attributed to your
          unique link (default 10% — your exact rate is shown on your account once approved).
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-8 text-muted-foreground">
          <Link
            to={AFFILIATE_JOIN_PATH}
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Register
          </Link>
          <span aria-hidden>·</span>
          <Link
            to={AFFILIATE_LOGIN_PATH}
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Login
          </Link>
          <span aria-hidden>·</span>
          <Link
            to={AFFILIATE_DASHBOARD_PATH}
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Manage dashboard
          </Link>
        </div>

        {authLoading || (user && loading) ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : !user ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>
                {needsVerification
                  ? "Verify your email"
                  : authMode === "login"
                    ? "Affiliate login"
                    : "Become an affiliate"}
              </CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                {needsVerification
                  ? `Enter the 6-digit code we emailed to ${email} (there is no link — use the code).`
                  : authMode === "login"
                    ? "Sign in to manage your affiliate dashboard"
                    : "Create a free account, then pick your 8-character code"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {authUnavailable && (
                <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">Auth service unavailable</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Refresh the page and try again.
                  </p>
                </div>
              )}
              {authError && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{authError}</p>
              )}

              {needsVerification ? (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="rounded-sm border border-border bg-muted/40 p-3 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Look for a short numeric code in your email — paste it here.
                      There is no verification link in this email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aff-auth-code">Verification code</Label>
                    <Input
                      id="aff-auth-code"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      disabled={formDisabled}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={formDisabled}>
                    {authSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      "Verify and continue"
                    )}
                  </Button>
                  <div className="flex flex-col gap-2 text-center">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={handleResend}
                      disabled={formDisabled}
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:underline"
                      onClick={() => {
                        setNeedsVerification(false);
                        setAuthCode("");
                      }}
                      disabled={formDisabled}
                    >
                      Back to password
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="aff-display-name">Display name (optional)</Label>
                      <Input
                        id="aff-display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name or brand"
                        disabled={formDisabled}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="aff-email">Email</Label>
                    <Input
                      id="aff-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      disabled={formDisabled}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aff-password">Password</Label>
                    <Input
                      id="aff-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={
                        authMode === "login" ? "current-password" : "new-password"
                      }
                      disabled={formDisabled}
                      required
                      minLength={6}
                    />
                    {authMode === "login" && (
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
                  <Button type="submit" className="w-full" size="lg" disabled={formDisabled}>
                    {authSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait…
                      </>
                    ) : authMode === "login" ? (
                      "Sign in"
                    ) : (
                      "Create account"
                    )}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      disabled={formDisabled}
                      onClick={() => {
                        const next =
                          authMode === "login"
                            ? AFFILIATE_JOIN_PATH
                            : AFFILIATE_LOGIN_PATH;
                        setAuthMode(authMode === "login" ? "register" : "login");
                        setAuthError(null);
                        setNeedsVerification(false);
                        navigate(next);
                      }}
                    >
                      {authMode === "login"
                        ? "Don't have an account? Register"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>
            )}

            {!affiliate ? (
              <Card>
                <CardContent className="py-10 space-y-5 max-w-md mx-auto">
                  <div className="text-center space-y-2">
                    <p className="font-medium text-foreground text-lg">Become an affiliate</p>
                    <p className="text-sm text-muted-foreground">
                      Signed in as{" "}
                      <span className="text-foreground">
                        {userEmail(user as { email?: string }) || "your account"}
                      </span>
                      . Choose your 8-character handle — an admin will approve before your link
                      goes live.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aff-name-apply">Display name (optional)</Label>
                    <Input
                      id="aff-name-apply"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name or brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aff-handle">Your code (exactly 8 characters)</Label>
                    <Input
                      id="aff-handle"
                      value={desiredCode}
                      maxLength={AFFILIATE_CODE_LENGTH}
                      onChange={(e) =>
                        setDesiredCode(normalizeAffiliateCode(e.target.value).slice(0, 8))
                      }
                      placeholder="e.g. reve2026"
                      className="font-mono tracking-wider"
                    />
                    <p className="text-xs text-muted-foreground">
                      Link will be:{" "}
                      {typeof window !== "undefined" ? window.location.origin : ""}
                      /affiliate/{desiredCode || "________"}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={register}
                    disabled={creating || desiredCode.length !== AFFILIATE_CODE_LENGTH}
                  >
                    {creating ? "Applying…" : "Submit application"}
                  </Button>
                </CardContent>
              </Card>
            ) : status === "pending" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Application pending</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {message ||
                      "Your application is pending. You can still change your 8-character code."}
                  </p>
                  <p className="text-sm">
                    Current code:{" "}
                    <code className="bg-secondary px-1.5 py-0.5 rounded">{affiliate.code}</code>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={desiredCode}
                      maxLength={AFFILIATE_CODE_LENGTH}
                      onChange={(e) =>
                        setDesiredCode(normalizeAffiliateCode(e.target.value).slice(0, 8))
                      }
                      placeholder={affiliate.code}
                      className="font-mono"
                    />
                    <Button
                      onClick={saveCode}
                      disabled={savingCode || desiredCode.length !== AFFILIATE_CODE_LENGTH}
                    >
                      {savingCode ? "Saving…" : "Update code"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : status === "inactive" ? (
              <Card>
                <CardContent className="py-10 text-center space-y-2">
                  <p className="font-medium">Account inactive</p>
                  <p className="text-sm text-muted-foreground">
                    {message ||
                      "Your affiliate account is inactive. Contact REVE if you think this is a mistake."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Your link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Code{" "}
                      <code className="bg-secondary px-1.5 py-0.5 rounded">{affiliate.code}</code>
                      {" · "}
                      {(Number(affiliate.commissionRate) * 100).toFixed(0)}% commission
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input readOnly value={link} className="font-mono text-sm" />
                      <Button type="button" onClick={copyLink} variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Input
                        value={desiredCode}
                        maxLength={AFFILIATE_CODE_LENGTH}
                        onChange={(e) =>
                          setDesiredCode(normalizeAffiliateCode(e.target.value).slice(0, 8))
                        }
                        placeholder={affiliate.code}
                        className="font-mono"
                      />
                      <Button
                        onClick={saveCode}
                        disabled={savingCode || desiredCode.length !== AFFILIATE_CODE_LENGTH}
                        variant="secondary"
                      >
                        {savingCode ? "Saving…" : "Change code"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Confirmed orders
                      </p>
                      <p className="text-2xl font-bold mt-1">{stats?.confirmedOrders ?? 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Sales
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        ₱{(stats?.totalSales ?? 0).toLocaleString("en-PH")}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Earnings
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        ₱{(stats?.totalEarnings ?? 0).toLocaleString("en-PH")}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Commission history</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {commissions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No commissions yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-muted-foreground border-b">
                              <th className="py-2 pr-2">Order</th>
                              <th className="py-2 pr-2">Subtotal</th>
                              <th className="py-2 pr-2">Commission</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commissions.map((c) => (
                              <tr key={c.id} className="border-b border-border/60">
                                <td className="py-2 pr-2 font-mono text-xs">{c.orderNumber}</td>
                                <td className="py-2 pr-2">
                                  ₱{Number(c.orderSubtotal).toLocaleString("en-PH")}
                                </td>
                                <td className="py-2 pr-2">
                                  ₱{Number(c.commissionAmount).toLocaleString("en-PH")}
                                </td>
                                <td className="py-2">
                                  {new Date(c.createdAt).toLocaleDateString("en-PH")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
