import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { MAX_PRODUCTS } from '@/config/constants';

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(MAX_PRODUCTS);

      if (error) throw error;
      return data as Product[];
    },
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

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      // If id looks like a UUID, query by id (avoids Postgres UUID cast error)
      if (UUID_REGEX.test(id)) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        if (data) return data as Product;
        return null;
      }

      // Otherwise treat as product code (sku), e.g. SHRT-YY
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', id)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return (data as Product) || null;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
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
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('products')
        .update({ stock_quantity: stockQuantity })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
