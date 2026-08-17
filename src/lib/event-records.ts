import { eventRegistrations, events } from "@/db/schema";
import { parseTicketTiers, formatRunnerNumber } from "@/lib/event-management";
import type { Event, EventPaymentStatus, EventRegistration } from "@/types/app-database";

const PAYMENT_STATUSES = new Set<EventPaymentStatus>(["pending", "paid", "cancelled", "refunded"]);

export function mapEvent(
  row: typeof events.$inferSelect,
  registrationCount?: number
): Event {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    starts_at: row.startsAt,
    ends_at: row.endsAt,
    price: Number(row.price ?? 0),
    promo_code: row.promoCode,
    promo_discount_percent: row.promoDiscountPercent ?? 0,
    max_attendees: row.maxAttendees ?? 0,
    payment_instructions: row.paymentInstructions,
    image_url: row.imageUrl,
    ticket_tiers: parseTicketTiers(row.ticketTiers),
    is_active: row.isActive,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    registration_count: registrationCount,
  };
}

export function mapRegistration(row: typeof eventRegistrations.$inferSelect): EventRegistration {
  const status = PAYMENT_STATUSES.has(row.paymentStatus as EventPaymentStatus)
    ? (row.paymentStatus as EventPaymentStatus)
    : "pending";

  return {
    id: row.id,
    event_id: row.eventId,
    full_name: row.fullName,
    email: row.email,
    phone: row.phone,
    company: row.company,
    notes: row.notes,
    ticket_slug: row.ticketSlug,
    ticket_name: row.ticketName,
    shirt_size: row.shirtSize,
    singlet_size: row.singletSize,
    finisher_shirt_size: row.finisherShirtSize,
    crop_top_size: row.cropTopSize,
    gender: row.gender,
    age: row.age,
    promo_code_used: row.promoCodeUsed,
    subtotal: Number(row.subtotal ?? 0),
    discount_amount: Number(row.discountAmount ?? 0),
    convenience_fee: Number(row.convenienceFee ?? 0),
    final_amount: Number(row.finalAmount ?? 0),
    payment_status: status,
    payment_reference: row.paymentReference,
    hitpay_payment_id: row.hitpayPaymentId,
    check_in_code: row.checkInCode,
    runner_number: formatRunnerNumber(row.runnerNumber, { slug: row.ticketSlug, name: row.ticketName }),
    checked_in: row.checkedIn,
    checked_in_at: row.checkedInAt,
    paid_at: row.paidAt,
    promo_eligible: Boolean(row.promoEligible),
    promo_rank: row.promoRank ?? null,
    promo_qualified_at: row.promoQualifiedAt,
    free_souvenir_shirt: Boolean(row.freeSouvenirShirt),
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function isPaidEventStatus(status: string) {
  return status === "paid";
}

export function holdsEventSeat(status: string) {
  return status === "pending" || status === "paid";
}
