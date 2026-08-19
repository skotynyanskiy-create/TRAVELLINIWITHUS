import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import DirectiveParagraph from '../components/article/directives/DirectiveParagraph';
import { datiDirective } from '../components/article/directives/dati';
import type { DirectiveNode } from '../components/article/directives/types';

/**
 * Rete di sicurezza isolata per `:::dati`, sul modello di
 * `Articolo.directives.test.tsx` ma senza dipendere dalla registrazione
 * condivisa in `directives/index.ts` (altri agenti costruiscono le altre
 * direttive in parallelo, quella la fa l'orchestratore alla fine). Il plugin
 * remark qui sotto ripete solo la trasformazione di QUESTA direttiva, con la
 * stessa logica di `remarkEditorialDirectives`.
 */

function remarkDatiOnly() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective' || directive.name !== 'dati') return;
      const data = directive.data || (directive.data = {});
      data.hProperties = datiDirective.toProps(directive);
      data.hName = datiDirective.hName;
    });
  };
}

function renderDati(content: string) {
  return render(
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkDatiOnly]}
      components={
        {
          'directive-p': DirectiveParagraph,
          [datiDirective.hName]: datiDirective.component,
        } as never
      }
    >
      {content}
    </ReactMarkdown>
  );
}

describe(':::dati — costi e info pratiche come <dl> a filo (peso L3)', () => {
  it('tipo="costi" completo: righe, totale con perQuante, data di aggiornamento', () => {
    const content = `:::dati{tipo="costi" titolo="Weekend a Vienna" quando="maggio 2026" perQuante="2 persone, 3 notti"}
- Voli A/R · 180 €
- Hotel (3 notti) · 240 €
- Totale · 420 €
:::
`;
    const { container } = renderDati(content);

    expect(screen.getByText('Weekend a Vienna')).toBeInTheDocument();
    expect(screen.getByText(/Aggiornato/).textContent).toContain('maggio 2026');

    expect(container.querySelectorAll('dt')).toHaveLength(3);
    expect(screen.getByText('Voli A/R')).toBeInTheDocument();
    expect(screen.getByText('180 €')).toBeInTheDocument();
    expect(screen.getByText('Hotel (3 notti)')).toBeInTheDocument();
    expect(screen.getByText('240 €')).toBeInTheDocument();

    expect(screen.getByText('Totale')).toBeInTheDocument();
    expect(screen.getByText('420 €')).toBeInTheDocument();
    expect(screen.getByText('2 persone, 3 notti')).toBeInTheDocument();

    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('border-y', 'border-[var(--color-border)]');
  });

  it('tipo="costi" senza perQuante: la riga Totale non renderizza, il resto si', () => {
    const content = `:::dati{tipo="costi" quando="maggio 2026"}
- Voli A/R · 180 €
- Totale · 420 €
:::
`;
    renderDati(content);

    expect(screen.getByText('Voli A/R')).toBeInTheDocument();
    expect(screen.queryByText('Totale')).toBeNull();
    expect(screen.queryByText('420 €')).toBeNull();
  });

  it('tipo="costi" senza quando: il blocco non renderizza (prezzo senza data)', () => {
    const content = `:::dati{tipo="costi" perQuante="2 persone, 3 notti"}
- Voli A/R · 180 €
- Totale · 180 €
:::
`;
    const { container } = renderDati(content);

    expect(container.querySelector('aside')).toBeNull();
    expect(screen.queryByText('Voli A/R')).toBeNull();
  });

  it('tipo="pratiche": righe Etichetta · valore, titolo di default, nessuna data richiesta', () => {
    const content = `:::dati{tipo="pratiche"}
- Come si arriva · Aereo su Vienna, poi metro U3 per il centro
- Quando andare · Aprile-giugno o settembre-ottobre
:::
`;
    const { container } = renderDati(content);

    expect(screen.getByText('Info pratiche')).toBeInTheDocument();
    expect(screen.getByText('Come si arriva')).toBeInTheDocument();
    expect(screen.getByText('Aereo su Vienna, poi metro U3 per il centro')).toBeInTheDocument();
    expect(screen.getByText('Quando andare')).toBeInTheDocument();
    expect(screen.queryByText(/Aggiornato/)).toBeNull();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
  });

  it('tipo non valido non renderizza nulla', () => {
    const content = `:::dati{tipo="sconosciuto"}
- Etichetta · Valore
:::
`;
    const { container } = renderDati(content);
    expect(container.querySelector('aside')).toBeNull();
  });
});
