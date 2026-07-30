import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { productVariants, products } from "@/db/schema";

const ALLOWED_SIZES = new Set([
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "XXL",
  "XXXL",
]);

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

function mapVariant(v: typeof productVariants.$inferSelect) {
  return {
    id: v.id,
    product_id: v.productId,
    size: v.size,
    stock_quantity: v.stockQuantity,
    low_stock_threshold: v.lowStockThreshold,
    sku_suffix: v.skuSuffix,
    created_at: v.createdAt,
    updated_at: v.updatedAt,
  };
}

async function syncProductStock(
  db: ReturnType<typeof getDb>,
  productId: string
) {
  const [sumRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)`,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  const total = Number(sumRow?.total ?? 0);
  await db
    .update(products)
    .set({ stockQuantity: total, updatedAt: new Date() })
    .where(eq(products.id, productId));
  return total;
}

/** Bulk upsert size stocks for a product (admin). */
export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const productId = String(body.product_id || body.productId || "");
    const variants = Array.isArray(body.variants) ? body.variants : [];
    if (!productId) {
      return NextResponse.json({ error: "product_id required" }, { status: 400 });
    }
    if (variants.length === 0) {
      return NextResponse.json({ error: "variants required" }, { status: 400 });
    }

    const db = getDb();
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const saved = [];
    for (const raw of variants) {
      const size = String(raw.size || "");
      if (!ALLOWED_SIZES.has(size)) {
        return NextResponse.json({ error: `Invalid size: ${size}` }, { status: 400 });
      }
      const stockQuantity = Math.max(0, Math.floor(Number(raw.stock_quantity) || 0));
      const lowStockThreshold = Math.max(
        0,
        Math.floor(Number(raw.low_stock_threshold ?? 5) || 5)
      );

      const [existing] = await db
        .select()
        .from(productVariants)
        .where(
          and(
            eq(productVariants.productId, productId),
            eq(productVariants.size, size as (typeof productVariants.size.enumValues)[number])
          )
        )
        .limit(1);

      if (existing) {
        const [row] = await db
          .update(productVariants)
          .set({
            stockQuantity,
            lowStockThreshold,
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, existing.id))
          .returning();
        saved.push(mapVariant(row));
      } else {
        const [row] = await db
          .insert(productVariants)
          .values({
            productId,
            size: size as (typeof productVariants.size.enumValues)[number],
            stockQuantity,
            lowStockThreshold,
          })
          .returning();
        saved.push(mapVariant(row));
      }
    }

    const stockTotal = await syncProductStock(db, productId);
    return NextResponse.json({ variants: saved, stock_quantity: stockTotal });
  } catch (e) {
    console.error("variants PUT", e);
    return NextResponse.json({ error: "Failed to save variants" }, { status: 500 });
  }
}

/** Update a single size stock (admin). */
export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const productId = String(body.product_id || body.productId || "");
    const size = String(body.size || "");
    if (!productId || !size) {
      return NextResponse.json(
        { error: "product_id and size required" },
        { status: 400 }
      );
    }
    if (!ALLOWED_SIZES.has(size)) {
      return NextResponse.json({ error: `Invalid size: ${size}` }, { status: 400 });
    }

    const stockQuantity = Math.max(0, Math.floor(Number(body.stock_quantity) || 0));
    const db = getDb();

    const [existing] = await db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.size, size as (typeof productVariants.size.enumValues)[number])
        )
      )
      .limit(1);

    let row;
    if (existing) {
      [row] = await db
        .update(productVariants)
        .set({ stockQuantity, updatedAt: new Date() })
        .where(eq(productVariants.id, existing.id))
        .returning();
    } else {
      [row] = await db
        .insert(productVariants)
        .values({
          productId,
          size: size as (typeof productVariants.size.enumValues)[number],
          stockQuantity,
          lowStockThreshold: 5,
        })
        .returning();
    }

    const stockTotal = await syncProductStock(db, productId);
    return NextResponse.json({
      ...mapVariant(row),
      product_stock_quantity: stockTotal,
    });
  } catch (e) {
    console.error("variants PATCH", e);
    return NextResponse.json({ error: "Failed to update variant" }, { status: 500 });
  }
}
