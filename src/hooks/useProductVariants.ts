import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductVariant {
  id: string;
  product_id: string;
  size: ProductSize;
  stock_quantity: number;
  low_stock_threshold: number;
  sku_suffix: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariantInsert {
  product_id: string;
  size: ProductSize;
  stock_quantity?: number;
  low_stock_threshold?: number;
  sku_suffix?: string | null;
}

export interface ProductVariantUpdate {
  stock_quantity?: number;
  low_stock_threshold?: number;
  sku_suffix?: string | null;
}

export interface SizeStock {
  S: number;
  M: number;
  L: number;
  XL: number;
}

export const SIZES: ProductSize[] = ['S', 'M', 'L', 'XL'];

export const useProductVariants = (productId?: string) => {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      const query = supabase
        .from('product_variants')
        .select('*')
        .order('size', { ascending: true });
      
      if (productId) {
        query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });
};

export const useAllProductVariants = () => {
  return useQuery({
    queryKey: ['product-variants', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .order('product_id', { ascending: true });

      if (error) throw error;
      return data as ProductVariant[];
    },
  });
};

export const useUpdateVariantStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, size, stockQuantity }: { 
      productId: string; 
      size: ProductSize; 
      stockQuantity: number;
    }) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update({ stock_quantity: stockQuantity })
        .eq('product_id', productId)
        .eq('size', size)
        .select()
        .single();

      if (error) throw error;
      return data as ProductVariant;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-variants', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useBulkUpdateVariants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variants }: { 
      productId: string; 
      variants: { size: ProductSize; stock_quantity: number; low_stock_threshold?: number }[];
    }) => {
      const updates = variants.map(v => 
        supabase
          .from('product_variants')
          .upsert({
            product_id: productId,
            size: v.size,
            stock_quantity: v.stock_quantity,
            low_stock_threshold: v.low_stock_threshold ?? 5,
          }, { onConflict: 'product_id,size' })
          .select()
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;

      return results.flatMap(r => r.data || []) as ProductVariant[];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-variants', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useCreateVariantsForProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, sizeStocks }: { 
      productId: string; 
      sizeStocks: SizeStock;
    }) => {
      const variants: ProductVariantInsert[] = SIZES.map(size => ({
        product_id: productId,
        size,
        stock_quantity: sizeStocks[size],
        low_stock_threshold: 5,
      }));

      const { data, error } = await supabase
        .from('product_variants')
        .upsert(variants, { onConflict: 'product_id,size' })
        .select();

      if (error) throw error;
      return data as ProductVariant[];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-variants', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Helper to convert variants array to SizeStock object
export const variantsToSizeStock = (variants: ProductVariant[]): SizeStock => {
  const sizeStock: SizeStock = { S: 0, M: 0, L: 0, XL: 0 };
  variants.forEach(v => {
    if (v.size in sizeStock) {
      sizeStock[v.size as ProductSize] = v.stock_quantity;
    }
  });
  return sizeStock;
};

// Helper to get total stock across all sizes
export const getTotalStock = (variants: ProductVariant[]): number => {
  return variants.reduce((sum, v) => sum + v.stock_quantity, 0);
};

// Helper to check if any size is low on stock
export const hasLowStock = (variants: ProductVariant[]): boolean => {
  return variants.some(v => v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold);
};

// Helper to check if all sizes are out of stock
export const isOutOfStock = (variants: ProductVariant[]): boolean => {
  return variants.every(v => v.stock_quantity === 0);
};
