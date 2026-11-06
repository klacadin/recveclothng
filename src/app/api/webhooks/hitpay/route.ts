import { getAppBaseUrl } from "@/config/constants";
import { recordAffiliateCommissionForOrder } from "@/db/affiliates";
import { getDb } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import { parseEventPaymentReference } from "@/lib/event-management";
import { markEventRegistrationPaidFromWebhook } from "@/lib/event-payment";
import {
  hitPayPaymentReference,
  hitPayPaymentRequestId,
  hitPayReferenceNumber,
  isHitPayWebhookSuccess,
  parseHitPayWebhookBody,
  verifyHitPayWebhookSignature,
} from "@/lib/hitpay";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
    const eventType = req.headers.get("hitpay-event-type");
    const rawBody = await req.text();
    const payload = parseHitPayWebhookBody(rawBody, req.headers.get("content-type"));

    if (!verifyHitPayWebhookSignature({ rawBody, signatureHeader: signature, payload })) {
      console.error("hitpay webhook: invalid signature");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    if (!isHitPayWebhookSuccess(payload, eventType)) {
      return NextResponse.json({ success: true, message: "Webhook received" });
    }

    const db = getDb();
    const paymentRef = hitPayPaymentReference(payload);
    const paymentRequestId = hitPayPaymentRequestId(payload);
    const rawRef = hitPayReferenceNumber(payload);

    try {
      const registration = await markEventRegistrationPaidFromWebhook(payload);
      if (registration) {
        return NextResponse.json({
          success: true,
          registration_id: registration.id,
          status: "paid",
        });
      }
    } catch (error) {
      console.error("hitpay webhook: event registration", error);
      const registrationId = parseEventPaymentReference(rawRef);
      if (registrationId || paymentRequestId) {
        return NextResponse.json({ success: true, message: "Event payment recorded" });
      }
    }

    if (!rawRef && !paymentRequestId) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
    }

    let order: typeof orders.$inferSelect | undefined;
    if (rawRef && !parseEventPaymentReference(rawRef)) {
      [order] = await db.update(orders).set({
        status: "paid",
        paymentReferenceNumber: paymentRef,
        hitpayPaymentId: paymentRequestId || undefined,
        updatedAt: new Date(),
      }).where(eq(orders.id, rawRef)).returning();
    }

    if (!order && paymentRequestId) {
      [order] = await db
        .update(orders)
        .set({
          status: "paid",
          paymentReferenceNumber: paymentRef,
          hitpayPaymentId: paymentRequestId,
          updatedAt: new Date(),
        })
        .where(eq(orders.hitpayPaymentId, paymentRequestId))
        .returning();
    }

    if (!order) {
      console.error("hitpay webhook: order not found", rawRef, paymentRequestId);
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
