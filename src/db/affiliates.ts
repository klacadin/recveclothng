import { and, eq, sql, desc, inArray, isNull } from "drizzle-orm";
import { getDb } from "./client";
import { affiliateCommissions, affiliates, orders, PAID_ORDER_STATUSES } from "./schema";

type PaidStatus = (typeof PAID_ORDER_STATUSES)[number];

export type AffiliateStats = {
  confirmedOrders: number;
  totalSales: number;
  totalEarnings: number;
};

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

export async function getAffiliateStats(affiliateId: string): Promise<AffiliateStats> {
  const map = await getAffiliateStatsForMany([affiliateId]);
  return (
    map.get(affiliateId) ?? {
      confirmedOrders: 0,
      totalSales: 0,
      totalEarnings: 0,
    }
  );
}

/** One grouped query for many affiliates (admin list). */
export async function getAffiliateStatsForMany(
  affiliateIds: string[]
): Promise<Map<string, AffiliateStats>> {
  const map = new Map<string, AffiliateStats>();
  for (const id of affiliateIds) {
    map.set(id, { confirmedOrders: 0, totalSales: 0, totalEarnings: 0 });
  }
  if (!affiliateIds.length) return map;

  const db = getDb();
  const rows = await db
    .select({
      affiliateId: affiliateCommissions.affiliateId,
      confirmedOrders: sql<number>`count(*)::int`,
      totalSales: sql<string>`coalesce(sum(${affiliateCommissions.orderSubtotal}), 0)`,
      totalEarnings: sql<string>`coalesce(sum(${affiliateCommissions.commissionAmount}), 0)`,
    })
    .from(affiliateCommissions)
    .where(inArray(affiliateCommissions.affiliateId, affiliateIds))
    .groupBy(affiliateCommissions.affiliateId);

  for (const row of rows) {
    map.set(row.affiliateId, {
      confirmedOrders: row.confirmedOrders ?? 0,
      totalSales: Number(row.totalSales ?? 0),
      totalEarnings: Number(row.totalEarnings ?? 0),
    });
  }
  return map;
}

export async function listAffiliateCommissions(affiliateId: string, limit = 100) {
  const db = getDb();
  return db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.affiliateId, affiliateId))
    .orderBy(desc(affiliateCommissions.createdAt))
    .limit(limit);
}

/**
 * Backfill commission rows for confirmed affiliate orders that are missing them
 * (e.g. payment marked paid manually / webhook missed commission write).
 */
export async function reconcileAffiliateCommissions(affiliateId?: string) {
  const db = getDb();
  const conditions = [
    sql`${orders.affiliateId} IS NOT NULL`,
    inArray(orders.status, [...PAID_ORDER_STATUSES]),
    isNull(affiliateCommissions.id),
  ];
  if (affiliateId) {
    conditions.push(eq(orders.affiliateId, affiliateId));
  }

  const missing = await db
    .select({ id: orders.id })
    .from(orders)
    .leftJoin(affiliateCommissions, eq(affiliateCommissions.orderId, orders.id))
    .where(and(...conditions))
    .limit(500);

  let created = 0;
  for (const row of missing) {
    const commission = await recordAffiliateCommissionForOrder(row.id);
    if (commission) created += 1;
  }
  return { scanned: missing.length, created };
}

/** Orders attributed to an affiliate (any status) for dashboard pipeline. */
export async function listAffiliateAttributedOrders(affiliateId: string, limit = 50) {
  const db = getDb();
  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotal: orders.subtotal,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.affiliateId, affiliateId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  const rateRow = await db
    .select({ commissionRate: affiliates.commissionRate })
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId))
    .limit(1);
  const rate = Number(rateRow[0]?.commissionRate ?? 0);

  return rows.map((o) => {
    const subtotal = Number(o.subtotal);
    const isConfirmed = PAID_ORDER_STATUSES.includes(o.status as PaidStatus);
    const estimatedEarnings = Math.round(subtotal * rate * 100) / 100;
    return {
      ...o,
      subtotal,
      total: Number(o.total),
      isConfirmed,
      estimatedEarnings,
      commissionRate: rate,
    };
  });
}

export async function listAllAffiliateActivity(commissionLimit = 200) {
  const db = getDb();
  const allAffiliates = await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  const commissions = await db
    .select()
    .from(affiliateCommissions)
    .orderBy(desc(affiliateCommissions.createdAt))
    .limit(commissionLimit);

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
