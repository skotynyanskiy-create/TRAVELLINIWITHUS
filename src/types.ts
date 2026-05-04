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

// --- Magazine content model ---

import type {
  ContentType,
  TravelStyle,
  DurationRange,
  Season,
  BudgetBand,
} from './config/travelFilters';

/** Extended article metadata for the magazine platform */
export interface ArticleMeta {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  contentType: ContentType;
  country?: string;
  region?: string;
  city?: string;
  heroImage?: string;
  excerpt?: string;
  travelStyles?: TravelStyle[];
  duration?: DurationRange;
  season?: Season[];
  budget?: BudgetBand;
  verifiedAt?: string;
  disclosureType?: DisclosureType;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  featured?: boolean;
  published?: boolean;
}

/** Single day in an itinerary */
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  transport?: string;
  accommodation?: string;
  meals?: string[];
  tips?: string[];
  estimatedCost?: string;
  mapCoordinates?: { lat: number; lng: number };
}

/** Full itinerary content */
export interface Itinerary extends ArticleMeta {
  contentType: 'itinerary';
  days: ItineraryDay[];
  totalBudget?: string;
  bestPeriod?: string;
  packingEssentials?: string[];
  googleMapsUrl?: string;
  pdfUrl?: string;
  relatedItineraries?: string[];
}

/** Travel planner consultation package */
export interface TravelPlannerPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
}
