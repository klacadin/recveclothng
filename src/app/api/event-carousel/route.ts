import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventCarousel } from "@/db/schema";
import { MAX_EVENT_CAROUSEL_ITEMS } from "@/config/constants";

async function requireAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await currentUser();
    return (user?.publicMetadata?.role as string) === "admin";
  } catch {
    return process.env.ALLOW_DEV_ADMIN === "1";
  }
}

function mapItem(row: typeof eventCarousel.$inferSelect) {
  return {
    id: row.id,
    image_url: row.imageUrl,
    title: row.title,
    caption: row.caption,
    created_at: row.createdAt?.toISOString?.() ?? row.createdAt,
  };
}

export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(eventCarousel)
      .orderBy(desc(eventCarousel.createdAt))
      .limit(MAX_EVENT_CAROUSEL_ITEMS);
    return NextResponse.json(rows.map(mapItem));
  } catch (e) {
    console.error("event-carousel GET", e);
    return NextResponse.json({ error: "Failed to load event carousel" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const imageUrl = String(body.image_url || "").trim();
    const title = String(body.title || "").trim();
    const caption =
      body.caption == null || String(body.caption).trim() === ""
        ? null
        : String(body.caption).trim();

    if (!imageUrl || !title) {
      return NextResponse.json(
        { error: "image_url and title are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = await db.select({ id: eventCarousel.id }).from(eventCarousel);
    if (existing.length >= MAX_EVENT_CAROUSEL_ITEMS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_EVENT_CAROUSEL_ITEMS} photos allowed` },
        { status: 400 }
      );
    }

    const [row] = await db
      .insert(eventCarousel)
      .values({ imageUrl, title, caption })
      .returning();

    return NextResponse.json(mapItem(row), { status: 201 });
  } catch (e) {
    console.error("event-carousel POST", e);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updates: Partial<typeof eventCarousel.$inferInsert> = {};
    if (body.image_url !== undefined) updates.imageUrl = String(body.image_url).trim();
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.caption !== undefined) {
      updates.caption =
        body.caption == null || String(body.caption).trim() === ""
          ? null
          : String(body.caption).trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const db = getDb();
    const [row] = await db
      .update(eventCarousel)
      .set(updates)
      .where(eq(eventCarousel.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(mapItem(row));
  } catch (e) {
    console.error("event-carousel PATCH", e);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = (searchParams.get("id") || "").trim();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb();
    const [row] = await db
      .delete(eventCarousel)
      .where(eq(eventCarousel.id, id))
      .returning({ id: eventCarousel.id });

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("event-carousel DELETE", e);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
