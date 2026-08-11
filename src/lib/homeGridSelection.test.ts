import { describe, it, expect } from 'vitest';
import { selectHomeGridItems } from './homeGridSelection';
import { CONTENT_ITEMS } from '../config/contentLibrary';
import type { ContentItem } from '../types/content';

function makeItem(overrides: Partial<ContentItem> & { id: string }): ContentItem {
  return {
    source: 'instagram',
    permalink: `https://instagram.com/p/${overrides.id}`,
    mediaType: 'post',
    cover: `/images/${overrides.id}.webp`,
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

describe('selectHomeGridItems — fixture sintetica', () => {
  it('non restituisce duplicati', () => {
    const pool = [
      makeItem({ id: 'a', types: ['Food & Ristoranti'] }),
      makeItem({ id: 'b', types: ['Hotel con carattere'] }),
      makeItem({ id: 'c', types: ['Insolito'] }),
    ];
    const { items } = selectHomeGridItems(pool, 9);
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('è deterministico su chiamate consecutive con lo stesso pool', () => {
    const pool = [
      makeItem({ id: 'a', types: ['Food & Ristoranti'], publishedAt: '2026-01-01' }),
      makeItem({ id: 'b', types: ['Hotel con carattere'], publishedAt: '2026-02-01' }),
      makeItem({ id: 'c', types: ['Insolito'], publishedAt: '2026-03-01' }),
      makeItem({ id: 'd', types: ['Insolito'], publishedAt: '2026-04-01' }),
    ];
    const first = selectHomeGridItems(pool, 9);
    const second = selectHomeGridItems(pool, 9);
    expect(second.items.map((item) => item.id)).toEqual(first.items.map((item) => item.id));
    expect(second.featuredId).toBe(first.featuredId);
  });

  it('featured: true vince come tiebreak e diventa featuredId, a prescindere dalla posizione nell’array', () => {
    const pool = [
      makeItem({ id: 'z-not-featured', types: ['Insolito'], publishedAt: '2026-06-01' }),
      makeItem({
        id: 'a-featured',
        types: ['Insolito'],
        publishedAt: '2026-01-01',
        featured: true,
      }),
      makeItem({ id: 'm-not-featured', types: ['Hotel con carattere'], publishedAt: '2026-05-01' }),
    ];
    const { featuredId } = selectHomeGridItems(pool, 9);
    expect(featuredId).toBe('a-featured');
  });
  it('esclude gli id passati in excludeIds e riempie comunque gli slot con un altro eligibile', () => {
    const pool = [
      makeItem({
        id: 'a-best',
        types: ['Food & Ristoranti'],
        publishedAt: '2026-03-01',
      }),
      makeItem({
        id: 'a-second',
        types: ['Food & Ristoranti'],
        publishedAt: '2026-01-01',
      }),
      makeItem({ id: 'b', types: ['Hotel con carattere'], publishedAt: '2026-02-01' }),
    ];
    const { items } = selectHomeGridItems(pool, 9, ['a-best']);
    const ids = items.map((item) => item.id);
    expect(ids).not.toContain('a-best');
    expect(ids).toContain('a-second');
    expect(ids).toContain('b');
  });

  it('mantiene nella griglia gli id prioritari quando non hanno una sezione dedicata', () => {
    const pool = [
      makeItem({ id: 'a', types: ['Food & Ristoranti'], publishedAt: '2026-03-01' }),
      makeItem({ id: 'b', types: ['Hotel con carattere'], publishedAt: '2026-02-01' }),
      makeItem({ id: 'c', types: ['Insolito'], publishedAt: '2026-01-01' }),
    ];

    const { items } = selectHomeGridItems(pool, 2, [], ['c']);

    expect(items.map((item) => item.id)).toContain('c');
  });

  it('senza item featured, featuredId è null', () => {
    const pool = [
      makeItem({ id: 'a', types: ['Food & Ristoranti'], publishedAt: '2026-01-01' }),
      makeItem({ id: 'b', types: ['Hotel con carattere'], publishedAt: '2026-02-01' }),
    ];
    const { featuredId } = selectHomeGridItems(pool, 9);
    expect(featuredId).toBeNull();
  });
});

describe('selectHomeGridItems — pool reale', () => {
  it('restituisce esattamente 9 item, tutti verificati e con cover', () => {
    const { items } = selectHomeGridItems(CONTENT_ITEMS, 9);
    expect(items).toHaveLength(9);
    for (const item of items) {
      expect(item.isPlaceholder).toBe(false);
      expect(item.cover?.trim()).toBeTruthy();
    }
  });

  it('non contiene duplicati sul pool reale', () => {
    const { items } = selectHomeGridItems(CONTENT_ITEMS, 9);
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nessun item verificato ha featured: true oggi, quindi featuredId è null', () => {
    const { featuredId } = selectHomeGridItems(CONTENT_ITEMS, 9);
    expect(featuredId).toBeNull();
  });
});
