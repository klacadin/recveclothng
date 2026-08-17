import { describe, expect, it } from 'vitest';
import {
  calculateRegistrationTotals,
  eventPaymentReference,
  generateCheckInCode,
  parseEventPaymentReference,
} from './event-management';

describe('event pricing logic', () => {
  it('applies a valid promo code to the registration fee', () => {
    const totals = calculateRegistrationTotals({
      basePrice: 1500,
      eventPromoCode: 'EARLYBIRD',
      providedPromoCode: 'EARLYBIRD',
      discountPercent: 20,
    });

    expect(totals.isPromoValid).toBe(true);
    expect(totals.discountPercent).toBe(20);
    expect(totals.discountAmount).toBe(300);
    expect(totals.finalAmount).toBe(1200);
  });

  it('ignores an invalid promo code instead of discounting', () => {
    const totals = calculateRegistrationTotals({
      basePrice: 1500,
      eventPromoCode: 'EARLYBIRD',
      providedPromoCode: 'VIP10',
      discountPercent: 20,
    });

    expect(totals.isPromoValid).toBe(false);
    expect(totals.discountAmount).toBe(0);
    expect(totals.finalAmount).toBe(1500);
  });

  it('never computes a negative final fee', () => {
    const totals = calculateRegistrationTotals({
      basePrice: 500,
      eventPromoCode: 'EARLYBIRD',
      providedPromoCode: 'EARLYBIRD',
      discountPercent: 100,
    });

    expect(totals.finalAmount).toBe(0);
  });
});

describe('event check-in and payment references', () => {
  it('builds a 6-character check-in code from the alphabet', () => {
    const code = generateCheckInCode(6, Uint8Array.from([1, 2, 3, 4, 5, 6]));
    expect(code).toHaveLength(6);
    expect(code).toMatch(/^[A-HJ-NP-Z2-9]+$/);
  });

  it('round-trips HitPay event payment references', () => {
    const ref = eventPaymentReference('abc-123');
    expect(ref).toBe('evt_abc-123');
    expect(parseEventPaymentReference(ref)).toBe('abc-123');
    expect(parseEventPaymentReference('order-uuid')).toBeNull();
  });
});
