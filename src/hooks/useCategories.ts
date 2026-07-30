import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories?all=1', { credentials: 'include' });
      if (!res.ok) {
        // Non-admin: fall back to public active list
        const pub = await fetch('/api/categories');
        if (!pub.ok) throw new Error('Failed to load categories');
        return (await pub.json()) as Category[];
      }
      return (await res.json()) as Category[];
    },
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      return (await res.json()) as Category[];
    },
  });
};

const isProductCategory = (c: Category) =>
  !c.slug?.toLowerCase().includes('nobody') && !c.name?.toLowerCase().includes('nobody collection');

export const useProductCategories = () => {
  const { data, ...rest } = useActiveCategories();
  return { data: (data ?? []).filter(isProductCategory), ...rest };
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: CategoryInsert) => {
      const via = await apiSend<Category>('/api/categories', 'POST', category);
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to create category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CategoryUpdate }) => {
      const via = await apiSend<Category>('/api/categories', 'PATCH', { id, ...updates });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to update category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const via = await apiSend('/api/categories', 'DELETE', { id });
      if (!via.ok) throw new Error(via.error || 'Failed to delete category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useReorderCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const via = await apiSend('/api/categories', 'PATCH', { ordered_ids: orderedIds });
      if (!via.ok) throw new Error(via.error || 'Failed to reorder');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useCategoryProductCounts = () => {
  return useQuery({
    queryKey: ['categories', 'product-counts'],
    queryFn: async () => {
      const res = await fetch('/api/categories?counts=1');
      if (!res.ok) throw new Error('Failed to load counts');
      return (await res.json()) as Record<string, number>;
    },
  });
};
