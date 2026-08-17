import { and, eq, isNull, max, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations } from "@/db/schema";

export async function assignRunnerNumber(registrationId: string) {
  const db = getDb();

  for (let attempt = 0; attempt < 8; attempt++) {
    const [current] = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.id, registrationId))
      .limit(1);
    if (!current) return null;
    if (current.runnerNumber != null) return current;
    if (current.paymentStatus !== "paid") return current;

    const ticketMatch = current.ticketSlug
      ? eq(eventRegistrations.ticketSlug, current.ticketSlug)
      : isNull(eventRegistrations.ticketSlug);

    const [agg] = await db
      .select({ highest: max(eventRegistrations.runnerNumber) })
      .from(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, current.eventId), ticketMatch));
    const next = (agg?.highest ?? 0) + 1;

    try {
      const [updated] = await db
        .update(eventRegistrations)
        .set({ runnerNumber: next, updatedAt: new Date() })
        .where(and(eq(eventRegistrations.id, registrationId), isNull(eventRegistrations.runnerNumber)))
        .returning();
      if (updated) return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!/unique|duplicate/i.test(message)) throw error;
    }
  }

  const [fallback] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  return fallback ?? null;
}

export const runnerBibSearchSql = (like: string) => sql`
  (
    lpad(
      substring(coalesce(${eventRegistrations.ticketName}, ${eventRegistrations.ticketSlug}, '') from '\\d+'),
      2,
      '0'
    )
    || '-' || lpad(${eventRegistrations.runnerNumber}::text, 3, '0')
  ) ilike ${like}
`;

