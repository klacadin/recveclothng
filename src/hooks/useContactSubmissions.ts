import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
};

export const useContactSubmissions = () => {
  return useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const res = await fetch('/api/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load contact submissions');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as ContactSubmission[];
    },
  });
};

export const useMarkContactRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const via = await apiSend('/api/contact', 'PATCH', { id });
      if (!via.ok) throw new Error(via.error || 'Failed to mark read');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-submissions'] }),
  });
};
