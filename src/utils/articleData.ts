import type { Timestamp } from 'firebase/firestore';

// TODO(@travelliniwithus): PLACEHOLDER — servono foto default articolo
const DEFAULT_ARTICLE_IMAGE =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop';

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : undefined;

const asTimestamp = (value: unknown) =>
  value && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : undefined;

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
    duration: asString(data.duration) || undefined,
    videoUrl: asString(data.videoUrl) || undefined,
  };
}
