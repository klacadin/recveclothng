import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import type { Event } from '@/types/app-database';
import Events from './Events';

const mockEvents = vi.hoisted(() => ({ data: [] as Event[] }));

// jsdom has no ResizeObserver; the Radix form controls need one to mount.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

vi.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({ data: mockEvents.data, isLoading: false }),
  useCreateRegistration: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

const liveEvent: Event = {
  id: 'evt-1',
  slug: 'year-end-trail-run',
  title: 'Year End Trail Run',
  description: null,
  location: 'Bukidnon',
  starts_at: '2026-12-04T16:00:00.000Z',
  ends_at: null,
  price: 1400,
  promo_code: null,
  promo_discount_percent: 0,
  max_attendees: 0,
  payment_instructions: null,
  image_url: null,
  ticket_tiers: [],
  is_active: true,
  registration_open: true,
  created_at: '2026-11-01T00:00:00.000Z',
  updated_at: '2026-11-01T00:00:00.000Z',
};

describe('Events page registration', () => {
  it('shows the sign-up form while registration is open', () => {
    mockEvents.data = [liveEvent];
    render(<Events />);

    expect(screen.getByText('Registration open')).toBeTruthy();
    expect(screen.getByLabelText('Full name')).toBeTruthy();
  });

  it('keeps the event visible but replaces the form once registration is closed', () => {
    mockEvents.data = [{ ...liveEvent, registration_open: false }];
    render(<Events />);

    expect(screen.getByRole('heading', { name: 'Year End Trail Run' })).toBeTruthy();
    expect(screen.getAllByText('Registration closed')).toHaveLength(2);
    expect(screen.getByText('Online registration for this event is closed.')).toBeTruthy();
    expect(screen.queryByLabelText('Full name')).toBeNull();
    expect(screen.queryByRole('button', { name: /register and pay|submit registration/i })).toBeNull();
  });
});
