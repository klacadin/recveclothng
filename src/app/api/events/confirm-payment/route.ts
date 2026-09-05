import { NextResponse } from "next/server";
import { and, eq, isNotNull, ne } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations } from "@/db/schema";
import { mapRegistration } from "@/lib/event-records";
import { reconcileEventRegistrationFromHitPay } from "@/lib/event-payment";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const reconcilePending = Boolean(body.reconcile_pending);
    const registrationId = String(body.registration_id || body.id || "").trim();
    const hitpayPaymentId = String(body.hitpay_payment_id || body.reference || "").trim();

    if (reconcilePending) {
      if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const db = getDb();
      const pending = await db
        .select()
        .from(eventRegistrations)
        .where(
          and(
            ne(eventRegistrations.paymentStatus, "paid"),
            isNotNull(eventRegistrations.hitpayPaymentId)
          )
        )
        .limit(50);

      const paid = [];
      for (const row of pending) {
        if (row.paymentStatus === "cancelled" || row.paymentStatus === "refunded") continue;
        try {
          const next = await reconcileEventRegistrationFromHitPay(row);
          if (next?.paymentStatus === "paid") paid.push(mapRegistration(next));
        } catch (error) {
          console.error("event confirm-payment reconcile", row.id, error);
        }
      }
      return NextResponse.json({ success: true, reconciled: paid.length, registrations: paid });
    }

    const db = getDb();
    let registration = null as typeof eventRegistrations.$inferSelect | null;
    if (registrationId) {
      const [row] = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.id, registrationId))
        .limit(1);
      registration = row ?? null;
    } else if (hitpayPaymentId) {
      const [row] = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.hitpayPaymentId, hitpayPaymentId))
        .limit(1);
      registration = row ?? null;
    }

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.paymentStatus === "paid") {
      const numbered = (await reconcileEventRegistrationFromHitPay(registration)) ?? registration;
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

    const numbered = await reconcileEventRegistrationFromHitPay(registration);
    const paid = numbered?.paymentStatus === "paid";
    return NextResponse.json({
      success: paid,
      reconciled: paid,
      registration: mapRegistration(numbered ?? registration),
      ...(!paid ? { hitpay_status: "pending" } : {}),
    });
  } catch (e) {
    console.error("event confirm-payment", e);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
