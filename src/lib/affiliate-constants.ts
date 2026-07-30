/** Client-safe affiliate constants (no DB imports) */
export const AFFILIATE_COOKIE_NAME = "reve_aff";
export const AFFILIATE_COOKIE_DAYS = 30;
/** Fallback when store_settings has no value yet (10%). */
export const DEFAULT_AFFILIATE_COMMISSION_RATE = 0.1;

export const AFFILIATE_DEFAULT_RATE_SETTING_KEY = "affiliate_default_commission_rate";

/** Exactly 8 alphanumeric characters (handle / ref code) */
export const AFFILIATE_CODE_LENGTH = 8;
export const AFFILIATE_CODE_REGEX = /^[a-z0-9]{8}$/;

export function normalizeAffiliateCode(raw: string): string {
    return raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isValidAffiliateCode(code: string): boolean {
    return AFFILIATE_CODE_REGEX.test(code);
}

/** Public share path: /affiliate/{code} */
export function affiliateSharePath(code: string): string {
    return `/affiliate/${normalizeAffiliateCode(code)}`;
}

/** Absolute share URL when origin is known */
export function affiliateShareUrl(code: string, origin?: string): string {
    const path = affiliateSharePath(code);
    if (origin) return `${origin.replace(/\/$/, "")}${path}`;
    if (typeof window !== "undefined") return `${window.location.origin}${path}`;
    return path;
}

/** Reserved /affiliate/* paths (not referral codes) */
export const AFFILIATE_JOIN_PATH = "/affiliate/join";
export const AFFILIATE_LOGIN_PATH = "/affiliate/login";
export const AFFILIATE_DASHBOARD_PATH = "/affiliate/dashboard";
export const AFFILIATE_GUIDE_PATH = "/affiliate/guide";
/** Public static assets */
export const AFFILIATE_HOWTO_PDF_PATH = "/REVE-Affiliate-How-To-Use.pdf";
export const AFFILIATE_POSTER_SQUARE_PATH = "/marketing/reve-affiliate-invite-square.png";
export const AFFILIATE_POSTER_STORY_PATH = "/marketing/reve-affiliate-invite-story.png";

export const AFFILIATE_RESERVED_SEGMENTS = new Set([
    "join",
    "login",
    "dashboard",
    "guide",
]);


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
