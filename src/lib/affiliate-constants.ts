/** Client-safe affiliate constants (no DB imports) */
export const AFFILIATE_COOKIE_NAME = "reve_aff";
export const AFFILIATE_COOKIE_DAYS = 30;
export const DEFAULT_AFFILIATE_COMMISSION_RATE = 0.15;

/** Exactly 8 alphanumeric characters (handle / ref code) */
export const AFFILIATE_CODE_LENGTH = 8;
export const AFFILIATE_CODE_REGEX = /^[a-z0-9]{8}$/;

export function normalizeAffiliateCode(raw: string): string {
    return raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isValidAffiliateCode(code: string): boolean {
    return AFFILIATE_CODE_REGEX.test(code);
}

/** Pad/truncate a slug to exactly 8 chars for auto-generated codes */
export function toAffiliateCode(raw: string): string {
    let code = normalizeAffiliateCode(raw);
    if (code.length >= AFFILIATE_CODE_LENGTH) {
        return code.slice(0, AFFILIATE_CODE_LENGTH);
    }
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    while (code.length < AFFILIATE_CODE_LENGTH) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return code;
}
