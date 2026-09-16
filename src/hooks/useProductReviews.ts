import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export type ProductReview = {
  id: string;
  product_id: string;
  order_id: string | null;
  user_id: string | null;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
};

export function useProductReviews(productId: string | undefined) {
  const { data: reviews = [], ...rest } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async (): Promise<ProductReview[]> => {
      if (!productId) return [];
      const res = await fetch(
        `/api/products/reviews?product_id=${encodeURIComponent(productId)}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as ProductReview[];
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
      const via = await apiSend<ProductReview>('/api/products/reviews', 'POST', {
        product_id: input.product_id,
        reviewer_name: input.reviewer_name.trim(),
        reviewer_email: input.reviewer_email.trim(),
        rating: Math.min(5, Math.max(1, Math.round(input.rating))),
        comment: input.comment?.trim() || null,
        order_id: input.order_id ?? null,
        user_id: input.user_id ?? null,
      });
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to submit review');
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
