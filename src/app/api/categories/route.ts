import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { categories } from "@/db/schema";

export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder));

    return NextResponse.json(
      rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        code: c.code,
        image_url: c.imageUrl,
        sort_order: c.sortOrder,
        is_active: c.isActive,
      }))
    );
  } catch (e) {
    console.error("categories GET", e);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
