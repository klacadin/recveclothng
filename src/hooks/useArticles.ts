import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useArticle = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data as Article | null;
    },
    enabled: !!slug,
  });
};

export const useCreateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ArticleInsert) => {
      const slug = input.slug || slugify(input.title);
      const { data, error } = await supabase
        .from('articles')
        .insert({ ...input, slug, source: input.source || 'manual' })
        .select()
        .single();
      if (error) throw error;
      return data as Article;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useUpdateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ArticleInsert> }) => {
      const { data, error } = await supabase
        .from('articles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Article;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};

export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles'] }),
  });
};
