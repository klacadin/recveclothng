import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

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

export const usePendingUsers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/user-approvals?status=pending', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load pending users');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as UserApproval[];
    },
    enabled: options?.enabled ?? true,
  });
};

export const useAllUserApprovals = () => {
  return useQuery({
    queryKey: ['all-user-approvals'],
    queryFn: async () => {
      const res = await fetch('/api/admin/user-approvals', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load approvals');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as UserApproval[];
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const via = await apiSend<UserApproval>('/api/admin/user-approvals', 'PATCH', {
        user_id: userId,
        status: 'approved',
      });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to approve user');
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
      const via = await apiSend<UserApproval>('/api/admin/user-approvals', 'PATCH', {
        user_id: userId,
        status: 'rejected',
        rejection_reason: reason || null,
      });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to reject user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-approvals'] });
    },
  });
};
