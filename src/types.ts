export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  published?: boolean;
  imageUrl?: string;
  category: string;
  isDigital?: boolean;
  downloadUrl?: string;
  isBestseller?: boolean;
  description?: string;
  features?: string[];
  gallery?: string[];
  specifications?: Record<string, string>;
  relatedProductIds?: string[];
  reviews?: {
    rating: number;
    comment: string;
    author: string;
  }[];
}

export interface Itinerary {
  id: string;
  slug: string;
  title: string;
  destination: string;
  region: string;
  continent: string;
  duration: string;
  durationDays: number;
  period: string;
  budget: string;
  budgetTier: 'lean' | 'medium' | 'premium';
  style: string;
  image: string;
  excerpt: string;
  highlights: string[];
  stages: { day: number; title: string; description: string; sleep?: string }[];
  costs?: { label: string; range: string }[];
  bestFor?: string[];
  notFor?: string[];
  relatedArticleSlug?: string;
  relatedGuideSlug?: string;
  isDemo?: boolean;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  category: string;
  price: number;
  pages: number;
  format: string;
  language: string;
  coverImage?: string;
  previewImages?: string[];
  excerpt: string;
  inside: string[];
  bestFor: string[];
  updatedAt: string;
  bundleProductId?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  isDemo?: boolean;
}
