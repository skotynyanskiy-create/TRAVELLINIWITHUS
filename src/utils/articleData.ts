import type { Timestamp } from 'firebase/firestore';

const DEFAULT_ARTICLE_IMAGE = '/images/hero-amalfi.png';

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : undefined;

const asTimestamp = (value: unknown) =>
  value && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : undefined;

type NumberTuple = [number, number];
type ArticleMapMarker = {
  id: string | number;
  name: string;
  coordinates: NumberTuple;
  title?: string;
  category?: string;
};

const asNumberTuple = (value: unknown): NumberTuple | undefined => {
  if (!Array.isArray(value) || value.length !== 2 || !value.every((item) => typeof item === 'number')) {
    return undefined;
  }

  return [value[0], value[1]];
};

const asMarkerArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const markers: ArticleMapMarker[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const marker = item as Record<string, unknown>;
    const coordinates = asNumberTuple(marker.coordinates);
    const name = asString(marker.name);

    if (!coordinates || !name) {
      continue;
    }

    const markerData: ArticleMapMarker = {
      id: typeof marker.id === 'string' || typeof marker.id === 'number' ? marker.id : name,
      name,
      coordinates,
    };

    const title = asString(marker.title);
    const category = asString(marker.category);

    if (title) {
      markerData.title = title;
    }

    if (category) {
      markerData.category = category;
    }

    markers.push(markerData);
  }

  return markers.length > 0 ? markers : undefined;
};

const asObjectArray = <T>(value: unknown, mapper: (item: Record<string, unknown>) => T | null) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((item) => (item && typeof item === 'object' ? mapper(item as Record<string, unknown>) : null))
    .filter((item): item is T => item !== null);

  return items.length > 0 ? items : undefined;
};

export interface NormalizedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  content: string;
  image: string;
  coverImage: string;
  category: string;
  published: boolean;
  author?: string;
  authorId?: string;
  date?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  location: string;
  period: string;
  budget: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  experienceTypes?: string[];
  readTime?: string;
  isMarkdown: boolean;
  tips?: string[];
  packingList?: string[];
  gallery?: string[];
  highlights?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  costs?: { alloggio?: string; cibo?: string; trasporti?: string; attivita?: string };
  seasonality?: { month: string; rating: number }[];
  hiddenGems?: { title: string; description: string }[];
  localFood?: { name: string; description: string; image?: string }[];
  mapUrl?: string;
  mapMarkers?: ArticleMapMarker[];
  mapCenter?: NumberTuple;
  mapZoom?: number;
  duration?: string;
  videoUrl?: string;
}

export function normalizeFirestoreArticle(id: string, data: Record<string, unknown>): NormalizedArticle {
  const title = asString(data.title) || 'Articolo Travelliniwithus';
  const slug = asString(data.slug) || id;
  const excerpt = asString(data.excerpt);
  const description = asString(data.description) || excerpt || 'Guida e ispirazione di viaggio firmata Travelliniwithus.';
  const coverImage = asString(data.coverImage) || asString(data.image) || DEFAULT_ARTICLE_IMAGE;
  const image = asString(data.image) || coverImage;
  const category = asString(data.category) || 'Guide';
  const country = asString(data.country) || undefined;
  const region = asString(data.region) || undefined;
  const city = asString(data.city) || undefined;
  const continent = asString(data.continent) || undefined;
  const location =
    asString(data.location) ||
    [country, region, city].filter(Boolean).join(', ') ||
    region ||
    continent ||
    'Destinazione';
  const createdAt = asTimestamp(data.createdAt);
  const updatedAt = asTimestamp(data.updatedAt);
  const date =
    createdAt?.toDate?.()?.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) || undefined;

  return {
    id,
    title,
    slug,
    excerpt,
    description,
    content: asString(data.content),
    image,
    coverImage,
    category,
    published: data.published === true,
    author: asString(data.author) || undefined,
    authorId: asString(data.authorId) || undefined,
    date,
    createdAt,
    updatedAt,
    location,
    period: asString(data.period) || 'Tutto l anno',
    budget: asString(data.budget) || 'Da definire',
    country,
    region,
    city,
    continent,
    experienceTypes: asStringArray(data.experienceTypes),
    readTime: asString(data.readTime) || undefined,
    isMarkdown: true,
    tips: asStringArray(data.tips),
    packingList: asStringArray(data.packingList),
    gallery: asStringArray(data.gallery),
    highlights: asStringArray(data.highlights),
    itinerary: asObjectArray(data.itinerary, (item) => {
      const titleValue = asString(item.title);
      const descriptionValue = asString(item.description);

      if (!titleValue || !descriptionValue || typeof item.day !== 'number') {
        return null;
      }

      return {
        day: item.day,
        title: titleValue,
        description: descriptionValue,
      };
    }),
    costs:
      data.costs && typeof data.costs === 'object'
        ? {
            alloggio: asString((data.costs as Record<string, unknown>).alloggio) || undefined,
            cibo: asString((data.costs as Record<string, unknown>).cibo) || undefined,
            trasporti: asString((data.costs as Record<string, unknown>).trasporti) || undefined,
            attivita: asString((data.costs as Record<string, unknown>).attivita) || undefined,
          }
        : undefined,
    seasonality: asObjectArray(data.seasonality, (item) => {
      const month = asString(item.month);
      if (!month || typeof item.rating !== 'number') {
        return null;
      }

      return {
        month,
        rating: item.rating,
      };
    }),
    hiddenGems: asObjectArray(data.hiddenGems, (item) => {
      const titleValue = asString(item.title);
      const descriptionValue = asString(item.description);

      if (!titleValue || !descriptionValue) {
        return null;
      }

      return {
        title: titleValue,
        description: descriptionValue,
      };
    }),
    localFood: asObjectArray(data.localFood, (item) => {
      const name = asString(item.name);
      const descriptionValue = asString(item.description);

      if (!name || !descriptionValue) {
        return null;
      }

      return {
        name,
        description: descriptionValue,
        image: asString(item.image) || undefined,
      };
    }),
    mapUrl: asString(data.mapUrl) || undefined,
    mapMarkers: asMarkerArray(data.mapMarkers),
    mapCenter: asNumberTuple(data.mapCenter),
    mapZoom: typeof data.mapZoom === 'number' ? data.mapZoom : undefined,
    duration: asString(data.duration) || undefined,
    videoUrl: asString(data.videoUrl) || undefined,
  };
}
