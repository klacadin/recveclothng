import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  source: 'manual' | 'facebook';
  source_url: string | null;
  image_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type ArticleInsert = {
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  source?: 'manual' | 'facebook';
  source_url?: string | null;
  image_url?: string | null;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error('Failed to load articles');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as Article[];
    },
  });
};

export const useArticle = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('Failed to load article');
      return (await res.json()) as Article | null;
    },
    enabled: !!slug,
  });
};

export const useCreateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ArticleInsert) => {
      const slug = input.slug || slugify(input.title);
      const via = await apiSend<Article>('/api/articles', 'POST', {
        ...input,
        slug,
        source: input.source || 'manual',
      });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to create article');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useUpdateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ArticleInsert> }) => {
      const via = await apiSend<Article>('/api/articles', 'PATCH', { id, ...updates });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to update article');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const via = await apiSend('/api/articles', 'DELETE', { id });
      if (!via.ok) throw new Error(via.error || 'Failed to delete article');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};
