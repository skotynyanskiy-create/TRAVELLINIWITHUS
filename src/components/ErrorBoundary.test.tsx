import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    );

    expect(getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI when an error occurs', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, getByRole } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/andato storto/)).toBeInTheDocument();
    expect(getByRole('button', { name: /riprova/i })).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
