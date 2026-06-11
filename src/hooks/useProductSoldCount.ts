import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Sold count for a single product (from shipped/completed orders).
 */
export function useProductSoldCount(productId: string | undefined) {
  const { data, ...rest } = useQuery({
    queryKey: ['productSoldCount', productId],
    queryFn: async (): Promise<number> => {
      if (!productId) return 0;
      try {
        const { data: rows, error } = await supabase.rpc('get_products_sold_counts', {
          product_ids: [productId],
        });
        if (error) return 0;
        const row = (rows as { product_id: string; sold_count: number }[] | null)?.[0];
        return row ? Number(row.sold_count) : 0;
      } catch {
        return 0;
      }
    },
    enabled: !!productId,
    retry: false,
  });
  return { soldCount: data ?? 0, ...rest };
}

/**
 * Sold counts for multiple products. Returns a Map productId -> soldCount.
 */
export function useProductsSoldCount(productIds: string[]) {
  const ids = [...new Set(productIds)].filter(Boolean);
  const { data, ...rest } = useQuery({
    queryKey: ['productsSoldCount', ids.sort().join(',')],
    queryFn: async (): Promise<Map<string, number>> => {
      if (ids.length === 0) return new Map();
      try {
        const { data: rows, error } = await supabase.rpc('get_products_sold_counts', {
          product_ids: ids,
        });
        if (error) return new Map();
        const list = (rows as { product_id: string; sold_count: number }[] | null) ?? [];
        const map = new Map<string, number>();
        list.forEach((r) => map.set(r.product_id, Number(r.sold_count)));
        return map;
      } catch {
        return new Map();
      }
    },
    enabled: ids.length > 0,
    retry: false,
  });
  return { soldCountByProductId: data ?? new Map<string, number>(), ...rest };
}
