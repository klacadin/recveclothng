import { describe, expect, it } from 'vitest';
import { EVENT_CONVENIENCE_FEE } from '@/config/constants';
import {
  calculateRegistrationTotals,
  eventPaymentReference,
  formatEventPriceLabel,
  generateCheckInCode,
  parseEventPaymentReference,
  parseEventAge,
  parseEventGender,
  parseEventShirtSize,
  formatCropTopRecord,
  formatRunnerApparel,
  formatRunnerNumber,
  runnerBibPrefix,
  parseTicketTiers,
  canCheckInWithPaymentStatus,
  resolveEventTicket,
  ticketApparel,
  isSouvenirPromoCategory,
  souvenirPromoDecision,
  souvenirPromoSummary,
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
    expect(totals.convenienceFee).toBe(EVENT_CONVENIENCE_FEE);
    expect(totals.registrationFee).toBe(1200);
    expect(totals.finalAmount).toBe(1200 + EVENT_CONVENIENCE_FEE);
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
    expect(totals.convenienceFee).toBe(EVENT_CONVENIENCE_FEE);
    expect(totals.finalAmount).toBe(1500 + EVENT_CONVENIENCE_FEE);
  });

  it('never computes a negative final fee', () => {
    const totals = calculateRegistrationTotals({
      basePrice: 500,
      eventPromoCode: 'EARLYBIRD',
      providedPromoCode: 'EARLYBIRD',
      discountPercent: 100,
    });

    expect(totals.registrationFee).toBe(0);
    expect(totals.convenienceFee).toBe(0);
    expect(totals.finalAmount).toBe(0);
  });

  it('always adds the configured convenience fee to every registration', () => {
    const totals = calculateRegistrationTotals({ basePrice: 1000 });
    expect(totals.convenienceFee).toBe(EVENT_CONVENIENCE_FEE);
    expect(totals.finalAmount).toBe(1000 + EVENT_CONVENIENCE_FEE);
  });

  it('applies TESTEVENT as 100% off including the convenience fee', () => {
    const totals = calculateRegistrationTotals({
      basePrice: 2000,
      providedPromoCode: 'testevent',
    });
    expect(totals.isPromoValid).toBe(true);
    expect(totals.discountPercent).toBe(100);
    expect(totals.convenienceFee).toBe(0);
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

describe('event ticket tiers', () => {
  it('resolves a trail-run distance and starting price', () => {
    const tiers = parseTicketTiers([
      { name: '5km', price: 1000 },
      { name: '10km', price: 2000 },
      { name: '35km', price: 3000 },
    ]);

    expect(tiers.map((tier) => tier.slug)).toEqual(['5km', '10km', '35km']);
    expect(resolveEventTicket(tiers, '10km')?.price).toBe(2000);
    expect(formatEventPriceLabel(1000, tiers)).toBe('From ₱1,000');
  });

  it('keeps a category poster on each distance', () => {
    const tiers = parseTicketTiers([
      { name: '5km', price: 1000, image_url: 'https://cdn.example/5km.webp' },
      { name: '10km', price: 2000, image_url: '  ' },
    ]);
    expect(tiers[0].image_url).toBe('https://cdn.example/5km.webp');
    expect(tiers[1].image_url).toBeNull();
  });

  it('keeps apparel flags and bib prefixes per category', () => {
    const tiers = parseTicketTiers([
      { name: '7km', price: 1000, has_singlet: false, bib_prefix: '07' },
      { name: '12km', price: 2000, has_singlet: true, bib_prefix: '12' },
    ]);
    expect(tiers[0]).toMatchObject({ has_singlet: false, has_finisher_shirt: true, has_crop_top: true, bib_prefix: '07' });
    expect(tiers[1].has_singlet).toBe(true);
    expect(ticketApparel(tiers[0]).has_singlet).toBe(false);
  });
});

describe('runner profile fields', () => {
  it('accepts shirt size, gender, and age', () => {
    expect(parseEventShirtSize('m')).toBe('M');
    expect(parseEventShirtSize('2xl')).toBe('2XL');
    expect(parseEventShirtSize('s16')).toBe('16');
    expect(parseEventShirtSize('7xl')).toBe('7XL');
    expect(parseEventGender('female')).toBe('Female');
    expect(parseEventAge('34')).toBe(34);
    expect(parseEventAge(4)).toBeNull();
    expect(parseEventShirtSize('XXL')).toBeNull();
  });

  it('records cropped top as a style option on the existing shirt', () => {
    expect(formatCropTopRecord('S')).toBe('Cropped top (S)');
    expect(formatCropTopRecord('YES')).toBe('Cropped top');
    expect(formatRunnerApparel({
      singlet_size: 'M',
      finisher_shirt_size: 'L',
      crop_top_size: 'L',
    })).toEqual(['Singlet M', 'Finisher L', 'Cropped top (L)']);
  });

  it('only allows check-in after payment', () => {
    expect(canCheckInWithPaymentStatus('paid')).toBe(true);
    expect(canCheckInWithPaymentStatus('pending')).toBe(false);
    expect(canCheckInWithPaymentStatus('cancelled')).toBe(false);
  });

  it('formats racebib numbers per distance', () => {
    expect(runnerBibPrefix('25km', '25km')).toBe('25');
    expect(runnerBibPrefix('7km', '7km')).toBe('07');
    expect(formatRunnerNumber(1, { slug: '12km', name: '12km' })).toBe('12-001');
    expect(formatRunnerNumber(1, { slug: '7km', name: '7km' })).toBe('07-001');
    expect(formatRunnerNumber(1, { slug: '25km', name: '25km' })).toBe('25-001');
    expect(formatRunnerNumber(null)).toBeNull();
  });
});

describe('souvenir shirt promo', () => {
  it('only counts 12km and 25km categories', () => {
    expect(isSouvenirPromoCategory('12km', '12km')).toBe(true);
    expect(isSouvenirPromoCategory('25km', '25KM')).toBe(true);
    expect(isSouvenirPromoCategory('7km', '7km')).toBe(false);
  });

  it('gives a free shirt through rank 150 and not 151', () => {
    expect(souvenirPromoDecision(1).free_souvenir_shirt).toBe(true);
    expect(souvenirPromoDecision(149).free_souvenir_shirt).toBe(true);
    expect(souvenirPromoDecision(150).free_souvenir_shirt).toBe(true);
    expect(souvenirPromoDecision(151).free_souvenir_shirt).toBe(false);
  });

  it('labels non-promo categories as not applicable', () => {
    expect(souvenirPromoSummary({ ticket_slug: '7km', ticket_name: '7km' }).shirtLabel).toBe('Not applicable');
    expect(souvenirPromoSummary({ ticket_slug: '12km', promo_rank: 42, free_souvenir_shirt: true })).toMatchObject({
      rankLabel: '#42',
      shirtLabel: 'YES',
    });
    expect(souvenirPromoSummary({
      ticket_slug: '12km',
      promo_rank: 42,
      free_souvenir_shirt: true,
      payment_status: 'cancelled',
    })).toMatchObject({
      rankLabel: '#42',
      shirtLabel: 'NO',
      shirt: false,
    });
  });
});
