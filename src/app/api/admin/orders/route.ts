import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { affiliates, orderItems, orders } from "@/db/schema";
import { recordAffiliateCommissionForOrder } from "@/db/affiliates";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const user = await currentUser();
  if ((user?.publicMetadata?.role as string) !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { userId };
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;

  const db = getDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  const affIds = [...new Set(rows.map((r) => r.affiliateId).filter(Boolean))] as string[];
  const affMap = new Map<string, { code: string; name: string }>();
  if (affIds.length) {
    const affRows = await db.select().from(affiliates).where(inArray(affiliates.id, affIds));
    for (const a of affRows) affMap.set(a.id, { code: a.code, name: a.name });
  }
  return NextResponse.json({
    orders: rows.map((o) => {
      const aff = o.affiliateId ? affMap.get(o.affiliateId) : null;
      return {
        id: o.id,
        order_number: o.orderNumber,
        customer_name: o.customerName,
        customer_email: o.customerEmail,
        status: o.status,
        payment_method: o.paymentMethod,
        subtotal: Number(o.subtotal),
        shipping_fee: Number(o.shippingFee),
        total: Number(o.total),
        affiliate_id: o.affiliateId,
        affiliate_code: aff?.code ?? null,
        affiliate_name: aff?.name ?? null,
        created_at: o.createdAt,
      };
    }),
  });
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;

  const body = await req.json();
  const id = String(body.id || "");
  const status = body.status as string | undefined;
  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const db = getDb();
  const [updated] = await db
    .update(orders)
    .set({
      status: status as never,
      paymentReferenceNumber: body.payment_reference_number ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (["paid", "preparing", "packed", "shipped", "for_pickup", "completed"].includes(status)) {
    await recordAffiliateCommissionForOrder(updated.id);
  }

  return NextResponse.json({ order: updated });
}

export async function POST(req: Request) {
  /** Fetch order items for admin detail */
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;
  const body = await req.json();
  const orderId = String(body.order_id || "");
  if (!orderId) return NextResponse.json({ error: "order_id required" }, { status: 400 });
  const db = getDb();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return NextResponse.json({ items });
}
