import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { productReviews } from "@/db/schema";

function mapReview(r: typeof productReviews.$inferSelect) {
  return {
    id: r.id,
    product_id: r.productId,
    order_id: r.orderId,
    user_id: r.userId,
    reviewer_name: r.reviewerName,
    reviewer_email: r.reviewerEmail,
    rating: r.rating,
    comment: r.comment,
    is_approved: r.isApproved,
    created_at: r.createdAt,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");
    if (!productId) {
      return NextResponse.json({ error: "product_id required" }, { status: 400 });
    }
    const db = getDb();
    const rows = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productId, productId),
          eq(productReviews.isApproved, true)
        )
      )
      .orderBy(desc(productReviews.createdAt));
    return NextResponse.json(rows.map(mapReview));
  } catch (e) {
    console.error("reviews GET", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = String(body.product_id || "");
    const reviewerName = String(body.reviewer_name || "").trim();
    const reviewerEmail = String(body.reviewer_email || "").trim();
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
    if (!productId || !reviewerName || !reviewerEmail || !rating) {
      return NextResponse.json(
        { error: "product_id, reviewer_name, reviewer_email, rating required" },
        { status: 400 }
      );
    }
    const db = getDb();
    const [row] = await db
      .insert(productReviews)
      .values({
        productId,
        reviewerName,
        reviewerEmail,
        rating,
        comment: body.comment?.trim() || null,
        orderId: body.order_id || null,
        userId: body.user_id || null,
        isApproved: true,
      })
      .returning();
    return NextResponse.json(mapReview(row));
  } catch (e) {
    console.error("reviews POST", e);
    return NextResponse.json(
      { error: "Failed to save review. Table may need migration." },
      { status: 500 }
    );
  }
}
