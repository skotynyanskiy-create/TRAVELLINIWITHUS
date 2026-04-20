import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CONTACTS, SITE_URL } from '../config/site';

type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleSchemaInput {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  url: string;
  /** Categoria editoriale (es. "Guida destinazione", "Itinerario"). Aiuta Google a classificare il contenuto. */
  articleSection?: string;
  /** Parole chiave editoriali. Lista corta e pertinente (5-10 termini). */
  keywords?: string[];
  /** Conteggio parole approssimato — segnale di depth per Helpful Content. */
  wordCount?: number;
  /** Entita Wikipedia/Wikidata o schema.org di cui parla l'articolo (es. Place). */
  about?: Array<{ name: string; sameAs?: string }>;
}

export interface GeoCoordinatesInput {
  latitude: number;
  longitude: number;
}

export interface TouristDestinationSchemaInput {
  /** Nome della destinazione (es. "Dolomiti di Brenta"). */
  name: string;
  description: string;
  url: string;
  image?: string;
  /** Coordinate geografiche — abilita rich results mappe. */
  geo?: GeoCoordinatesInput;
  /** Regione/nazione contenente (es. "Trentino", "Italia"). */
  containedInPlace?: string;
  /** Tipo di viaggiatore target (es. "Coppie", "Slow travellers"). */
  touristType?: string[];
}

export interface TripStop {
  name: string;
  description?: string;
  url?: string;
}

export interface ItinerarySchemaInput {
  /** Nome dell'itinerario (es. "Lisbona in 4 giorni slow"). */
  name: string;
  description: string;
  url: string;
  image?: string;
  /** Durata ISO 8601 (es. "P4D" per 4 giorni). */
  duration?: string;
  /** Tappe in ordine cronologico. */
  stops?: TripStop[];
}

export interface ReviewSchemaInput {
  /** Oggetto recensito. */
  itemReviewed: {
    name: string;
    type?: 'LodgingBusiness' | 'Restaurant' | 'TouristAttraction' | 'Place' | 'Product';
  };
  reviewBody: string;
  authorName?: string;
  /** Rating 1-5 — opzionale, usa solo se recensione reale con valutazione. */
  rating?: { value: number; best?: number; worst?: number };
  datePublished?: string;
}

export interface ProductSchemaInput {
  name: string;
  description?: string;
  image?: string;
  /** URL canonico del prodotto. */
  url: string;
  /** Prezzo in valore numerico puro (es. 29.00). */
  price: number;
  /** ISO currency (default 'EUR'). */
  currency?: string;
  /** Stato disponibilita schema.org. 'PreOrder' finche lo shop non apre. */
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock' | 'Discontinued';
  category?: string;
  sku?: string;
  brand?: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Breadcrumb trail — emette BreadcrumbList JSON-LD. */
  breadcrumbs?: BreadcrumbItem[];
  /** FAQ items — emette FAQPage JSON-LD. */
  faqs?: FaqItem[];
  /** Quando true, emette LocalBusiness JSON-LD del brand. Usare su home e pagine brand. */
  includeBrandSchema?: boolean;
  /** Dati Article schema per pagina articolo. */
  article?: ArticleSchemaInput;
  /** Schema TouristDestination — pagine guida destinazione. */
  destination?: TouristDestinationSchemaInput;
  /** Schema TouristTrip — pagine itinerario multi-tappa. */
  itinerary?: ItinerarySchemaInput;
  /** Review schema — quando si recensisce hotel, ristorante, luogo. */
  review?: ReviewSchemaInput;
  /** Product schema — pagina singolo prodotto Shop. */
  product?: ProductSchemaInput;
  /** Emette WebSite schema con SearchAction — usare sulla homepage. */
  website?: boolean;
}

const DEFAULT_SITE_NAME = 'Travelliniwithus';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

function brandSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: DEFAULT_SITE_NAME,
    alternateName: 'Travellini With Us',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: DEFAULT_OG_IMAGE,
    description:
      'Travelliniwithus - posti particolari, esperienze reali e consigli di viaggio di Rodrigo & Betta.',
    email: CONTACTS.email,
    telephone: CONTACTS.whatsappDisplay,
    sameAs: [
      CONTACTS.instagramUrl,
      CONTACTS.tiktokUrl,
      CONTACTS.facebookUrl,
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IT',
    },
  };
}

