import { EVENT_CONVENIENCE_FEE, EVENT_TEST_PROMO_CODE, EVENT_TEST_PROMO_DISCOUNT_PERCENT } from "@/config/constants";

export const EVENT_PAYMENT_REF_PREFIX = "evt_";
export const CHECK_IN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const SOUVENIR_SHIRT_PROMO_LIMIT = 150;
export const SOUVENIR_SHIRT_PROMO_CATEGORIES = ["12km", "25km"] as const;
export const SOUVENIR_SHIRT_PROMO_NOTE =
  "Free souvenir shirt for the first 150 qualified 12KM and 25KM registrants.";

export interface CalculateRegistrationTotalsInput {
  basePrice: number;
  eventPromoCode?: string | null;
  providedPromoCode?: string | null;
  discountPercent?: number;
  convenienceFee?: number;
}

export interface RegistrationTotals {
  basePrice: number;
  registrationFee: number;
  convenienceFee: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  isPromoValid: boolean;
}

export function calculateRegistrationTotals({
  basePrice,
  eventPromoCode,
  providedPromoCode,
  discountPercent = 0,
  convenienceFee = EVENT_CONVENIENCE_FEE,
}: CalculateRegistrationTotalsInput): RegistrationTotals {
  const numericBase = Number(basePrice) || 0;
  const normalizedPromo = (eventPromoCode || '').trim().toUpperCase();
  const normalizedProvided = (providedPromoCode || '').trim().toUpperCase();
  const promoDiscountPercent = Number.isFinite(Number(discountPercent)) ? Math.max(0, Math.min(Number(discountPercent), 100)) : 0;
  const isTestPromo = normalizedProvided === EVENT_TEST_PROMO_CODE.toUpperCase();
  const isPromoValid =
    isTestPromo ||
    (Boolean(normalizedPromo) && normalizedPromo === normalizedProvided && promoDiscountPercent > 0);
  const discountPercentValue = isTestPromo
    ? EVENT_TEST_PROMO_DISCOUNT_PERCENT
    : isPromoValid
      ? promoDiscountPercent
      : 0;
  const discountAmount = Number(Math.max(0, Math.min(numericBase, numericBase * (discountPercentValue / 100))).toFixed(2));
  const registrationFee = Number(Math.max(0, numericBase - discountAmount).toFixed(2));
  const fee = discountPercentValue >= 100 ? 0 : Number(Math.max(0, convenienceFee).toFixed(2));
  const finalAmount = Number((registrationFee + fee).toFixed(2));

  return {
    basePrice: numericBase,
    registrationFee,
    convenienceFee: fee,
    discountPercent: discountPercentValue,
    discountAmount,
    finalAmount,
    isPromoValid,
  };
}

function normalizeCategoryKey(value?: string | null) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

export function isSouvenirPromoCategory(ticketSlug?: string | null, ticketName?: string | null) {
  const keys = [normalizeCategoryKey(ticketSlug), normalizeCategoryKey(ticketName)];
  return SOUVENIR_SHIRT_PROMO_CATEGORIES.some((category) => keys.includes(category));
}

export function souvenirPromoDecision(rank: number, limit = SOUVENIR_SHIRT_PROMO_LIMIT) {
  const promoRank = Number.isInteger(rank) && rank > 0 ? rank : null;
  return {
    promo_rank: promoRank,
    free_souvenir_shirt: promoRank != null && promoRank <= limit,
  };
}

export function souvenirPromoSummary(input: {
  ticket_slug?: string | null;
  ticket_name?: string | null;
  payment_status?: string | null;
  promo_rank?: number | null;
  free_souvenir_shirt?: boolean | null;
}) {
  if (!isSouvenirPromoCategory(input.ticket_slug, input.ticket_name)) {
    return {
      applicable: false,
      rankLabel: "—",
      shirtLabel: "Not applicable",
      shirt: false,
    };
  }
  const rank = input.promo_rank != null && input.promo_rank > 0 ? input.promo_rank : null;
  const isPaid = !input.payment_status || input.payment_status === "paid";
  const shirt = Boolean(input.free_souvenir_shirt) && isPaid;
  return {
    applicable: true,
    rankLabel: rank ? `#${rank}` : "—",
    shirtLabel: shirt ? "YES" : "NO",
    shirt,
  };
}

