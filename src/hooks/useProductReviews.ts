import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type ProductReview = Tables<'product_reviews'>;

export function useProductReviews(productId: string | undefined) {
  const { data: reviews = [], ...rest } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async (): Promise<ProductReview[]> => {
      if (!productId) return [];
      try {
        const { data, error } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', productId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        if (error) return [];
        return (data ?? []) as ProductReview[];
      } catch {
        return [];
      }
    },
    enabled: !!productId,
    retry: false,
  });

  const queryClient = useQueryClient();
  const submitReview = useMutation({
    mutationFn: async (input: {
      product_id: string;
      reviewer_name: string;
      reviewer_email: string;
      rating: number;
      comment?: string | null;
      order_id?: string | null;
      user_id?: string | null;
    }) => {
      const row: TablesInsert<'product_reviews'> = {
        product_id: input.product_id,
        reviewer_name: input.reviewer_name.trim(),
        reviewer_email: input.reviewer_email.trim(),
        rating: Math.min(5, Math.max(1, Math.round(input.rating))),
        comment: input.comment?.trim() || null,
        order_id: input.order_id ?? null,
        user_id: input.user_id ?? null,
        is_approved: true,
      };
      const { data, error } = await supabase.from('product_reviews').insert(row).select().single();
      if (error) throw error;
      return data as ProductReview;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', variables.product_id] });
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return { reviews, averageRating, submitReview, ...rest };
}
