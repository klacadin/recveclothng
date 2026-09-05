import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  affiliates,
  orderItems,
  orders,
  productVariants,
  products,
  vouchers,
} from "@/db/schema";
import { AFFILIATE_COOKIE_NAME, MAX_ORDER_PIECES_SAFE } from "@/lib/commerce";
import {
  CONVENIENCE_FEE,
  MAX_ORDER_PIECES,
  TEST_VOUCHER_CODE,
  TEST_VOUCHER_DISCOUNT_PERCENT,
  getAppBaseUrl,
} from "@/config/constants";
import { shippingFeeByTotalPiecesPhp } from "@/utils/orderShippingRates";

type CartItem = {
  product_id: string;
  size: string;
  quantity: number;
};

async function computeVoucherDiscount(
  db: ReturnType<typeof getDb>,
  codeRaw: string | null | undefined,
  serverSubtotal: number,
  reserved: Array<{ product_id: string; total_price: number; category?: string | null }>
) {
  const cleanCode = String(codeRaw || "")
    .trim()
    .toUpperCase();
  if (!cleanCode) return 0;

  if (cleanCode === TEST_VOUCHER_CODE.toUpperCase()) {
    return Math.floor(serverSubtotal * (Math.min(100, TEST_VOUCHER_DISCOUNT_PERCENT) / 100));
  }

  const [voucher] = await db
    .select()
    .from(vouchers)
    .where(sql`upper(${vouchers.code}) = ${cleanCode}`)
    .limit(1);
  if (!voucher || !voucher.isActive) return 0;
  if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) return 0;
  if (voucher.maxUses != null && (voucher.usedCount ?? 0) >= voucher.maxUses) return 0;

  const minOrder = Number(voucher.minOrderAmount ?? 0);
  if (minOrder > 0 && serverSubtotal < minOrder) return 0;

  const productIds = Array.isArray(voucher.productIds) ? voucher.productIds : [];
  const categoryIds = Array.isArray(voucher.categoryIds) ? voucher.categoryIds : [];
  let eligible = serverSubtotal;
  if (productIds.length > 0 || categoryIds.length > 0) {
    eligible = reserved.reduce((sum, i) => {
      const matchProduct = productIds.length > 0 && productIds.includes(i.product_id);
      const matchCategory =
        categoryIds.length > 0 &&
        !!i.category &&
        categoryIds.includes(String(i.category));
      const ok =
        (productIds.length > 0 && matchProduct) ||
        (categoryIds.length > 0 && matchCategory);
      return ok ? sum + i.total_price : sum;
    }, 0);
  }
  if (eligible <= 0) return 0;

  const val = Number(voucher.discountValue);
  const discountAmount =
    voucher.discountType === "percent"
      ? Math.floor(eligible * (Math.min(100, val) / 100))
      : Math.min(eligible, val);
  if (discountAmount <= 0) return 0;

  // Atomically claim a redemption slot so concurrent checkouts can't both
  // succeed past a voucher's max-use limit.
  const redeemed =
    voucher.maxUses != null
      ? await db
          .update(vouchers)
          .set({ usedCount: sql`${vouchers.usedCount} + 1`, updatedAt: new Date() })
          .where(and(eq(vouchers.id, voucher.id), lt(vouchers.usedCount, voucher.maxUses)))
          .returning({ id: vouchers.id })
      : await db
          .update(vouchers)
          .set({ usedCount: sql`${vouchers.usedCount} + 1`, updatedAt: new Date() })
          .where(eq(vouchers.id, voucher.id))
          .returning({ id: vouchers.id });

  if (!redeemed.length) return 0; // usage limit reached by a concurrent order

  return discountAmount;
}

