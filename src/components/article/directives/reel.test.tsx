import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { reelDirective } from './reel';

/**
 * `:::reel` non e' ancora registrata in `directives/index.ts` (la
 * registrazione finale spetta a chi coordina le direttive in parallelo),
 * quindi qui si testa direttamente `reelDirective.component`. Fixture: id
 * reali da `src/config/reels.ts`, non inventati. Nessun `Link`/router qui
 * (solo `<a>`/`<button>`/`<video>`), quindi il render di testing-library base
 * basta, senza wrapper Router.
 */

const Reel = reelDirective.component as React.ComponentType<{
  'data-id'?: string;
  'data-posto'?: string;
}>;

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

  it('mostra il poster con bottone play (mai autoplay) e monta il video solo al tap', () => {
    const { container, getByRole } = render(<Reel data-id="reel-campania-burton-juice" />);
    const aside = container.querySelector(
      'aside[aria-label="Reel: Il primo ristorante a tema Tim Burton in Italia?"]'
    );
    expect(aside).not.toBeNull();
    expect(container.querySelector('video')).toBeNull();

    const playButton = getByRole('button', {
      name: 'Guarda il reel: Il primo ristorante a tema Tim Burton in Italia?',
    });
    fireEvent.click(playButton);

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('src', '/video/campania-burton-juice.mp4');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('controls');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).not.toHaveAttribute('loop');
  });

  it('risolve il reel anche via posto (getReelForPosto)', () => {
    const { getByRole } = render(<Reel data-posto="campania-burton-juice" />);
    expect(
      getByRole('button', {
        name: 'Guarda il reel: Il primo ristorante a tema Tim Burton in Italia?',
      })
    ).toBeInTheDocument();
  });

  it('se il video fallisce a caricare, ripiega sul link Instagram con label esplicita', () => {
    const { container, getByRole } = render(<Reel data-id="reel-campania-burton-juice" />);
    fireEvent.click(getByRole('button', { name: /Guarda il reel/ }));
    const video = container.querySelector('video') as HTMLVideoElement;
    fireEvent.error(video);

    expect(container.querySelector('video')).toBeNull();
    const link = getByRole('link', { name: 'Guarda su Instagram ↗' });
    expect(link).toHaveAttribute(
      'href',
      'https://www.instagram.com/travelliniwithus/reel/C6gJr_noB_i/'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('non renderizza nulla per un id assente dal manifest', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Reel data-id="reel-che-non-esiste" />);
    expect(container).toBeEmptyDOMElement();
    warn.mockRestore();
  });
});
