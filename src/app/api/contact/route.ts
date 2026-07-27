import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";

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
