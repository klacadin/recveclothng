import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const sku = searchParams.get("sku");
    const db = getDb();

    if (id || sku) {
      let product: typeof products.$inferSelect | undefined;

      if (id && UUID_REGEX.test(id)) {
        const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        product = row;
      }

      if (!product && (sku || id)) {
        const code = (sku || id || "").trim();
        const [row] = await db
          .select()
          .from(products)
          .where(and(eq(products.sku, code), eq(products.isActive, true)))
          .limit(1);
        product = row;
      }

      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(mapProduct(product));
    }

    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    return NextResponse.json(rows.map(mapProduct));
  } catch (e) {
    console.error("products GET", e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

function mapProduct(p: typeof products.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    sku: p.sku,
    category: p.category,
    image_url: p.imageUrl,
    images: p.images,
    stock_quantity: p.stockQuantity,
    low_stock_threshold: p.lowStockThreshold,
    weight_grams: p.weightGrams,
    is_active: p.isActive,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}
