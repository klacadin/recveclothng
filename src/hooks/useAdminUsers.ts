import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
  email?: string;
  full_name?: string | null;
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load admin users');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as UserRole[];
    },
  });
};

export const useGrantAdminRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_email: string) => {
      throw new Error('Use Clerk user ID (user_…) to grant admin');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useGrantAdminRoleById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const via = await apiSend<UserRole>('/api/admin/users', 'POST', { user_id: userId });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to grant admin');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useRevokeAdminRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const via = await apiSend('/api/admin/users', 'DELETE', { user_id: userId });
      if (!via.ok) throw new Error(via.error || 'Failed to revoke admin');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
