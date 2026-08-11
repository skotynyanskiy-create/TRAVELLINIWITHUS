import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { affiliatoDirective, toProps } from './affiliato';
import type { DirectiveNode } from './types';

/**
 * Test isolati per la direttiva inline `:affiliato[testo]{partner="..."}`.
 * Il motore che la attiva davvero dentro `remark`/`ArticleBody` e' fuori
 * scope qui (vedi commento in affiliato.tsx): questi test chiamano
 * `toProps`/`component` direttamente, come lo fara' il motore una volta
 * collegato.
 */

function makeNode(
  attributes: Record<string, string | null | undefined>,
  label = 'Masseria Le Rene'
): DirectiveNode {
  return {
    type: 'textDirective',
    name: 'affiliato',
    attributes,
    children: [{ type: 'text', value: label }],
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('affiliatoDirective.toProps', () => {
  it('costruisce data-href via buildAffiliateLink per un partner noto', () => {
    const node = makeNode({
      partner: 'booking',
      path: '/hotel/it/le-rene.it.html',
      campagna: 'salento-agosto',
    });
    const props = toProps(node, 0);
    expect(props['data-href']).toBe('https://www.booking.com/hotel/it/le-rene.it.html');
    expect(props['data-partner']).toBe('booking');
    expect(props['data-campaign']).toBe('salento-agosto');
    expect(props['data-utm-content']).toBe('articolo-inline-1');
  });

  it('deriva utm_content dalla posizione (index 0-based -> inline-N 1-based)', () => {
    const node = makeNode({ partner: 'booking', campagna: 'salento-agosto' });
    const props = toProps(node, 3);
    expect(props['data-utm-content']).toBe('articolo-inline-4');
  });

  it('senza index esplicito ricade su articolo-inline-1', () => {
    const node = makeNode({ partner: 'booking', campagna: 'salento-agosto' });
    const props = toProps(node);
    expect(props['data-utm-content']).toBe('articolo-inline-1');
  });

  it('non produce data-href per un partner sconosciuto/mancante', () => {
    const node = makeNode({ partner: 'nonesiste', campagna: 'salento-agosto' });
    const props = toProps(node);
    expect(props['data-href']).toBeUndefined();
  });

  it('avvisa in dev se il testo del link è un invito generico', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const node = makeNode({ partner: 'booking', campagna: 'salento-agosto' }, 'Clicca qui');
    toProps(node);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('non nomina la cosa'));
  });

  it('non avvisa se il testo del link nomina la cosa', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const node = makeNode({ partner: 'booking', campagna: 'salento-agosto' }, 'Masseria Le Rene');
    toProps(node);
    const genericWarning = warnSpy.mock.calls.some((call) =>
      String(call[0]).includes('non nomina la cosa')
    );
    expect(genericWarning).toBe(false);
  });
});

describe('affiliatoDirective.component', () => {
  const Component = affiliatoDirective.component;

  it('renderizza link + marcatore "· affiliato" quando data-href è presente', () => {
    const { container, getByText } = render(
      <Component
        data-href="https://www.booking.com/hotel/it/le-rene.it.html"
        data-partner="booking"
        data-campaign="salento-agosto"
        data-utm-content="articolo-inline-1"
      >
        Masseria Le Rene
      </Component>
    );
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('href', 'https://www.booking.com/hotel/it/le-rene.it.html');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'nofollow sponsored noopener noreferrer');
    expect(link?.textContent).toBe('Masseria Le Rene');
    expect(getByText('· affiliato')).toBeInTheDocument();
  });

  it('senza data-href renderizza solo il testo, senza link né marcatore', () => {
    const { container, queryByText } = render(<Component>Masseria Le Rene</Component>);
    expect(container.querySelector('a')).toBeNull();
    expect(queryByText('· affiliato')).toBeNull();
    expect(container.textContent).toBe('Masseria Le Rene');
  });
});
