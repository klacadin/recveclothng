import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Search, UserRoundCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventRegistrations, useEvents, useUpdateRegistration } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";

const EventCheckIn = () => {
  const { data: events = [] } = useEvents({ activeOnly: false });
  const [eventId, setEventId] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: registrations = [], isFetching } = useEventRegistrations({
    eventId: eventId === "all" ? undefined : eventId,
    q: submittedQuery,
  });
  const updateRegistration = useUpdateRegistration();
  const { toast } = useToast();

  const eventTitle = useMemo(
    () => new Map(events.map((event) => [event.id, event.title])),
    [events]
  );

  const handleCheckIn = async (id: string, next: boolean) => {
    try {
      await updateRegistration.mutateAsync({
        id,
        updates: { checked_in: next, checked_in_at: next ? new Date().toISOString() : null },
      });
      toast({ title: next ? "Checked in" : "Check-in cleared" });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container max-w-3xl py-8 space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Event day</p>
              <h1 className="font-display text-3xl font-bold">Check-in</h1>
              <p className="text-sm text-muted-foreground mt-1">Search by name, email, phone, or the 6-character code.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">Admin</Link>
            </Button>
          </div>

          <form
            className="grid gap-3 sm:grid-cols-[1fr_200px_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedQuery(query.trim());
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, email, or check-in code"
                className="pl-9"
                autoFocus
              />
            </div>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="All events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>

          <div className="space-y-3">
            {isFetching ? (
              <p className="text-sm text-muted-foreground">Searching…</p>
            ) : registrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching registrations.</p>
            ) : (
              registrations.map((reg) => (
                <div key={reg.id} className="rounded-sm border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{reg.full_name}</p>
                    <p className="text-xs text-muted-foreground">{reg.email} · {reg.phone || "No phone"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {eventTitle.get(reg.event_id) || "Event"}{reg.ticket_name ? ` · ${reg.ticket_name}` : ""} · Code <span className="font-mono font-semibold text-foreground">{reg.check_in_code}</span> · {reg.payment_status}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant={reg.checked_in ? "default" : "outline"}
                    onClick={() => handleCheckIn(reg.id, !reg.checked_in)}
                    disabled={updateRegistration.isPending}
                  >
                    {reg.checked_in ? <Check className="h-4 w-4 mr-2" /> : <UserRoundCheck className="h-4 w-4 mr-2" />}
                    {reg.checked_in ? "Checked in" : "Check in"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventCheckIn;
