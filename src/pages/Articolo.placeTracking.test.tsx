import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test/test-utils';
import { ArticleBody } from './Articolo';
import type { ArticleData } from '../components/article';
import { trackAnalyticsEvent } from '../services/analytics';

/**
 * Copre il contratto eventi del pillar «dormire-posti-sembrano-inventati»
 * (ARTICLE_dormire-posti-sembrano-inventati.md, sezione SEO -> «Contratto
 * eventi»), generalizzato a qualunque articolo: `article_place_click` su
 * OGNI link `/posto/:id` del corpo (direttiva `:::posto` o link in prosa),
 * non solo sui blocchi, e `article_partner_cta_click` sul link a
 * `/collaborazioni`. Fixture: id reali da `content-seed.json`, come negli
 * altri test delle direttive.
 */

vi.mock('../services/analytics', () => ({
  trackAnalyticsEvent: vi.fn(),
  trackEvent: vi.fn(),
}));

const CONTENT = `Apertura del pezzo di prova.

:::posto{id="emilia-granduca-di-campigna"}
:::

Testo di mezzo, poi la scheda di [Placat](/posto/bossico-placat) e basta.

Se gestite una struttura, guardate la [pagina collaborazioni](/collaborazioni).
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

describe('ArticleBody — article_place_click / article_partner_cta_click', () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
  });

  it('la card :::posto traccia article_place_click con slug, position 1-based e partnership_kind', async () => {
    const { getByRole } = render(<ArticleBody article={makeArticle()} slug="test-articolo" />);
    const cta = await waitFor(() => getByRole('link', { name: 'Scheda del posto →' }));

    fireEvent.click(cta);

    expect(trackAnalyticsEvent).toHaveBeenCalledWith('article_place_click', {
      slug: 'test-articolo',
      place_id: 'emilia-granduca-di-campigna',
      position: 1,
      partnership_kind: 'organic',
    });
  });

  it('un link in prosa verso /posto/:id traccia lo stesso evento con la sua position', async () => {
    const { getByRole } = render(<ArticleBody article={makeArticle()} slug="test-articolo" />);
    const link = await waitFor(() => getByRole('link', { name: 'Placat' }));

    fireEvent.click(link);

    expect(trackAnalyticsEvent).toHaveBeenCalledWith('article_place_click', {
      slug: 'test-articolo',
      place_id: 'bossico-placat',
      position: 2,
      partnership_kind: 'organic',
    });
  });

  it('un link in prosa non pertinente non traccia article_place_click', async () => {
    const contentWithNeutralLink = `${CONTENT}\n\nAltro link a [una guida](/esplora?format=guida).`;
    const { getByRole } = render(
      <ArticleBody
        article={{ ...makeArticle(), content: contentWithNeutralLink }}
        slug="test-articolo"
      />
    );
    const link = await waitFor(() => getByRole('link', { name: 'una guida' }));

    fireEvent.click(link);

    expect(trackAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('il link a /collaborazioni traccia article_partner_cta_click', async () => {
    const { getByRole } = render(<ArticleBody article={makeArticle()} slug="test-articolo" />);
    const link = await waitFor(() => getByRole('link', { name: 'pagina collaborazioni' }));

    fireEvent.click(link);

    expect(trackAnalyticsEvent).toHaveBeenCalledWith('article_partner_cta_click', {
      slug: 'test-articolo',
    });
  });
});
