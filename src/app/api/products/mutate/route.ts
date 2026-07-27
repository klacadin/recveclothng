import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

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

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const db = getDb();
    const [row] = await db
      .insert(products)
      .values({
        name: body.name,
        description: body.description ?? null,
        price: String(body.price ?? 0),
        sku: body.sku ?? null,
        category: body.category ?? null,
        imageUrl: body.image_url ?? null,
        images: body.images ?? null,
        stockQuantity: body.stock_quantity ?? 0,
        lowStockThreshold: body.low_stock_threshold ?? 5,
        weightGrams: body.weight_grams ?? null,
        isActive: body.is_active ?? true,
      })
      .returning();
    return NextResponse.json(row);
  } catch (e) {
    console.error("products POST", e);
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
      .update(products)
      .set({
        name: body.name ?? undefined,
        description: body.description ?? undefined,
        price: body.price != null ? String(body.price) : undefined,
        sku: body.sku ?? undefined,
        category: body.category ?? undefined,
        imageUrl: body.image_url ?? undefined,
        images: body.images ?? undefined,
        stockQuantity: body.stock_quantity ?? undefined,
        lowStockThreshold: body.low_stock_threshold ?? undefined,
        weightGrams: body.weight_grams ?? undefined,
        isActive: body.is_active ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return NextResponse.json(row);
  } catch (e) {
    console.error("products PATCH", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = getDb();
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("products DELETE", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
