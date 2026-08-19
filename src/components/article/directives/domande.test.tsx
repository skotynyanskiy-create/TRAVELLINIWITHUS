import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { domandeDirective } from './domande';
import type { DirectiveNode } from './types';

/**
 * Pipeline isolata (remark-directive reale + solo `domandeDirective`), senza
 * passare dal registro condiviso in `./index.ts` — non ancora registrato in
 * questa slice (la registrazione la fa l'orchestratore a fine lavoro).
 */
function remarkDomandeOnly() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective' || directive.name !== 'domande') return;
      const data = directive.data || (directive.data = {});
      data.hProperties = domandeDirective.toProps(directive);
      data.hName = domandeDirective.hName;
    });
  };
}

const components = {
  [domandeDirective.hName]: domandeDirective.component,
} as unknown as Components;

function renderDomande(content: string) {
  return render(
    <ReactMarkdown remarkPlugins={[remarkDirective, remarkDomandeOnly]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

/* remark-directive non supporta uno spazio fra ":::" e il nome (verificato
   con un probe diretto sul parser): stessa convenzione senza spazio già
   usata da verified/pullquote/fullbleed/source. */
const THREE_QA = `:::domande
### Quanto costa dormire nel Salento ad agosto?
Tra 90 e 140€ a notte per due in masseria, se prenoti entro marzo.

### Serve l'auto per girare il Salento?
Sì, i borghi sono lontani tra loro e i bus locali sono rari la sera.

### Quando conviene prenotare per evitare il tutto esaurito?
Entro fine giugno per agosto: le masserie migliori si esauriscono prima.
:::
`;

describe(':::domande::: — direttiva editoriale', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renderizza ogni domanda come <details>/<summary> nativi con la prima aperta', () => {
    const { container } = renderDomande(THREE_QA);
    const section = container.querySelector('section[aria-label="Domande frequenti"]');
    expect(section).not.toBeNull();
    const details = Array.from(section?.querySelectorAll('details') ?? []);
    expect(details.length).toBe(3);
    expect(details[0]?.hasAttribute('open')).toBe(true);
    expect(details[1]?.hasAttribute('open')).toBe(false);
    expect(section?.textContent).toContain('Quanto costa dormire nel Salento ad agosto?');
    expect(section?.textContent).toContain(
      'Tra 90 e 140€ a notte per due in masseria, se prenoti entro marzo.'
    );
  });

  it('è peso L3: solo filo (border-y), nessun fondo colorato', () => {
    const { container } = renderDomande(THREE_QA);
    const section = container.querySelector('section[aria-label="Domande frequenti"]');
    expect(section).toHaveClass('border-y', 'border-[var(--color-border)]');
    expect(section?.className).not.toMatch(/bg-\[/);
  });

  it('emette FAQPage una sola volta con le domande e risposte reali', () => {
    const { container } = renderDomande(THREE_QA);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    const jsonLd = JSON.parse(scripts[0].textContent || '{}');
    expect(jsonLd['@type']).toBe('FAQPage');
    expect(jsonLd.mainEntity).toHaveLength(3);
    expect(jsonLd.mainEntity[0].name).toBe('Quanto costa dormire nel Salento ad agosto?');
    expect(jsonLd.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(jsonLd.mainEntity[0].acceptedAnswer.text).toContain('Tra 90 e 140€');
  });

  it('scarta una domanda senza risposta reale e non la conta nello schema', () => {
    const withUnanswered = `:::domande
### Quanto costa dormire nel Salento ad agosto?
Tra 90 e 140€ a notte per due in masseria, se prenoti entro marzo.

### Domanda senza risposta

### Serve l'auto per girare il Salento?
Sì, i borghi sono lontani tra loro e i bus locali sono rari la sera.
:::
`;
    const { container } = renderDomande(withUnanswered);
    expect(container.textContent).not.toContain('Domanda senza risposta');
    const script = container.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.textContent || '{}');
    expect(jsonLd.mainEntity).toHaveLength(2);
  });

  it('avvisa in sviluppo se le domande sono fuori dal range 3-6', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const TWO_QA = `:::domande
### Prima domanda?
Prima risposta reale.

### Seconda domanda?
Seconda risposta reale.
:::
`;
    renderDomande(TWO_QA);
    expect(
      warnSpy.mock.calls.some((call) => String(call[0]).includes('intervallo consigliato'))
    ).toBe(true);
  });

  /* Due blocchi domande nella stessa pagina dichiarerebbero a Google due
     FAQPage. Il motore passa l'occorrenza a `toProps`: dalla seconda in poi lo
     schema non si emette, ma il blocco resta visibile. */
  describe('schema non duplicato', () => {
    const directive = () =>
      ({
        type: 'containerDirective',
        name: 'domande',
        children: [
          { type: 'heading', children: [{ type: 'text', value: 'Una domanda?' }] },
          { type: 'paragraph', children: [{ type: 'text', value: 'Una risposta reale.' }] },
        ],
      }) as unknown as DirectiveNode;

    it('la prima occorrenza non porta il flag di soppressione', () => {
      expect(domandeDirective.toProps(directive(), 0)['data-skip-schema']).toBeUndefined();
    });

    it("dalla seconda occorrenza il flag c'è", () => {
      expect(domandeDirective.toProps(directive(), 1)['data-skip-schema']).toBe('true');
    });

    it('col flag il blocco si vede ma non emette JSON-LD', () => {
      const Component = domandeDirective.component;
      const items = JSON.stringify([{ q: 'Una domanda?', a: 'Una risposta reale.' }]);
      const { container } = render(
        <Component {...{ 'data-items': items, 'data-skip-schema': 'true' }} />
      );
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
      expect(container.textContent).toContain('Una domanda?');
    });
  });
});
