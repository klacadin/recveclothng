import { NextResponse } from "next/server";
import { eq, and, lt } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const updated = await db
      .update(orders)
      .set({ status: "failed", updatedAt: new Date() })
      .where(and(eq(orders.status, "pending_payment"), lt(orders.createdAt, cutoff)))
      .returning({ id: orders.id });

    return NextResponse.json({ failed: updated.length, ids: updated.map((o) => o.id) });
  } catch (e) {
    console.error("fail-stale", e);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
