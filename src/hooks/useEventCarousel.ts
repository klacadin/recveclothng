import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { MAX_EVENT_CAROUSEL_ITEMS } from "@/config/constants";
import { apiSend } from "@/lib/api";

export type EventCarouselItem = Tables<"event_carousel">;
export type EventCarouselInsert = TablesInsert<"event_carousel">;
export type EventCarouselUpdate = TablesUpdate<"event_carousel">;

async function fetchEventCarousel(): Promise<EventCarouselItem[]> {
  const res = await fetch("/api/event-carousel");
  if (!res.ok) throw new Error("Failed to load event carousel");
  const data = await res.json();
  return (Array.isArray(data) ? data : []).slice(
    0,
    MAX_EVENT_CAROUSEL_ITEMS
  ) as EventCarouselItem[];
}

export const useEventCarousel = () => {
  return useQuery({
    queryKey: ["event-carousel"],
    queryFn: fetchEventCarousel,
  });
};

export const useCreateEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventCarouselInsert) => {
      const result = await apiSend<EventCarouselItem>(
        "/api/event-carousel",
        "POST",
        input
      );
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to create carousel item");
      }
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-carousel"] }),
  });
};

export const useUpdateEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: EventCarouselUpdate;
    }) => {
      const result = await apiSend<EventCarouselItem>(
        "/api/event-carousel",
        "PATCH",
        { id, ...updates }
      );
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to update carousel item");
      }
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-carousel"] }),
  });
};

export const useDeleteEventCarouselItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await apiSend<{ ok: boolean }>(
        `/api/event-carousel?id=${encodeURIComponent(id)}`,
        "DELETE"
      );
      if (!result.ok) {
        throw new Error(result.error || "Failed to delete carousel item");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-carousel"] }),
  });
};
