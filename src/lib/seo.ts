import { SITE_URL } from '../config/site';

export interface ArticleSchemaInput {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  gallery?: string[];
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags?: string[];
  authors?: Array<{ name: string; url?: string; sameAs?: string[] }>;
  /** Numero parole articolo (per Article.wordCount). Marathon FASE 1.D 2026-05-17. */
  wordCount?: number;
  /** Place entity di cui l'articolo parla (Article.about). */
  about?: PlaceEntity | PlaceEntity[];
  /** Place entities citate ma non focus principale (Article.mentions). */
  mentions?: PlaceEntity[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Place entity per Article.about / Article.mentions.
 *
 * Marathon FASE 1.D 2026-05-17 (Entity layer per AI search citation).
 * Usare Wikidata Q-ID quando disponibile per disambiguazione cross-LLM.
 */
export interface PlaceEntity {
  /** Nome localita (es. "Otranto") */
  name: string;
  /** URL Wikidata (es. "https://www.wikidata.org/wiki/Q121234") */
  wikidataUrl?: string;
  /** Coordinate geografiche se applicabili */
  geo?: { latitude: number; longitude: number };
  /** Tipo Place (es. "City", "TouristAttraction", "Country") */
  placeType?:
    | 'City'
    | 'Country'
    | 'AdministrativeArea'
    | 'TouristAttraction'
    | 'Beach'
    | 'Mountain'
    | 'LakeBodyOfWater'
    | 'LandmarksOrHistoricalBuildings';
  /** Indirizzo se ristorante/hotel */
  address?: string;
}

function buildPlaceJsonLd(place: PlaceEntity) {
  return {
    '@type': place.placeType ?? 'Place',
    name: place.name,
    ...(place.wikidataUrl ? { sameAs: [place.wikidataUrl] } : {}),
    ...(place.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.geo.latitude,
            longitude: place.geo.longitude,
          },
        }
      : {}),
    ...(place.address ? { address: place.address } : {}),
  };
}

/**
 * Person schema per Rodrigo & Betta con autorita strutturata.
 * Marathon FASE 1.D 2026-05-17 — Author authority per AI citation.
 */
export function buildAuthorPersonJsonLd(
  name: 'Rodrigo' | 'Betta',
  options?: { jobTitle?: string }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#${name.toLowerCase()}`,
    name,
    url: `${SITE_URL}/chi-siamo`,
    sameAs: [
      'https://www.instagram.com/travelliniwithus/',
      'https://www.tiktok.com/@travellini.withus',
      'https://www.facebook.com/travelwithuss/',
    ],
    jobTitle: options?.jobTitle ?? 'Travel creator e autore editoriale',
    nationality: 'IT',
    knowsLanguage: ['it', 'en'],
    knowsAbout: [
      'viaggi in Italia',
      'destinazioni Sud Italia',
      'borghi italiani',
      'Salento',
      'Sicilia',
      'Dolomiti',
      'travel editorial',
      'itinerari di coppia',
      'hotel boutique',
      'guide pratiche viaggio',
    ],
    worksFor: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Travelliniwithus',
    },
  };
}

const DEFAULT_AUTHORS = [
  {
    name: 'Rodrigo',
    url: `${SITE_URL}/chi-siamo`,
    sameAs: [
      'https://www.instagram.com/travelliniwithus/',
      'https://www.tiktok.com/@travellini.withus',
      'https://www.facebook.com/travelwithuss/',
    ],
  },
  {
    name: 'Betta',
    url: `${SITE_URL}/chi-siamo`,
    sameAs: [
      'https://www.instagram.com/travelliniwithus/',
      'https://www.tiktok.com/@travellini.withus',
      'https://www.facebook.com/travelwithuss/',
    ],
  },
];

function toAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function buildArticleJsonLd(article: ArticleSchemaInput) {
  const canonical = `${SITE_URL}/articolo/${article.slug}`;
  const images = [article.coverImage, ...(article.gallery ?? [])]
    .filter(Boolean)
    .map(toAbsoluteUrl);
  const authors = (article.authors ?? DEFAULT_AUTHORS).map((author) => ({
    '@type': 'Person' as const,
    name: author.name,
    url: author.url ?? `${SITE_URL}/chi-siamo`,
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  }));

  // Marathon FASE 1.D 2026-05-17 — entity layer per AI citation
  const aboutEntities = article.about
    ? Array.isArray(article.about)
      ? article.about.map(buildPlaceJsonLd)
      : [buildPlaceJsonLd(article.about)]
    : undefined;
  const mentionEntities = article.mentions?.map(buildPlaceJsonLd);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.slice(0, 110),
    description: article.excerpt,
    image: images,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: authors,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Travelliniwithus',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/pwa-512x512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    articleSection: article.category,
    inLanguage: 'it-IT',
    ...(article.tags && article.tags.length > 0 ? { keywords: article.tags.join(', ') } : {}),
    ...(article.wordCount ? { wordCount: article.wordCount } : {}),
    ...(aboutEntities ? { about: aboutEntities } : {}),
    ...(mentionEntities && mentionEntities.length > 0 ? { mentions: mentionEntities } : {}),
    /* Speakable: prima 2 sezioni leggibili da assistente vocale */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-body > p:first-of-type', '.article-body > p:nth-of-type(2)'],
    },
    url: canonical,
  };
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
