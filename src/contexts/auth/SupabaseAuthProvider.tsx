/**
 * @deprecated Dead legacy provider. App auth is Clerk via AuthContext / ClerkAuthProvider.
 */
import { useEffect, useState, type ReactNode } from "react";
import {
  AuthContext,
  type AuthContextType,
  type AuthUser,
  type AuthSession,
} from "./types";

const retired = async () => ({
  error: new Error("Supabase auth is retired. Use Clerk."),
});

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser | null>(null);
  const [session] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    console.warn(
      "SupabaseAuthProvider is deprecated. Use ClerkAuthProvider via AuthContext."
    );
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    authUnavailable: true,
    isAdmin: false,
    isApproved: true,
    approvalStatus: "approved",
    signIn: async () => ({
      error: new Error("Supabase auth is retired. Use Clerk."),
    }),
    verifySignInCode: retired,
    resendSignInCode: retired,
    signUp: async () => ({
      error: new Error("Supabase auth is retired. Use Clerk."),
    }),
    verifySignUpCode: retired,
    resendSignUpCode: retired,
    signOut: async () => undefined,
    clerkUserId: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
