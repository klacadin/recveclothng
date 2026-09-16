import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import { recordAffiliateCommissionForOrder } from "@/db/affiliates";

/**
 * Reconcile HitPay payment when webhook was missed (e.g. apex→www 308).
 * Called from /payment-success after redirect.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = String(body.order_id || "").trim();
    if (!orderId) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (["paid", "preparing", "packed", "shipped", "for_pickup", "completed"].includes(order.status)) {
      return NextResponse.json({
        success: true,
        already_paid: true,
        order_number: order.orderNumber,
        status: order.status,
        customer_name: order.customerName,
        total: Number(order.total),
      });
    }

    if (!order.hitpayPaymentId) {
      return NextResponse.json({
        success: false,
        status: order.status,
        order_number: order.orderNumber,
        customer_name: order.customerName,
        total: Number(order.total),
        message: "No HitPay payment on this order",
      });
    }

    const apiKey = process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
    }

    const hitpayBase =
      process.env.HITPAY_SANDBOX === "true"
        ? "https://api.sandbox.hit-pay.com"
        : "https://api.hit-pay.com";

    const hitRes = await fetch(`${hitpayBase}/v1/payment-requests/${order.hitpayPaymentId}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Business-Api-Key": apiKey,
      },
    });

    if (!hitRes.ok) {
      const errText = await hitRes.text();
      console.error("HitPay reconcile fetch failed", hitRes.status, errText);
      return NextResponse.json({ error: "Failed to verify payment" }, { status: 502 });
    }

    const hitData = (await hitRes.json()) as {
      status?: string;
      id?: string;
      payments?: Array<{ id?: string; status?: string }>;
    };

    const paid =
      hitData.status === "completed" ||
      hitData.status === "succeeded" ||
      hitData.payments?.some((p) => p.status === "succeeded" || p.status === "completed");

    if (!paid) {
      return NextResponse.json({
        success: false,
        status: order.status,
        hitpay_status: hitData.status,
        order_number: order.orderNumber,
        customer_name: order.customerName,
        total: Number(order.total),
      });
    }

    const paymentRef = hitData.payments?.[0]?.id || hitData.id || order.hitpayPaymentId;
    const [updated] = await db
      .update(orders)
      .set({
        status: "paid",
        paymentReferenceNumber: paymentRef,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();

    await recordAffiliateCommissionForOrder(order.id);

    return NextResponse.json({
      success: true,
      reconciled: true,
      order_number: updated.orderNumber,
      status: updated.status,
      customer_name: updated.customerName,
      total: Number(updated.total),
    });
  } catch (e) {
    console.error("confirm-payment", e);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
