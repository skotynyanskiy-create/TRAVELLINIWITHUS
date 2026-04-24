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

export type DisclosureType = 'none' | 'affiliate' | 'sponsored' | 'gifted' | 'partner';

export interface HotelEntry {
  id: string;
  slug: string;
  title?: string;
  name: string;
  description?: string;
  destination: string;
  destinationSlug: string;
  destinationHref: string;
  country: string;
  region?: string;
  area?: string;
  category: string;
  heroImage?: string;
  image: string;
  gallery?: string[];
  bookingUrl: string;
  priceHint?: string;
  budgetBand?: 'Economico' | 'Medio' | 'Alto';
  rating?: number;
  badge?: string;
  summary: string;
  fit: string;
  idealFor: string[];
  pros: string[];
  cons: string[];
  affiliateDisclosure?: DisclosureType;
  verifiedAt?: unknown;
  editorialNote: string;
  relatedGuideHref?: string;
  relatedArticles?: string[];
  mapLabel?: string;
  published?: boolean;
  isFallback?: boolean;
}
