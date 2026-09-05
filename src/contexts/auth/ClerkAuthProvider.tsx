"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
} from "@clerk/nextjs";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { AuthContext, type AuthContextType, type AuthUser, type AuthSession } from "./types";

function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (err && typeof err === "object" && "errors" in err) {
    const first = (
      err as { errors?: { message?: string; longMessage?: string }[] }
    ).errors?.[0];
    return new Error(
      first?.longMessage || first?.message || "Authentication failed"
    );
  }
  return new Error(String(err) || "Authentication failed");
}

const AUTH_LOAD_TIMEOUT_MS = 15_000;
const AUTH_READY_WAIT_MS = 8_000;
const AUTH_READY_POLL_MS = 50;

const AUTH_UNAVAILABLE_MESSAGE =
  "Auth service unavailable. Check your connection, refresh the page, and try again.";

type EmailCodeFactor = {
  strategy: "email_code";
  emailAddressId: string;
};

function isEmailCodeFactor(factor: {
  strategy: string;
}): factor is EmailCodeFactor {
  return factor.strategy === "email_code" && "emailAddressId" in factor;
}

async function waitForReady<T>(
  get: () => T | null | undefined,
  timeoutMs: number
): Promise<T | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const value = get();
    if (value) return value;
    await new Promise((r) => setTimeout(r, AUTH_READY_POLL_MS));
  }
  return null;
}

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >("approved");
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  /** emailAddressId for the pending Client Trust / MFA email code */
  const pendingEmailFactorIdRef = useRef<string | null>(null);

  const signInRef = useRef(signIn);
  const setSignInActiveRef = useRef(setSignInActive);
  const signUpRef = useRef(signUp);
  const setSignUpActiveRef = useRef(setSignUpActive);
  signInRef.current = signIn;
  setSignInActiveRef.current = setSignInActive;
  signUpRef.current = signUp;
  setSignUpActiveRef.current = setSignUpActive;

  const clerkReady = isLoaded && signInLoaded && signUpLoaded;

  useEffect(() => {
    if (clerkReady) {
      setLoadTimedOut(false);
      return;
    }
    const t = window.setTimeout(
      () => setLoadTimedOut(true),
      AUTH_LOAD_TIMEOUT_MS
    );
    return () => window.clearTimeout(t);
  }, [clerkReady]);

  useEffect(() => {
    if (!clerkUser) {
      setIsAdmin(false);
      return;
    }
    const role = (clerkUser.publicMetadata?.role as string) || "";
    setIsAdmin(role === "admin");
    if (role === "admin") {
      setIsApproved(true);
      setApprovalStatus("approved");
    }
  }, [clerkUser]);

  const authUnavailable = loadTimedOut && !clerkReady;

  async function getSignInReady() {
    return waitForReady(() => {
      const s = signInRef.current;
      const a = setSignInActiveRef.current;
      return s && a ? { signIn: s, setActive: a } : null;
    }, AUTH_READY_WAIT_MS);
  }

  /** Client Trust / MFA: send email_code and mark verification pending. */
  async function prepareEmailSecondFactor(attempt: {
    supportedSecondFactors?: Array<{ strategy: string; emailAddressId?: string }>;
  }): Promise<{ error: Error | null; needsVerification?: boolean }> {
    const ready = await getSignInReady();
    if (!ready) {
      return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
    }

    const emailCodeFactor = attempt.supportedSecondFactors?.find(isEmailCodeFactor);

    if (!emailCodeFactor) {
      return {
        error: new Error(
          "Sign-in needs a verification step that is not available for this account. Contact support."
        ),
      };
    }

    await ready.signIn.prepareSecondFactor({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });
    pendingEmailFactorIdRef.current = emailCodeFactor.emailAddressId;
    return { error: null, needsVerification: true };
  }

  const value: AuthContextType = {
    user: isSignedIn
      ? ({
        id: userId!,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
      } satisfies AuthUser)
      : null,
    session: isSignedIn
      ? ({ user: { id: userId! } } satisfies AuthSession)
      : null,
    isLoading: !clerkReady && !loadTimedOut,
    authUnavailable,
    isAdmin,
    isApproved,
    approvalStatus,
    clerkUserId: userId ?? null,
    signIn: async (email, password) => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }
        if (!email || !password) {
          return { error: new Error("Email and password are required.") };
        }

        const ready = await getSignInReady();
        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        pendingEmailFactorIdRef.current = null;

        let result = await ready.signIn.create({
          identifier: email,
          password,
        });

        // Password not applied yet — attempt first factor explicitly.
        if (result.status === "needs_first_factor") {
          result = await ready.signIn.attemptFirstFactor({
            strategy: "password",
            password,
          });
        }

        if (result.status === "complete" && result.createdSessionId) {
          await ready.setActive({ session: result.createdSessionId });
          return { error: null };
        }

        // Client Trust (new device) or MFA — email verification code.
        if (
          result.status === "needs_second_factor" ||
          result.status === "needs_client_trust"
        ) {
          return prepareEmailSecondFactor(result);
        }

        return {
          error: new Error(
            `Sign-in incomplete (${result.status || "unknown"}). Refresh and try again, or contact support.`
          ),
        };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    verifySignInCode: async (code) => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }
        const trimmed = code.trim();
        if (!trimmed) {
          return { error: new Error("Enter the verification code from your email.") };
        }

        const ready = await getSignInReady();
        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const result = await ready.signIn.attemptSecondFactor({
          strategy: "email_code",
          code: trimmed,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await ready.setActive({ session: result.createdSessionId });
          pendingEmailFactorIdRef.current = null;
          return { error: null };
        }

        return {
          error: new Error(
            `Verification incomplete (${result.status || "unknown"}). Try again.`
          ),
        };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    resendSignInCode: async () => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const ready = await getSignInReady();
        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const emailAddressId =
          pendingEmailFactorIdRef.current ||
          (
            ready.signIn.supportedSecondFactors as
            | Array<{ strategy: string }>
            | undefined
          )?.find(isEmailCodeFactor)?.emailAddressId;

        if (!emailAddressId) {
          return {
            error: new Error(
              "No pending verification. Sign in with your password again."
            ),
          };
        }

        await ready.signIn.prepareSecondFactor({
          strategy: "email_code",
          emailAddressId,
        });
        pendingEmailFactorIdRef.current = emailAddressId;
        return { error: null };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    signUp: async (email, password) => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }
        if (!email || !password) {
          return { error: new Error("Email and password are required.") };
        }

        const ready = await waitForReady(() => {
          const s = signUpRef.current;
          const a = setSignUpActiveRef.current;
          return s && a ? { signUp: s, setActive: a } : null;
        }, AUTH_READY_WAIT_MS);

        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const result = await ready.signUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === "complete") {
          if (result.createdSessionId) {
            await ready.setActive({ session: result.createdSessionId });
          }
          return { error: null };
        }

        // Clerk sends a numeric email code (not a magic link) for custom flows.
        const needsEmail =
          result.unverifiedFields?.includes("email_address") ||
          result.status === "missing_requirements";

        if (needsEmail) {
          await ready.signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          return { error: null, needsVerification: true };
        }

        return {
          error: new Error(
            `Sign-up incomplete (${result.status || "unknown"}). Refresh and try again.`
          ),
        };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    verifySignUpCode: async (code) => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }
        const trimmed = code.trim();
        if (!trimmed) {
          return {
            error: new Error("Enter the verification code from your email."),
          };
        }

        const ready = await waitForReady(() => {
          const s = signUpRef.current;
          const a = setSignUpActiveRef.current;
          return s && a ? { signUp: s, setActive: a } : null;
        }, AUTH_READY_WAIT_MS);

        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const result = await ready.signUp.attemptEmailAddressVerification({
          code: trimmed,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await ready.setActive({ session: result.createdSessionId });
          return { error: null };
        }

        return {
          error: new Error(
            `Verification incomplete (${result.status || "unknown"}). Check the code and try again.`
          ),
        };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    resendSignUpCode: async () => {
      try {
        if (authUnavailable) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        const ready = await waitForReady(() => {
          const s = signUpRef.current;
          return s ? { signUp: s } : null;
        }, AUTH_READY_WAIT_MS);

        if (!ready) {
          return { error: new Error(AUTH_UNAVAILABLE_MESSAGE) };
        }

        await ready.signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        return { error: null };
      } catch (err) {
        return { error: toError(err) };
      }
    },
    signOut: async () => {
      pendingEmailFactorIdRef.current = null;
      await clerkSignOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
