import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

function mapContact(c: typeof contactSubmissions.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    read_at: c.readAt,
    created_at: c.createdAt,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const [row] = await db
      .insert(contactSubmissions)
      .values({ name, email, phone, subject, message })
      .returning();

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error("contact POST", e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
    return NextResponse.json(rows.map(mapContact));
  } catch (e) {
    console.error("contact GET", e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = getDb();
    const [row] = await db
      .update(contactSubmissions)
      .set({ readAt: body.read_at === null ? null : new Date() })
      .where(eq(contactSubmissions.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapContact(row));
  } catch (e) {
    console.error("contact PATCH", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
