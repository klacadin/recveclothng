import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarRange, CheckCircle2, CreditCard, MapPin, Ticket, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEvents, useCreateRegistration } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { calculateRegistrationTotals, formatEventPriceLabel } from "@/lib/event-management";

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
  promo_code: "",
  ticket_slug: "",
};

const Events = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useEvents({ activeOnly: true });
  const createRegistration = useCreateRegistration();
  const { toast } = useToast();
  const [form, setForm] = useState(defaultForm);

  const activeEvents = useMemo(() => events.filter((event) => event.is_active), [events]);

  const selectedEvent = useMemo(() => {
    if (!activeEvents.length) return null;
    if (slug) return activeEvents.find((event) => event.slug === slug) ?? activeEvents[0];
    return activeEvents[0];
  }, [activeEvents, slug]);

  const selectedEventPrice = Number(
    selectedEvent?.ticket_tiers?.find((tier) => tier.slug === form.ticket_slug)?.price
    ?? selectedEvent?.ticket_tiers?.[0]?.price
    ?? selectedEvent?.price
    ?? 0
  );
  const totals = calculateRegistrationTotals({
    basePrice: selectedEventPrice,
    eventPromoCode: selectedEvent?.promo_code ?? null,
    providedPromoCode: form.promo_code,
    discountPercent: selectedEvent?.promo_discount_percent ?? 0,
  });

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast({ title: "No event available", variant: "destructive" });
      return;
    }

    const fullName = form.full_name.trim();
    const email = form.email.trim();
    if (!fullName || !email) {
      toast({ title: "Full name and email are required", variant: "destructive" });
      return;
    }
    if (selectedEvent.ticket_tiers?.length && !form.ticket_slug) {
      toast({ title: "Select a distance", variant: "destructive" });
      return;
    }

    try {
      const result = await createRegistration.mutateAsync({
        event_id: selectedEvent.id,
        full_name: fullName,
        email,
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        notes: form.notes.trim() || null,
        ticket_slug: form.ticket_slug || selectedEvent.ticket_tiers?.[0]?.slug || null,
        promo_code_used: form.promo_code.trim() || null,
      });
      setForm(defaultForm);
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      toast({
        title: totals.finalAmount > 0 ? "Registration saved" : "You're registered",
        description:
          totals.finalAmount > 0
            ? "Pay using the event instructions, then show your check-in code on the day."
            : "Bring your check-in code on the event day.",
      });
      navigate(`/events/registered?id=${result.id}`);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={selectedEvent ? `${selectedEvent.title} | Events` : "Events"}
        description={selectedEvent?.description || "Register for REVE clothing events and community gatherings."}
        url={selectedEvent ? `/events/${selectedEvent.slug}` : "/events"}
      />
      <Header />
      <main className="pt-20 pb-16">
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/70 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span>Events</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Events</h1>
            <p className="mt-2 text-primary-foreground/80">
              Register, pay, and check in on the day — all in one place.
            </p>
          </div>
        </section>

        <div className="container py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
            ) : activeEvents.length === 0 ? (
              <div className="rounded-sm border border-border bg-card p-8 text-center text-muted-foreground">
                No live events are available right now.
              </div>
            ) : (
              <>
                {activeEvents.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {activeEvents.map((event) => (
                      <Button
                        key={event.id}
                        type="button"
                        variant={selectedEvent?.id === event.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => navigate(`/events/${event.slug}`)}
                      >
                        {event.title}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedEvent && (
                  <article className="bg-card border border-border rounded-sm overflow-hidden">
                    {selectedEvent.image_url && (
                      <img
                        src={selectedEvent.image_url}
                        alt={selectedEvent.title}
                        className="w-full max-h-[32rem] object-contain bg-black"
                      />
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming event</p>
                          <h2 className="font-display text-2xl font-bold text-foreground mt-1">{selectedEvent.title}</h2>
                        </div>
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {formatEventPriceLabel(selectedEventPrice, selectedEvent.ticket_tiers)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <CalendarRange className="h-4 w-4" />
                          {new Date(selectedEvent.starts_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                        {selectedEvent.location && (
                          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{selectedEvent.location}</span>
                        )}
                        <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />Registration open</span>
                      </div>

                      {selectedEvent.description && <p className="text-foreground/80 leading-7">{selectedEvent.description}</p>}

                      {selectedEvent.ticket_tiers?.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-3">
                          {selectedEvent.ticket_tiers.map((tier) => (
                            <button
                              key={tier.slug}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, ticket_slug: tier.slug }))}
                              className={`rounded-sm border p-3 text-left transition-colors ${
                                (form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug) === tier.slug
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-foreground/30"
                              }`}
                            >
                              <p className="font-semibold text-foreground">{tier.name}</p>
                              <p className="text-sm text-muted-foreground">₱{Number(tier.price).toLocaleString()}</p>
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedEvent.payment_instructions && selectedEventPrice > 0 && (
                        <div className="rounded-sm border border-dashed border-border bg-secondary/40 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <CreditCard className="h-4 w-4" />Payment details
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{selectedEvent.payment_instructions}</p>
                        </div>
                      )}

                      {selectedEvent.promo_code && (
                        <div className="rounded-sm border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                          Use promo code <span className="font-semibold">{selectedEvent.promo_code}</span> for {selectedEvent.promo_discount_percent}% off.
                        </div>
                      )}
                    </div>
                  </article>
                )}
              </>
            )}
          </div>

          <div className="bg-card border border-border rounded-sm p-6 h-fit">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Ticket className="h-5 w-5" />
              Register
            </div>
            <form onSubmit={submitRegistration} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="company">Company / Team</Label>
                <Input id="company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
              {selectedEvent?.ticket_tiers?.length ? (
                <div>
                  <Label>Distance</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedEvent.ticket_tiers.map((tier) => (
                      <Button
                        key={tier.slug}
                        type="button"
                        variant={(form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug) === tier.slug ? "default" : "outline"}
                        onClick={() => setForm((f) => ({ ...f, ticket_slug: tier.slug }))}
                      >
                        {tier.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
              {selectedEvent?.promo_code && (
                <div>
                  <Label htmlFor="promo_code">Promo code</Label>
                  <Input
                    id="promo_code"
                    value={form.promo_code}
                    onChange={(e) => setForm((f) => ({ ...f, promo_code: e.target.value }))}
                    placeholder={selectedEvent.promo_code}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Anything we should know?" />
              </div>

              {selectedEvent && (
                <div className="rounded-sm border border-border bg-secondary/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Base fee</span><span>₱{totals.basePrice.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-₱{totals.discountAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2"><span>Total</span><span>₱{totals.finalAmount.toLocaleString()}</span></div>
                  {selectedEvent.promo_code && form.promo_code && !totals.isPromoValid && (
                    <p className="text-xs text-red-600">That promo code is not valid for this event.</p>
                  )}
                  {totals.isPromoValid && (
                    <p className="text-xs text-green-700 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Promo code applied.</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={createRegistration.isPending || !selectedEvent}>
                {createRegistration.isPending
                  ? "Submitting..."
                  : totals.finalAmount > 0
                    ? "Register and pay"
                    : "Submit registration"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