/** Undo a voucher redemption claimed by computeVoucherDiscount (rollback on order failure). */
async function releaseVoucherRedemption(
  db: ReturnType<typeof getDb>,
  codeRaw: string | null | undefined,
  discount: number
) {
  const cleanCode = String(codeRaw || "").trim().toUpperCase();
  if (!cleanCode || cleanCode === TEST_VOUCHER_CODE.toUpperCase() || discount <= 0) return;
  await db
    .update(vouchers)
    .set({ usedCount: sql`greatest(${vouchers.usedCount} - 1, 0)`, updatedAt: new Date() })
    .where(sql`upper(${vouchers.code}) = ${cleanCode}`);
}

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
      voucher_code: bodyVoucherCode,
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
      voucher_code?: string;
    };

    if (!customer_name || !customer_email || !shipping_address || !payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fail fast on a misconfigured payment method, before reserving any stock.
    const needsProof = ["gcash", "maya", "bank_transfer"].includes(payment_method);
    if (needsProof && !(process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY)) {
      return NextResponse.json(
        { error: "Payment service is not configured", code: "payment_not_configured" },
        { status: 500 }
      );
    }

    const totalPieces = items.reduce((s, i) => s + Number(i.quantity || 0), 0);
    if (totalPieces > MAX_ORDER_PIECES || totalPieces > MAX_ORDER_PIECES_SAFE) {
      return NextResponse.json(
        { error: `Orders limited to ${MAX_ORDER_PIECES} pieces` },
        { status: 400 }
      );
    }

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!item.product_id || !item.size || qty < 1) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }
    }

    // Merge duplicate product+size lines so each variant is only checked/reserved once.
    const mergedItems = new Map<string, CartItem>();
    for (const item of items) {
      const key = `${item.product_id}:${item.size}`;
      const existing = mergedItems.get(key);
      if (existing) {
        existing.quantity += Number(item.quantity);
      } else {
        mergedItems.set(key, { ...item, quantity: Number(item.quantity) });
      }
    }

    const db = getDb();
    const productIds = [...new Set(items.map((i) => i.product_id))];
    const productRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, productIds), eq(products.isActive, true)));
    const productMap = new Map(productRows.map((p) => [p.id, p]));

    const variantRows = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));
    const variantMap = new Map(
      variantRows.map((v) => [`${v.productId}:${v.size}`, v])
    );

    const reserved: Array<{
      product_id: string;
      size: string;
      quantity: number;
      product_name: string;
      product_sku: string | null;
      unit_price: number;
      total_price: number;
      category: string | null;
      variant_id: string;
    }> = [];

    for (const item of mergedItems.values()) {
      const qty = Number(item.quantity);
      const product = productMap.get(item.product_id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }
      const variant = variantMap.get(`${item.product_id}:${item.size}`);
      if (!variant || variant.stockQuantity < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name} (${item.size})` },
          { status: 400 }
        );
      }
      const unit = Number(product.price);
      reserved.push({
        product_id: product.id,
        size: item.size,
        quantity: qty,
        product_name: product.name,
        product_sku: product.sku,
        unit_price: unit,
        total_price: unit * qty,
        category: product.category,
        variant_id: variant.id,
      });
    }

    // Reserve stock one variant at a time with a conditional decrement (guards against
    // concurrent checkouts oversubscribing the same variant) so we can roll back cleanly
    // if a later item runs out or order/payment creation fails afterwards.
    const decremented: Array<{ variant_id: string; quantity: number }> = [];
    const restoreStock = () =>
      Promise.all(
        decremented.map((d) =>
          db
            .update(productVariants)
            .set({ stockQuantity: sql`${productVariants.stockQuantity} + ${d.quantity}` })
            .where(eq(productVariants.id, d.variant_id))
        )
      );

    for (const item of reserved) {
      const [row] = await db
        .update(productVariants)
        .set({ stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}` })
        .where(
          and(
            eq(productVariants.id, item.variant_id),
            gte(productVariants.stockQuantity, item.quantity)
          )
        )
        .returning({ id: productVariants.id });

      if (!row) {
        await restoreStock();
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product_name} (${item.size})` },
          { status: 409 }
        );
      }
      decremented.push({ variant_id: item.variant_id, quantity: item.quantity });
    }

    // Keep products.stock_quantity in sync with size totals (shop reads this field)
    const touchedProductIds = [...new Set(reserved.map((i) => i.product_id))];
    await Promise.all(
      touchedProductIds.map(async (productId) => {
        const [sumRow] = await db
          .select({
            total: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)`,
          })
          .from(productVariants)
          .where(eq(productVariants.productId, productId));
        await db
          .update(products)
          .set({
            stockQuantity: Number(sumRow?.total ?? 0),
            updatedAt: new Date(),
          })
          .where(eq(products.id, productId));
      })
    );

    const serverSubtotal = reserved.reduce((s, i) => s + i.total_price, 0);
    const shippingFee = shippingFeeByTotalPiecesPhp(totalPieces);
    const discount = await computeVoucherDiscount(
      db,
      bodyVoucherCode,
      serverSubtotal,
      reserved
    );
    // Must match checkout UI: subtotal - voucher + shipping + convenience fee
    const serverTotal = Math.max(
      1,
      serverSubtotal - discount + shippingFee + CONVENIENCE_FEE
    );

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

    // If anything from here on fails, undo the stock reservation and voucher
    // claim above so a failed checkout doesn't strand inventory or a redemption slot.
    const rollbackReservation = async () => {
      await restoreStock();
      await Promise.all(
        touchedProductIds.map(async (productId) => {
          const [sumRow] = await db
            .select({
              total: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)`,
            })
            .from(productVariants)
            .where(eq(productVariants.productId, productId));
          await db
            .update(products)
            .set({ stockQuantity: Number(sumRow?.total ?? 0), updatedAt: new Date() })
            .where(eq(products.id, productId));
        })
      );
      await releaseVoucherRedemption(db, bodyVoucherCode, discount);
    };

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const initialStatus = needsProof ? "pending_payment" : "new";

    let order: typeof orders.$inferSelect | undefined;
    try {
      [order] = await db
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
          orderId: order!.id,
          productId: item.product_id,
          productName: item.product_name,
          productSku: item.product_sku,
          quantity: item.quantity,
          size: item.size,
          unitPrice: String(item.unit_price),
          totalPrice: String(item.total_price),
        }))
      );
    } catch (e) {
      console.error("create-order: failed to persist order", e);
      if (order) {
        await db.delete(orderItems).where(eq(orderItems.orderId, order.id)).catch(() => {});
        await db.delete(orders).where(eq(orders.id, order.id)).catch(() => {});
      }
      await rollbackReservation().catch((rollbackErr) =>
        console.error("create-order: reservation rollback failed", rollbackErr)
      );
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    let redirectUrl: string | null = null;
    if (needsProof) {
      // Already validated at the top of the request, before stock was reserved.
      const hitpayApiKey = (process.env.HITPAY_API_KEY || process.env.VITE_HITPAY_API_KEY)!;

      const appUrl = getAppBaseUrl();
      const isSandbox = process.env.HITPAY_SANDBOX === "true";
      const hitpayBase = isSandbox
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
      form.set("send_email", "false");
      form.set("send_sms", "false");

      // Sandbox only supports card/PayNow. Production: omit payment_methods so HitPay
      // shows methods enabled on the account (avoids reject/lag from invalid method codes).
      if (isSandbox) {
        form.append("payment_methods[]", "card");
        form.append("payment_methods[]", "paynow_online");
      }

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
        await db.delete(orderItems).where(eq(orderItems.orderId, order.id));
        await db.delete(orders).where(eq(orders.id, order.id));
        await rollbackReservation();
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
        total: serverTotal,
        subtotal: serverSubtotal,
        shipping_fee: shippingFee,
        discount,
        convenience_fee: CONVENIENCE_FEE,
        affiliate_id: affiliateId,
      },
      redirect_url: redirectUrl,
    });
  } catch (e) {
    console.error("create-order", e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
