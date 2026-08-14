import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { reelDirective } from './reel';
import { REELS } from '../../../config/reels';

/**
 * Fixture: id reali da `src/config/reels.ts`, non inventati. Nessun
 * `Link`/router qui (solo `<a>`/`<button>`/`<video>`), quindi basta il render
 * di testing-library senza wrapper.
 *
 * Il comportamento normale e' l'anteprima che porta su Instagram; il video in
 * pagina e' l'eccezione, accesa da `videoInPagina` sulla `ReelEntry`. Nessuna
 * voce reale del manifest ha il flag, quindi per quel ramo si clona la entry
 * vera e le si accende sopra: cosi' il test non chiede di alterare i dati di
 * produzione per farsi passare.
 */

const Reel = reelDirective.component as React.ComponentType<{
  'data-id'?: string;
  'data-posto'?: string;
}>;

const BURTON_ID = 'reel-campania-burton-juice';
const BURTON_HOOK = 'Il primo ristorante a tema Tim Burton in Italia?';
const BURTON_URL = 'https://www.instagram.com/travelliniwithus/reel/C6gJr_noB_i/';

/** La entry reale, con il video in pagina acceso: serve ai due test del ramo video. */
function conVideoInPagina() {
  const vera = REELS.find((r) => r.id === BURTON_ID);
  if (!vera) throw new Error(`Fixture mancante nel manifest: ${BURTON_ID}`);
  return { ...vera, videoInPagina: true };
}

describe(':::reel — reelDirective', () => {
  it('toProps legge id/posto dagli attributes e scarta i children', () => {
    const directive = {
      type: 'containerDirective',
      name: 'reel',
      attributes: { id: 'reel-praga-cinnamood' },
      children: [{ type: 'paragraph', children: [{ type: 'text', value: 'ignorato' }] }],
    };
    const props = reelDirective.toProps(directive);
    expect(props).toEqual({ 'data-id': 'reel-praga-cinnamood' });
    expect(directive.children).toEqual([]);
  });

  it('per default l’anteprima porta su Instagram in un tocco solo, senza montare video', () => {
    const { container, getByRole } = render(<Reel data-id={BURTON_ID} />);
    expect(container.querySelector(`aside[aria-label="Reel: ${BURTON_HOOK}"]`)).not.toBeNull();
    expect(container.querySelector('video')).toBeNull();

    const link = getByRole('link', { name: `Guarda il reel su Instagram: ${BURTON_HOOK}` });
    expect(link).toHaveAttribute('href', BURTON_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('l’anteprima mostra la copertina con il suo alt, non un’immagine decorativa', () => {
    const { container } = render(<Reel data-id={BURTON_ID} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img).not.toHaveAttribute('aria-hidden');
    expect(img?.getAttribute('alt')).toBeTruthy();
  });

  it('risolve il reel anche via posto (getReelForPosto)', () => {
    const { getByRole } = render(<Reel data-posto="campania-burton-juice" />);
    expect(
      getByRole('link', { name: `Guarda il reel su Instagram: ${BURTON_HOOK}` })
    ).toBeInTheDocument();
  });

  it('con videoInPagina mostra il poster e monta il video solo al tap, mai in autoplay', async () => {
    vi.resetModules();
    const vera = conVideoInPagina();
    vi.doMock('../../../config/reels', async () => {
      const actual =
        await vi.importActual<typeof import('../../../config/reels')>('../../../config/reels');
      return { ...actual, REELS: [vera], getReelForPosto: () => vera };
    });
    const { reelDirective: diretta } = await import('./reel');
    const Isolato = diretta.component as typeof Reel;

    const { container, getByRole } = render(<Isolato data-id={BURTON_ID} />);
    expect(container.querySelector('video')).toBeNull();

    fireEvent.click(getByRole('button', { name: `Guarda il reel: ${BURTON_HOOK}` }));

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('controls');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).not.toHaveAttribute('loop');

    // Il permalink resta raggiungibile anche quando il video sta in pagina.
    expect(getByRole('link', { name: /Apri su Instagram/ })).toHaveAttribute('href', BURTON_URL);
    vi.doUnmock('../../../config/reels');
  });

  it('con videoInPagina, se il video non carica ripiega sul link Instagram', async () => {
    vi.resetModules();
    const vera = conVideoInPagina();
    vi.doMock('../../../config/reels', async () => {
      const actual =
        await vi.importActual<typeof import('../../../config/reels')>('../../../config/reels');
      return { ...actual, REELS: [vera], getReelForPosto: () => vera };
    });
    const { reelDirective: diretta } = await import('./reel');
    const Isolato = diretta.component as typeof Reel;

    const { container, getByRole } = render(<Isolato data-id={BURTON_ID} />);
    fireEvent.click(getByRole('button', { name: /Guarda il reel/ }));
    fireEvent.error(container.querySelector('video') as HTMLVideoElement);

    expect(container.querySelector('video')).toBeNull();
    expect(
      getByRole('link', { name: `Guarda il reel su Instagram: ${BURTON_HOOK}` })
    ).toHaveAttribute('href', BURTON_URL);
    vi.doUnmock('../../../config/reels');
  });

  it('non renderizza nulla per un id assente dal manifest', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Reel data-id="reel-che-non-esiste" />);
    expect(container).toBeEmptyDOMElement();
    warn.mockRestore();
  });
});
