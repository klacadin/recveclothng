import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarRange, CheckCircle2, Loader2, MapPin, Ticket } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useConfirmEventPayment, useEventRegistration } from "@/hooks/useEvents";
import { formatRunnerApparel, souvenirPromoSummary } from "@/lib/event-management";

const EventRegistered = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: registration, isLoading } = useEventRegistration(id);
  const confirmPayment = useConfirmEventPayment();
  const [reconciled, setReconciled] = useState(false);
  const confirmOnce = useRef(false);

  useEffect(() => {
    if (!id || !registration || registration.payment_status === "paid" || reconciled || confirmOnce.current) return;
    if (!registration.hitpay_payment_id) return;
    confirmOnce.current = true;
    confirmPayment.mutate(id, { onSettled: () => setReconciled(true) });
  }, [id, registration, reconciled, confirmPayment]);

  const event = registration?.event;
  const paid = registration?.payment_status === "paid";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Event ticket" description="Your REVE event registration ticket and check-in code." url="/events/registered" />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-xl">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !registration ? (
            <div className="rounded-sm border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">We could not find that registration.</p>
              <Button asChild className="mt-4"><Link to="/events">Back to events</Link></Button>
            </div>
          ) : (
            <div className="rounded-sm border border-border bg-card p-8 space-y-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className={`mx-auto h-10 w-10 ${paid ? "text-green-600" : "text-amber-500"}`} />
                <h1 className="font-display text-2xl font-bold">{paid ? "You're registered" : "Registration received"}</h1>
                <p className="text-sm text-muted-foreground">
                  {paid
                    ? "Show this runner number and check-in code at the door."
                    : "Complete payment to get your runner number. Staff can also mark you paid on site."}
                </p>
              </div>

              {paid && registration.runner_number && (
                <div className="rounded-sm bg-primary text-primary-foreground p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">Runner number</p>
                  <p className="mt-2 font-display text-5xl font-bold tracking-[0.2em]">{registration.runner_number}</p>
                </div>
              )}

              <div className="rounded-sm bg-secondary p-6 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Check-in code</p>
                <p className="mt-2 font-display text-4xl font-bold tracking-[0.25em]">{registration.check_in_code}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold text-foreground">{event?.title || "Event"}</p>
                {event && (
                  <p className="inline-flex items-center gap-2 text-muted-foreground">
                    <CalendarRange className="h-4 w-4" />
                    {new Date(event.starts_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                )}
                {event?.location && (
                  <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{event.location}</p>
                )}
                <p className="text-muted-foreground">{registration.full_name} · {registration.email}</p>
                <p className="text-muted-foreground">
                  {[registration.gender, registration.age != null ? `${registration.age} yrs` : null, ...formatRunnerApparel(registration)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="font-medium text-foreground">
                  {registration.ticket_name ? `${registration.ticket_name} · ` : ""}
                  {paid ? "Paid" : "Payment pending"}
                </p>
                <div className="rounded-sm border border-border bg-secondary/40 p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Registration fee</span><span>₱{Number(registration.subtotal - registration.discount_amount).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Convenience fee</span><span>₱{Number(registration.convenience_fee ?? 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1"><span>Total</span><span>₱{Number(registration.final_amount).toLocaleString()}</span></div>
                </div>
                {(() => {
                  const promo = souvenirPromoSummary(registration);
                  return (
                    <p className="text-muted-foreground">
                      {promo.applicable
                        ? `Promo rank: ${promo.rankLabel} · Free souvenir shirt: ${promo.shirtLabel}`
                        : "Promo eligibility: Not applicable"}
                    </p>
                  );
                })()}
              </div>

              {!paid && event?.payment_instructions && (
                <div className="rounded-sm border border-dashed border-border p-4 text-sm whitespace-pre-line text-muted-foreground">
                  {event.payment_instructions}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link to={event ? `/events/${event.slug}` : "/events"}>
                    <Ticket className="h-4 w-4 mr-2" />
                    Event page
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">Back home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventRegistered;
