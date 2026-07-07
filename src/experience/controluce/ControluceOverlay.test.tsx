import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ControluceOverlay from './ControluceOverlay';
import { ACTS } from './acts';

describe('ControluceOverlay', () => {
  it('renders every act title and Italian verse', () => {
    render(<ControluceOverlay tRef={{ current: 0 }} />);
    for (const act of ACTS) {
      expect(screen.getByText(act.title)).toBeInTheDocument();
      expect(screen.getByText(act.verse)).toBeInTheDocument();
    }
  });

  it('marks decorative reel windows aria-hidden with empty alt', () => {
    const { container } = render(<ControluceOverlay tRef={{ current: 0 }} />);
    const windows = container.querySelectorAll('[data-reel-window]');
    expect(windows.length).toBe(ACTS.length);
    windows.forEach((w) => {
      expect(w.getAttribute('aria-hidden')).toBe('true');
      expect(w.querySelector('img')?.getAttribute('alt')).toBe('');
    });
  });

  it('shows the scroll cue at start', () => {
    render(<ControluceOverlay tRef={{ current: 0 }} />);
    expect(screen.getByText(/scorri/i)).toBeInTheDocument();
  });

  it('has a clickable CTA link to /esplora', () => {
    render(<ControluceOverlay tRef={{ current: 0 }} />);
    expect(screen.getByRole('link', { name: /esplora/i })).toHaveAttribute('href', '/esplora');
  });
});
