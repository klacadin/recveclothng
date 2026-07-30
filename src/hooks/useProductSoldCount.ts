import { useQuery } from '@tanstack/react-query';

/**
 * Sold count for a single product (from paid/fulfilled orders).
 */
export function useProductSoldCount(productId: string | undefined) {
  const { data, ...rest } = useQuery({
    queryKey: ['productSoldCount', productId],
    queryFn: async (): Promise<number> => {
      if (!productId) return 0;
      const res = await fetch(
        `/api/products/sold-counts?ids=${encodeURIComponent(productId)}`
      );
      if (!res.ok) return 0;
      const rows = (await res.json()) as { product_id: string; sold_count: number }[];
      const row = Array.isArray(rows) ? rows[0] : null;
      return row ? Number(row.sold_count) : 0;
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
      const res = await fetch(
        `/api/products/sold-counts?ids=${ids.map(encodeURIComponent).join(',')}`
      );
      if (!res.ok) return new Map();
      const list = (await res.json()) as { product_id: string; sold_count: number }[];
      const map = new Map<string, number>();
      (Array.isArray(list) ? list : []).forEach((r) =>
        map.set(r.product_id, Number(r.sold_count))
      );
      return map;
    },
    enabled: ids.length > 0,
    retry: false,
  });
  return { soldCountByProductId: data ?? new Map<string, number>(), ...rest };
}
