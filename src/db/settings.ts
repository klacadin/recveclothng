import { eq, sql } from "drizzle-orm";
import {
  AFFILIATE_DEFAULT_RATE_SETTING_KEY,
  DEFAULT_AFFILIATE_COMMISSION_RATE,
} from "@/lib/affiliate-constants";
import { affiliates, storeSettings } from "./schema";
import type { Db } from "./client";

let ensuredStoreSettings = false;

/** Create store_settings if missing (safe for Neon without a separate migrate step). */
export async function ensureStoreSettingsTable(db: Db) {
  if (ensuredStoreSettings) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS store_settings (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  ensuredStoreSettings = true;
}

export async function getStoreSetting(db: Db, key: string): Promise<string | null> {
  await ensureStoreSettingsTable(db);
  const [row] = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  return row?.value ?? null;
}

export async function setStoreSetting(db: Db, key: string, value: string) {
  await ensureStoreSettingsTable(db);
  await db
    .insert(storeSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: storeSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

/** Default commission rate as a fraction (0.10 = 10%). */
export async function getDefaultAffiliateCommissionRate(db: Db): Promise<number> {
  const raw = await getStoreSetting(db, AFFILIATE_DEFAULT_RATE_SETTING_KEY);
  if (raw == null) return DEFAULT_AFFILIATE_COMMISSION_RATE;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 1) return DEFAULT_AFFILIATE_COMMISSION_RATE;
  return n;
}

export async function setDefaultAffiliateCommissionRate(
  db: Db,
  rate: number,
  options?: { applyToAll?: boolean }
) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
    throw new Error("commission_rate must be between 0 and 1");
  }
  const value = rate.toFixed(4);
  await setStoreSetting(db, AFFILIATE_DEFAULT_RATE_SETTING_KEY, value);

  let updatedCount = 0;
  if (options?.applyToAll) {
    const updated = await db
      .update(affiliates)
      .set({ commissionRate: value, updatedAt: new Date() })
      .returning({ id: affiliates.id });
    updatedCount = updated.length;
  }

  return { rate: Number(value), updatedCount };
}
