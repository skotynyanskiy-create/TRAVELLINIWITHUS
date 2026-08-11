import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { verdettoDirective } from './verdetto';
import { remarkEditorialDirectives, directiveComponents } from './index';
import type { DirectiveNode } from './types';

/**
 * Pipeline isolata (remark-directive reale + solo `verdettoDirective`), senza
 * passare dal registro condiviso in `./index.ts` — usata per i test di resa
 * visiva (sì/no, "Il momento giusto", colori) che non dipendono dal contesto
 * documento. Senza contesto, `toProps` non riceve mai `singlePostoId`: e'
 * esattamente lo stato "posto non identificabile", verificato piu' sotto.
 */
function remarkVerdettoOnly() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective' || directive.name !== 'verdetto') return;
      const data = directive.data || (directive.data = {});
      data.hProperties = verdettoDirective.toProps(directive);
      data.hName = verdettoDirective.hName;
    });
  };
}

const components = {
  [verdettoDirective.hName]: verdettoDirective.component,
} as unknown as Components;

/**
 * Pipeline reale (`remarkEditorialDirectives`, lo stesso plugin che gira sugli
 * articoli pubblicati): serve ad agganciare `:::verdetto` al `:::posto{id}`
 * che lo precede nello stesso documento — collegamento che vive nel contesto
 * a livello di documento, non nel singolo nodo, quindi non e' osservabile
 * dalla pipeline isolata sopra.
 */
function renderWithRegistry(content: string) {
  return render(
    <MemoryRouter>
      <ReactMarkdown
        remarkPlugins={[remarkDirective, remarkEditorialDirectives]}
        components={directiveComponents as unknown as Components}
      >
        {content}
      </ReactMarkdown>
    </MemoryRouter>
  );
}

