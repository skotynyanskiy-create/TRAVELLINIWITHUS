import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

const robotsAt = (route: string, props: { noindex?: boolean } = {}) => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <SEO title="T" description="D" {...props} />
      </MemoryRouter>
    </HelmetProvider>
  );
  return document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
};

describe('SEO: noindex derivato dal registro', () => {
  it('indicizza una superficie live', () => {
    expect(robotsAt('/mappa')).toContain('index, follow');
  });

  it('non indicizza una superficie soon, senza che la pagina lo chieda', () => {
    expect(robotsAt('/shop')).toBe('noindex, nofollow');
  });

  it('non indicizza una superficie preview', () => {
    expect(robotsAt('/itinerari')).toBe('noindex, nofollow');
  });

  it('non indicizza una superficie private', () => {
    expect(robotsAt('/preferiti')).toBe('noindex, nofollow');
  });

  it('somma in OR il noindex per-contenuto su una superficie live', () => {
    expect(robotsAt('/posto/qualsiasi', { noindex: true })).toBe('noindex, nofollow');
  });

  it('non permette a una pagina di forzare index su una superficie non live', () => {
    expect(robotsAt('/shop', { noindex: false })).toBe('noindex, nofollow');
  });
});
