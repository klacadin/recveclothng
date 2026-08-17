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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents, useCreateRegistration } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import {
  calculateRegistrationTotals,
  EVENT_AGE_MAX,
  EVENT_AGE_MIN,
  EVENT_GENDERS,
  EVENT_SHIRT_SIZES,
  formatEventPriceLabel,
  isSouvenirPromoCategory,
  resolvePublicEventSlug,
  SOUVENIR_SHIRT_PROMO_NOTE,
  ticketApparel,
} from "@/lib/event-management";

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  singlet_size: "",
  finisher_shirt_size: "",
  crop_top_enabled: false,
  crop_top_size: "",
  gender: "",
  age: "",
  notes: "",
  promo_code: "",
  ticket_slug: "",
};

function ApparelSizeButtons({
  value,
  onChange,
  sizes = EVENT_SHIRT_SIZES,
}: {
  value: string;
  onChange: (size: string) => void;
  sizes?: readonly string[];
}) {
  return (
    <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
      {sizes.map((size) => (
        <Button
          key={size}
          type="button"
          variant={value === size ? "default" : "outline"}
          onClick={() => onChange(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
}

const Events = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useEvents({ activeOnly: true });
  const events = Array.isArray(data) ? data : [];
  const createRegistration = useCreateRegistration();
  const { toast } = useToast();
  const [form, setForm] = useState(defaultForm);

  const activeEvents = useMemo(() => events.filter((event) => event.is_active), [events]);

  const selectedEvent = useMemo(() => {
    if (!activeEvents.length) return null;
    const requested = resolvePublicEventSlug(slug);
    if (requested) {
      return activeEvents.find((event) => event.slug === requested || event.slug === slug) ?? activeEvents[0];
    }
    return activeEvents[0];
  }, [activeEvents, slug]);

  const selectedTier = selectedEvent?.ticket_tiers?.find(
    (tier) => tier.slug === (form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug)
  ) ?? selectedEvent?.ticket_tiers?.[0] ?? null;
  const apparel = ticketApparel(selectedTier);

  const selectTicket = (tierSlug: string) => {
    const tier = selectedEvent?.ticket_tiers?.find((item) => item.slug === tierSlug);
    const nextApparel = ticketApparel(tier);
    setForm((f) => ({
      ...f,
      ticket_slug: tierSlug,
      singlet_size: nextApparel.has_singlet ? f.singlet_size : "",
      finisher_shirt_size: nextApparel.has_finisher_shirt ? f.finisher_shirt_size : "",
      crop_top_enabled: nextApparel.has_crop_top ? f.crop_top_enabled : false,
      crop_top_size: nextApparel.has_crop_top ? f.crop_top_size : "",
    }));
  };

  const selectedEventPrice = Number(
    selectedTier?.price
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
    const age = Number(form.age);
    if (!fullName || !email) {
      toast({ title: "Full name and email are required", variant: "destructive" });
      return;
    }
    if (!form.gender || !Number.isInteger(age)) {
      toast({ title: "Gender and age are required", variant: "destructive" });
      return;
    }
    if (apparel.has_singlet && !form.singlet_size) {
      toast({ title: "Event singlet size is required", variant: "destructive" });
      return;
    }
    if (apparel.has_finisher_shirt && !form.finisher_shirt_size) {
      toast({ title: "Finisher t-shirt size is required", variant: "destructive" });
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
        shirt_size: form.singlet_size || form.finisher_shirt_size || null,
        singlet_size: apparel.has_singlet ? form.singlet_size : null,
        finisher_shirt_size: apparel.has_finisher_shirt ? form.finisher_shirt_size : null,
        crop_top: apparel.has_crop_top && form.crop_top_enabled,
        crop_top_size: apparel.has_crop_top && form.crop_top_enabled
          ? form.finisher_shirt_size || form.singlet_size || null
          : null,
        gender: form.gender,
        age,
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
                        <div className="space-y-3">
                          <div className="grid gap-3 sm:grid-cols-3">
                            {selectedEvent.ticket_tiers.map((tier) => {
                              const selected = (form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug) === tier.slug;
                              return (
                                <button
                                  key={tier.slug}
                                  type="button"
                                  onClick={() => selectTicket(tier.slug)}
                                  className={`rounded-sm border overflow-hidden text-left transition-colors ${selected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-foreground/30"
                                    }`}
                                >
                                  {tier.image_url && (
                                    <img src={tier.image_url} alt={tier.name} className="h-40 w-full object-cover object-top bg-black" />
                                  )}
                                  <div className="p-3">
                                    <p className="font-semibold text-foreground">{tier.name}</p>
                                    <p className="text-sm text-muted-foreground">₱{Number(tier.price).toLocaleString()}</p>
                                    {isSouvenirPromoCategory(tier.slug, tier.name) && (
                                      <p className="text-[11px] text-muted-foreground mt-1">First 150 qualified 12KM + 25KM get a free souvenir shirt.</p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {(() => {
                            const selectedTier = selectedEvent.ticket_tiers.find(
                              (tier) => tier.slug === (form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug)
                            );
                            if (!selectedTier?.image_url) return null;
                            return (
                              <div className="rounded-sm border border-border overflow-hidden bg-black">
                                <p className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/80 bg-primary">
                                  {selectedTier.name} entitlements
                                </p>
                                <img
                                  src={selectedTier.image_url}
                                  alt={`${selectedTier.name} entitlements`}
                                  className="w-full max-h-[40rem] object-contain"
                                />
                              </div>
                            );
                          })()}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={form.gender} onValueChange={(value) => setForm((f) => ({ ...f, gender: value }))}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={EVENT_AGE_MIN}
                    max={EVENT_AGE_MAX}
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    required
                  />
                </div>
              </div>
              {apparel.has_singlet && (
                <div>
                  <Label>Event singlet size</Label>
                  <ApparelSizeButtons
                    value={form.singlet_size}
                    onChange={(size) => setForm((f) => ({ ...f, singlet_size: size }))}
                  />
                </div>
              )}
              {apparel.has_finisher_shirt && (
                <div>
                  <Label>Finisher t-shirt size</Label>
                  <ApparelSizeButtons
                    value={form.finisher_shirt_size}
                    onChange={(size) => setForm((f) => ({ ...f, finisher_shirt_size: size }))}
                  />
                </div>
              )}
              {apparel.has_crop_top && (
                <div>
                  <label className="flex items-start gap-3 rounded-sm border border-border p-3 cursor-pointer">
                    <Checkbox
                      className="mt-0.5"
                      checked={form.crop_top_enabled}
                      onCheckedChange={(checked) => setForm((f) => ({
                        ...f,
                        crop_top_enabled: checked === true,
                      }))}
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">Make this a cropped top</span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        Optional. Uses the singlet / finisher size you picked above. Check this only if you want your shirt cropped.
                      </span>
                    </span>
                  </label>
                </div>
              )}
              {selectedEvent?.ticket_tiers?.length ? (
                <div>
                  <Label>Distance</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedEvent.ticket_tiers.map((tier) => (
                      <Button
                        key={tier.slug}
                        type="button"
                        variant={(form.ticket_slug || selectedEvent.ticket_tiers[0]?.slug) === tier.slug ? "default" : "outline"}
                        onClick={() => selectTicket(tier.slug)}
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

              {selectedEvent && isSouvenirPromoCategory(selectedTier?.slug, selectedTier?.name) && (
                <p className="text-xs text-muted-foreground">{SOUVENIR_SHIRT_PROMO_NOTE}</p>
              )}
              {selectedEvent && (
                <p className="text-xs text-muted-foreground">A ₱{totals.convenienceFee.toLocaleString()} convenience fee is added to every registration.</p>
              )}
              {selectedEvent && (
                <div className="rounded-sm border border-border bg-secondary/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Registration fee</span><span>₱{totals.basePrice.toLocaleString()}</span></div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-₱{totals.discountAmount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Convenience fee</span><span>₱{totals.convenienceFee.toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2"><span>Total amount due</span><span>₱{totals.finalAmount.toLocaleString()}</span></div>
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
