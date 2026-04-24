import type { Timestamp } from 'firebase/firestore';
import type {
  ArticleBudgetBand,
  ArticleDisclosureType,
  ArticleFeaturedPlacement,
  ArticleType,
  HotelRecommendation,
} from '../components/article';
import { ARTICLE_TYPES } from '../components/article';

type ArticleShopCta = {
  productType: 'maps' | 'presets' | 'ebook';
  productUrl: string;
  count?: number;
};

export type { ArticleShopCta };

const SHOP_CTA_PRODUCT_TYPES: readonly ArticleShopCta['productType'][] = [
  'maps',
  'presets',
  'ebook',
];

const DEFAULT_ARTICLE_IMAGE = '/images/hero-amalfi.png';

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : undefined;

const asTimestamp = (value: unknown) =>
  value && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : undefined;

const asEnum = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  return allowed.includes(value as T) ? (value as T) : undefined;
};

const normalizeArticleType = (value: unknown, category: string): ArticleType => {
  const explicit = asEnum(value, ARTICLE_TYPES);
  if (explicit) return explicit;
  if (value === 'article') return 'guide';
  if (category === 'Itinerari completi' || category === 'Weekend & Day trip') return 'itinerary';
  return 'guide';
};

const normalizeDisclosureType = (value: unknown): ArticleDisclosureType | undefined => {
  const explicit = asEnum(value, ['none', 'affiliate', 'sponsored', 'gifted', 'partner']);
  if (explicit) return explicit;

  if (value === 'Affiliazioni') return 'affiliate';
  if (value === 'Ospitati') return 'gifted';
  if (value === 'Pagato') return 'sponsored';
  if (value === 'Viaggio personale') return 'none';
  return undefined;
};

const inferBudgetBand = (value: string): ArticleBudgetBand | undefined => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (normalized.includes('econom') || normalized.includes('basso') || normalized.includes('low')) {
    return 'Economico';
  }

  if (
    normalized.includes('alto') ||
    normalized.includes('lusso') ||
    normalized.includes('premium')
  ) {
    return 'Alto';
  }

  if (normalized.includes('medio') || normalized.includes('standard')) {
    return 'Medio';
  }

  return undefined;
};

type NumberTuple = [number, number];
type ArticleMapMarker = {
  id: string | number;
  name: string;
  coordinates: NumberTuple;
  title?: string;
  category?: string;
};

const asNumberTuple = (value: unknown): NumberTuple | undefined => {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    !value.every((item) => typeof item === 'number')
  ) {
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
    .map((item) =>
      item && typeof item === 'object' ? mapper(item as Record<string, unknown>) : null
    )
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
  type: ArticleType;
  published: boolean;
  author?: string;
  authorId?: string;
  date?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  location: string;
  period: string;
  budget: string;
  budgetBand?: ArticleBudgetBand;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  experienceTypes?: string[];
  tripIntents?: string[];
  readTime?: string;
  verifiedAt?: Timestamp;
  disclosureType?: ArticleDisclosureType;
  featuredPlacement?: ArticleFeaturedPlacement | null;
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
  hotels?: HotelRecommendation[];
  shopCta?: ArticleShopCta;
}

const asHotelArray = (value: unknown): HotelRecommendation[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const hotels: HotelRecommendation[] = [];

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const name = asString(record.name);
    const image = asString(record.image);
    const bookingUrl = asString(record.bookingUrl);

    if (!name || !image || !bookingUrl) continue;

    const hotel: HotelRecommendation = { name, image, bookingUrl };
    const category = asString(record.category);
    const priceHint = asString(record.priceHint);
    const badge = asString(record.badge);

    if (category) hotel.category = category;
    if (priceHint) hotel.priceHint = priceHint;
    if (badge) hotel.badge = badge;
    if (typeof record.rating === 'number') hotel.rating = record.rating;

    hotels.push(hotel);
  }

  return hotels.length > 0 ? hotels : undefined;
};

const asShopCta = (value: unknown): ArticleShopCta | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const productType = record.productType;
  const productUrl = asString(record.productUrl);

  if (
    typeof productType !== 'string' ||
    !SHOP_CTA_PRODUCT_TYPES.includes(productType as ArticleShopCta['productType'])
  ) {
    return undefined;
  }
  if (!productUrl) return undefined;

  const cta: ArticleShopCta = {
    productType: productType as ArticleShopCta['productType'],
    productUrl,
  };

  if (typeof record.count === 'number') cta.count = record.count;
  return cta;
};

export function normalizeFirestoreArticle(
  id: string,
  data: Record<string, unknown>
): NormalizedArticle {
  const title = asString(data.title) || 'Articolo Travelliniwithus';
  const slug = asString(data.slug) || id;
  const excerpt = asString(data.excerpt);
  const description =
    asString(data.description) ||
    excerpt ||
    'Guida e ispirazione di viaggio firmata Travelliniwithus.';
  const coverImage = asString(data.coverImage) || asString(data.image) || DEFAULT_ARTICLE_IMAGE;
  const image = asString(data.image) || coverImage;
  const category = asString(data.category) || 'Guide';
  const country = asString(data.country) || undefined;
  const region = asString(data.region) || undefined;
  const city = asString(data.city) || undefined;
  const continent = asString(data.continent) || undefined;
  const budget = asString(data.budget) || 'Da definire';
  const location =
    asString(data.location) ||
    [country, region, city].filter(Boolean).join(', ') ||
    region ||
    continent ||
    'Destinazione';
  const createdAt = asTimestamp(data.createdAt);
  const updatedAt = asTimestamp(data.updatedAt);
  const verifiedAt = asTimestamp(data.verifiedAt);
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
    type: normalizeArticleType(data.type, category),
    published: data.published === true,
    author: asString(data.author) || undefined,
    authorId: asString(data.authorId) || undefined,
    date,
    createdAt,
    updatedAt,
    verifiedAt,
    location,
    period: asString(data.period) || 'Tutto l anno',
    budget,
    budgetBand: asEnum(data.budgetBand, ['Economico', 'Medio', 'Alto']) ?? inferBudgetBand(budget),
    country,
    region,
    city,
    continent,
    experienceTypes: asStringArray(data.experienceTypes),
    tripIntents: asStringArray(data.tripIntents) ?? asStringArray(data.experienceTypes),
    readTime: asString(data.readTime) || undefined,
    disclosureType: normalizeDisclosureType(data.disclosureType),
    featuredPlacement:
      asEnum(data.featuredPlacement, ['home-flagship', 'hub-destination', 'hub-experience']) ??
      null,
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
    hotels: asHotelArray(data.hotels),
    shopCta: asShopCta(data.shopCta),
  };
}
