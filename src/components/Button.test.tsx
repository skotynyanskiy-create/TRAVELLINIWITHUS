import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';
import { BrowserRouter } from 'react-router-dom';

describe('Button Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { getByText } = render(<Button onClick={onClick}>Click me</Button>);
    getByText('Click me').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a Link when "to" prop is provided', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <Button to="/test">Link</Button>
      </BrowserRouter>
    );

    const linkElement = getByRole('link', { name: /link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/test');
  });

  it('renders as an anchor when "href" prop is provided', () => {
    const { getByRole } = render(<Button href="https://example.com">External</Button>);
    const anchorElement = getByRole('link', { name: /external/i });
    expect(anchorElement).toBeInTheDocument();
    expect(anchorElement.getAttribute('href')).toBe('https://example.com');
    expect(anchorElement.getAttribute('target')).toBe('_blank');
  });

  it('applies correct variant classes', () => {
    const { getByRole } = render(<Button variant="secondary">Secondary</Button>);
    expect(getByRole('button', { name: /secondary/i })).toHaveClass(
      'bg-[var(--color-surface)]',
      'border'
    );
  });
});
