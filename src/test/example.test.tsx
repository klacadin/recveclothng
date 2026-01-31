import { describe, it, expect } from 'vitest';
import { render, screen } from './utils';
import Index from '@/pages/Index';

describe('Index Page', () => {
  it('renders without crashing', () => {
    render(<Index />);
    expect(document.body).toBeTruthy();
  });

  it('has main content area', () => {
    render(<Index />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });
});

describe('Utility Functions', () => {
  it('should format currency correctly', () => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount);
    };

    expect(formatCurrency(1000)).toBe('₱1,000.00');
    expect(formatCurrency(0)).toBe('₱0.00');
  });
});

