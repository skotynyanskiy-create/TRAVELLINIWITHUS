import { describe, it, expect } from 'vitest';
import {
  buildFilterQuery,
  parseDiscoveryFilters,
  filterByScope,
  type DiscoveryFilters,
} from './discoveryQuery';
import type { ArchiveItem } from './contentArchive';

// Minimal stub item factory
function makeItem(overrides: Partial<ArchiveItem> = {}): ArchiveItem {
  return {
    id: 'test-1',
    title: 'Guida al Salento',
    excerpt: 'Tutto sul Salento.',
    image: '/img/salento.webp',
    link: '/articolo/salento',
    category: 'Guida',
    location: 'Puglia',
    destinationGroup: 'Italia',
    experienceTypes: ['Posti particolari'],
    ...overrides,
  };
}

describe('buildFilterQuery → parseDiscoveryFilters round-trip', () => {
  it('round-trips zone filter', () => {
    const filters: DiscoveryFilters = { zone: 'Italia' };
    const qs = buildFilterQuery(filters);
    const params = new URLSearchParams(qs);
    const parsed = parseDiscoveryFilters(params);
    expect(parsed.zone).toBe('Italia');
  });

  it('round-trips type filter', () => {
    const filters: DiscoveryFilters = { type: 'Posti particolari' };
    const qs = buildFilterQuery(filters);
    const params = new URLSearchParams(qs);
    const parsed = parseDiscoveryFilters(params);
    expect(parsed.type).toBe('Posti particolari');
  });

  it('round-trips search filter', () => {
    const filters: DiscoveryFilters = { search: 'puglia' };
    const qs = buildFilterQuery(filters);
    const params = new URLSearchParams(qs);
    const parsed = parseDiscoveryFilters(params);
    expect(parsed.search).toBe('puglia');
  });

  it('produces empty string when no filters set', () => {
    const qs = buildFilterQuery({});
    expect(qs).toBe('');
  });
});

describe('filterByScope', () => {
  const items = [
    makeItem({ id: '1', destinationGroup: 'Italia', experienceTypes: ['Posti particolari'] }),
    makeItem({ id: '2', destinationGroup: 'Europa', experienceTypes: ['Food & Ristoranti'] }),
    makeItem({
      id: '3',
      title: 'Marocco avventura',
      destinationGroup: 'Africa',
      experienceTypes: ['Insolito'],
    }),
  ];

  it('returns all items when no filters set', () => {
    expect(filterByScope(items, {})).toHaveLength(3);
  });

  it('filters by zone', () => {
    const result = filterByScope(items, { zone: 'Italia' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by type', () => {
    const result = filterByScope(items, { type: 'Food & Ristoranti' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by search matching title', () => {
    const result = filterByScope(items, { search: 'marocco' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns empty array when no items match', () => {
    const result = filterByScope(items, { zone: 'Oceania' });
    expect(result).toHaveLength(0);
  });
});
