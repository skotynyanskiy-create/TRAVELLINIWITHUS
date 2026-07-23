import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

const trackEvent = vi.fn();
vi.mock('../services/analytics', () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

import VieniConNoi from './VieniConNoi';

/**
 * Guardia di non-regressione per TASK-005: le tre card "Oppure continua sul
 * sito" avevano solo `data-track`, che nel repo non e letto da nessun listener
 * delegato — quindi i click non emettevano alcun evento.
 */
const renderLanding = (route = '/guida-in-regalo') =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <VieniConNoi />
      </MemoryRouter>
    </HelmetProvider>
  );

const CARDS = [
  { cta_id: 'guida_path_esplora', destination: '/esplora' },
  { cta_id: 'guida_path_mappa', destination: '/mappa' },
  { cta_id: 'guida_path_collab', destination: '/collaborazioni' },
];

describe('/guida-in-regalo — tracciamento path del bio hub', () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it.each(CARDS)('il click su $cta_id emette bio_hub_path_click', ({ cta_id, destination }) => {
    renderLanding();
    trackEvent.mockClear(); // scarta landing_view emesso al mount

    fireEvent.click(document.querySelector(`[data-track="${cta_id}"]`) as HTMLElement);

    expect(trackEvent).toHaveBeenCalledWith(
      'bio_hub_path_click',
      expect.objectContaining({ route: '/guida-in-regalo', cta_id, destination })
    );
  });

  it('propaga utm_source cosi il path secondario resta attribuibile alla campagna', () => {
    renderLanding('/guida-in-regalo?utm_source=instagram_bio');
    trackEvent.mockClear();

    fireEvent.click(document.querySelector('[data-track="guida_path_mappa"]') as HTMLElement);

    expect(trackEvent).toHaveBeenCalledWith(
      'bio_hub_path_click',
      expect.objectContaining({
        utm_source: 'instagram_bio',
        source: 'lead_magnet_landing_instagram_bio',
      })
    );
  });

  it('ogni card e raggiungibile come link e ha un cta_id distinto', () => {
    renderLanding();

    const ids = CARDS.map((card) => card.cta_id);
    expect(new Set(ids).size).toBe(CARDS.length);

    for (const { cta_id, destination } of CARDS) {
      const link = document.querySelector(`[data-track="${cta_id}"]`);
      expect(link, `card ${cta_id} assente`).not.toBeNull();
      expect(link?.getAttribute('href')).toBe(destination);
    }

    // La vista pagina resta tracciata a parte: le due cose non si sostituiscono.
    expect(trackEvent).toHaveBeenCalledWith('landing_view', expect.objectContaining({}));
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
