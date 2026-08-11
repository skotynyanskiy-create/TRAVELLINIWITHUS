import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../test/test-utils';
import { postoDirective } from './posto';

/**
 * `:::posto` non e' ancora registrata in `directives/index.ts` (la
 * registrazione finale spetta a chi coordina le direttive in parallelo),
 * quindi qui si testa direttamente `postoDirective.component` con le props
 * che `toProps` produrrebbe — stessa cosa che l'integrazione via markdown
 * fara' una volta registrata. Fixture: id reali da `content-seed.json`, non
 * inventati.
 */

const Posto = postoDirective.component as React.ComponentType<{ 'data-id'?: string }>;

describe(':::posto — postoDirective', () => {
  it('toProps legge id dagli attributes e scarta i children', () => {
    const children = [{ type: 'paragraph', children: [{ type: 'text', value: 'ignorato' }] }];
    const directive = {
      type: 'containerDirective',
      name: 'posto',
      attributes: { id: 'praga-dog-cafe' },
      children,
    };
    const props = postoDirective.toProps(directive);
    expect(props).toEqual({ 'data-id': 'praga-dog-cafe' });
    expect(directive.children).toEqual([]);
  });

  it('renderizza cover, titolo, luogo, prezzo, CTA per un posto reale con prezzo', () => {
    const { container, getByText, getByRole } = render(
      <Posto data-id="emilia-granduca-di-campigna" />
    );
    const aside = container.querySelector(
      'aside[aria-label="Posto dal registro: Granduca di Campigna"]'
    );
    expect(aside).not.toBeNull();
    expect(getByText('Dal registro')).toBeInTheDocument();
    expect(getByText('Granduca di Campigna')).toBeInTheDocument();
    expect(getByText('Santa Sofia')).toBeInTheDocument();
    expect(getByText('da 98€/notte')).toBeInTheDocument();
    const cta = getByRole('link', { name: 'Scheda del posto →' });
    expect(cta).toHaveAttribute('href', '/posto/emilia-granduca-di-campigna');
  });

  it('scrive la disclosure partnership come testo e non scrive nulla quando manca il prezzo', () => {
    const { container, getByText, queryByText } = render(<Posto data-id="campania-burton-juice" />);
    expect(getByText('ADV · @theburtonjuice')).toBeInTheDocument();
    // "campania-burton-juice" non ha `value` nel seed: nessun prezzo, nessun "n.d.".
    expect(queryByText(/n\.d\./i)).not.toBeInTheDocument();
    expect(container.querySelector('p.tabular-nums')).toBeNull();
  });

  it('non renderizza nulla per un posto ancora isPlaceholder', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Posto data-id="toscana-mirror-house-spinofiorito" />);
    expect(container).toBeEmptyDOMElement();
    warn.mockRestore();
  });

  it('non renderizza nulla per un id assente dal registro', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Posto data-id="questo-id-non-esiste" />);
    expect(container).toBeEmptyDOMElement();
    warn.mockRestore();
  });
});
