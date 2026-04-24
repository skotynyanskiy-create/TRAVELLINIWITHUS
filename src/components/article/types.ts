import React from 'react';

export const ARTICLE_BUDGET_BANDS = ['Economico', 'Medio', 'Alto'] as const;
export const ARTICLE_DISCLOSURE_TYPES = [
  'none',
  'affiliate',
  'sponsored',
  'gifted',
  'partner',
] as const;
export const ARTICLE_FEATURED_PLACEMENTS = [
  'home-flagship',
  'hub-destination',
  'hub-experience',
] as const;
export const ARTICLE_TYPES = ['pillar', 'guide', 'itinerary'] as const;
export const ARTICLE_EDITORIAL_FORMATS = ['guide', 'itinerary'] as const;

export type ArticleBudgetBand = (typeof ARTICLE_BUDGET_BANDS)[number];
export type ArticleDisclosureType = (typeof ARTICLE_DISCLOSURE_TYPES)[number];
export type ArticleFeaturedPlacement = (typeof ARTICLE_FEATURED_PLACEMENTS)[number];
export type ArticleType = (typeof ARTICLE_TYPES)[number];
export type ArticleEditorialFormat = (typeof ARTICLE_EDITORIAL_FORMATS)[number];

export const ARTICLE_DISCLOSURE_LABELS: Record<ArticleDisclosureType, string> = {
  none: 'Viaggio personale',
  affiliate: 'Link affiliati',
  sponsored: 'Sponsorizzato',
  gifted: 'Ospitato / gifted',
  partner: 'Partner editoriale',
};

export interface ArticleData {
  title: string;
  description: string;
  image: string;
  category: string;
  /** 'pillar' flagship, 'guide' pratica standard, 'itinerary' itinerario. Default 'guide'. */
  type?: ArticleType;
  date: string;
  updatedAt?: unknown;
  verifiedAt?: unknown;
  author?: string;
  readTime?: string;
  location: string;
  period: string;
  budget: string;
  budgetBand?: ArticleBudgetBand;
  continent?: string;
  tripIntents?: string[];
  disclosureType?: ArticleDisclosureType;
  featuredPlacement?: ArticleFeaturedPlacement | null;
  content: React.ReactNode | string;
  isMarkdown?: boolean;
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
  hotels?: HotelRecommendation[];
  shopCta?: { productType: 'maps' | 'presets' | 'ebook'; productUrl: string; count?: number };
}

export interface HotelRecommendation {
  name: string;
  image: string;
  bookingUrl: string;
  slug?: string;
  category?: string;
  rating?: number;
  priceHint?: string;
  badge?: string;
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
