import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderInsert, OrderItem, OrderItemInsert, OrderUpdate } from "@/types/app-database";
import { apiGet, apiSend } from "@/lib/api";

export type { Order, OrderInsert, OrderItem, OrderItemInsert, OrderUpdate };

export type OrderWithItems = Order & {
  order_items: OrderItem[];
  affiliate_id?: string | null;
  affiliate_code?: string | null;
  affiliate_name?: string | null;
};

export const useOrders = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const fromApi = await apiGet<OrderWithItems[]>("/api/orders");
      return fromApi ?? [];
    },
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      return (
        (await apiGet<OrderWithItems>(
          `/api/orders?id=${encodeURIComponent(id)}`
        )) ?? null
      );
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: Omit<OrderInsert, "order_number">;
      items: Omit<OrderItemInsert, "order_id">[];
    }) => {
      const created = await apiSend<{ order?: Order; id?: string }>(
        "/api/orders/create",
        "POST",
        {
          ...order,
          items,
        }
      );
      if (created.ok && created.data) {
        return (created.data.order ?? created.data) as Order;
      }
      throw new Error(created.error || "Failed to create order");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => {
      const patched = await apiSend<Order>("/api/orders", "PATCH", {
        id,
        status,
      });
      if (patched.ok && patched.data) {
        void apiSend("/api/emails/order", "POST", {
          type: "status_update",
          order_id: id,
          customer_email: (patched.data as Order).customer_email,
          customer_name: (patched.data as Order).customer_name,
          order_number: (patched.data as Order).order_number,
          new_status: status,
        });
        return patched.data;
      }
      throw new Error(patched.error || "Failed to update order status");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: OrderUpdate;
    }) => {
      const patched = await apiSend<Order>("/api/orders", "PATCH", {
        id,
        ...updates,
      });
      if (patched.ok && patched.data) return patched.data;
      throw new Error(patched.error || "Failed to update order");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const deleted = await apiSend<{ deleted?: number }>("/api/orders", "DELETE", { id });
      if (!deleted.ok) {
        throw new Error(deleted.error || "Failed to delete order");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};
