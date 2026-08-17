import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { mapEvent } from "@/lib/event-records";
import { parseTicketTiers, slugifyEvent } from "@/lib/event-management";

function parseDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const activeOnly = searchParams.get("activeOnly") === "1";
    const isAdmin = await requireAdmin();
    const db = getDb();

    if (id) {
      const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (!row || (!row.isActive && !isAdmin)) {
        return NextResponse.json(null);
      }
      return NextResponse.json(mapEvent(row));
    }

    if (slug) {
      const [row] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
      if (!row || (!row.isActive && !isAdmin)) {
        return NextResponse.json(null);
      }
      return NextResponse.json(mapEvent(row));
    }

    const rows = await db.select().from(events).orderBy(desc(events.startsAt));
    const visible = activeOnly || !isAdmin ? rows.filter((row) => row.isActive) : rows;
    return NextResponse.json(visible.map((row) => mapEvent(row)));
  } catch (e) {
    console.error("events GET", e);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const startsAt = parseDate(body.starts_at);
    if (!title || !startsAt) {
      return NextResponse.json({ error: "title and starts_at required" }, { status: 400 });
    }

    const slug = slugifyEvent(String(body.slug || title) || "event") || "event";
    const ticketTiers = parseTicketTiers(body.ticket_tiers);
    const price = ticketTiers.length ? ticketTiers[0].price : Number(body.price || 0);
    const db = getDb();
    const [row] = await db
      .insert(events)
      .values({
        title,
        slug,
        description: body.description?.trim() || null,
        location: body.location?.trim() || null,
        startsAt,
        endsAt: parseDate(body.ends_at),
        price: String(price),
        promoCode: body.promo_code?.trim() || null,
        promoDiscountPercent: Math.max(0, Math.min(Number(body.promo_discount_percent || 0), 100)),
        maxAttendees: Math.max(0, Number(body.max_attendees || 0)),
        paymentInstructions: body.payment_instructions?.trim() || null,
        imageUrl: body.image_url?.trim() || null,
        ticketTiers,
        isActive: body.is_active !== false && body.is_active !== "false",
      })
      .returning();
    return NextResponse.json(mapEvent(row));
  } catch (e) {
    console.error("events POST", e);
    const message = e instanceof Error && e.message.includes("unique") ? "Slug already in use" : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
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

    const ticketTiers = body.ticket_tiers !== undefined ? parseTicketTiers(body.ticket_tiers) : undefined;
    const db = getDb();
    const [row] = await db
      .update(events)
      .set({
        title: body.title !== undefined ? String(body.title).trim() : undefined,
        slug: body.slug !== undefined ? slugifyEvent(String(body.slug)) || undefined : undefined,
        description: body.description !== undefined ? String(body.description || "").trim() || null : undefined,
        location: body.location !== undefined ? String(body.location || "").trim() || null : undefined,
        startsAt: body.starts_at !== undefined ? parseDate(body.starts_at) || undefined : undefined,
        endsAt: body.ends_at !== undefined ? parseDate(body.ends_at) : undefined,
        price:
          ticketTiers !== undefined
            ? String(ticketTiers.length ? ticketTiers[0].price : Number(body.price || 0))
            : body.price !== undefined
              ? String(Number(body.price || 0))
              : undefined,
        promoCode: body.promo_code !== undefined ? String(body.promo_code || "").trim() || null : undefined,
        promoDiscountPercent:
          body.promo_discount_percent !== undefined
            ? Math.max(0, Math.min(Number(body.promo_discount_percent || 0), 100))
            : undefined,
        maxAttendees: body.max_attendees !== undefined ? Math.max(0, Number(body.max_attendees || 0)) : undefined,
        paymentInstructions:
          body.payment_instructions !== undefined
            ? String(body.payment_instructions || "").trim() || null
            : undefined,
        imageUrl: body.image_url !== undefined ? String(body.image_url || "").trim() || null : undefined,
        ticketTiers,
        isActive:
          body.is_active !== undefined ? body.is_active !== false && body.is_active !== "false" : undefined,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapEvent(row));
  } catch (e) {
    console.error("events PATCH", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = String(body.id || searchParams.get("id") || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = getDb();
    await db.delete(events).where(eq(events.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("events DELETE", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}