export function slugifyEvent(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateCheckInCode(length = 6, randomValues?: Uint8Array) {
  const bytes = randomValues && randomValues.length >= length
    ? randomValues
    : typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(length))
      : Uint8Array.from({ length }, (_, i) => (i * 17 + 13) % 256);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHECK_IN_CODE_ALPHABET[bytes[i] % CHECK_IN_CODE_ALPHABET.length];
  }
  return code;
}

export function eventPaymentReference(registrationId: string) {
  return `${EVENT_PAYMENT_REF_PREFIX}${registrationId}`;
}

export function parseEventPaymentReference(ref?: string | null) {
  if (!ref?.startsWith(EVENT_PAYMENT_REF_PREFIX)) return null;
  const id = ref.slice(EVENT_PAYMENT_REF_PREFIX.length).trim();
  return id || null;
}

export function toDatetimeLocalValue(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export interface EventTicketTier {
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
  bib_prefix?: string | null;
  has_singlet?: boolean;
  has_finisher_shirt?: boolean;
  has_crop_top?: boolean;
}

export const MAX_EVENT_CATEGORIES = 8;
export const DEFAULT_SHIRT_SIZES_TEXT = "16, 18, S, M, L, XL, 2XL, 3XL, 4XL, 5XL, 6XL, 7XL";
export const DEFAULT_GENDER_OPTIONS_TEXT = "Male, Female";
export const EVENT_SLUG_ALIASES: Record<string, string> = {
  "test-trail-run": "year-end-pasasalamat-trail-run",
};

export function resolvePublicEventSlug(slug?: string | null) {
  const normalized = String(slug || "").trim();
  if (!normalized) return "";
  return EVENT_SLUG_ALIASES[normalized] || normalized;
}

function parseFlexibleBool(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return fallback;
}

export function parseCommaList(value: unknown, fallback: readonly string[]) {
  const items = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : [...fallback];
}

export const RUNNER_NUMBER_DIGITS = 3;

export function runnerBibPrefix(
  ticketSlug?: string | null,
  ticketName?: string | null,
  explicit?: string | null
) {
  const raw = String(explicit || "").trim();
  if (raw) {
    const digits = raw.replace(/\D/g, "");
    if (digits) return digits.padStart(2, "0").slice(-2);
    return raw.toUpperCase().slice(0, 4);
  }
  const source = `${ticketName || ""} ${ticketSlug || ""}`;
  const km = source.match(/(\d+)\s*km/i)?.[1] ?? source.match(/(\d+)/)?.[1];
  if (!km) return "00";
  return km.padStart(2, "0");
}

export function parseTicketTiers(value: unknown): EventTicketTier[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const name = String((item as { name?: string })?.name || "").trim();
    if (!name) return [];
    const slug = slugifyEvent(String((item as { slug?: string })?.slug || name)) || slugifyEvent(name);
    const imageUrl = String((item as { image_url?: string })?.image_url || "").trim();
    const bibPrefix = runnerBibPrefix(slug, name, (item as { bib_prefix?: string })?.bib_prefix);
    return [{
      slug,
      name,
      price: Number((item as { price?: number })?.price || 0),
      image_url: imageUrl || null,
      bib_prefix: bibPrefix,
      has_singlet: parseFlexibleBool((item as { has_singlet?: unknown }).has_singlet, true),
      has_finisher_shirt: parseFlexibleBool((item as { has_finisher_shirt?: unknown }).has_finisher_shirt, true),
      has_crop_top: parseFlexibleBool((item as { has_crop_top?: unknown }).has_crop_top, true),
    }];
  });
}

export function ticketApparel(tier?: EventTicketTier | null) {
  return {
    has_singlet: tier?.has_singlet !== false,
    has_finisher_shirt: tier?.has_finisher_shirt !== false,
    has_crop_top: tier?.has_crop_top !== false,
  };
}

