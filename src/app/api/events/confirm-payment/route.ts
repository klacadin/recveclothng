import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations, events } from "@/db/schema";
import { sendEventConfirmationEmail } from "@/lib/event-email";
import { mapRegistration } from "@/lib/event-records";
import { finalizeEventPayment } from "@/lib/finalize-event-payment";
import { formatRunnerNumber } from "@/lib/event-management";
import { fetchHitPayPaymentRequest, isHitPayPaid } from "@/lib/hitpay";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const registrationId = String(body.registration_id || body.id || "").trim();
    if (!registrationId) {
      return NextResponse.json({ error: "registration_id required" }, { status: 400 });
    }

    const db = getDb();
    const [registration] = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.id, registrationId))
      .limit(1);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.paymentStatus === "paid") {
      const numbered = (await finalizeEventPayment(registration.id)) ?? registration;
      return NextResponse.json({
        success: true,
        already_paid: true,
        registration: mapRegistration(numbered),
      });
    }

    if (!registration.hitpayPaymentId) {
      return NextResponse.json({
        success: false,
        registration: mapRegistration(registration),
        message: "No HitPay payment on this registration",
      });
    }

    const hitData = await fetchHitPayPaymentRequest(registration.hitpayPaymentId);
    if (!isHitPayPaid(hitData)) {
      return NextResponse.json({
        success: false,
        hitpay_status: hitData.status,
        registration: mapRegistration(registration),
      });
    }

    const paymentRef = hitData.payments?.[0]?.id || hitData.id || registration.hitpayPaymentId;
    const [updated] = await db
      .update(eventRegistrations)
      .set({
        paymentStatus: "paid",
        paymentReference: paymentRef,
        updatedAt: new Date(),
      })
      .where(eq(eventRegistrations.id, registration.id))
      .returning();

    const numbered = (await finalizeEventPayment(updated.id)) ?? updated;

    const [event] = await db.select().from(events).where(eq(events.id, numbered.eventId)).limit(1);
    if (event) {
      await sendEventConfirmationEmail({
        email: numbered.email,
        fullName: numbered.fullName,
        eventTitle: event.title,
        startsAt: event.startsAt,
        location: event.location,
        checkInCode: numbered.checkInCode,
        runnerNumber: formatRunnerNumber(numbered.runnerNumber, {
          slug: numbered.ticketSlug,
          name: numbered.ticketName,
        }),
        registrationFee: Number(numbered.subtotal) - Number(numbered.discountAmount || 0),
        convenienceFee: Number(numbered.convenienceFee || 0),
        finalAmount: Number(numbered.finalAmount),
        paymentStatus: "paid",
        registrationId: numbered.id,
        ticketName: numbered.ticketName,
        promoRank: numbered.promoRank,
        freeSouvenirShirt: numbered.freeSouvenirShirt,
      });
    }

    return NextResponse.json({
      success: true,
      reconciled: true,
      registration: mapRegistration(numbered),
    });
  } catch (e) {
    console.error("event confirm-payment", e);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
