import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; approvalError?: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error('Error in checkAdminRole:', err);
      return false;
    }
  };

  const checkApprovalStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_approvals')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking approval status:', error);
        return { status: null, isApproved: false };
      }

      const status = (data?.status as 'pending' | 'approved' | 'rejected') || null;
      return { status, isApproved: status === 'approved' };
    } catch (err) {
      console.error('Error in checkApprovalStatus:', err);
      return { status: null, isApproved: false };
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer admin and approval checks to avoid deadlock
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
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        Promise.all([
          checkAdminRole(session.user.id),
          checkApprovalStatus(session.user.id)
        ]).then(([adminResult, approvalResult]) => {
          setIsAdmin(adminResult);
          setApprovalStatus(approvalResult.status);
          setIsApproved(approvalResult.isApproved);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // Check approval status after successful login
    if (data.user) {
      const approvalResult = await checkApprovalStatus(data.user.id);
      if (!approvalResult.isApproved && !isAdmin) {
        // Sign out the user if not approved (unless they're an admin)
        await supabase.auth.signOut();
        return { 
          error: new Error('Your account is pending approval. Please wait for an admin to approve your account.') as any,
          approvalError: true 
        };
      }
      setApprovalStatus(approvalResult.status);
      setIsApproved(approvalResult.isApproved);
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { BASE_URL } = await import('@/config/constants');
    const redirectUrl = `${BASE_URL}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    // The trigger will automatically create a pending approval record
    // No need to do anything here - the database handles it
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsApproved(false);
    setApprovalStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        isApproved,
        approvalStatus,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
