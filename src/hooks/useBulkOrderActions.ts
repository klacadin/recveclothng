import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/hooks/useOrders';

export const useBulkOrderActions = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(new Set(ids));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (id: string) => selectedIds.has(id);
  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  const bulkUpdateStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: Order['status'] }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedIds(new Set());
      toast({ title: 'Orders updated', description: `${selectedCount} orders set to ${status}.` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const bulkExportCSV = (orders: Array<{ id: string; order_number: string; customer_name: string; customer_email: string; total: number; status: string; created_at: string }>) => {
    const ids = Array.from(selectedIds);
    const toExport = orders.filter((o) => ids.includes(o.id));
    const headers = ['Order #', 'Customer', 'Email', 'Total', 'Status', 'Date'];
    const rows = toExport.map((o) => [
      o.order_number,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      o.customer_email,
      o.total,
      o.status,
      new Date(o.created_at).toLocaleDateString(),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast({ title: 'Export complete', description: `Exported ${toExport.length} orders to CSV.` });
  };

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
    hasSelection,
    bulkUpdateStatus,
    bulkExportCSV,
  };
};
