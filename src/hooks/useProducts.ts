import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { MAX_PRODUCTS } from '@/config/constants';
import { apiSend } from '@/lib/api';

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

async function fetchProductsFromApi(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to load products');
  const data = await res.json();
  return (Array.isArray(data) ? data : []).slice(0, MAX_PRODUCTS) as Product[];
}

export const useProducts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProductsFromApi,
    enabled: options?.enabled ?? true,
  });
};

/** Active products only — for Shop/storefront. Only is_active products appear. */
export const useActiveProducts = () => {
  const { data = [], ...rest } = useProducts();
  return { data: data.filter((p) => p.is_active), ...rest };
};

const NEW_PRODUCT_DAYS = 30;

/** True if product was created within the last N days */
export function isProductNew(createdAt: string, days = NEW_PRODUCT_DAYS): boolean {
  const created = new Date(createdAt).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return created >= cutoff;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchProductFromApi(id: string): Promise<Product | null> {
  const param = UUID_REGEX.test(id)
    ? `id=${encodeURIComponent(id)}`
    : `sku=${encodeURIComponent(id)}`;
  const res = await fetch(`/api/products?${param}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data && typeof data === 'object' && data.id) return data as Product;
  return null;
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductFromApi(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const viaApi = await apiSend<Product>('/api/products/mutate', 'POST', product);
      if (viaApi.ok && viaApi.data) return viaApi.data;
      throw new Error(viaApi.error || 'Failed to create product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const viaApi = await apiSend<Product>('/api/products/mutate', 'PATCH', { id, ...updates });
      if (viaApi.ok && viaApi.data) return viaApi.data;
      throw new Error(viaApi.error || 'Failed to update product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const viaApi = await apiSend('/api/products/mutate', 'DELETE', { id });
      if (!viaApi.ok) throw new Error(viaApi.error || 'Failed to delete product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stockQuantity }: { id: string; stockQuantity: number }) => {
      const viaApi = await apiSend<Product>('/api/products/mutate', 'PATCH', {
        id,
        stock_quantity: stockQuantity,
      });
      if (viaApi.ok && viaApi.data) return viaApi.data;
      throw new Error(viaApi.error || 'Failed to update stock');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
