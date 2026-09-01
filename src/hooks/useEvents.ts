import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Event,
  EventInsert,
  EventRegistration,
  EventRegistrationInsert,
  EventRegistrationUpdate,
  EventUpdate,
} from "@/types/app-database";
import { apiGet, apiSend } from "@/lib/api";

export type { Event, EventInsert, EventRegistration, EventRegistrationInsert, EventRegistrationUpdate, EventUpdate };

export type EventRegistrationWithEvent = EventRegistration & { event?: Event | null };
export type EventRegistrationResult = EventRegistration & { redirect_url?: string | null };

export const useEvents = (options?: { activeOnly?: boolean; enabled?: boolean }) => {
  return useQuery({
    queryKey: ["events", options?.activeOnly ?? false],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.activeOnly) params.set("activeOnly", "1");
      const query = params.toString();
      const res = await apiGet<Event[]>(`/api/events${query ? `?${query}` : ""}`);
      return res ?? [];
    },
    enabled: options?.enabled ?? true,
  });
};

export const useEventRegistrations = (options?: { eventId?: string; q?: string; enabled?: boolean }) => {
  const eventId = options?.eventId;
  const q = options?.q?.trim() || "";
  return useQuery({
    queryKey: ["event-registrations", eventId ?? "all", q],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (eventId) params.set("eventId", eventId);
      if (q) params.set("q", q);
      const query = params.toString();
      const res = await apiGet<EventRegistration[]>(`/api/events/registrations${query ? `?${query}` : ""}`);
      return res ?? [];
    },
    enabled: options?.enabled ?? true,
  });
};

export const useEventRegistration = (id?: string | null) => {
  return useQuery({
    queryKey: ["event-registration", id],
    queryFn: async () => {
      if (!id) return null;
      return apiGet<EventRegistrationWithEvent>(`/api/events/registrations?id=${encodeURIComponent(id)}`);
    },
    enabled: Boolean(id),
  });
};

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventInsert) => {
      const result = await apiSend<Event>("/api/events", "POST", input);
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to create event");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventUpdate }) => {
      const result = await apiSend<Event>("/api/events", "PATCH", { id, ...updates });
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to update event");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await apiSend<{ ok: boolean }>(`/api/events?id=${encodeURIComponent(id)}`, "DELETE");
      if (!result.ok) throw new Error(result.error || "Failed to delete event");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event-registrations"] });
    },
  });
};

export const useCreateRegistration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventRegistrationInsert) => {
      const result = await apiSend<EventRegistrationResult>("/api/events/register", "POST", input);
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to register");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event-registrations"] });
    },
  });
};

export const useUpdateRegistration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventRegistrationUpdate }) => {
      const result = await apiSend<EventRegistration>("/api/events/registrations", "PATCH", { id, ...updates });
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to update registration");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-registrations"] });
      qc.invalidateQueries({ queryKey: ["event-registration"] });
    },
  });
};

export const useConfirmEventPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: string | { registration_id?: string; hitpay_payment_id?: string }) => {
      const body =
        typeof input === "string"
          ? { registration_id: input }
          : {
              registration_id: input.registration_id,
              hitpay_payment_id: input.hitpay_payment_id,
            };
      const result = await apiSend<{ success: boolean; registration: EventRegistration }>(
        "/api/events/confirm-payment",
        "POST",
        body
      );
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to confirm payment");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-registrations"] });
      qc.invalidateQueries({ queryKey: ["event-registration"] });
    },
  });
};

export const useReconcileEventPayments = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await apiSend<{ success: boolean; reconciled: number }>(
        "/api/events/confirm-payment",
        "POST",
        { reconcile_pending: true }
      );
      if (!result.ok || !result.data) throw new Error(result.error || "Failed to sync payments");
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-registrations"] });
      qc.invalidateQueries({ queryKey: ["event-registration"] });
    },
  });
};
