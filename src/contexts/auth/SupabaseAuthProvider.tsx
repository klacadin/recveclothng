"use client";

import { useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { BASE_URL } from "@/config/constants";
import { AuthContext, type AuthContextType } from "./types";

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected" | null>(
    null
  );

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  };

  const checkApprovalStatus = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_approvals")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) return { status: null as const, isApproved: false };
      const status = (data?.status as "pending" | "approved" | "rejected") || null;
      return { status, isApproved: status === "approved" };
    } catch {
      return { status: null as const, isApproved: false };
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id).then(setIsAdmin);
          checkApprovalStatus(session.user.id).then(({ status, isApproved }) => {
            setApprovalStatus(status);
            setIsApproved(isApproved);
          });
        }, 0);
      } else {
        setIsAdmin(false);
        setIsApproved(false);
        setApprovalStatus(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id).then(setIsAdmin);
        checkApprovalStatus(session.user.id).then(({ status, isApproved }) => {
          setApprovalStatus(status);
          setIsApproved(isApproved);
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    authUnavailable: false,
    isAdmin,
    isApproved,
    approvalStatus,
    clerkUserId: null,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      return { error: null };
    },
    verifySignInCode: async () => ({
      error: new Error("Email verification codes are not used with Supabase auth."),
    }),
    resendSignInCode: async () => ({
      error: new Error("Email verification codes are not used with Supabase auth."),
    }),
    signUp: async (email, password) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: BASE_URL },
      });
      return { error: error as Error | null };
    },
    verifySignUpCode: async () => ({
      error: new Error("Email verification codes are not used with Supabase auth."),
    }),
    resendSignUpCode: async () => ({
      error: new Error("Email verification codes are not used with Supabase auth."),
    }),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
