"use client";

import { createContext } from "react";

/** Minimal auth user shape (Clerk-backed; not Supabase). */
export type AuthUser = {
  id: string;
  email?: string | null;
};

export type AuthSession = {
  user: { id: string };
};

export type SignInResult = {
  error: Error | null;
  approvalError?: boolean;
  /** Password OK; Clerk Client Trust / MFA needs an email code next. */
  needsVerification?: boolean;
};

export type SignUpResult = {
  error: Error | null;
  /** Email verification code was sent — enter it to finish sign-up. */
  needsVerification?: boolean;
};

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  /** True until Clerk hooks are ready, or until load timed out. */
  isLoading: boolean;
  /** True when Clerk failed to become ready (proxy/FAPI). Forms should not submit. */
  authUnavailable: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  approvalStatus: "pending" | "approved" | "rejected" | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Complete Client Trust / MFA after signIn returned needsVerification. */
  verifySignInCode: (code: string) => Promise<{ error: Error | null }>;
  /** Resend the email verification code for the pending sign-in. */
  resendSignInCode: () => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  /** Complete email verification after signUp returned needsVerification. */
  verifySignUpCode: (code: string) => Promise<{ error: Error | null }>;
  /** Resend the sign-up email verification code. */
  resendSignUpCode: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  clerkUserId: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