function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqSchema(items: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function articleSchema(article: ArticleSchemaInput): JsonLd {
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: article.authorName
      ? {
          '@type': 'Person',
          name: article.authorName,
        }
      : {
          '@type': 'Organization',
          name: DEFAULT_SITE_NAME,
          url: SITE_URL,
        },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: article.url,
  };
  if (article.articleSection) base.articleSection = article.articleSection;
  if (article.keywords && article.keywords.length > 0) base.keywords = article.keywords.join(', ');
  if (article.wordCount) base.wordCount = article.wordCount;
  if (article.about && article.about.length > 0) {
    base.about = article.about.map((entry) => ({
      '@type': 'Thing',
      name: entry.name,
      ...(entry.sameAs ? { sameAs: entry.sameAs } : {}),
    }));
  }
  return base;
}

function touristDestinationSchema(input: TouristDestinationSchemaInput): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: input.name,
    description: input.description,
    url: input.url,
  };
  if (input.image) schema.image = input.image;
  if (input.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: input.geo.latitude,
      longitude: input.geo.longitude,
    };
  }
  if (input.containedInPlace) {
    schema.containedInPlace = {
      '@type': 'Place',
      name: input.containedInPlace,
    };
  }
  if (input.touristType && input.touristType.length > 0) {
    schema.touristType = input.touristType;
  }
  return schema;
}

function itinerarySchema(input: ItinerarySchemaInput): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: input.name,
    description: input.description,
    url: input.url,
  };
  if (input.image) schema.image = input.image;
  if (input.duration) schema.duration = input.duration;
  if (input.stops && input.stops.length > 0) {
    schema.itinerary = {
      '@type': 'ItemList',
      itemListElement: input.stops.map((stop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Place',
          name: stop.name,
          ...(stop.description ? { description: stop.description } : {}),
          ...(stop.url ? { url: stop.url } : {}),
        },
      })),
    };
  }
  return schema;
}

function productSchema(input: ProductSchemaInput): JsonLd {
  const currency = input.currency ?? 'EUR';
  const availability = input.availability ?? 'InStock';
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    url: input.url,
    offers: {
      '@type': 'Offer',
      price: input.price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: input.url,
    },
    brand: {
      '@type': 'Brand',
      name: input.brand ?? DEFAULT_SITE_NAME,
    },
  };
  if (input.description) schema.description = input.description;
  if (input.image) schema.image = input.image;
  if (input.category) schema.category = input.category;
  if (input.sku) schema.sku = input.sku;
  return schema;
}

function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      'Posti particolari, esperienze memorabili e consigli utili per chi vuole scoprire, salvare e vivere meglio ogni viaggio.',
    inLanguage: 'it-IT',
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SITE_NAME,
      url: SITE_URL,
    },
  };
}

function reviewSchema(input: ReviewSchemaInput): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': input.itemReviewed.type ?? 'Place',
      name: input.itemReviewed.name,
    },
    reviewBody: input.reviewBody,
    author: {
      '@type': 'Person',
      name: input.authorName ?? 'Rodrigo & Betta',
    },
  };
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.rating) {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: input.rating.value,
      bestRating: input.rating.best ?? 5,
      worstRating: input.rating.worst ?? 1,
    };
  }
  return schema;
}

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  breadcrumbs,
  faqs,
  includeBrandSchema = false,
  article,
  destination,
  itinerary,
  review,
  product,
  website = false,
}: SEOProps) {
  const finalTitle = title.toLowerCase().includes(DEFAULT_SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${DEFAULT_SITE_NAME}`;

  const schemas: JsonLd[] = [];
  if (includeBrandSchema) schemas.push(brandSchema());
  if (website) schemas.push(websiteSchema());
  if (breadcrumbs && breadcrumbs.length > 0) schemas.push(breadcrumbSchema(breadcrumbs));
  if (faqs && faqs.length > 0) schemas.push(faqSchema(faqs));
  if (article) schemas.push(articleSchema(article));
  if (destination) schemas.push(touristDestinationSchema(destination));
  if (itinerary) schemas.push(itinerarySchema(itinerary));
  if (review) schemas.push(reviewSchema(review));
  if (product) schemas.push(productSchema(product));

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta name="theme-color" content="#f7f0e5" />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Travelliniwithus - posti particolari, esperienze reali e consigli di viaggio" />
      <meta property="og:locale" content="it_IT" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={CONTACTS.instagramHandle} />
      <meta name="twitter:creator" content={CONTACTS.instagramHandle} />
      {canonical && <link rel="canonical" href={canonical} />}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
