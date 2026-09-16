import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiSend } from "@/lib/api";

export type Voucher = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
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
  discount_type: "percent" | "fixed";
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
    queryKey: ["vouchers"],
    queryFn: async () => {
      const data = await apiGet<Voucher[]>("/api/vouchers");
      return data ?? [];
    },
  });
};

export const useCreateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (voucher: VoucherInsert) => {
      const res = await apiSend<Voucher>("/api/vouchers", "POST", {
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
      });
      if (!res.ok || !res.data) throw new Error(res.error || "Failed to create voucher");
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vouchers"] }),
  });
};

export const useUpdateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VoucherInsert> }) => {
      const payload: Record<string, unknown> = { id, ...updates };
      if (updates.code) payload.code = updates.code.trim().toUpperCase();
      const res = await apiSend<Voucher>("/api/vouchers", "PATCH", payload);
      if (!res.ok || !res.data) throw new Error(res.error || "Failed to update voucher");
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vouchers"] }),
  });
};

export const useDeleteVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiSend<{ deleted?: boolean }>("/api/vouchers", "DELETE", { id });
      if (!res.ok) throw new Error(res.error || "Failed to delete voucher");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vouchers"] }),
  });
};