export function resolveEventTicket(tiers: EventTicketTier[], slug?: string | null) {
  if (!tiers.length || !slug) return null;
  const normalized = slugifyEvent(slug);
  return tiers.find((tier) => tier.slug === normalized) ?? null;
}

export function eventStartingPrice(price: number, tiers?: EventTicketTier[] | null) {
  if (tiers?.length) return Math.min(...tiers.map((tier) => Number(tier.price) || 0));
  return Number(price) || 0;
}

export function formatEventPriceLabel(price: number, tiers?: EventTicketTier[] | null) {
  if (tiers?.length) {
    const amounts = tiers.map((tier) => Number(tier.price) || 0);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    if (min <= 0 && max <= 0) return "Free";
    if (min === max) return `₱${min.toLocaleString("en-PH")}`;
    return `From ₱${min.toLocaleString("en-PH")}`;
  }
  return Number(price) > 0 ? `₱${Number(price).toLocaleString("en-PH")}` : "Free";
}

export const EVENT_SHIRT_SIZES = ["16", "18", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL"] as const;
export const EVENT_GENDERS = ["Male", "Female"] as const;
export const EVENT_AGE_MIN = 5;
export const EVENT_AGE_MAX = 99;

export type EventShirtSize = (typeof EVENT_SHIRT_SIZES)[number];
export type EventGender = (typeof EVENT_GENDERS)[number];

export function parseEventShirtSize(value: unknown, allowed: readonly string[] = EVENT_SHIRT_SIZES): string | null {
  const normalized = String(value || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!normalized) return null;
  const mapped = normalized === "S16" ? "16" : normalized === "S18" ? "18" : normalized;
  return allowed.find((size) => size.toUpperCase().replace(/\s+/g, "") === mapped) ?? null;
}

export function formatCropTopRecord(size?: string | null) {
  const normalized = String(size || "").trim();
  if (!normalized || normalized.toUpperCase() === "YES") return "Cropped top";
  return `Cropped top (${normalized})`;
}

export function formatRunnerApparel(input: {
  singlet_size?: string | null;
  finisher_shirt_size?: string | null;
  crop_top_size?: string | null;
  shirt_size?: string | null;
}) {
  const parts: string[] = [];
  if (input.singlet_size) parts.push(`Singlet ${input.singlet_size}`);
  if (input.finisher_shirt_size) parts.push(`Finisher ${input.finisher_shirt_size}`);
  if (input.crop_top_size) parts.push(formatCropTopRecord(input.crop_top_size));
  if (!parts.length && input.shirt_size) parts.push(`Shirt ${input.shirt_size}`);
  return parts;
}

export function parseEventGender(value: unknown, allowed: readonly string[] = EVENT_GENDERS): string | null {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  if (allowed.some((item) => item.toLowerCase() === "male") && (normalized === "male" || normalized === "m")) {
    return allowed.find((item) => item.toLowerCase() === "male") ?? "Male";
  }
  if (allowed.some((item) => item.toLowerCase() === "female") && (normalized === "female" || normalized === "f")) {
    return allowed.find((item) => item.toLowerCase() === "female") ?? "Female";
  }
  return allowed.find((item) => item.toLowerCase() === normalized) ?? null;
}

export function parseEventAge(value: unknown): number | null {
  const age = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isInteger(age) || age < EVENT_AGE_MIN || age > EVENT_AGE_MAX) return null;
  return age;
}

export function canCheckInWithPaymentStatus(status: string) {
  return status === "paid";
}

export function formatRunnerNumber(
  value: number | string | null | undefined,
  ticket?: { slug?: string | null; name?: string | null; prefix?: string | null; bib_prefix?: string | null } | string | null
) {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 1) return null;
  const ticketSlug = typeof ticket === "string" ? ticket : ticket?.slug;
  const ticketName = typeof ticket === "string" ? ticket : ticket?.name;
  const explicit = typeof ticket === "string" ? null : ticket?.prefix ?? ticket?.bib_prefix;
  return `${runnerBibPrefix(ticketSlug, ticketName, explicit)}-${String(n).padStart(RUNNER_NUMBER_DIGITS, "0")}`;
}
