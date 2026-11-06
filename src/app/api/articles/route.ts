import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { articles } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

function mapArticle(a: typeof articles.$inferSelect) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    excerpt: a.excerpt,
    source: a.source as "manual" | "facebook",
    source_url: a.sourceUrl,
    image_url: a.imageUrl,
    published_at: a.publishedAt,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const db = getDb();

    if (slug) {
      const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
      return NextResponse.json(row ? mapArticle(row) : null);
    }

    const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt));
    return NextResponse.json(rows.map(mapArticle));
  } catch (e) {
    console.error("articles GET", e);
    return NextResponse.json({ error: "Failed to load articles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const slug = String(body.slug || "").trim();
    if (!title || !slug) {
      return NextResponse.json({ error: "title and slug required" }, { status: 400 });
    }
    const db = getDb();
    const [row] = await db
      .insert(articles)
      .values({
        title,
        slug,
        content: body.content ?? null,
        excerpt: body.excerpt ?? null,
        source: body.source || "manual",
        sourceUrl: body.source_url ?? null,
        imageUrl: body.image_url ?? null,
      })
      .returning();
    return NextResponse.json(mapArticle(row));
  } catch (e) {
    console.error("articles POST", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
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
      .update(articles)
      .set({
        title: body.title ?? undefined,
        slug: body.slug ?? undefined,
        content: body.content !== undefined ? body.content : undefined,
        excerpt: body.excerpt !== undefined ? body.excerpt : undefined,
        source: body.source ?? undefined,
        sourceUrl: body.source_url !== undefined ? body.source_url : undefined,
        imageUrl: body.image_url !== undefined ? body.image_url : undefined,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapArticle(row));
  } catch (e) {
    console.error("articles PATCH", e);
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
    await db.delete(articles).where(eq(articles.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("articles DELETE", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
