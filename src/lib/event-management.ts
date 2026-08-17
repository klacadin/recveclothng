export const EVENT_PAYMENT_REF_PREFIX = "evt_";
export const CHECK_IN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export interface CalculateRegistrationTotalsInput {
  basePrice: number;
  eventPromoCode?: string | null;
  providedPromoCode?: string | null;
  discountPercent?: number;
}

export interface RegistrationTotals {
  basePrice: number;
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
}: CalculateRegistrationTotalsInput): RegistrationTotals {
  const numericBase = Number(basePrice) || 0;
  const normalizedPromo = (eventPromoCode || '').trim().toUpperCase();
  const normalizedProvided = (providedPromoCode || '').trim().toUpperCase();
  const promoDiscountPercent = Number.isFinite(Number(discountPercent)) ? Math.max(0, Math.min(Number(discountPercent), 100)) : 0;
  const isPromoValid = Boolean(normalizedPromo) && normalizedPromo === normalizedProvided && promoDiscountPercent > 0;
  const discountPercentValue = isPromoValid ? promoDiscountPercent : 0;
  const discountAmount = Number(Math.max(0, Math.min(numericBase, numericBase * (discountPercentValue / 100))).toFixed(2));
  const finalAmount = Number(Math.max(0, numericBase - discountAmount).toFixed(2));

  return {
    basePrice: numericBase,
    discountPercent: discountPercentValue,
    discountAmount,
    finalAmount,
    isPromoValid,
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
