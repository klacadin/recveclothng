import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Voucher = {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  expires_at: string | null;
  is_active: boolean;
  max_uses: number | null;
  times_used: number;
  description: string | null;
  product_ids: string[] | null;
  category_ids: string[] | null;
  created_at: string;
  updated_at: string;
};

export type VoucherInsert = {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount?: number | null;
  expires_at?: string | null;
  is_active?: boolean;
  max_uses?: number | null;
  description?: string | null;
  product_ids?: string[] | null;
  category_ids?: string[] | null;
};

export const useVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Voucher[];
    },
  });
};

export const useCreateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (voucher: VoucherInsert) => {
      const { data, error } = await supabase
        .from('vouchers')
        .insert({
          code: voucher.code.trim().toUpperCase(),
          discount_type: voucher.discount_type,
          discount_value: voucher.discount_value,
          min_order_amount: voucher.min_order_amount ?? 0,
          expires_at: voucher.expires_at || null,
          is_active: voucher.is_active ?? true,
          max_uses: voucher.max_uses ?? null,
          description: voucher.description?.trim() || null,
          product_ids: voucher.product_ids?.length ? voucher.product_ids : [],
          category_ids: voucher.category_ids?.length ? voucher.category_ids : [],
        })
        .select()
        .single();
      if (error) throw error;
      return data as Voucher;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  });
};

export const useUpdateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VoucherInsert> }) => {
      const payload: Record<string, unknown> = { ...updates };
      if (updates.code) payload.code = updates.code.trim().toUpperCase();
      const { data, error } = await supabase
        .from('vouchers')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Voucher;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  });
};

export const useDeleteVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vouchers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vouchers'] }),
  });
};
