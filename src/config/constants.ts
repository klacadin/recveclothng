/**
 * Application Configuration Constants
 */

// Server base URL - Domain for redirects and email links
export const SERVER_BASE_URL = 'https://reveclothingxnobody.com';

// Base URL for redirects and email links
export const BASE_URL = SERVER_BASE_URL;

// Checkout fees (from REVE CLOTHING spreadsheet)
export const SHIPPING_FEE = 130;
export const CONVENIENCE_FEE = 38;

// Test voucher for low-cost payment testing (99% off)
export const TEST_VOUCHER_CODE = 'TEST99';
export const TEST_VOUCHER_DISCOUNT_PERCENT = 99;

// J&T Express Philippines - Shipping
// For tracking: integrate via AfterShip (aftership.com) or TrackingMore
// Set in Supabase Edge Function secrets: JNT_API_KEY, JNT_WEBHOOK_SECRET
export const JNT_CARRIER_SLUG = 'jtexpress-ph';

