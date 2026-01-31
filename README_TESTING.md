# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

## Setup

Tests are already configured. The test setup includes:
- Vitest with React Testing Library
- jsdom environment for DOM testing
- Custom render utilities with all providers

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { useCart } from '@/contexts/CartContext';

describe('useCart', () => {
  it('adds items to cart', () => {
    const { result } = renderHook(() => useCart());
    // Test hook behavior
  });
});
```

## Test Structure

- `src/test/setup.ts` - Global test setup
- `src/test/utils.tsx` - Custom render utilities
- `src/**/*.test.tsx` - Test files (co-located with components)

## Coverage Goals

- Aim for 70%+ coverage on critical paths
- Focus on:
  - Business logic
  - User interactions
  - Error handling
  - API integrations