function renderVerdetto(content: string) {
  return render(
    <ReactMarkdown remarkPlugins={[remarkDirective, remarkVerdettoOnly]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

/* remark-directive non supporta uno spazio fra ":::" e il nome (verificato
   con un probe diretto sul parser): stessa convenzione senza spazio già
   usata da verified/pullquote/fullbleed/source. */
const VALID_VERDETTO = `:::verdetto{quando="da metà settembre a ottobre"}
- sì · Vuoi mare e ombra vera, e guidi volentieri 40 minuti al giorno
- no · Vai ad agosto senza prenotare: paghi il doppio per il peggio
:::
`;

/** "emilia-granduca-di-campigna" è reale, non placeholder (content-seed.json). */
const POSTO_E_VERDETTO = `:::posto{id="emilia-granduca-di-campigna"}
:::

${VALID_VERDETTO}`;

describe(':::verdetto::: — direttiva editoriale', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renderizza le righe "sì ·" sotto Vale il viaggio se e quelle "no ·" sotto Lascia perdere se', () => {
    const { container } = render(
      <ReactMarkdown remarkPlugins={[remarkDirective, remarkVerdettoOnly]} components={components}>
        {VALID_VERDETTO}
      </ReactMarkdown>
    );
    const aside = container.querySelector('aside[aria-label="Verdetto"]');
    expect(aside).not.toBeNull();
    expect(aside?.textContent).toContain('Vale il viaggio se');
    expect(aside?.textContent).toContain(
      'Vuoi mare e ombra vera, e guidi volentieri 40 minuti al giorno'
    );
    expect(aside?.textContent).toContain('Lascia perdere se');
    expect(aside?.textContent).toContain(
      'Vai ad agosto senza prenotare: paghi il doppio per il peggio'
    );
  });

  it('mostra "Il momento giusto" solo quando l\'attributo quando è presente', () => {
    const { container } = renderVerdetto(VALID_VERDETTO);
    expect(container.textContent).toContain('Il momento giusto:');
    expect(container.textContent).toContain('da metà settembre a ottobre');
  });

  it("è l'unico blocco scuro: usa --color-ink-deep e --color-sand, mai un voto o una stella", () => {
    const { container } = renderVerdetto(VALID_VERDETTO);
    const aside = container.querySelector('aside[aria-label="Verdetto"]');
    expect(aside).toHaveClass('bg-[var(--color-ink-deep)]', 'text-[var(--color-sand)]');
    expect(aside?.textContent).not.toMatch(/★|voto|punteggio|\/5|\/10/i);
  });

  /* Senza un :::posto nello stesso documento non c'è modo di sapere QUALE
     posto il verdetto giudica: un Review senza itemReviewed è un frammento,
     non uno schema valido, quindi qui non si emette nulla — vedi il
     commento su buildVerdettoReviewJsonLd in verdetto.tsx. */
  it('senza un :::posto identificabile nello stesso documento, NON emette JSON-LD', () => {
    const { container } = renderVerdetto(VALID_VERDETTO);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  describe('agganciato a un posto reale del documento (pipeline registrata)', () => {
    it('emette Review con itemReviewed, author Organization, mai reviewRating', () => {
      const { container } = renderWithRegistry(POSTO_E_VERDETTO);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd['@type']).toBe('Review');
      expect(jsonLd.author).toEqual({ '@type': 'Organization', name: 'Travelliniwithus' });
      expect(jsonLd.reviewBody).toContain('Vale il viaggio se');
      expect(jsonLd.reviewBody).toContain('Lascia perdere se');
      expect(jsonLd.reviewRating).toBeUndefined();
      expect(jsonLd.aggregateRating).toBeUndefined();
    });

    it('itemReviewed usa l’insegna reale del registro (place.name), non un titolo inventato', () => {
      const { container } = renderWithRegistry(POSTO_E_VERDETTO);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd.itemReviewed).toBeDefined();
      expect(jsonLd.itemReviewed.name).toBe('Granduca di Campigna');
      expect(jsonLd.itemReviewed['@type']).toBe('HealthAndBeautyBusiness');
    });

    it('con più di un :::posto nello stesso documento, resta ambiguo: NON emette JSON-LD', () => {
      const twoPosti = `:::posto{id="emilia-granduca-di-campigna"}
:::

:::posto{id="verona-bbq-magi"}
:::

${VALID_VERDETTO}`;
      const { container } = renderWithRegistry(twoPosti);
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    });

    it('se il :::posto referenziato è ancora isPlaceholder, NON emette JSON-LD', () => {
      const placeholderPosto = `:::posto{id="toscana-mirror-house-spinofiorito"}
:::

${VALID_VERDETTO}`;
      const { container } = renderWithRegistry(placeholderPosto);
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    });
  });

  it('avvisa in sviluppo se trova un secondo blocco verdetto nello stesso articolo', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ReactMarkdown remarkPlugins={[remarkDirective, remarkVerdettoOnly]} components={components}>
        {`${VALID_VERDETTO}\n${VALID_VERDETTO}`}
      </ReactMarkdown>
    );
    expect(
      warnSpy.mock.calls.some((call) =>
        String(call[0]).includes('Trovato più di un blocco verdetto')
      )
    ).toBe(true);
  });

  /* L'avviso qui sopra e' dev-only e non ferma il render: in produzione due
     verdetti incollati dichiaravano comunque due Review per la stessa pagina.
     Il motore passa l'occorrenza a `toProps`, e dalla seconda lo schema tace. */
  describe('schema non duplicato', () => {
    const directive = () =>
      ({
        type: 'containerDirective',
        name: 'verdetto',
        attributes: { quando: 'da settembre' },
        children: [
          {
            type: 'list',
            children: [
              {
                type: 'listItem',
                children: [
                  { type: 'paragraph', children: [{ type: 'text', value: 'sì · Un motivo vero' }] },
                ],
              },
              {
                type: 'listItem',
                children: [
                  { type: 'paragraph', children: [{ type: 'text', value: 'no · Un motivo vero' }] },
                ],
              },
            ],
          },
        ],
      }) as unknown as DirectiveNode;

    it('la prima occorrenza non porta il flag di soppressione', () => {
      expect(verdettoDirective.toProps(directive(), 0)['data-skip-schema']).toBeUndefined();
    });

    it("dalla seconda occorrenza il flag c'è", () => {
      expect(verdettoDirective.toProps(directive(), 1)['data-skip-schema']).toBe('true');
    });

    it('la prima occorrenza porta l’id del posto quando il contesto lo fornisce', () => {
      expect(
        verdettoDirective.toProps(directive(), 0, { singlePostoId: 'emilia-granduca-di-campigna' })[
          'data-posto-id'
        ]
      ).toBe('emilia-granduca-di-campigna');
    });

    it('col flag il blocco si vede ma non emette JSON-LD', () => {
      const Component = verdettoDirective.component;
      const { container } = render(
        <Component
          {...{
            'data-si': JSON.stringify(['Un motivo vero']),
            'data-no': JSON.stringify(['Un motivo vero']),
            'data-skip-schema': 'true',
            'data-posto-id': 'emilia-granduca-di-campigna',
          }}
        />
      );
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
      expect(container.textContent).toContain('Un motivo vero');
    });
  });
});
