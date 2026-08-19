import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentCard from './ContentCard';
import { QuickViewProvider } from '../../context/QuickViewContext';
import type { ContentItem } from '../../types/content';

function makeItem(overrides: Partial<ContentItem> & { id: string }): ContentItem {
  return {
    source: 'instagram',
    permalink: 'https://www.instagram.com/travelliniwithus/',
    mediaType: 'reel',
    cover: '',
    hook: 'Hook di prova?',
    title: `Titolo ${overrides.id}`,
    description: 'Descrizione di prova.',
    place: { name: 'Posto di prova', country: 'Italia' },
    zone: 'Italia',
    types: ['Posti particolari'],
    partnership: { kind: 'organic' },
    isPlaceholder: false,
    ...overrides,
  };
}

function renderCard(item: ContentItem) {
  return render(
    <BrowserRouter>
      <QuickViewProvider>
        <ContentCard item={item} />
      </QuickViewProvider>
    </BrowserRouter>
  );
}

describe("ContentCard — trattamento onesto dei placeholder (no promesse su contenuto che non c'è)", () => {
  it('un posto reale con cover mostra la CTA "Apri la scheda"', () => {
    const item = makeItem({
      id: 'real',
      isPlaceholder: false,
      cover: '/images/real.webp',
      permalink: 'https://www.instagram.com/reel/DZWo5OTM_Cw/',
    });
    renderCard(item);
    expect(screen.getByText('Apri la scheda')).toBeInTheDocument();
    expect(screen.queryByText('In arrivo')).not.toBeInTheDocument();
  });

  it('un placeholder col permalink ridotto al profilo mostra "In arrivo" e "Scheda in arrivo", mai "Apri la scheda"', () => {
    const item = makeItem({
      id: 'placeholder-senza-reel',
      isPlaceholder: true,
      cover: '',
      permalink: 'https://www.instagram.com/travelliniwithus/',
    });
    renderCard(item);
    expect(screen.getByText('In arrivo')).toBeInTheDocument();
    expect(screen.getByText('Scheda in arrivo')).toBeInTheDocument();
    expect(screen.queryByText('Apri la scheda')).not.toBeInTheDocument();
  });

  it('un placeholder che ha già un reel specifico collegato (manca solo la cover) mantiene "Apri la scheda"', () => {
    const item = makeItem({
      id: 'placeholder-con-reel',
      isPlaceholder: true,
      cover: '',
      permalink: 'https://www.instagram.com/travelliniwithus/reel/DTw_JBJjBBd/',
    });
    renderCard(item);
    expect(screen.getByText('In arrivo')).toBeInTheDocument();
    expect(screen.getByText('Apri la scheda')).toBeInTheDocument();
    expect(screen.queryByText('Scheda in arrivo')).not.toBeInTheDocument();
  });

  it('un item con cover ma ancora isPlaceholder=true tratta comunque come non pronto (fallback, non foto)', () => {
    const item = makeItem({
      id: 'edge-case',
      isPlaceholder: true,
      cover: '/images/has-cover-but-still-placeholder.webp',
    });
    renderCard(item);
    expect(screen.getByText('In arrivo')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
