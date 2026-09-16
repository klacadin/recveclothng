import { Link } from "react-router-dom";
import { ArrowRight, CalendarRange, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { formatEventPriceLabel } from "@/lib/event-management";

const UpcomingEvents = () => {
  const { data, isLoading } = useEvents({ activeOnly: true });
  const events = Array.isArray(data) ? data : [];
  if (isLoading || events.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Upcoming</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Events</h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="self-start md:self-auto">
            <Link to="/events">
              View all events
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {events.slice(0, 3).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className="group rounded-sm border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors"
            >
              {event.image_url ? (
                <img src={event.image_url} alt={event.title} className="h-64 w-full object-cover object-top" />
              ) : (
                <div className="h-44 w-full bg-secondary" />
              )}
              <div className="p-5 space-y-3">
                <h3 className="font-display text-xl font-semibold group-hover:text-accent transition-colors">{event.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    {new Date(event.starts_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {event.location && (
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatEventPriceLabel(Number(event.price), event.ticket_tiers)} · Register
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
