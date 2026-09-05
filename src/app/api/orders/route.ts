import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { affiliateCommissions, affiliates, orderItems, orders } from "@/db/schema";
import { recordAffiliateCommissionForOrder } from "@/db/affiliates";

async function isAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await currentUser();
    return (user?.publicMetadata?.role as string) === "admin";
  } catch {
    // Clerk not configured — allow in development when ALLOW_DEV_ADMIN=1
    return process.env.ALLOW_DEV_ADMIN === "1";
  }
}

function mapOrder(
  o: typeof orders.$inferSelect,
  aff?: { code: string; name: string } | null
) {
  return {
    id: o.id,
    order_number: o.orderNumber,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    customer_phone: o.customerPhone,
    shipping_address: o.shippingAddress,
    status: o.status,
    payment_method: o.paymentMethod,
    subtotal: Number(o.subtotal),
    shipping_fee: Number(o.shippingFee),
    total: Number(o.total),
    notes: o.notes,
    proof_of_payment_url: o.proofOfPaymentUrl,
    proof_uploaded_at: o.proofUploadedAt,
    payment_reference_number: o.paymentReferenceNumber,
    hitpay_payment_id: o.hitpayPaymentId,
    waybill_number: o.waybillNumber,
    user_id: o.userId,
    affiliate_id: o.affiliateId,
    affiliate_code: aff?.code ?? null,
    affiliate_name: aff?.name ?? null,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}

async function affiliateMapForOrders(
  db: ReturnType<typeof getDb>,
  rows: (typeof orders.$inferSelect)[]
) {
  const ids = [...new Set(rows.map((r) => r.affiliateId).filter(Boolean))] as string[];
  const map = new Map<string, { code: string; name: string }>();
  if (ids.length === 0) return map;
  const affRows = await db.select().from(affiliates).where(inArray(affiliates.id, ids));
  for (const a of affRows) {
    map.set(a.id, { code: a.code, name: a.name });
  }
  return map;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const db = getDb();

    if (id) {
      const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const affMap = await affiliateMapForOrders(db, [order]);
      const aff = order.affiliateId ? affMap.get(order.affiliateId) : null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      return NextResponse.json({
        ...mapOrder(order, aff),
        order_items: items.map((i) => ({
          id: i.id,
          order_id: i.orderId,
          product_id: i.productId,
          product_name: i.productName,
          product_sku: i.productSku,
          quantity: i.quantity,
          size: i.size,
          unit_price: Number(i.unitPrice),
          total_price: Number(i.totalPrice),
          created_at: i.createdAt,
        })),
      });
    }

    const admin = await isAdmin();
    if (!admin && !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let rows;
    if (admin && !email) {
      rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(300);
    } else if (email) {
      if (!admin) {
        // Non-admins may only list their own orders: ignore the query param and
        // resolve the email from the authenticated Clerk session instead.
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await currentUser();
        const verifiedEmails = (user?.emailAddresses ?? []).map((e) =>
          e.emailAddress.toLowerCase()
        );
        if (!verifiedEmails.includes(String(email).toLowerCase())) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
      rows = await db
        .select()
        .from(orders)
        .where(eq(orders.customerEmail, String(email).toLowerCase()))
        .orderBy(desc(orders.createdAt))
        .limit(100);
    } else {
      rows = [];
    }

    const affMap = await affiliateMapForOrders(db, rows);
    const orderIds = rows.map((o) => o.id);
    const allItems =
      orderIds.length > 0
        ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
        : [];
    const itemsByOrder = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByOrder.get(item.orderId);
      if (list) list.push(item);
      else itemsByOrder.set(item.orderId, [item]);
    }

    const result = rows.map((o) => {
      const items = itemsByOrder.get(o.id) ?? [];
      const aff = o.affiliateId ? affMap.get(o.affiliateId) : null;
      return {
        ...mapOrder(o, aff),
        order_items: items.map((i) => ({
          id: i.id,
          order_id: i.orderId,
          product_id: i.productId,
          product_name: i.productName,
          product_sku: i.productSku,
          quantity: i.quantity,
          size: i.size,
          unit_price: Number(i.unitPrice),
          total_price: Number(i.totalPrice),
          created_at: i.createdAt,
        })),
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("orders GET", e);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.map(String)
      : body.id
        ? [String(body.id)]
        : [];
    if (!ids.length) {
      return NextResponse.json({ error: "id or ids required" }, { status: 400 });
    }

    const db = getDb();
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status != null) patch.status = body.status;
    if (body.payment_reference_number !== undefined) {
      patch.paymentReferenceNumber = body.payment_reference_number;
    }
    if (body.proof_of_payment_url !== undefined) {
      patch.proofOfPaymentUrl = body.proof_of_payment_url;
    }
    if (body.waybill_number !== undefined) patch.waybillNumber = body.waybill_number;
    if (body.notes !== undefined) patch.notes = body.notes;

    const updated = await db
      .update(orders)
      .set(patch as never)
      .where(inArray(orders.id, ids))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      body.status &&
      ["paid", "preparing", "packed", "shipped", "for_pickup", "completed"].includes(
        body.status
      )
    ) {
      for (const row of updated) {
        await recordAffiliateCommissionForOrder(row.id);
      }
    }

    if (ids.length === 1) {
      const affMap = await affiliateMapForOrders(db, updated);
      const row = updated[0];
      const aff = row.affiliateId ? affMap.get(row.affiliateId) : null;
      return NextResponse.json(mapOrder(row, aff));
    }

    return NextResponse.json({ updated: updated.length, ids: updated.map((r) => r.id) });
  } catch (e) {
    console.error("orders PATCH", e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/** Admin hard-delete: removes order items, affiliate commissions, then orders. */
export async function DELETE(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.map(String)
      : body.id
        ? [String(body.id)]
        : searchParams.get("id")
          ? [String(searchParams.get("id"))]
          : [];

    if (!ids.length) {
      return NextResponse.json({ error: "id or ids required" }, { status: 400 });
    }

    const db = getDb();

    // Explicit cleanup in case older DBs lack ON DELETE CASCADE
    try {
      await db.delete(affiliateCommissions).where(inArray(affiliateCommissions.orderId, ids));
    } catch (e) {
      // Table may not exist on older DBs
      console.warn("affiliate_commissions cleanup skipped:", e);
    }
    await db.delete(orderItems).where(inArray(orderItems.orderId, ids));
    const removed = await db
      .delete(orders)
      .where(inArray(orders.id, ids))
      .returning({ id: orders.id, orderNumber: orders.orderNumber });

    return NextResponse.json({
      deleted: removed.length,
      ids: removed.map((r) => r.id),
      order_numbers: removed.map((r) => r.orderNumber),
    });
  } catch (e) {
    console.error("orders DELETE", e);
    return NextResponse.json(
      {
        error: "Failed to delete orders",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
