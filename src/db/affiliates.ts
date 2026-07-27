import { and, eq, sql, desc } from "drizzle-orm";
import { getDb } from "./client";
import { affiliateCommissions, affiliates, orders, PAID_ORDER_STATUSES } from "./schema";

type PaidStatus = (typeof PAID_ORDER_STATUSES)[number];

export async function recordAffiliateCommissionForOrder(orderId: string) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order?.affiliateId) return null;
  if (!PAID_ORDER_STATUSES.includes(order.status as PaidStatus)) return null;

  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(and(eq(affiliates.id, order.affiliateId), eq(affiliates.status, "active")))
    .limit(1);
  if (!affiliate) return null;

  const rate = Number(affiliate.commissionRate);
  const subtotal = Number(order.subtotal);
  const amount = Math.round(subtotal * rate * 100) / 100;

  const [existing] = await db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.orderId, orderId))
    .limit(1);
  if (existing) return existing;

  const [row] = await db
    .insert(affiliateCommissions)
    .values({
      affiliateId: affiliate.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderSubtotal: String(subtotal),
      commissionRate: String(rate),
      commissionAmount: String(amount),
    })
    .returning();

  return row;
}

export async function getAffiliateStats(affiliateId: string) {
  const db = getDb();
  const [agg] = await db
    .select({
      confirmedOrders: sql<number>`count(*)::int`,
      totalSales: sql<string>`coalesce(sum(${affiliateCommissions.orderSubtotal}), 0)`,
      totalEarnings: sql<string>`coalesce(sum(${affiliateCommissions.commissionAmount}), 0)`,
    })
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.affiliateId, affiliateId));

  return {
    confirmedOrders: agg?.confirmedOrders ?? 0,
    totalSales: Number(agg?.totalSales ?? 0),
    totalEarnings: Number(agg?.totalEarnings ?? 0),
  };
}

export async function listAffiliateCommissions(affiliateId: string) {
  const db = getDb();
  return db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.affiliateId, affiliateId))
    .orderBy(desc(affiliateCommissions.createdAt));
}

export async function listAllAffiliateActivity() {
  const db = getDb();
  const allAffiliates = await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  const commissions = await db
    .select()
    .from(affiliateCommissions)
    .orderBy(desc(affiliateCommissions.createdAt));

  return { affiliates: allAffiliates, commissions };
}

export async function resolveAffiliateByCode(code: string) {
  const db = getDb();
  const normalized = code.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(affiliates)
    .where(and(eq(affiliates.code, normalized), eq(affiliates.status, "active")))
    .limit(1);
  return row ?? null;
}
