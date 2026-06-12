import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errors';

export const useBulkProductActions = () => {
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

  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) throw error;
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
    mutationFn: async ({ ids, updatedByEmail }: { ids: string[]; updatedByEmail?: string }) => {
      const updates: Record<string, unknown> = { is_active: true };
      if (updatedByEmail) updates.updated_by_email = updatedByEmail;
      const { error } = await supabase
        .from('products')
        .update(updates)
        .in('id', ids);

      if (error) throw error;
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
    mutationFn: async ({ ids, updatedByEmail }: { ids: string[]; updatedByEmail?: string }) => {
      const updates: Record<string, unknown> = { is_active: false };
      if (updatedByEmail) updates.updated_by_email = updatedByEmail;
      const { error } = await supabase
        .from('products')
        .update(updates)
        .in('id', ids);

      if (error) throw error;
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
    mutationFn: async ({ ids, category, updatedByEmail }: { ids: string[]; category: string; updatedByEmail?: string }) => {
      const updates: Record<string, unknown> = { category };
      if (updatedByEmail) updates.updated_by_email = updatedByEmail;
      const { error } = await supabase
        .from('products')
        .update(updates)
        .in('id', ids);

      if (error) throw error;
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
