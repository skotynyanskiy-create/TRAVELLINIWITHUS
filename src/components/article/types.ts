import React from 'react';

export interface ArticleData {
  title: string;
  description: string;
  image: string;
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
  mapMarkers?: { id: string | number; name: string; coordinates: [number, number]; title?: string; category?: string }[];
  mapCenter?: [number, number];
  mapZoom?: number;
  duration?: string;
  videoUrl?: string;
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
