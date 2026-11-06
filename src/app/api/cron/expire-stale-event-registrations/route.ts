import { NextResponse } from "next/server";
import { and, eq, lt, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations } from "@/db/schema";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const now = new Date();

    const stale = await db
      .select({ id: eventRegistrations.id })
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.paymentStatus, "pending"),
          eq(eventRegistrations.registrationStatus, "pending"),
          lt(eventRegistrations.expiresAt, now)
        )
      )
      .limit(500);

    if (stale.length === 0) {
      return NextResponse.json({ expired: 0, ids: [] });
    }

    const ids = stale.map((r) => r.id);
    const updated = await db
      .update(eventRegistrations)
      .set({ registrationStatus: "expired", updatedAt: now })
      .where(sql`${eventRegistrations.id} = any(${ids}::uuid[])`)
      .returning({ id: eventRegistrations.id });

    return NextResponse.json({ expired: updated.length, ids: updated.map((r) => r.id) });
  } catch (e) {
    console.error("expire-stale-event-registrations", e);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
