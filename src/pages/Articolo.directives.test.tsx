import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ArticleBody } from './Articolo';
import type { ArticleData } from '../components/article';

/**
 * Rete di sicurezza per l'estrazione del sistema di direttive editoriali in
 * `src/components/article/directives/`. Copre il rendering delle quattro
 * direttive esistenti (`verified`, `fullbleed`, `pullquote`, `source`):
 * markup, classi e attributi devono restare identici dopo il refactor.
 *
 * `ArticleBody` monta `ArticleMarkdownBody` dietro un confine `lazy()`/
 * `Suspense` (vedi Articolo.tsx): il DOM reale arriva dopo il resolve del
 * dynamic import, quindi ogni asserzione e' avvolta in `waitFor`.
 */

const CONTENT = `Primo paragrafo del corpo, breve.

:::verified{visited="2025-09" pricesChecked="2026-04" contacts="true"}
Verificato di persona a settembre 2025.
:::

## Sezione di prova

:::fullbleed{ratio="4/3"}
![Testo alternativo](https://example.com/foto.jpg "Didascalia di prova | Foto: Rodrigo")
:::

:::pullquote
Frase citata in evidenza per il lettore.

— Betta, agosto 2025
:::

:::source{href="https://example.com/fonte" author="Fonte di prova" verified="true" date="2025"}
Testo della fonte citata nel blocco source.
:::
`;

function makeArticle(): ArticleData {
  return {
    title: 'Articolo di prova',
    description: 'Descrizione di prova.',
    image: '/hero.jpg',
    category: 'Guide',
    date: '1 gennaio 2026',
    location: 'Test, Italia',
    period: 'Tutto l’anno',
    budget: 'Medio',
    content: CONTENT,
    isMarkdown: true,
  };
}

describe('ArticleBody — direttive editoriali (verified, fullbleed, pullquote, source)', () => {
  it('renderizza :::verified::: come VerifiedBox con badge, date formattate e contatti', async () => {
    const { container } = render(<ArticleBody article={makeArticle()} />);
    await waitFor(() => {
      const box = container.querySelector('aside[aria-label="Box verifica esperienza diretta"]');
      expect(box).not.toBeNull();
      expect(box).toHaveClass(
        'my-8',
        'rounded-[var(--radius-md)]',
        'border',
        'border-[var(--color-border)]',
        'border-l-4',
        'border-l-[var(--color-accent)]',
        'bg-[var(--color-accent-soft)]'
      );
      expect(box?.textContent).toContain('Verificato');
      expect(box?.textContent).toContain('settembre 2025');
      expect(box?.textContent).toContain('aprile 2026');
      expect(box?.textContent).toContain('Contatti aggiornati');
      expect(box?.textContent).toContain('Verificato di persona a settembre 2025.');
    });
  });

  it('renderizza :::fullbleed::: come FullBleedFigure con src/alt/ratio/caption/credit dalla prima image', async () => {
    const { container } = render(<ArticleBody article={makeArticle()} />);
    await waitFor(() => {
      const figure = container.querySelector('figure.w-screen');
      expect(figure).not.toBeNull();
      const img = figure?.querySelector('img');
      expect(img).toHaveAttribute('src', 'https://example.com/foto.jpg');
      expect(img).toHaveAttribute('alt', 'Testo alternativo');
      expect(img).toHaveStyle({ aspectRatio: '4/3' });
      expect(figure?.querySelector('figcaption')?.textContent).toContain('Didascalia di prova');
      expect(figure?.querySelector('figcaption')?.textContent).toContain('Foto: Rodrigo');
    });
  });

  it('renderizza :::pullquote::: come blockquote con attribuzione estratta dal corpo', async () => {
    const { container } = render(<ArticleBody article={makeArticle()} />);
    await waitFor(() => {
      const quote = container.querySelector('blockquote');
      expect(quote).not.toBeNull();
      expect(quote).toHaveClass(
        'my-12',
        'md:my-16',
        'border-l-2',
        'border-[var(--color-accent)]',
        'pl-6',
        'md:pl-8'
      );
      expect(quote?.textContent).toContain('Frase citata in evidenza per il lettore.');
      const footer = quote?.querySelector('footer');
      expect(footer?.textContent).toBe('— Betta, agosto 2025');
    });
  });

  it('renderizza :::source::: come SourceBlock con href, autore e badge verified', async () => {
    const { container } = render(<ArticleBody article={makeArticle()} />);
    await waitFor(() => {
      const source = container.querySelector('aside[aria-label="Fonte citata"]');
      expect(source).not.toBeNull();
      expect(source?.textContent).toContain('Fonte');
      expect(source?.textContent).toContain('(2025)');
      expect(source?.textContent).toContain('Testo della fonte citata nel blocco source.');
      const link = source?.querySelector('a[href="https://example.com/fonte"]');
      expect(link?.textContent).toContain('Fonte di prova');
    });
  });
});
