import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations, events } from "@/db/schema";
import { sendEventConfirmationEmail } from "@/lib/event-email";
import { formatRunnerNumber, parseEventPaymentReference } from "@/lib/event-management";
import { finalizeEventPayment } from "@/lib/finalize-event-payment";
import {
  fetchHitPayPaymentRequest,
  hitPayPaymentReference,
  hitPayPaymentRequestId,
  hitPayReferenceNumber,
  isHitPayPaid,
  type HitPayWebhookPayload,
} from "@/lib/hitpay";

export async function findEventRegistrationFromHitPay(payload: HitPayWebhookPayload) {
  const db = getDb();
  const reference = hitPayReferenceNumber(payload);
  const registrationId = parseEventPaymentReference(reference);
  if (registrationId) {
    const [row] = await db.select().from(eventRegistrations).where(eq(eventRegistrations.id, registrationId)).limit(1);
    if (row) return row;
  }

  const paymentRequestId = hitPayPaymentRequestId(payload);
  if (paymentRequestId) {
    const [row] = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.hitpayPaymentId, paymentRequestId))
      .limit(1);
    if (row) return row;
  }

  return null;
}

export async function markEventRegistrationPaid(
  registrationId: string,
  payment?: { paymentReference?: string | null; hitpayPaymentId?: string | null }
) {
  const db = getDb();
  const [current] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  if (!current) return null;

  if (current.paymentStatus === "paid") {
    try {
      return (await finalizeEventPayment(current.id)) ?? current;
    } catch (error) {
      console.error("finalize event payment", error);
      return current;
    }
  }

    const [updated] = await db
    .update(eventRegistrations)
    .set({
      paymentStatus: "paid",
      paymentReference: payment?.paymentReference || current.paymentReference,
      hitpayPaymentId: payment?.hitpayPaymentId || current.hitpayPaymentId,
      updatedAt: new Date(),
    })
    .where(eq(eventRegistrations.id, registrationId))
    .returning();

  let registration = updated ?? current;
  try {
    registration = (await finalizeEventPayment(registration.id)) ?? registration;
  } catch (error) {
    console.error("finalize event payment", error);
  }
  await sendPaidEventEmail(registration);
  return registration;
}

export async function reconcileEventRegistrationFromHitPay(registration: typeof eventRegistrations.$inferSelect) {
  if (registration.paymentStatus === "paid") {
    return (await finalizeEventPayment(registration.id)) ?? registration;
  }
  if (!registration.hitpayPaymentId) return registration;

  const hitData = await fetchHitPayPaymentRequest(registration.hitpayPaymentId);
  if (!isHitPayPaid(hitData)) return registration;

  return markEventRegistrationPaid(registration.id, {
    paymentReference: hitData.payments?.[0]?.id || hitData.id || registration.hitpayPaymentId,
    hitpayPaymentId: hitData.id || registration.hitpayPaymentId,
  });
}

export async function markEventRegistrationPaidFromWebhook(payload: HitPayWebhookPayload) {
  const registration = await findEventRegistrationFromHitPay(payload);
  if (!registration) return null;
  return markEventRegistrationPaid(registration.id, {
    paymentReference: hitPayPaymentReference(payload),
    hitpayPaymentId: hitPayPaymentRequestId(payload) || registration.hitpayPaymentId,
  });
}

async function sendPaidEventEmail(registration: typeof eventRegistrations.$inferSelect) {
  try {
    const db = getDb();
    const [event] = await db.select().from(events).where(eq(events.id, registration.eventId)).limit(1);
    if (!event) return;
    await sendEventConfirmationEmail({
      email: registration.email,
      fullName: registration.fullName,
      eventTitle: event.title,
      startsAt: event.startsAt,
      location: event.location,
      checkInCode: registration.checkInCode,
      runnerNumber: formatRunnerNumber(registration.runnerNumber, {
        slug: registration.ticketSlug,
        name: registration.ticketName,
      }),
      registrationFee: Number(registration.subtotal) - Number(registration.discountAmount || 0),
      convenienceFee: Number(registration.convenienceFee || 0),
      finalAmount: Number(registration.finalAmount),
      paymentStatus: "paid",
      registrationId: registration.id,
      ticketName: registration.ticketName,
      promoRank: registration.promoRank,
      freeSouvenirShirt: registration.freeSouvenirShirt,
    });
  } catch (error) {
    console.error("event paid email", error);
  }
}
