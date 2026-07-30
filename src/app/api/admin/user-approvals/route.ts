import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { userApprovals } from "@/db/schema";
import { requireAdmin, requireAdminUser } from "@/lib/require-admin";

function mapApproval(a: typeof userApprovals.$inferSelect) {
  return {
    id: a.id,
    user_id: a.clerkUserId,
    status: a.status as "pending" | "approved" | "rejected",
    approved_by: a.reviewedBy,
    approved_at: a.reviewedAt,
    rejection_reason: a.notes,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
    email: a.email,
    full_name: null as string | null,
  };
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const db = getDb();
    const rows = status
      ? await db
          .select()
          .from(userApprovals)
          .where(eq(userApprovals.status, status))
          .orderBy(desc(userApprovals.createdAt))
      : await db.select().from(userApprovals).orderBy(desc(userApprovals.createdAt));
    return NextResponse.json(rows.map(mapApproval));
  } catch (e) {
    console.error("user-approvals GET", e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdminUser();
  if (!admin && !(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const userId = String(body.user_id || body.clerk_user_id || "");
    const status = String(body.status || "");
    if (!userId || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "user_id and status (approved|rejected|pending) required" },
        { status: 400 }
      );
    }
    const db = getDb();
    const [row] = await db
      .update(userApprovals)
      .set({
        status,
        reviewedBy: admin?.id ?? "admin",
        reviewedAt: new Date(),
        notes: body.rejection_reason ?? body.notes ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(userApprovals.clerkUserId, userId))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapApproval(row));
  } catch (e) {
    console.error("user-approvals PATCH", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
