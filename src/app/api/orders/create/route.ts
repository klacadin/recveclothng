import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { orderItems, orders, productVariants, products, affiliates } from "@/db/schema";
import { AFFILIATE_COOKIE_NAME, MAX_ORDER_PIECES_SAFE } from "@/lib/commerce";
import {
  MAX_ORDER_PIECES,
  SHIPPING_PHP_BY_PIECE_COUNT,
  getAppBaseUrl,
} from "@/config/constants";

type CartItem = {
  product_id: string;
  size: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      notes,
      payment_method,
      items,
      user_id,
      affiliate_code: bodyAffiliateCode,
    } = body as {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: string;
      notes?: string;
      payment_method: "cod" | "gcash" | "maya" | "bank_transfer";
      items: CartItem[];
      user_id?: string;
      affiliate_code?: string;
    };

    if (!customer_name || !customer_email || !shipping_address || !payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalPieces = items.reduce((s, i) => s + Number(i.quantity || 0), 0);
    if (totalPieces > MAX_ORDER_PIECES || totalPieces > MAX_ORDER_PIECES_SAFE) {
      return NextResponse.json(
        { error: `Orders limited to ${MAX_ORDER_PIECES} pieces` },
        { status: 400 }
      );
    }

    const db = getDb();
    const reserved: Array<{
      product_id: string;
      size: string;
      quantity: number;
      product_name: string;
      product_sku: string | null;
      unit_price: number;
      total_price: number;
    }> = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!item.product_id || !item.size || qty < 1) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }

      const [product] = await db
        .select()
        .from(products)
        .where(and(eq(products.id, item.product_id), eq(products.isActive, true)))
        .limit(1);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }

      const [variant] = await db
        .select()
        .from(productVariants)
        .where(
          and(eq(productVariants.productId, item.product_id), eq(productVariants.size, item.size as never))
        )
        .limit(1);

      if (!variant || variant.stockQuantity < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name} (${item.size})` },
          { status: 400 }
        );
      }

      await db
        .update(productVariants)
        .set({
          stockQuantity: sql`${productVariants.stockQuantity} - ${qty}`,
          updatedAt: new Date(),
        })
        .where(eq(productVariants.id, variant.id));

      const unit = Number(product.price);
      reserved.push({
        product_id: product.id,
        size: item.size,
        quantity: qty,
        product_name: product.name,
        product_sku: product.sku,
        unit_price: unit,
        total_price: unit * qty,
      });
    }

    const serverSubtotal = reserved.reduce((s, i) => s + i.total_price, 0);
    const shippingFee = SHIPPING_PHP_BY_PIECE_COUNT[totalPieces] ?? SHIPPING_PHP_BY_PIECE_COUNT[10];
    const serverTotal = serverSubtotal + shippingFee;

    const jar = await cookies();
    const cookieCode = jar.get(AFFILIATE_COOKIE_NAME)?.value?.toLowerCase() || "";
    const bodyCode = String(bodyAffiliateCode || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const affCode = cookieCode || bodyCode;
    let affiliateId: string | null = null;
    if (affCode) {
      const [aff] = await db
        .select()
        .from(affiliates)
        .where(and(eq(affiliates.code, affCode), eq(affiliates.status, "active")))
        .limit(1);
      affiliateId = aff?.id ?? null;
    }

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const needsProof = ["gcash", "maya", "bank_transfer"].includes(payment_method);
    const initialStatus = needsProof ? "pending_payment" : "new";

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: customer_name.slice(0, 255),
        customerEmail: customer_email.slice(0, 320),
        customerPhone: customer_phone?.slice(0, 50) || null,
        shippingAddress: shipping_address.slice(0, 1000),
        notes: notes?.slice(0, 500) || null,
        paymentMethod: payment_method,
        subtotal: String(serverSubtotal),
        shippingFee: String(shippingFee),
        total: String(serverTotal),
        status: initialStatus,
        userId: user_id || null,
        affiliateId,
      })
      .returning();

    await db.insert(orderItems).values(
      reserved.map((item) => ({
        orderId: order.id,
        productId: item.product_id,
        productName: item.product_name,
        productSku: item.product_sku,
        quantity: item.quantity,
        size: item.size,
        unitPrice: String(item.unit_price),
        totalPrice: String(item.total_price),
      }))
    );

    let redirectUrl: string | null = null;
    if (needsProof) {
      const hitpayApiKey =
        process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY;
      if (!hitpayApiKey) {
        return NextResponse.json(
          { error: "Payment service is not configured", code: "payment_not_configured" },
          { status: 500 }
        );
      }

      const appUrl = getAppBaseUrl();
      const hitpayBase =
        process.env.HITPAY_SANDBOX === "true"
          ? "https://api.sandbox.hit-pay.com"
          : "https://api.hit-pay.com";
      const webhookUrl = `${appUrl}/api/webhooks/hitpay`;

      const form = new URLSearchParams();
      form.set("amount", serverTotal.toFixed(2));
      form.set("currency", "PHP");
      form.set("email", customer_email);
      form.set("name", customer_name);
      form.set("purpose", `REVE order ${orderNumber}`);
      form.set("reference_number", order.id);
      form.set("redirect_url", `${appUrl}/payment-success?order_id=${order.id}`);
      form.set("webhook", webhookUrl);

      const hitRes = await fetch(`${hitpayBase}/v1/payment-requests`, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Business-Api-Key": hitpayApiKey,
        },
        body: form.toString(),
      });

      if (!hitRes.ok) {
        const errText = await hitRes.text();
        console.error("HitPay error", errText);
        return NextResponse.json({ error: "Failed to create payment" }, { status: 502 });
      }

      const hitData = (await hitRes.json()) as { id?: string; url?: string };
      redirectUrl = hitData.url || null;
      if (hitData.id) {
        await db
          .update(orders)
          .set({ hitpayPaymentId: hitData.id, updatedAt: new Date() })
          .where(eq(orders.id, order.id));
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        shipping_fee: Number(order.shippingFee),
        affiliate_id: affiliateId,
      },
      redirect_url: redirectUrl,
    });
  } catch (e) {
    console.error("create-order", e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
