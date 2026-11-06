import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errors';
import { apiSend } from '@/lib/api';

export const useBulkProductActions = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (ids: string[]) => setSelectedIds(new Set(ids));
  const clearSelection = () => setSelectedIds(new Set());
  const isSelected = (id: string) => selectedIds.has(id);
  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiSend('/api/products/mutate', 'DELETE', { ids });
      if (!res.ok) throw new Error(res.error || 'Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      clearSelection();
      toast({ title: 'Products deleted', description: `${selectedCount} products have been deleted.` });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const bulkActivate = useMutation({
    mutationFn: async ({ ids }: { ids: string[]; updatedByEmail?: string }) => {
      const res = await apiSend('/api/products/mutate', 'PATCH', {
        ids,
        is_active: true,
      });
      if (!res.ok) throw new Error(res.error || 'Activate failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      clearSelection();
      toast({ title: 'Products activated', description: `${selectedCount} products have been activated.` });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const bulkDeactivate = useMutation({
    mutationFn: async ({ ids }: { ids: string[]; updatedByEmail?: string }) => {
      const res = await apiSend('/api/products/mutate', 'PATCH', {
        ids,
        is_active: false,
      });
      if (!res.ok) throw new Error(res.error || 'Deactivate failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      clearSelection();
      toast({ title: 'Products deactivated', description: `${selectedCount} products have been deactivated.` });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const bulkUpdateCategory = useMutation({
    mutationFn: async ({
      ids,
      category,
    }: {
      ids: string[];
      category: string;
      updatedByEmail?: string;
    }) => {
      const res = await apiSend('/api/products/mutate', 'PATCH', {
        ids,
        category,
      });
      if (!res.ok) throw new Error(res.error || 'Category update failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      clearSelection();
      toast({ title: 'Category updated', description: `${selectedCount} products have been updated.` });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
    hasSelection,
    bulkDelete,
    bulkActivate,
    bulkDeactivate,
    bulkUpdateCategory,
  };
};
