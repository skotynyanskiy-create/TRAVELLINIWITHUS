import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FamilyEntry } from '@/src/types/family';
import HomeFamilyPicks from './HomeFamilyPicks';

let selectedInterest: 'gravidanza' | 'essenziali-family' | null = null;

const entries: FamilyEntry[] = [
  {
    id: 'pregnancy',
    title: 'Gravidanza',
    hook: 'Cosa sapere in gravidanza',
    excerpt: 'Un consiglio sulla gravidanza.',
    cover: '/images/pregnancy.webp',
    coverAlt: 'Gravidanza',
    category: 'gravidanza',
    partnership: { kind: 'organic' },
    sourceUrl: 'https://instagram.com/p/pregnancy',
    isPlaceholder: false,
  },
  {
    id: 'packing',
    title: 'Zaino family',
    hook: 'Cosa mettere nello zaino',
    excerpt: 'Un consiglio pratico.',
    cover: '/images/packing.webp',
    coverAlt: 'Zaino family',
    category: 'zaino-family',
    partnership: { kind: 'organic' },
    sourceUrl: 'https://instagram.com/p/packing',
    isPlaceholder: false,
  },
];

vi.mock('@/src/config/familyLibrary', () => ({
  getFamilyEntries: () => entries,
}));

vi.mock('@/src/hooks/usePersonalizedInterest', () => ({
  usePersonalizedInterest: () => ({ interest: selectedInterest, source: null }),
}));

vi.mock('@/src/components/Section', () => ({
  default: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}));

vi.mock('@/src/components/TransitionLink', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="/family/consigli">{children}</a>,
}));

vi.mock('@/src/components/family/FamilyEntryCard', () => ({
  default: ({ entry }: { entry: FamilyEntry }) => (
    <article data-testid="family-entry">{entry.id}</article>
  ),
}));

afterEach(() => {
  cleanup();
  selectedInterest = null;
});

describe('HomeFamilyPicks', () => {
  it('mette in testa un consiglio coerente con l’interesse Family scelto', () => {
    selectedInterest = 'essenziali-family';

    render(<HomeFamilyPicks />);

    expect(screen.getAllByTestId('family-entry').map((entry) => entry.textContent)).toEqual([
      'packing',
      'pregnancy',
    ]);
  });
});
