import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import DirectiveParagraph from '../components/article/directives/DirectiveParagraph';
import { mappaDirective } from '../components/article/directives/mappa';
import type { DirectiveNode } from '../components/article/directives/types';
import { setConsent } from '../lib/consent';
import type { ContentItem } from '../types/content';

/**
 * Rete di sicurezza isolata per `:::mappa`, sul modello di
 * `Articolo.directives.test.tsx` ma senza dipendere dalla registrazione
 * condivisa in `directives/index.ts` (altri agenti costruiscono le altre
 * direttive in parallelo, quella la fa l'orchestratore alla fine). Il plugin
 * remark qui sotto ripete solo la trasformazione di QUESTA direttiva, con la
 * stessa logica di `remarkEditorialDirectives`.
 */

const MOCK_ITEMS: Record<string, ContentItem> = {
  'posto-uno': {
    id: 'posto-uno',
    source: 'instagram',
    permalink: 'https://instagram.com/p/1',
    mediaType: 'post',
    cover: '/img/uno.jpg',
    hook: 'Hook uno',
    title: 'Posto Uno',
    description: 'Descrizione uno.',
    place: {
      name: 'Posto Uno',
      city: 'Praga',
      country: 'Repubblica Ceca',
      coordinates: { lat: 50.08, lng: 14.43 },
    },
    zone: 'Europa',
    types: ['Insolito'],
    partnership: { kind: 'organic' },
    isPlaceholder: false,
  },
  'posto-due': {
    id: 'posto-due',
    source: 'instagram',
    permalink: 'https://instagram.com/p/2',
    mediaType: 'post',
    cover: '/img/due.jpg',
    hook: 'Hook due',
    title: 'Posto Due',
    description: 'Descrizione due.',
    place: {
      name: 'Posto Due',
      city: 'Vienna',
      country: 'Austria',
      coordinates: { lat: 48.2, lng: 16.37 },
    },
    zone: 'Europa',
    types: ['Food & Ristoranti'],
    partnership: { kind: 'organic' },
    isPlaceholder: false,
  },
};

vi.mock('../config/contentLibrary', () => ({
  getContentById: (id: string) => MOCK_ITEMS[id],
}));

function remarkMappaOnly() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective' || directive.name !== 'mappa') return;
      const data = directive.data || (directive.data = {});
      data.hProperties = mappaDirective.toProps(directive);
      data.hName = mappaDirective.hName;
    });
  };
}

function renderMappa(content: string) {
  return render(
    <BrowserRouter>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkMappaOnly]}
        components={
          {
            'directive-p': DirectiveParagraph,
            [mappaDirective.hName]: mappaDirective.component,
          } as never
        }
      >
        {content}
      </ReactMarkdown>
    </BrowserRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe(':::mappa — mini-mappa con elenco posti citati', () => {
  it('senza consenso marketing non monta la mappa: resta solo elenco + CTA "Attivala"', () => {
    const { container } = renderMappa(':::mappa{posti="posto-uno, posto-due"}\n:::\n');

    const aside = screen.getByRole('complementary', {
      name: "Mappa dei posti citati nell'articolo",
    });
    expect(aside).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeNull();

    const linkUno = screen.getByRole('link', { name: /Posto Uno/ });
    expect(linkUno).toHaveAttribute('href', '/posto/posto-uno');
    const linkDue = screen.getByRole('link', { name: /Posto Due/ });
    expect(linkDue).toHaveAttribute('href', '/posto/posto-due');

    expect(screen.getByRole('button', { name: 'Attivala' })).toBeInTheDocument();
  });

  it("con consenso marketing sparisce la CTA d'attivazione e l'elenco resta accessibile", () => {
    setConsent({ analytics: false, marketing: true, personalization: false });

    renderMappa(':::mappa{posti="posto-uno, posto-due" zoom="9"}\n:::\n');

    expect(screen.queryByRole('button', { name: 'Attivala' })).toBeNull();
    expect(screen.getByRole('link', { name: /Posto Uno/ })).toHaveAttribute(
      'href',
      '/posto/posto-uno'
    );
    expect(screen.getByRole('link', { name: /Posto Due/ })).toHaveAttribute(
      'href',
      '/posto/posto-due'
    );
  });

  it('scarta id non trovati nel registro senza rompere il rendering', () => {
    renderMappa(':::mappa{posti="posto-uno, inesistente"}\n:::\n');

    expect(screen.getByRole('link', { name: /Posto Uno/ })).toBeInTheDocument();
    expect(screen.queryByText('Posto Due')).toBeNull();
  });

  it('senza id validi non renderizza nulla', () => {
    const { container } = renderMappa(':::mappa{posti="inesistente"}\n:::\n');
    expect(container.querySelector('aside')).toBeNull();
  });
});
