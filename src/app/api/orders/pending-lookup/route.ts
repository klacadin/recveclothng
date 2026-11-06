import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";

/**
 * Public lookup for payment-proof upload: order_number + customer_email.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderNumber = String(body.order_number || "").trim();
    const email = String(body.customer_email || "").trim().toLowerCase();
    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "order_number and customer_email required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderNumber, orderNumber),
          sql`lower(${orders.customerEmail}) = ${email}`
        )
      )
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Check order number and email." },
        { status: 404 }
      );
    }

    const allowUpload = [
      "pending_payment",
      "for_verification",
      "new",
      "paid",
    ].includes(order.status);

    if (!allowUpload && order.proofOfPaymentUrl) {
      // Still return the order so UI can show "already uploaded"
    } else if (
      !["pending_payment", "for_verification", "new"].includes(order.status) &&
      !order.proofOfPaymentUrl
    ) {
      // HitPay-paid orders may not need proof; still allow if pending
    }

    return NextResponse.json({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      proof_of_payment_url: order.proofOfPaymentUrl,
    });
  } catch (e) {
    console.error("pending-lookup", e);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
