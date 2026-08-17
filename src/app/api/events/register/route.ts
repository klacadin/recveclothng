import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations, events } from "@/db/schema";
import { getAppBaseUrl } from "@/config/constants";
import {
  calculateRegistrationTotals,
  eventPaymentReference,
  generateCheckInCode,
} from "@/lib/event-management";
import { sendEventConfirmationEmail } from "@/lib/event-email";
import { holdsEventSeat, mapRegistration } from "@/lib/event-records";
import { createHitPayPaymentRequest, getHitPayApiKey } from "@/lib/hitpay";

async function uniqueCheckInCode() {
  const db = getDb();
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateCheckInCode();
    const [existing] = await db
      .select({ id: eventRegistrations.id })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.checkInCode, code))
      .limit(1);
    if (!existing) return code;
  }
  return generateCheckInCode(8);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventId = String(body.event_id || "").trim();
    const fullName = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    if (!eventId || !fullName || !email) {
      return NextResponse.json({ error: "event_id, full_name, and email are required" }, { status: 400 });
    }

    const db = getDb();
    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event || !event.isActive) {
      return NextResponse.json({ error: "Event is not available" }, { status: 404 });
    }

    const totals = calculateRegistrationTotals({
      basePrice: Number(event.price || 0),
      eventPromoCode: event.promoCode,
      providedPromoCode: body.promo_code_used ?? body.promo_code,
      discountPercent: event.promoDiscountPercent,
    });

    const existingRows = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, event.id),
          sql`lower(${eventRegistrations.email}) = ${email}`
        )
      );

    const activeExisting = existingRows.find((row) => holdsEventSeat(row.paymentStatus));
    if (activeExisting?.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This email is already registered for the event" },
        { status: 409 }
      );
    }

    const seatCount = existingRows.filter((row) => holdsEventSeat(row.paymentStatus)).length;
    if (event.maxAttendees > 0 && !activeExisting && seatCount >= event.maxAttendees) {
      return NextResponse.json({ error: "This event is full" }, { status: 409 });
    }

    const phone = String(body.phone || "").trim() || null;
    const company = String(body.company || "").trim() || null;
    const notes = String(body.notes || "").trim() || null;
    const promoCodeUsed = totals.isPromoValid ? event.promoCode : null;
    const isFree = totals.finalAmount <= 0;
    const now = new Date();

    let registration = activeExisting;
    if (registration) {
      const [updated] = await db
        .update(eventRegistrations)
        .set({
          fullName,
          phone,
          company,
          notes,
          promoCodeUsed,
          subtotal: String(totals.basePrice),
          discountAmount: String(totals.discountAmount),
          finalAmount: String(totals.finalAmount),
          paymentStatus: isFree ? "paid" : "pending",
          updatedAt: now,
        })
        .where(eq(eventRegistrations.id, registration.id))
        .returning();
      registration = updated;
    } else {
      const [created] = await db
        .insert(eventRegistrations)
        .values({
          eventId: event.id,
          fullName,
          email,
          phone,
          company,
          notes,
          promoCodeUsed,
          subtotal: String(totals.basePrice),
          discountAmount: String(totals.discountAmount),
          finalAmount: String(totals.finalAmount),
          paymentStatus: isFree ? "paid" : "pending",
          checkInCode: await uniqueCheckInCode(),
        })
        .returning();
      registration = created;
    }

    if (!registration) {
      return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }

    let redirectUrl: string | null = null;
    if (!isFree && getHitPayApiKey()) {
      try {
        const appUrl = getAppBaseUrl();
        const hit = await createHitPayPaymentRequest({
          amount: totals.finalAmount,
          email,
          name: fullName,
          purpose: `REVE event: ${event.title}`,
          referenceNumber: eventPaymentReference(registration.id),
          redirectUrl: `${appUrl}/events/registered?id=${registration.id}`,
        });
        redirectUrl = hit.url || null;
        if (hit.id) {
          const [paidRow] = await db
            .update(eventRegistrations)
            .set({ hitpayPaymentId: hit.id, updatedAt: new Date() })
            .where(eq(eventRegistrations.id, registration.id))
            .returning();
          if (paidRow) registration = paidRow;
        }
      } catch (e) {
        console.error("event HitPay", e);
      }
    }

    if (isFree) {
      await sendEventConfirmationEmail({
        email,
        fullName,
        eventTitle: event.title,
        startsAt: event.startsAt,
        location: event.location,
        checkInCode: registration.checkInCode,
        finalAmount: totals.finalAmount,
        paymentStatus: "paid",
        registrationId: registration.id,
      });
    }

    return NextResponse.json({
      ...mapRegistration(registration),
      redirect_url: redirectUrl,
    });
  } catch (e) {
    console.error("events register", e);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
