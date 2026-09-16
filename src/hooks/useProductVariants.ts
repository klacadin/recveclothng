import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

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
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  '2XL': number;
  '3XL': number;
}

export const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const useProductVariants = (productId?: string) => {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return [] as ProductVariant[];
      const res = await fetch(`/api/variants?product_id=${encodeURIComponent(productId)}`);
      if (!res.ok) throw new Error('Failed to load variants');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as ProductVariant[];
    },
    enabled: !!productId,
  });
};

export const useAllProductVariants = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['product-variants', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/variants');
      if (!res.ok) throw new Error('Failed to load variants');
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as ProductVariant[];
    },
    enabled: options?.enabled ?? true,
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
      const viaApi = await apiSend<ProductVariant>('/api/variants/mutate', 'PATCH', {
        product_id: productId,
        size,
        stock_quantity: stockQuantity,
      });
      if (viaApi.ok && viaApi.data) return viaApi.data;
      throw new Error(viaApi.error || 'Failed to update variant stock');
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
      const viaApi = await apiSend<{ variants: ProductVariant[]; stock_quantity: number }>(
        '/api/variants/mutate',
        'PUT',
        { product_id: productId, variants }
      );
      if (viaApi.ok && viaApi.data?.variants) return viaApi.data.variants;
      throw new Error(viaApi.error || 'Failed to save inventory');
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
      const variants = SIZES.map(size => ({
        size,
        stock_quantity: sizeStocks[size],
        low_stock_threshold: 5,
      }));
      const viaApi = await apiSend<{ variants: ProductVariant[]; stock_quantity: number }>(
        '/api/variants/mutate',
        'PUT',
        { product_id: productId, variants }
      );
      if (viaApi.ok && viaApi.data?.variants) return viaApi.data.variants;
      throw new Error(viaApi.error || 'Failed to create variants');
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
  const sizeStock: SizeStock = { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 };
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
