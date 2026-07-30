import { getAppBaseUrl } from "@/config/constants";
import { recordAffiliateCommissionForOrder } from "@/db/affiliates";
import { getDb } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function verifyHitpaySignature(rawBody: string, signature: string | null) {
  const salt =
    process.env.HITPAY_WEBHOOK_SALT || process.env.VITE_HITPAY_WEBHOOK_SALT;
  if (!salt || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const computed = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

async function sendConfirmationEmail(order: typeof orders.$inferSelect) {
  try {
    const db = getDb();
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const appUrl = getAppBaseUrl();
    await fetch(`${appUrl}/api/emails/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation",
        order_id: order.id,
        customer_email: order.customerEmail,
        customer_name: order.customerName,
        order_number: order.orderNumber,
        subtotal: Number(order.subtotal),
        shipping_fee: Number(order.shippingFee),
        total: Number(order.total),
        payment_method: order.paymentMethod,
        items: items.map((i) => ({
          product_name: i.productName,
          quantity: i.quantity,
          unit_price: Number(i.unitPrice),
          total_price: Number(i.totalPrice),
          size: i.size,
        })),
      }),
    });
  } catch (e) {
    console.error("Failed to send confirmation email", e);
  }
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("hitpay-signature");
    const rawBody = await req.text();

    if (!(await verifyHitpaySignature(rawBody, signature))) {
      console.error("hitpay webhook: invalid signature");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as {
      status?: string;
      reference_number?: string;
      reference_id?: string;
      id?: string;
      payments?: Array<{ id?: string }>;
    };

    const status = payload.status;
    const isSuccess = status === "completed" || status === "succeeded";
    if (!isSuccess) {
      return NextResponse.json({ success: true, message: "Webhook received" });
    }

    const orderId = payload.reference_number || payload.reference_id;
    if (!orderId) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
    }

    const db = getDb();
    const paymentRef = payload.payments?.[0]?.id || payload.id || null;

    const [order] = await db
      .update(orders)
      .set({
        status: "paid",
        paymentReferenceNumber: paymentRef,
        hitpayPaymentId: payload.id || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!order) {
      console.error("hitpay webhook: order not found", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await recordAffiliateCommissionForOrder(order.id);
    await sendConfirmationEmail(order);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.orderNumber,
      status: "paid",
    });
  } catch (e) {
    console.error("hitpay webhook", e);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
