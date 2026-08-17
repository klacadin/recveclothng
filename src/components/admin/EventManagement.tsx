import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, Check, Clock3, Copy, Loader2, MapPin, Plus, Search, Trash2, Upload, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateEvent, useDeleteEvent, useEventRegistrations, useEvents, useUpdateEvent, useUpdateRegistration, type Event } from "@/hooks/useEvents";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";
import { slugifyEvent, toDatetimeLocalValue, formatEventPriceLabel } from "@/lib/event-management";

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
  ticket_tiers: [{ name: "", price: "" }],
};

const EventManagement = () => {
  const { data: events = [], isLoading } = useEvents({ activeOnly: false });
  const { data: registrations = [] } = useEventRegistrations();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const updateRegistration = useUpdateRegistration();
  const { uploadImage, isUploading } = useImageUpload();
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const openCreateForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, {
      name: form.title || "event",
      folder: "events",
    });
    if (url) setForm((f) => ({ ...f, image_url: url }));
    if (imageInputRef.current) imageInputRef.current.value = "";
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

  const registrationsByEvent = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? registrations.filter((item) =>
        [item.full_name, item.email, item.phone, item.check_in_code]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      )
      : registrations;
    return filtered.reduce<Record<string, typeof registrations>>((acc, item) => {
      acc[item.event_id] = acc[item.event_id] ? [...acc[item.event_id], item] : [item];
      return acc;
    }, {});
  }, [registrations, search]);

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
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search registrations"
          className="pl-9"
        />
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
                          ? event.ticket_tiers.map((tier) => ({ name: tier.name, price: String(tier.price) }))
                          : [{ name: "", price: "" }],
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

                <div className="grid gap-3 sm:grid-cols-4 text-sm">
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Promo</p>
                    <p className="font-medium text-foreground">{event.promo_code ? `${event.promo_code} (${event.promo_discount_percent}%)` : "None"}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium text-foreground">{event.max_attendees ? `${allRegs.length}/${event.max_attendees}` : `${allRegs.length} registered`}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Paid</p>
                    <p className="font-medium text-foreground">{paidCount}/{allRegs.length || 0}</p>
                  </div>
                  <div className="bg-secondary rounded-sm p-3">
                    <p className="text-muted-foreground">Checked in</p>
                    <p className="font-medium text-foreground">{checkedInCount}/{allRegs.length || 0}</p>
                  </div>
                </div>

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
                              Due: ₱{Number(reg.final_amount).toLocaleString()} • {reg.ticket_name || "Open"} • Promo: {reg.promo_code_used || "—"} • Code: <span className="font-mono font-semibold">{reg.check_in_code}</span>
                            </p>
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
              Add promo, image, payment instructions, and capacity. The public page is /events/your-slug.
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
                <Label>Promo image</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="Image URL or upload"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => imageInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
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
                <Label>Distances / tickets</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, ticket_tiers: [...f.ticket_tiers, { name: "", price: "" }] }))}
                >
                  Add distance
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {form.ticket_tiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-[1fr_120px_auto] gap-2">
                    <Input
                      placeholder="5km"
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setForm((f) => ({
                        ...f,
                        ticket_tiers: f.ticket_tiers.length > 1
                          ? f.ticket_tiers.filter((_, i) => i !== index)
                          : [{ name: "", price: "" }],
                      }))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
