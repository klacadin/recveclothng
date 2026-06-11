import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { MAX_EVENT_CAROUSEL_ITEMS } from '@/config/constants';

export type EventCarouselItem = Tables<'event_carousel'>;
export type EventCarouselInsert = TablesInsert<'event_carousel'>;
export type EventCarouselUpdate = TablesUpdate<'event_carousel'>;

export const useEventCarousel = () => {
  return useQuery({
    queryKey: ['event-carousel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_carousel')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(MAX_EVENT_CAROUSEL_ITEMS);
      if (error) throw error;
      return data as EventCarouselItem[];
    },
  });
};

export const useCreateEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventCarouselInsert) => {
      const { data, error } = await supabase
        .from('event_carousel')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as EventCarouselItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['event-carousel'] }),
  });
};

export const useUpdateEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventCarouselUpdate }) => {
      const { data, error } = await supabase
        .from('event_carousel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as EventCarouselItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['event-carousel'] }),
  });
};

export const useDeleteEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('event_carousel').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['event-carousel'] }),
  });
};
