import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

function mapCategory(c: typeof categories.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    code: c.code,
    image_url: c.imageUrl,
    parent_id: null as string | null,
    sort_order: c.sortOrder ?? 0,
    is_active: c.isActive,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

/** Public: active categories. Admin with ?all=1: every category. ?counts=1: product counts. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wantAll = searchParams.get("all") === "1";
    const wantCounts = searchParams.get("counts") === "1";
    const db = getDb();

    if (wantCounts) {
      const rows = await db
        .select({
          category: products.category,
          count: sql<number>`count(*)::int`,
        })
        .from(products)
        .where(eq(products.isActive, true))
        .groupBy(products.category);
      const counts: Record<string, number> = {};
      for (const r of rows) {
        counts[r.category || "uncategorized"] = Number(r.count);
      }
      return NextResponse.json(counts);
    }

    if (wantAll) {
      if (!(await requireAdmin())) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      return NextResponse.json(rows.map(mapCategory));
    }

    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder));
    return NextResponse.json(rows.map(mapCategory));
  } catch (e) {
    console.error("categories GET", e);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug required" }, { status: 400 });
    }
    const db = getDb();
    const [row] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: body.description ?? null,
        code: body.code ?? null,
        imageUrl: body.image_url ?? null,
        sortOrder: body.sort_order ?? 0,
        isActive: body.is_active ?? true,
      })
      .returning();
    return NextResponse.json(mapCategory(row));
  } catch (e) {
    console.error("categories POST", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const db = getDb();

    // Bulk reorder: { ordered_ids: string[] }
    if (Array.isArray(body.ordered_ids)) {
      for (let i = 0; i < body.ordered_ids.length; i++) {
        const id = String(body.ordered_ids[i]);
        await db
          .update(categories)
          .set({ sortOrder: i + 1, updatedAt: new Date() })
          .where(eq(categories.id, id));
      }
      return NextResponse.json({ ok: true });
    }

    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const [row] = await db
      .update(categories)
      .set({
        name: body.name ?? undefined,
        slug: body.slug ?? undefined,
        description: body.description !== undefined ? body.description : undefined,
        code: body.code !== undefined ? body.code : undefined,
        imageUrl: body.image_url !== undefined ? body.image_url : undefined,
        sortOrder: body.sort_order ?? undefined,
        isActive: body.is_active ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapCategory(row));
  } catch (e) {
    console.error("categories PATCH", e);
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
    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("categories DELETE", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
