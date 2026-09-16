import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

/** Admin customer account summary for an order's user_id (Clerk). */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const userId = String(body.user_id || "").trim();
    if (!userId) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    const db = getDb();
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.userId, userId));

    let account_name: string | null = null;
    let account_email: string | null = null;
    let account_created_at: string | null = null;

    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      account_email = user.emailAddresses[0]?.emailAddress ?? null;
      account_name =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;
      account_created_at = new Date(user.createdAt).toISOString();
    } catch {
      // Clerk user may not exist for legacy ids
    }

    return NextResponse.json({
      account_name,
      account_email,
      account_created_at,
      total_orders: Number(countRow?.count ?? 0),
    });
  } catch (e) {
    console.error("customer-info", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
