import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { productVariants } from "@/db/schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");
    const db = getDb();

    const rows = productId
      ? await db.select().from(productVariants).where(eq(productVariants.productId, productId))
      : await db.select().from(productVariants);

    return NextResponse.json(
      rows.map((v) => ({
        id: v.id,
        product_id: v.productId,
        size: v.size,
        stock_quantity: v.stockQuantity,
        low_stock_threshold: v.lowStockThreshold,
        sku_suffix: v.skuSuffix,
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      }))
    );
  } catch (e) {
    console.error("variants GET", e);
    return NextResponse.json({ error: "Failed to load variants" }, { status: 500 });
  }
}
