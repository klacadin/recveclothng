import { NextResponse } from "next/server";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations, events } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { mapEvent, mapRegistration } from "@/lib/event-records";

const PAYMENT_STATUSES = ["pending", "paid", "cancelled", "refunded"] as const;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const eventId = searchParams.get("eventId");
    const q = String(searchParams.get("q") || "").trim();
    const isAdmin = await requireAdmin();
    const db = getDb();

    if (id) {
      const [row] = await db.select().from(eventRegistrations).where(eq(eventRegistrations.id, id)).limit(1);
      if (!row) return NextResponse.json(null);
      const [event] = await db.select().from(events).where(eq(events.id, row.eventId)).limit(1);
      return NextResponse.json({
        ...mapRegistration(row),
        event: event ? mapEvent(event) : null,
      });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const filters = [];
    if (eventId) filters.push(eq(eventRegistrations.eventId, eventId));
    if (q) {
      const like = `%${q}%`;
      filters.push(
        or(
          ilike(eventRegistrations.fullName, like),
          ilike(eventRegistrations.email, like),
          ilike(eventRegistrations.checkInCode, like),
          ilike(eventRegistrations.phone, like)
        )
      );
    }

    const rows = await db
      .select()
      .from(eventRegistrations)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(eventRegistrations.createdAt));

    return NextResponse.json(rows.map(mapRegistration));
  } catch (e) {
    console.error("event registrations GET", e);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const nextStatus = body.payment_status
      ? String(body.payment_status)
      : undefined;
    if (nextStatus && !PAYMENT_STATUSES.includes(nextStatus as (typeof PAYMENT_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }

    const checkedIn =
      body.checked_in === undefined ? undefined : Boolean(body.checked_in);
    const checkedInAtRaw = body.checked_in_at ?? body.check_in_at;
    let checkedInAt: Date | null | undefined = undefined;
    if (checkedIn === true) checkedInAt = new Date();
    if (checkedIn === false) checkedInAt = null;
    if (checkedInAtRaw !== undefined && checkedIn === undefined) {
      checkedInAt = checkedInAtRaw ? new Date(String(checkedInAtRaw)) : null;
    }

    const db = getDb();
    const [row] = await db
      .update(eventRegistrations)
      .set({
        paymentStatus: nextStatus,
        paymentReference:
          body.payment_reference !== undefined ? String(body.payment_reference || "").trim() || null : undefined,
        checkedIn,
        checkedInAt,
        updatedAt: new Date(),
      })
      .where(eq(eventRegistrations.id, id))
      .returning();

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapRegistration(row));
  } catch (e) {
    console.error("event registrations PATCH", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}