/**
 * J&T-style shipping from Mindanao origin (₱ PHP).
 * Brackets match merchant table: 0–500g, 501g–1kg, 1.01kg–3kg … 9.01kg–10kg;
 * above 10kg, add ₱70 per started kg (same increment as table).
 *
 * Keep in sync with `supabase/functions/create-order/index.ts` → `jtMindanaoOriginRatePhp`.
 */
export type JtDestinationZone = 'mindanao' | 'visayas' | 'luzon' | 'metro_manila' | 'island';

const BRACKETS: { maxKg: number; rates: Record<JtDestinationZone, number> }[] = [
  { maxKg: 0.5, rates: { metro_manila: 105, luzon: 105, visayas: 105, mindanao: 85, island: 115 } },
  { maxKg: 1, rates: { metro_manila: 195, luzon: 195, visayas: 175, mindanao: 155, island: 185 } },
  { maxKg: 3, rates: { metro_manila: 215, luzon: 215, visayas: 195, mindanao: 180, island: 205 } },
  { maxKg: 4, rates: { metro_manila: 325, luzon: 325, visayas: 285, mindanao: 270, island: 295 } },
  { maxKg: 5, rates: { metro_manila: 370, luzon: 370, visayas: 370, mindanao: 360, island: 380 } },
  { maxKg: 6, rates: { metro_manila: 435, luzon: 435, visayas: 435, mindanao: 435, island: 445 } },
  { maxKg: 7, rates: { metro_manila: 505, luzon: 505, visayas: 505, mindanao: 505, island: 515 } },
  { maxKg: 8, rates: { metro_manila: 575, luzon: 575, visayas: 575, mindanao: 575, island: 585 } },
  { maxKg: 9, rates: { metro_manila: 645, luzon: 645, visayas: 645, mindanao: 645, island: 655 } },
  { maxKg: 10, rates: { metro_manila: 715, luzon: 715, visayas: 715, mindanao: 715, island: 725 } },
];

const INCREMENT_PER_KG_ABOVE_10 = 70;

export function computeJtMindanaoOriginShippingPhp(
  totalWeightGrams: number,
  zone: JtDestinationZone
): number {
  const wKg = Math.max(0, totalWeightGrams) / 1000;
  for (const b of BRACKETS) {
    if (wKg <= b.maxKg) {
      return b.rates[zone];
    }
  }
  const last = BRACKETS[BRACKETS.length - 1];
  const base = last.rates[zone];
  const extraBands = Math.ceil(wKg - 10);
  return base + INCREMENT_PER_KG_ABOVE_10 * extraBands;
}
