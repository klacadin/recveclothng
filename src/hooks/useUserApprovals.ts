import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserApproval = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  email: string | null;
  full_name: string | null;
};

export type UserApprovalWithEmail = UserApproval & {
  email: string;
  created_at_user: string;
};

export const usePendingUsers = () => {
  return useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      // Get all pending approvals
      const { data: approvals, error: approvalsError } = await supabase
        .from('user_approvals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (approvalsError) throw approvalsError;

      // Get user emails from auth.users (we'll need to use a function for this)
      // Since we can't directly query auth.users, we'll return the approvals
      // and fetch emails separately if needed
      return approvals as UserApproval[];
    },
  });
};

export const useAllUserApprovals = () => {
  return useQuery({
    queryKey: ['all-user-approvals'],
    queryFn: async () => {
      const { data: approvals, error } = await supabase
        .from('user_approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return approvals as UserApproval[];
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_approvals')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as UserApproval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-approvals'] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_approvals')
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as UserApproval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-approvals'] });
    },
  });
};

