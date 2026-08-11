import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { verdettoDirective } from './verdetto';
import type { DirectiveNode } from './types';

/**
 * Pipeline isolata (remark-directive reale + solo `verdettoDirective`), senza
 * passare dal registro condiviso in `./index.ts` — non ancora registrato in
 * questa slice (la registrazione la fa l'orchestratore a fine lavoro).
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

  it('emette Review con author Organization e solo reviewBody, senza reviewRating', () => {
    const { container } = renderVerdetto(VALID_VERDETTO);
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
});
