"use client";

import { useContext, ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth/types";
import { ClerkAuthProvider } from "./auth/ClerkAuthProvider";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const disabledAuth: AuthContextType = {
  user: null,
  session: null,
  isLoading: false,
  authUnavailable: true,
  isAdmin: false,
  isApproved: true,
  approvalStatus: "approved",
  clerkUserId: null,
  signIn: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  verifySignInCode: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  resendSignInCode: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  signUp: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  verifySignUpCode: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  resendSignUpCode: async () => ({
    error: new Error("Authentication is not configured. Clerk keys are required."),
  }),
  signOut: async () => undefined,
};

function DisabledAuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={disabledAuth}>{children}</AuthContext.Provider>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  if (clerkEnabled) {
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  }
  return <DisabledAuthProvider>{children}</DisabledAuthProvider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export type { AuthContextType } from "./auth/types";
