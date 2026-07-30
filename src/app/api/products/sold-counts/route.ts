import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orderItems, orders } from "@/db/schema";

const PAID_STATUSES = [
  "paid",
  "preparing",
  "packed",
  "shipped",
  "for_pickup",
  "completed",
] as const;

/** GET ?ids=uuid,uuid — sold counts from paid/fulfilled orders */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = String(searchParams.get("ids") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 100);
    if (ids.length === 0) return NextResponse.json([]);

    const db = getDb();
    const rows = await db
      .select({
        product_id: orderItems.productId,
        sold_count: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(
        and(
          inArray(orderItems.productId, ids),
          inArray(orders.status, [...PAID_STATUSES])
        )
      )
      .groupBy(orderItems.productId);

    return NextResponse.json(
      rows
        .filter((r) => r.product_id)
        .map((r) => ({
          product_id: r.product_id as string,
          sold_count: Number(r.sold_count),
        }))
    );
  } catch (e) {
    console.error("sold-counts", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
