import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type UserWithRole = {
  id: string;
  email: string;
  created_at: string;
  role?: 'admin' | 'user';
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all user roles
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (error) throw error;
      return roles as UserRole[];
    },
  });
};

export const useGrantAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      // First we need to find the user by email using the auth admin API
      // Since we can't access auth.users directly, we'll insert with the user_id
      // The admin must know the user_id or we need a different approach
      
      // For now, we'll use a workaround - the user needs to sign up first,
      // then the admin can grant them access using their user_id
      throw new Error('Please provide user ID directly');
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
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('User already has admin role');
        }
        throw error;
      }
      return data as UserRole;
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
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
