import React from 'react';
import type { PartnershipKind } from '@/src/types/content';

export interface ArticleData {
  title: string;
  description: string;
  image: string;
  /** Trasparenza partnership (AGCOM/IAP) — assente = organico, nessun badge mostrato. */
  partnership?: { kind: PartnershipKind; partner?: string };
  /** Alt descrittivo dell'immagine di copertina. Se assente, fallback su luogo + categoria
      (evita di duplicare l'H1 per gli screen reader). */
  imageAlt?: string;
  /** Card OG fotografica dedicata (1200x630), se diversa dalla coverImage —
      vedi `Articolo.tsx` ogImage/SEO.tsx: senza, gli unfurl social userebbero
      la coverImage grezza invece di una card composta con testo/wordmark. */
  ogImage?: string;
  category: string;
  date: string;
  updatedAt?: unknown;
  author?: string;
  readTime?: string;
  location: string;
  period: string;
  budget: string;
  continent?: string;
  content: React.ReactNode | string;
  isMarkdown?: boolean;
  /** Flag di contenuto: presenza di beat = variante Diario attiva. Assente/vuoto = degrado pulito. */
  diary?: DiaryBeat[];
  tips?: string[];
  packingList?: string[];
  gallery?: string[];
  highlights?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  costs?: { alloggio: string; cibo: string; trasporti: string; attivita: string };
  seasonality?: { month: string; rating: number }[];
  hiddenGems?: { title: string; description: string }[];
  localFood?: { name: string; description: string; image?: string }[];
  gear?: { title: string; description: string; link: string; image: string; cta?: string }[];
  mapUrl?: string;
  mapMarkers?: {
    id: string | number;
    name: string;
    coordinates: [number, number];
    title?: string;
    category?: string;
  }[];
  mapCenter?: [number, number];
  mapZoom?: number;
  duration?: string;
  videoUrl?: string;
}

/**
 * Un "beat" del Diario: registro emotivo/narrativo del viaggio, distinto
 * dall'Itinerario leggibile (che resta la logistica). Titolo concreto del
 * viaggio reale, mai etichette generiche ("Partenza/Tramonto/Sosta").
 */
export interface DiaryBeat {
  id: string;
  title: string;
  text: string;
  image: {
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
  };
  /** Marca i beat con Rodrigo & Betta reali nel frame (requisito people-led). */
  peopleInFrame?: boolean;
}

export interface RelatedArticleSummary {
  id: string;
  title: string;
  image: string;
  category: string;
  date?: string;
  continent?: string;
}

export interface TocItem {
  id: string;
  label: string;
  show: boolean;
}
