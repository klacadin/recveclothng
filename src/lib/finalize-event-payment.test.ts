import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultEventFlags, type EventFlags } from '@/lib/event-management';
import { finalizeEventPayment } from './finalize-event-payment';

const mocks = vi.hoisted(() => {
  /** Stand-in for a drizzle query builder: every chained call resolves to `result`. */
  const chain = (result: unknown) => {
    const builder: Record<string, unknown> = {};
    for (const method of ['from', 'where', 'limit', 'set', 'returning', 'orderBy']) {
      builder[method] = () => builder;
    }
    builder.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject);
    return builder;
  };
  return {
    chain,
    flags: null as EventFlags | null,
    registration: { id: 'reg-1', eventId: 'evt-1', paymentStatus: 'paid' },
    assignRunnerNumber: vi.fn(async () => null),
    execute: vi.fn(async () => ({})),
    update: vi.fn(),
  };
});

vi.mock('@/db/client', () => ({
  getDb: () => ({
    select: () => mocks.chain([mocks.registration]),
    update: (...args: unknown[]) => {
      mocks.update(...args);
      return mocks.chain([]);
    },
    execute: mocks.execute,
  }),
}));

vi.mock('@/db/settings', () => ({
  getEventFlags: async () => mocks.flags,
}));

vi.mock('@/lib/assign-runner-number', () => ({
  assignRunnerNumber: mocks.assignRunnerNumber,
}));

describe('finalizeEventPayment per-event switches', () => {
  beforeEach(() => {
    mocks.assignRunnerNumber.mockClear();
    mocks.execute.mockClear();
    mocks.update.mockClear();
  });

  it('assigns a race bib and runs the souvenir shirt promo by default', async () => {
    mocks.flags = defaultEventFlags();

    await finalizeEventPayment('reg-1');

    expect(mocks.assignRunnerNumber).toHaveBeenCalledWith('reg-1');
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('skips the race bib and the promo when both are switched off, but still stamps paid_at', async () => {
    mocks.flags = { ...defaultEventFlags(), runner_numbers_off: true, souvenir_promo_off: true };

    const result = await finalizeEventPayment('reg-1');

    expect(mocks.assignRunnerNumber).not.toHaveBeenCalled();
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mocks.registration);
  });

  it('can switch off only the race bib', async () => {
    mocks.flags = { ...defaultEventFlags(), runner_numbers_off: true };

    await finalizeEventPayment('reg-1');

    expect(mocks.assignRunnerNumber).not.toHaveBeenCalled();
    expect(mocks.execute).toHaveBeenCalledTimes(1);
  });
});
