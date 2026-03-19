/**
 * Application Configuration Constants
 */

// Server base URL - Domain for redirects and email links
export const SERVER_BASE_URL = 'https://reveclothingxnobody.com';

// Base URL for redirects and email links
export const BASE_URL = SERVER_BASE_URL;

// Checkout fees (from REVE CLOTHING spreadsheet)
// SHIPPING_FEE: fallback only — actual shipping is J&T weight/zone-based (see Checkout + create-order).
export const SHIPPING_FEE = 130;
export const CONVENIENCE_FEE = 38;

// Test voucher for low-cost payment testing (99% off)
export const TEST_VOUCHER_CODE = 'TEST99';
export const TEST_VOUCHER_DISCOUNT_PERCENT = 99;

// J&T Express Philippines - Shipping
// For tracking: integrate via AfterShip (aftership.com) or TrackingMore
// Set in Supabase Edge Function secrets: JNT_API_KEY, JNT_WEBHOOK_SECRET
export const JNT_CARRIER_SLUG = 'jtexpress-ph';

// J&T Express Philippines VIP merchant portal (COD approved)
export const JNT_VIP_QUICK_ORDER_URL = 'https://vip.jtexpress.ph/order/quickOrder';
export const JNT_VIP_ORDER_WAYBILL_URL = 'https://vip.jtexpress.ph/mange/orderWaybill';
export const JNT_MERCHANT_CODE = 'CDO-V2534';
export const JNT_DROP_POINT = 'Maramag DP';

// Product catalog limit
export const MAX_PRODUCTS = 300;

// Event carousel (Join Us section)
export const MAX_EVENT_CAROUSEL_ITEMS = 9;

// NON-NEGOTIABLE: Photo/media upload limits and optimization
// All photos and media MUST be optimized to smallest size without sacrificing quality.
// Max upload size: 2MB. Reject or compress before upload.
export const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const MAX_UPLOAD_SIZE_MB = 2;

