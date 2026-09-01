import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, Check, Clock3, Copy, Download, Loader2, MapPin, Plus, Search, Trash2, Upload, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateEvent, useDeleteEvent, useEventRegistrations, useEvents, useReconcileEventPayments, useUpdateEvent, useUpdateRegistration, type Event, type EventRegistration } from "@/hooks/useEvents";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";
import { formatEventPriceLabel, formatRunnerApparel, isSouvenirPromoCategory, MAX_EVENT_CATEGORIES, slugifyEvent, souvenirPromoSummary, SOUVENIR_SHIRT_PROMO_LIMIT, toDatetimeLocalValue } from "@/lib/event-management";
import { downloadRunnerExport, first150SouvenirRecipients, type RunnerExportFormat } from "@/lib/event-registration-export";

const emptyCategory = () => ({
  name: "",
  price: "",
  image_url: "",
  bib_prefix: "",
  has_singlet: true,
  has_finisher_shirt: true,
  has_crop_top: true,
});

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
  price: "0",
  promo_code: "",
  promo_discount_percent: "0",
  max_attendees: "0",
  payment_instructions: "",
  image_url: "",
  is_active: "true",
  ticket_tiers: [emptyCategory(), emptyCategory(), emptyCategory()],
};

const EventManagement = () => {
  const { data: events = [], isLoading } = useEvents({ activeOnly: false });
  const { data: registrations = [] } = useEventRegistrations();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const updateRegistration = useUpdateRegistration();
  const reconcilePayments = useReconcileEventPayments();
  const { uploadImage, isUploading } = useImageUpload();
  const { toast } = useToast();
  const posterInputRef = useRef<HTMLInputElement>(null);
  const posterTargetRef = useRef<"main" | number>("main");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [promoFilter, setPromoFilter] = useState("all");

  useEffect(() => {
    void reconcilePayments.mutateAsync().catch(() => undefined);
    // Sync HitPay-paid rows that the webhook missed. Run once when admin opens Events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const pickPoster = (target: "main" | number) => {
    posterTargetRef.current = target;
    posterInputRef.current?.click();
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const target = posterTargetRef.current;
    const url = await uploadImage(file, {
      name: `${form.title || "event"}-${target === "main" ? "main" : `category-${target + 1}`}`,
      folder: "events",
    });
    if (url) {
      if (target === "main") {
        setForm((f) => ({ ...f, image_url: url }));
      } else {
        setForm((f) => ({
          ...f,
          ticket_tiers: f.ticket_tiers.map((item, i) => (i === target ? { ...item, image_url: url } : item)),
        }));
      }
    }
    if (posterInputRef.current) posterInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    const slug = slugifyEvent(form.slug || title) || "event";
    const ticketTiers = form.ticket_tiers
      .map((tier) => ({
        slug: slugifyEvent(tier.name),
        name: tier.name.trim(),
        price: Number(tier.price || 0),
        image_url: tier.image_url.trim() || null,
        bib_prefix: tier.bib_prefix.trim() || null,
        has_singlet: Boolean(tier.has_singlet),
        has_finisher_shirt: Boolean(tier.has_finisher_shirt),
        has_crop_top: Boolean(tier.has_crop_top),
      }))
      .filter((tier) => tier.name);
    const price = ticketTiers.length ? ticketTiers[0].price : Number(form.price || 0);
    const promoDiscountPercent = Math.max(0, Math.min(Number(form.promo_discount_percent || 0), 100));
    const maxAttendees = Math.max(0, Number(form.max_attendees || 0));

    if (!title || !form.starts_at) {
      toast({ title: "Title and start date required", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        slug,
        title,
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        price,
        promo_code: form.promo_code.trim() || null,
        promo_discount_percent: promoDiscountPercent,
        max_attendees: maxAttendees,
        payment_instructions: form.payment_instructions.trim() || null,
        image_url: form.image_url.trim() || null,
        ticket_tiers: ticketTiers,
        is_active: form.is_active === "true",
      };

      if (editing) {
        await updateEvent.mutateAsync({ id: editing.id, updates: payload });
        toast({ title: "Event updated" });
      } else {
        await createEvent.mutateAsync(payload);
        toast({ title: "Event created" });
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: "Event deleted" });
      setDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleRegistrationUpdate = async (id: string, nextStatus: string, nextCheckedIn: boolean) => {
    if (nextCheckedIn && nextStatus !== "paid") {
      toast({ title: "Mark as paid before check-in", variant: "destructive" });
      return;
    }
    try {
      await updateRegistration.mutateAsync({
        id,
        updates: {
          payment_status: nextStatus as "pending" | "paid" | "cancelled" | "refunded",
          checked_in: nextCheckedIn,
          checked_in_at: nextCheckedIn ? new Date().toISOString() : null,
        },
      });
      toast({ title: "Registration updated" });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const copyEventLink = async (slug: string) => {
    const url = `${window.location.origin}/events/${slug}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Public event link copied" });
  };

  const handleExportRunners = async (
    list: EventRegistration[],
    format: RunnerExportFormat,
    event?: Event,
    options?: { sort?: "name" | "promo_rank"; filenameSuffix?: string }
  ) => {
    if (list.length === 0) {
      toast({ title: "No registrations to export", variant: "destructive" });
      return;
    }
    try {
      const count = await downloadRunnerExport({
        registrations: list,
        events,
        event,
        format,
        sort: options?.sort,
        filenameSuffix: options?.filenameSuffix,
      });
      toast({
        title: "Export complete",
        description: `Downloaded ${count} runner${count === 1 ? "" : "s"} as ${format === "xlsx" ? "Excel" : "CSV"}.`,
      });
    } catch (err) {
      toast({ title: "Export failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  const registrationsByEvent = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = registrations.filter((item) => {
      if (q) {
        const hay = [item.full_name, item.email, item.phone, item.check_in_code, item.runner_number, item.ticket_name, item.promo_rank != null ? `#${item.promo_rank}` : ""]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
        if (!hay) return false;
      }
      if (categoryFilter !== "all" && (item.ticket_slug || "") !== categoryFilter && (item.ticket_name || "") !== categoryFilter) {
        return false;
      }
      if (statusFilter === "paid" && item.payment_status !== "paid") return false;
      if (statusFilter === "unpaid" && item.payment_status === "paid") return false;
      if (promoFilter === "shirt" && !item.free_souvenir_shirt) return false;
      if (promoFilter === "eligible" && !item.promo_eligible) return false;
      if (promoFilter === "no" && (item.free_souvenir_shirt || !isSouvenirPromoCategory(item.ticket_slug, item.ticket_name))) return false;
      return true;
    });
    return filtered.reduce<Record<string, typeof registrations>>((acc, item) => {
      acc[item.event_id] = acc[item.event_id] ? [...acc[item.event_id], item] : [item];
      return acc;
    }, {});
  }, [registrations, search, categoryFilter, statusFilter, promoFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-foreground">Events</h3>
          <p className="text-sm text-muted-foreground">Promote, collect registrations, take payment, and check people in.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/events/check-in">
              <UserRoundCheck className="h-4 w-4 mr-2" />
              Event-day check-in
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" disabled={registrations.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export all
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportRunners(registrations, "xlsx")}>
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportRunners(registrations, "csv")}>
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, runner number, or promo rank"
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[130px] h-10"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="7km">7km</SelectItem>
            <SelectItem value="12km">12km</SelectItem>
            <SelectItem value="25km">25km</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-10"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Paid / unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={promoFilter} onValueChange={setPromoFilter}>
          <SelectTrigger className="w-[170px] h-10"><SelectValue placeholder="Promo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All promo statuses</SelectItem>
            <SelectItem value="shirt">Free souvenir shirt</SelectItem>
            <SelectItem value="eligible">12km / 25km</SelectItem>
            <SelectItem value="no">No free shirt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center border border-border rounded-sm bg-card text-muted-foreground">
          No events yet. Create the first one to start collecting registrations.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const regs = registrationsByEvent[event.id] ?? [];
            const allRegs = registrations.filter((item) => item.event_id === event.id);
            const checkedInCount = allRegs.filter((r) => r.checked_in).length;
            const paidCount = allRegs.filter((r) => r.payment_status === "paid").length;
            const unpaidCount = allRegs.filter((r) => r.payment_status !== "paid").length;
            const km12 = allRegs.filter((r) => (r.ticket_slug || r.ticket_name || "").toLowerCase().replace(/\s+/g, "") === "12km").length;
            const km25 = allRegs.filter((r) => (r.ticket_slug || r.ticket_name || "").toLowerCase().replace(/\s+/g, "") === "25km").length;
            const promoRecipients = first150SouvenirRecipients(allRegs);
            const qualifiedCount = promoRecipients.length;
            const remainingPromo = Math.max(0, SOUVENIR_SHIRT_PROMO_LIMIT - qualifiedCount);
            return (
              <div key={event.id} className="border border-border rounded-sm bg-card p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex gap-3">
                    {event.image_url && (
                      <img src={event.image_url} alt="" className="h-16 w-16 rounded-sm object-cover hidden sm:block" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{event.title}</p>
                        <span className={`px-2 py-1 text-[10px] font-medium rounded ${event.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                          {event.is_active ? "Active" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarRange className="h-4 w-4" />{new Date(event.starts_at).toLocaleString()}</span>
                        {event.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{event.location}</span>}
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{formatEventPriceLabel(Number(event.price), event.ticket_tiers)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={allRegs.length === 0}>
                          <Download className="h-4 w-4 mr-1" /> Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExportRunners(allRegs, "xlsx", event)}>
                          Excel (.xlsx)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportRunners(allRegs, "csv", event)}>
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportRunners(promoRecipients, "xlsx", event, { sort: "promo_rank", filenameSuffix: "first-150" })}>
                          First 150 shirts (Excel)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportRunners(promoRecipients, "csv", event, { sort: "promo_rank", filenameSuffix: "first-150" })}>
                          First 150 shirts (CSV)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={() => copyEventLink(event.slug)}>
                      <Copy className="h-4 w-4 mr-1" /> Link
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditing(event);
                      setForm({
                        slug: event.slug,
                        title: event.title,
                        description: event.description ?? "",
                        location: event.location ?? "",
                        starts_at: toDatetimeLocalValue(event.starts_at),
                        ends_at: toDatetimeLocalValue(event.ends_at),
                        price: String(Number(event.price ?? 0)),
                        promo_code: event.promo_code ?? "",
                        promo_discount_percent: String(event.promo_discount_percent ?? 0),
                        max_attendees: String(event.max_attendees ?? 0),
                        payment_instructions: event.payment_instructions ?? "",
                        image_url: event.image_url ?? "",
                        is_active: String(event.is_active),
                        ticket_tiers: event.ticket_tiers?.length
                          ? event.ticket_tiers.map((tier) => ({
                            name: tier.name,
                            price: String(tier.price),
                            image_url: tier.image_url ?? "",
                            bib_prefix: tier.bib_prefix ?? "",
                            has_singlet: tier.has_singlet !== false,
                            has_finisher_shirt: tier.has_finisher_shirt !== false,
                            has_crop_top: tier.has_crop_top !== false,
                          }))
                          : [emptyCategory(), emptyCategory(), emptyCategory()],
                      });
                      setShowForm(true);
                    }}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(event.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8 text-sm">
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Registered</p>
                    <p className="font-medium text-foreground">{allRegs.length}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Paid</p>
                    <p className="font-medium text-foreground">{paidCount}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Unpaid</p>
                    <p className="font-medium text-foreground">{unpaidCount}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Checked in</p>
                    <p className="font-medium text-foreground">{checkedInCount}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">12KM</p>
                    <p className="font-medium text-foreground">{km12}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">25KM</p>
                    <p className="font-medium text-foreground">{km25}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3 sm:col-span-2">
                    <p className="text-muted-foreground">First 150 souvenir shirts</p>
                    <p className="font-medium text-foreground">{qualifiedCount} / {SOUVENIR_SHIRT_PROMO_LIMIT} · {remainingPromo} remaining</p>
                  </div>
                </div>

                {promoRecipients.length > 0 && (
                  <div className="rounded-sm border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-secondary/70 text-sm font-medium text-foreground">First 150 souvenir shirt promo</div>
                    <div className="max-h-64 overflow-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-card">
                          <tr className="text-left text-muted-foreground">
                            <th className="px-3 py-2">Rank</th>
                            <th className="px-3 py-2">Runner</th>
                            <th className="px-3 py-2">Category</th>
                            <th className="px-3 py-2">Qualified</th>
                            <th className="px-3 py-2">Shirt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {promoRecipients.map((reg) => (
                            <tr key={reg.id} className="border-t border-border">
                              <td className="px-3 py-2 font-mono">#{reg.promo_rank}</td>
                              <td className="px-3 py-2">{reg.full_name}</td>
                              <td className="px-3 py-2">{reg.ticket_name || "—"}</td>
                              <td className="px-3 py-2">{reg.promo_qualified_at ? new Date(reg.promo_qualified_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td>
                              <td className="px-3 py-2 font-medium">FREE</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <UserRoundCheck className="h-4 w-4" />
                    Registrations
                  </div>
                  {regs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{search ? "No matching registrations." : "No registrations yet."}</p>
                  ) : (
                    <div className="space-y-2">
                      {regs.map((reg) => (
                        <div key={reg.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 rounded-sm border border-border p-3 bg-secondary/50">
                          <div>
                            <p className="font-medium text-foreground">{reg.full_name}</p>
                            <p className="text-xs text-muted-foreground">{reg.email} • {reg.phone || "No phone"}</p>
                            <p className="text-xs text-muted-foreground">
                              {[reg.gender, reg.age != null ? `${reg.age} yrs` : null, ...formatRunnerApparel(reg)]
                                .filter(Boolean)
                                .join(" • ") || "No apparel / gender / age"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reg.ticket_name || "Open"} · {reg.payment_status.toUpperCase()} · Fee ₱{Number(reg.subtotal - reg.discount_amount).toLocaleString()} + ₱{Number(reg.convenience_fee ?? 0).toLocaleString()} convenience = ₱{Number(reg.final_amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Registered: {new Date(reg.created_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                              {reg.paid_at ? ` · Paid: ${new Date(reg.paid_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}` : ""}
                              {reg.runner_number ? <> · No. <span className="font-mono font-semibold">{reg.runner_number}</span></> : null}
                              {" · "}Code: <span className="font-mono font-semibold">{reg.check_in_code}</span>
                            </p>
                            {(() => {
                              const promo = souvenirPromoSummary(reg);
                              return (
                                <p className="text-xs text-muted-foreground">
                                  {promo.applicable
                                    ? `Promo rank: ${promo.rankLabel} · Free souvenir shirt: ${promo.shirtLabel}`
                                    : "Promo eligibility: Not applicable"}
                                </p>
                              );
                            })()}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Select value={reg.payment_status} onValueChange={(value) => handleRegistrationUpdate(reg.id, value, reg.checked_in)}>
                              <SelectTrigger className="w-32 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant={reg.checked_in ? "default" : "outline"}
                              size="sm"
                              disabled={!reg.checked_in && reg.payment_status !== "paid"}
                              title={reg.payment_status !== "paid" && !reg.checked_in ? "Mark as paid before check-in" : undefined}
                              onClick={() => handleRegistrationUpdate(reg.id, reg.payment_status, !reg.checked_in)}
                            >
                              {reg.checked_in ? <Check className="h-4 w-4 mr-1" /> : <UserRoundCheck className="h-4 w-4 mr-1" />}
                              {reg.checked_in ? "Checked in" : "Check in"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit event" : "Create event"}</DialogTitle>
            <DialogDescription>
              Add a main poster plus category posters. Each category can have its own price, racebib prefix, and apparel. The public page is /events/your-slug.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="optional" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Main poster</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="Main event poster URL or upload"
                  />
                  <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => pickPoster("main")} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Main poster preview" className="mt-2 h-32 w-full object-contain rounded-sm border border-border bg-black" />
                )}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="price">Registration price</Label>
                <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                <p className="text-xs text-muted-foreground mt-1">Used when there are no distances below.</p>
              </div>
              <div>
                <Label htmlFor="starts_at">Starts at</Label>
                <Input id="starts_at" type="datetime-local" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="ends_at">Ends at</Label>
                <Input id="ends_at" type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="promo_code">Promo code</Label>
                <Input id="promo_code" value={form.promo_code} onChange={(e) => setForm((f) => ({ ...f, promo_code: e.target.value }))} placeholder="EARLYBIRD" />
              </div>
              <div>
                <Label htmlFor="promo_discount_percent">Promo discount %</Label>
                <Input id="promo_discount_percent" type="number" min="0" max="100" value={form.promo_discount_percent} onChange={(e) => setForm((f) => ({ ...f, promo_discount_percent: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="max_attendees">Capacity</Label>
                <Input id="max_attendees" type="number" min="0" value={form.max_attendees} onChange={(e) => setForm((f) => ({ ...f, max_attendees: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="is_active">Status</Label>
                <Select value={form.is_active} onValueChange={(value) => setForm((f) => ({ ...f, is_active: value }))}>
                  <SelectTrigger id="is_active">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label>Categories / distances</Label>
                  <p className="text-xs text-muted-foreground mt-1">Up to {MAX_EVENT_CATEGORIES} categories. Turn apparel on or off per distance.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={form.ticket_tiers.length >= MAX_EVENT_CATEGORIES}
                  onClick={() => setForm((f) => (
                    f.ticket_tiers.length >= MAX_EVENT_CATEGORIES
                      ? f
                      : { ...f, ticket_tiers: [...f.ticket_tiers, emptyCategory()] }
                  ))}
                >
                  Add category
                </Button>
              </div>
              <div className="mt-2 space-y-3">
                {form.ticket_tiers.map((tier, index) => (
                  <div key={index} className="rounded-sm border border-border p-3 space-y-2">
                    <div className="grid grid-cols-[1fr_120px_90px_auto] gap-2">
                      <Input
                        placeholder={index === 0 ? "7km" : index === 1 ? "12km" : "25km"}
                        value={tier.name}
                        onChange={(e) => setForm((f) => ({
                          ...f,
                          ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, name: e.target.value } : item),
                        }))}
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="1000"
                        value={tier.price}
                        onChange={(e) => setForm((f) => ({
                          ...f,
                          ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, price: e.target.value } : item),
                        }))}
                      />
                      <Input
                        placeholder="07"
                        value={tier.bib_prefix}
                        onChange={(e) => setForm((f) => ({
                          ...f,
                          ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, bib_prefix: e.target.value } : item),
                        }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setForm((f) => ({
                          ...f,
                          ticket_tiers: f.ticket_tiers.length > 1
                            ? f.ticket_tiers.filter((_, i) => i !== index)
                            : [emptyCategory()],
                        }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Name, price, then racebib prefix (e.g. 07 → 07-001).</p>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={tier.has_singlet}
                          onCheckedChange={(checked) => setForm((f) => ({
                            ...f,
                            ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, has_singlet: checked === true } : item),
                          }))}
                        />
                        Event singlet
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={tier.has_finisher_shirt}
                          onCheckedChange={(checked) => setForm((f) => ({
                            ...f,
                            ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, has_finisher_shirt: checked === true } : item),
                          }))}
                        />
                        Finisher shirt
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={tier.has_crop_top}
                          onCheckedChange={(checked) => setForm((f) => ({
                            ...f,
                            ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, has_crop_top: checked === true } : item),
                          }))}
                        />
                        Cropped top option
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={tier.image_url}
                        onChange={(e) => setForm((f) => ({
                          ...f,
                          ticket_tiers: f.ticket_tiers.map((item, i) => i === index ? { ...item, image_url: e.target.value } : item),
                        }))}
                        placeholder={`Category ${index + 1} poster URL or upload`}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => pickPoster(index)} disabled={isUploading}>
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                    {tier.image_url && (
                      <img src={tier.image_url} alt={`${tier.name || `Category ${index + 1}`} poster`} className="h-24 w-full object-contain rounded-sm border border-border bg-black" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="payment_instructions">Payment instructions</Label>
              <Textarea id="payment_instructions" value={form.payment_instructions} onChange={(e) => setForm((f) => ({ ...f, payment_instructions: e.target.value }))} placeholder="GCash, bank transfer details, or QR code instructions" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
                {editing ? "Save changes" : "Create event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {deleteId && (
        <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete event</DialogTitle>
              <DialogDescription>This will remove the event and its registrations. This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)} disabled={deleteEvent.isPending}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventManagement;
