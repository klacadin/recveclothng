import { and, asc, count, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { eventRegistrations } from "@/db/schema";
import { getEventFlags } from "@/db/settings";
import { assignRunnerNumber } from "@/lib/assign-runner-number";
import { isSouvenirPromoCategory, SOUVENIR_SHIRT_PROMO_LIMIT } from "@/lib/event-management";

export async function assignSouvenirPromo(registrationId: string) {
  const db = getDb();
  await db.execute(
    sql`SELECT * FROM assign_event_souvenir_promo(${registrationId}::uuid, ${SOUVENIR_SHIRT_PROMO_LIMIT}::int)`
  );
  const [row] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  return row ?? null;
}

/**
 * assign_event_souvenir_promo is also what stamps paid_at. Events running without the
 * promo still need that stamp, and must not touch any promo fields.
 */
async function stampPaidAt(registrationId: string) {
  const db = getDb();
  await db
    .update(eventRegistrations)
    .set({ paidAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(eventRegistrations.id, registrationId),
        eq(eventRegistrations.paymentStatus, "paid"),
        isNull(eventRegistrations.paidAt)
      )
    );
  const [row] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  return row ?? null;
}

export async function finalizeEventPayment(registrationId: string) {
  const db = getDb();
  const [current] = await db
    .select({ eventId: eventRegistrations.eventId })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  if (!current) return null;

  // Admins can switch off automatic race bibs and the first-150 shirt promo per event.
  const flags = await getEventFlags(db, current.eventId);
  const numbered = flags.runner_numbers_off ? null : await assignRunnerNumber(registrationId);
  const finalized = flags.souvenir_promo_off
    ? await stampPaidAt(registrationId)
    : await assignSouvenirPromo(registrationId);
  return finalized ?? numbered;
}

export async function revokeSouvenirShirt(registrationId: string) {
  const db = getDb();
  const [current] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);
  if (!current) return null;

  const hadShirt = Boolean(current.freeSouvenirShirt);
  const [updated] = await db
    .update(eventRegistrations)
    .set({ freeSouvenirShirt: false, updatedAt: new Date() })
    .where(eq(eventRegistrations.id, registrationId))
    .returning();

  if (hadShirt) {
    await offerSouvenirShirtToNext(current.eventId);
  }

  return updated ?? current;
}

async function offerSouvenirShirtToNext(eventId: string) {
  const db = getDb();
  const [agg] = await db
    .select({ n: count() })
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.paymentStatus, "paid"),
        eq(eventRegistrations.freeSouvenirShirt, true)
      )
    );
  if ((agg?.n ?? 0) >= SOUVENIR_SHIRT_PROMO_LIMIT) return;

  const candidates = await db
    .select()
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.paymentStatus, "paid"),
        eq(eventRegistrations.freeSouvenirShirt, false),
        isNotNull(eventRegistrations.promoRank)
      )
    )
    .orderBy(asc(eventRegistrations.promoRank))
    .limit(25);

  const next = candidates.find((row) => isSouvenirPromoCategory(row.ticketSlug, row.ticketName));
  if (!next) return;

  await db
    .update(eventRegistrations)
    .set({ freeSouvenirShirt: true, updatedAt: new Date() })
    .where(
      and(
        eq(eventRegistrations.id, next.id),
        eq(eventRegistrations.paymentStatus, "paid"),
        eq(eventRegistrations.freeSouvenirShirt, false)
      )
    );
}
