import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import type { FirestoreDocument, FirestoreValue, ProductRecord } from './src/server/types';
import { SENTIERO_STAGES } from './src/experience/sentiero/sentieroData';
import { DESTINATIONS, getDestinationUrl } from './src/config/destinations';
import contentSeed from './src/data/content-seed.json';
import { createSeoRouter } from './src/server/seoRoutes';
import { createApiRouter } from './src/server/apiRoutes';
import {
  LEAD_MAGNET_URL,
  MEDIA_KIT_URL,
  OWNER_EMAIL,
  fetchCouponByCode,
  fetchJson,
  fetchProductAssets,
  fetchProductById,
  fetchProductBySlug,
  firebaseConfig,
  getArray,
  getArticlesCollectionUrl,
  getBoolean,
  getDocumentId,
  getMapFields,
  getString,
  getTimestamp,
  isCheckoutRequestItem,
  saveStripeOrder,
  ssrCache,
  verifyOptionalIdToken,
} from './src/server/data';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null;

interface FirestoreListResponse {
  documents?: FirestoreDocument[];
}

interface FirestoreRunQueryResponse {
  document?: FirestoreDocument;
}

interface ArticleMeta {
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  updatedAt: string | null;
  category: string;
  location: string;
  itinerary: { title: string; description: string }[] | null;
  tips: string[] | null;
}

interface SitemapArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

// Slug delle 30 anteprime editoriali generate da src/config/demoArchive.ts.
// Mantenuto qui statico per evitare di importare client-side modules nel
// server bundle. Aggiornare quando si aggiungono seed a DEMO_ARCHIVE_SEEDS.
const DEMO_PREVIEW_ARTICLE_SLUGS = new Set([
  // Italia (10)
  'salento-agosto-coppia',
  'cilento-mare-italiano',
  'toscana-borghi-nascosti',
  'costiera-amalfitana-fuori-stagione',
  'puglia-trulli-masserie',
  'dolomiti-rifugi-design',
  'sicilia-orientale-5-giorni',
  'sardegna-interna-barbagia',
  'roma-quartieri-fuori-rotta',
  'trentino-spa-weekend',
  // Europa (8)
  'islanda-ring-road',
  'andalusia-4-giorni-coppia',
  'praga-febbraio-coppia',
  'slovenia-8-giorni-slow',
  'cornovaglia-mare-inglese',
  'lisbona-quartieri-locali',
  'croazia-isole-dalmazia',
  'norvegia-fiordi-roadtrip',
  // Asia (5)
  'giappone-14-giorni-itinerario',
  'nord-delle-filippine',
  'vietnam-nord-slow',
  'indonesia-sumba-isola',
  'bali-sud-uluwatu',
  // Americhe (3)
  'patagonia-trek-torres',
  'cuba-strade-musica',
  'messico-yucatan-cenotes',
  // Africa (2)
  'marocco-riad-fes',
  'sudafrica-kruger-safari',
  // Oceania (2)
  'australia-outback-uluru',
  'nuova-zelanda-south-island',
]);

const DEMO_PRODUCT_SLUGS = new Set([
  'guida-premium-dolomiti',
  'guida-premium-giappone',
  'itinerario-puglia',
  'planner-viaggio-islanda',
  'safari-template-sudafrica',
  'weekend-trentino-spa',
]);

// Slug regione validi per /destinazione/:regionSlug (mantenuto in sync con
// src/lib/regions.ts → REGIONS_DATA). Senza questo set, resolveAppStatus
// ritornava 404 ai bot anche se la SPA renderizzava la pagina correttamente.
const REGION_LANDING_SLUGS = new Set([
  'puglia',
  'sicilia',
  'sardegna',
  'toscana',
  'campania',
  'trentino-alto-adige',
]);

// Pathname completi validi dell'albero /destinazione, derivati dalla STESSA
// logica client (getDestinationUrl su DESTINATIONS) per zone/paesi/regioni, piu'
// gli slug regione legacy. Cosi il route-registry SSR resta in sync con la
// taxonomy senza duplicarla: un path fuori da questo set resta 404 ai bot.
const VALID_DESTINATION_PATHS = new Set([
  ...DESTINATIONS.map((node) => getDestinationUrl(node)),
  ...[...REGION_LANDING_SLUGS].map((slug) => `/destinazione/${slug}`),
]);

// Gli id dei posti REALI. Stessa regola di `scripts/generate-route-html.js`
// (`!isPlaceholder`), che genera `dist/posto/<id>/index.html` esattamente per
// questi: se le due liste divergono, il bot riceve uno stato che contraddice
// il file servito.
const REAL_POSTO_IDS = new Set(
  (contentSeed as Array<{ id: string; isPlaceholder?: boolean }>)
    .filter((entry) => !entry.isPlaceholder)
    .map((entry) => entry.id)
);

const LITE_MODE = process.env.VITE_LITE_MODE === 'true';
const LITE_DISABLED_PREFIXES = [
  '/esplora',
  '/itinerari',
  '/shop',
  '/club',
  '/preferiti',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/quiz',
  '/strumenti',
  '/press',
  '/risorse',
  '/futuro',
  '/lead-magnet',
];

function isLiteDisabledPath(pathname: string): boolean {
  if (!LITE_MODE) return false;
  return LITE_DISABLED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`)
  );
}

const ALL_STATIC_APP_ROUTES = [
  '/',
  '/sentiero',
  '/guida-in-regalo',
  '/lead-magnet',
  '/iscrivi',
  '/esplora',
  '/destinazioni',
  '/destinazione',
  '/esperienze',
  '/guide',
  '/itinerari',
  '/quiz',
  '/strumenti',
  '/press',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/family',
  '/family/consigli',
  '/family/shop',
  '/famiglia',
  '/preferiti',
  '/risorse',
  '/shop',
  '/club',
  '/mappa',
  '/account/acquisti',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
  '/admin',
  '/admin/editor',
  '/admin/product-editor',
  '/admin/users',
  '/admin/orders',
  '/admin/site-content',
];

const STATIC_APP_ROUTES = new Set(
  ALL_STATIC_APP_ROUTES.filter((route) => !isLiteDisabledPath(route))
);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?=\s|$)/);
  const sentence = (match ? match[0] : trimmed).trim();
  return sentence.length > 0 ? sentence : trimmed;
}

function mapArticleMeta(fields: Record<string, FirestoreValue>): ArticleMeta {
  const itinerary = getArray(fields, 'itinerary')
    .map((stepValue) => {
      const stepFields = getMapFields(stepValue);
      return {
        title: getString(stepFields, 'title'),
        description: getString(stepFields, 'description'),
      };
    })
    .filter((step) => step.title || step.description);

  const tips = getArray(fields, 'tips')
    .map((tipValue) => tipValue.stringValue)
    .filter((tip): tip is string => typeof tip === 'string' && tip.length > 0);

  return {
    title: getString(fields, 'title'),
    description: getString(fields, 'description') || getString(fields, 'excerpt'),
    image: getString(fields, 'image') || getString(fields, 'coverImage'),
    author: getString(fields, 'author') || 'Travelliniwithus',
    date: getTimestamp(fields, 'createdAt'),
    updatedAt: fields.updatedAt?.timestampValue || null,
    category: getString(fields, 'category'),
    location: getString(fields, 'location'),
    itinerary: itinerary.length > 0 ? itinerary : null,
    tips: tips.length > 0 ? tips : null,
  };
}

async function fetchArticleByDocumentId(documentId: string): Promise<ArticleMeta | null> {
  try {
    const url = `${getArticlesCollectionUrl()}/${documentId}`;
    const data = await fetchJson<FirestoreDocument>(url);
    const fields = data?.fields;

    if (!fields || !getBoolean(fields, 'published')) {
      return null;
    }

    return mapArticleMeta(fields);
  } catch (error) {
    console.error('Error fetching article by document ID:', error);
    return null;
  }
}

async function fetchArticle(slug: string): Promise<ArticleMeta | null> {
  const cacheKey = `article_${slug}`;
  const cached = ssrCache.get<ArticleMeta>(cacheKey);
  if (cached) return cached;

  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) return null;

  try {
    const response = await fetch(`${getArticlesCollectionUrl()}:runQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'articles' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug },
            },
          },
          limit: 1,
        },
      }),
    });

    if (response.ok) {
      const results = (await response.json()) as FirestoreRunQueryResponse[];
      const document = results.find((entry) => entry.document)?.document;
      const fields = document?.fields;

      if (fields && getBoolean(fields, 'published')) {
        const article = mapArticleMeta(fields);
        ssrCache.set(cacheKey, article);
        return article;
      }
    }

    const docArticle = await fetchArticleByDocumentId(slug);
    if (docArticle) ssrCache.set(cacheKey, docArticle);
    return docArticle;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function resolveAppStatus(pathname: string) {
  if (isLiteDisabledPath(pathname)) {
    return 404;
  }

  if (STATIC_APP_ROUTES.has(pathname)) {
    return 200;
  }

  const firestoreAvailable = Boolean(
    firebaseConfig.projectId && firebaseConfig.firestoreDatabaseId
  );

  if (pathname.startsWith('/articolo/')) {
    const slug = pathname.split('/').pop();
    if (!slug) {
      return 404;
    }

    // Preview slug noti (DEMO_ARTICLE_SLUG storico + 30 seed in demoArchive):
    // serviti come SPA con preview body lato client. Tornano 200 sempre
    // perche' PREVIEW_ARTICLES garantisce il render.
    if (slug === DEMO_ARTICLE_SLUG || DEMO_PREVIEW_ARTICLE_SLUGS.has(slug)) {
      return 200;
    }

    if (!firestoreAvailable) {
      return 200;
    }

    const article = await fetchArticle(slug);
    return article ? 200 : 404;
  }

  if (pathname.startsWith('/shop/')) {
    const slug = pathname.split('/').pop();
    if (!slug) {
      return 404;
    }

    if (DEMO_PRODUCT_SLUGS.has(slug)) {
      return 200;
    }

    if (!firestoreAvailable) {
      return 200;
    }

    const product = await fetchProductBySlug(slug);
    return product ? 200 : 404;
  }

  if (pathname.startsWith('/admin/')) {
    return 200;
  }

  // Demo content types (Sprint 4): client renders NotFound if slug missing.
  if (pathname.startsWith('/itinerari/') || pathname.startsWith('/guide/')) {
    return 200;
  }

  if (pathname.startsWith('/destinazione/')) {
    return VALID_DESTINATION_PATHS.has(pathname) ? 200 : 404;
  }

  // `/posto/<id>` mancava del tutto e cadeva sul 404 finale: la pagina si
  // vedeva benissimo per una persona e rispondeva 404 al crawler. E' la
  // destinazione di ogni reel, di ogni pin della mappa e di 40 link in home,
  // quindi era l'intero catalogo dei posti a essere un soft-404.
  if (pathname.startsWith('/posto/')) {
    return REAL_POSTO_IDS.has(pathname.slice('/posto/'.length)) ? 200 : 404;
  }

  return 404;
}

async function fetchAllArticles(): Promise<SitemapArticle[]> {
  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) return [];

  try {
    const url = getArticlesCollectionUrl();
    const data = await fetchJson<FirestoreListResponse>(url);

    return (data?.documents || [])
      .filter((doc) => getBoolean(doc.fields, 'published'))
      .map((doc) => {
        const fields = doc.fields;
        return {
          slug: getString(fields, 'slug') || getDocumentId(doc),
          title: getString(fields, 'title'),
          description: getString(fields, 'description') || getString(fields, 'excerpt'),
          date: getTimestamp(fields, 'createdAt'),
        };
      })
      .filter((article) => article.slug && article.title);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

function injectMetaTags(html: string, article: ArticleMeta, url: string) {
  const title = `${article.title} | Travelliniwithus`;

  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title.slice(0, 110),
      description: article.description,
      image: article.image ? [article.image] : [],
      datePublished: article.date,
      dateModified: article.updatedAt || article.date,
      author: [
        {
          '@type': 'Person',
          name: article.author,
          url: 'https://travelliniwithus.it/chi-siamo',
        },
      ],
      publisher: {
        '@type': 'Organization',
        '@id': 'https://travelliniwithus.it/#organization',
        name: 'Travelliniwithus',
        logo: {
          '@type': 'ImageObject',
          url: 'https://travelliniwithus.it/pwa-512x512.png',
          width: 512,
          height: 512,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      articleSection: article.category,
      inLanguage: 'it-IT',
      url,
    },
  ];

  if (article.category === 'Guide' && article.itinerary && article.itinerary.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `Come visitare ${article.location || article.title}`,
      description: article.description,
      image: article.image,
      step: article.itinerary.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    });
  } else if (article.category === 'Guide' && article.tips && article.tips.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.tips.map((tip) => ({
        '@type': 'Question',
        name: firstSentence(tip),
        acceptedAnswer: {
          '@type': 'Answer',
          text: tip,
        },
      })),
    });
  }

  // Aggiunge schema TouristDestination per articoli con location
  if (article.location) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: article.location,
      description: article.description,
      image: article.image ? { '@type': 'ImageObject', url: article.image } : undefined,
      url: url,
    });
  }

  const metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(article.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${escapeHtml(url)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(article.description)}">
    <meta property="og:image" content="${escapeHtml(article.image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="it_IT">
    <meta property="og:site_name" content="Travelliniwithus">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${escapeHtml(url)}">
    <meta property="twitter:title" content="${escapeHtml(title)}">
    <meta property="twitter:description" content="${escapeHtml(article.description)}">
    <meta property="twitter:image" content="${escapeHtml(article.image)}">
    <meta property="twitter:site" content="@travelliniwithus">
    <script type="application/ld+json" data-ssr-jsonld="article">${safeJsonLd(structuredData)}</script>
  `;

  return html.replace(/<title>.*?<\/title>/, '').replace('</head>', `${metaTags}</head>`);
}

function injectProductMetaTags(html: string, product: ProductRecord, url: string) {
  const title = `${product.name} | Travelliniwithus`;
  const description =
    product.description ||
    'Prodotto premium Travelliniwithus pensato per organizzare meglio il viaggio.';
  const image = product.imageUrl || 'https://travelliniwithus.it/og/default.jpg';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    image: image ? [image] : [],
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  const metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${escapeHtml(url)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="it_IT">
    <meta property="og:site_name" content="Travelliniwithus">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${escapeHtml(url)}">
    <meta property="twitter:title" content="${escapeHtml(title)}">
    <meta property="twitter:description" content="${escapeHtml(description)}">
    <meta property="twitter:image" content="${escapeHtml(image)}">
    <meta property="twitter:site" content="@travelliniwithus">
    <script type="application/ld+json">${safeJsonLd(structuredData)}</script>
  `;

  return html.replace(/<title>.*?<\/title>/, '').replace('</head>', `${metaTags}</head>`);
}

// SSR meta per le rotte statiche indicizzabili. Le stringhe rispecchiano i <SEO>
// delle pagine (non vanno reinventate: sono copy SEO italiano). Le rotte noindex
// (/guida-in-regalo, /itinerari, /lead-magnet, preview) restano FUORI da qui.
const STATIC_ROUTE_META: Record<string, { title: string; description: string; ogImage?: string }> =
  {
    '/': {
      title: 'Viaggi reali e posti particolari',
      description:
        'Rodrigo e Betta raccontano posti particolari, guide pratiche e idee viaggio provate sul campo, in Italia e nel mondo.',
    },
    '/chi-siamo': {
      title: 'Rodrigo e Betta: chi siamo',
      description:
        'Dalla nascita del brand nel 2018: viaggi in coppia raccontati con criterio. Come scegliamo i posti, perché ne consigliamo pochi, cosa garantiamo a chi ci legge.',
    },
    '/esplora': {
      title: 'Esplora viaggi scelti a mano',
      description:
        'Le idee di viaggio che scegliamo davvero noi: posti, weekend in coppia e mete fuori rotta da filtrare per zona, periodo e budget. Archivio Travellini.',
    },
    '/mappa': {
      title: 'Mappa dei posti che abbiamo visitato',
      description:
        'La mappa interattiva 3D di Travelliniwithus: destinazioni verificate sul posto, filtrate per regione, esperienza e periodo.',
    },
    '/collaborazioni': {
      title: 'Collaborazioni travel con hotel e brand',
      description:
        'Collaborazioni editoriali con hotel, destinazioni, brand travel e progetti lifestyle che hanno qualcosa da raccontare con credibilità.',
    },
    '/media-kit': {
      title: 'Media kit Travelliniwithus: audience, format e condizioni',
      description:
        'Richiedi il media kit Travelliniwithus per capire audience, format, tono editoriale e condizioni giuste per una collaborazione coerente.',
    },
    '/contatti': {
      title: 'Contatti Travelliniwithus',
      description:
        'Scrivici per collaborazioni, press trip, media kit, domande editoriali o richieste legate al progetto Travelliniwithus.',
    },
    '/risorse': {
      title: 'Risorse di viaggio selezionate',
      description:
        'Strumenti, app, servizi e gear che Travelliniwithus usa o valuta con criterio per organizzare, vivere e raccontare meglio i viaggi.',
    },
    '/club': {
      title: 'Travellini Club — il club di chi viaggia in Italia con noi',
      description:
        'Una piccola quota per tutte le guide. Itinerari aggiornati, anteprime, archivio. Pensato per chi viaggia spesso e vuole leggere meno rumore.',
    },
    '/shop': {
      title: 'Shop editoriale — guide premium e planner',
      description:
        'Guide premium, planner e toolkit Travelliniwithus pensati per organizzare viaggi con più criterio. Catalogo reale in preparazione.',
    },
    '/press': {
      title: 'Press: media kit e contatti per redazioni',
      description:
        'Risorse stampa Travelliniwithus per redazioni e media: brand snapshot, media kit, contatti diretti e materiali aggiornati.',
    },
    '/strumenti': {
      title: 'Strumenti di viaggio',
      description:
        'Calendario meteo e affollamento, builder itinerario e mappa interattiva Travelliniwithus. Strumenti pratici per decidere meglio.',
    },
  };

function injectStaticMeta(html: string, pathname: string, origin: string) {
  const meta = STATIC_ROUTE_META[pathname];
  if (!meta) return html;

  const title = meta.title.toLowerCase().includes('travelliniwithus')
    ? meta.title
    : `${meta.title} | Travelliniwithus`;
  const image = meta.ogImage || 'https://travelliniwithus.it/og/default.jpg';
  const url = `${origin}${pathname}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: meta.description,
    url,
    inLanguage: 'it-IT',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://travelliniwithus.it/#website',
      name: 'Travelliniwithus',
      url: 'https://travelliniwithus.it/',
    },
  };

  const metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(url)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="it_IT">
    <meta property="og:site_name" content="Travelliniwithus">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${escapeHtml(url)}">
    <meta property="twitter:title" content="${escapeHtml(title)}">
    <meta property="twitter:description" content="${escapeHtml(meta.description)}">
    <meta property="twitter:image" content="${escapeHtml(image)}">
    <meta property="twitter:site" content="@travelliniwithus">
    <script type="application/ld+json">${safeJsonLd(structuredData)}</script>
  `;

  return html.replace(/<title>.*?<\/title>/, '').replace('</head>', `${metaTags}</head>`);
}

function injectSentieroPrerender(html: string): string {
  const prerenderHtml = SENTIERO_STAGES.map(
    (stage) => `
    <section id="stage-${stage.id}" style="margin: 4rem 0;">
      <h2>${escapeHtml(stage.kicker)} — ${escapeHtml(stage.title)}</h2>
      <p>${escapeHtml(stage.description)}</p>
      <p><em>Note di campo: ${escapeHtml(stage.fieldNote)}</em></p>
      <a href="${escapeHtml(stage.routeFallback ?? stage.route)}">${escapeHtml(stage.cta)}</a>
    </section>
  `
  ).join('\n');

  const container = `
    <div class="sr-only" data-twu-prerender="sentiero">
      ${prerenderHtml}
    </div>
  `;

  return html.replace('<div id="root"></div>', `<div id="root">${container}</div>`);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Trust the first proxy hop so express-rate-limit keys on the real client IP
  // when running behind Render/Vercel/Cloudflare. Harmless in local dev.
  app.set('trust proxy', 1);

  const isProd = process.env.NODE_ENV === 'production';

  // Security (open-redirect): in produzione APP_URL deve essere settato.
  // Senza, success_url/cancel_url Stripe e i canonical SSR cadrebbero sul
  // fallback `req.get('host')` (attacker-controllable). Fail-fast all'avvio.
  if (isProd && !process.env.APP_URL) {
    console.error(
      '[startup] APP_URL non impostata in produzione. Necessaria per Stripe callback URL e canonical SSR sicuri. Avvio interrotto.'
    );
    process.exit(1);
  }

  // Pagamenti: senza STRIPE_WEBHOOK_SECRET in produzione ogni evento webhook
  // cade nel ramo 400 (server.ts:1303) e gli ordini pagati non vengono mai
  // registrati. Stripe ritenta per 3 giorni, poi rinuncia. Fail-fast all'avvio,
  // come per APP_URL.
  if (isProd && !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      '[startup] STRIPE_WEBHOOK_SECRET non impostata in produzione. Gli ordini pagati Stripe verrebbero rifiutati e persi. Avvio interrotto.'
    );
    process.exit(1);
  }

  const cspProd =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://js.stripe.com https://m.stripe.network https://connect.facebook.net https://www.facebook.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "media-src 'self' https: blob:; " +
    "connect-src 'self' https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com https://*.firebasestorage.app https://identitytoolkit.googleapis.com https://api.stripe.com https://m.stripe.network https://api.mapbox.com https://events.mapbox.com https://www.facebook.com https://www.google-analytics.com; " +
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.facebook.com; " +
    "worker-src 'self' blob:; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=(self "https://js.stripe.com"), interest-cohort=()'
    );
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    if (isProd) {
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      res.setHeader('Content-Security-Policy', cspProd);
    }
    next();
  });

  const allowedOrigins = [
    process.env.APP_URL,
    'https://travelliniwithus.it',
    'https://www.travelliniwithus.it',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ].filter((origin): origin is string => Boolean(origin));

  app.use(
    cors({
      origin(origin, callback) {
        // No origin = same-origin or non-browser client; let it through.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: false,
    })
  );

  // Layer /api/* — estratto in src/server/apiRoutes.ts allo stadio 1 perche' la
  // Cloud Function di produzione monta lo stesso router. Un solo corpo di
  // codice, nessuna copia che diverge.
  app.use(
    createApiRouter({
      stripe,
      firebaseConfig,
      OWNER_EMAIL,
      LEAD_MAGNET_URL,
      MEDIA_KIT_URL,
      saveStripeOrder,
      verifyOptionalIdToken,
      fetchProductById,
      fetchProductAssets,
      fetchCouponByCode,
      isCheckoutRequestItem,
    })
  );
  app.use(createSeoRouter(fetchAllArticles, escapeHtml));

  // Legacy alias: la sezione editoriale e' /guide, ma vecchi link social
  // possono ancora puntare a /articoli — redirect 301 verso la rotta corretta.
  app.get(/^\/articoli(\/.*)?$/, (req, res) => {
    const tail = req.path.replace(/^\/articoli/, '');
    res.redirect(301, `/guide${tail}`);
  });

  // Consolidamento Esplora 2026-05-15: /destinazioni e /esperienze sono confluite
  // in /esplora. Redirect 301 server-side per trasferire link-equity ai bot
  // (prima era solo <Navigate> client-side, invisibile ai crawler).
  app.get(/^\/destinazioni(\/.*)?$/, (_req, res) => {
    res.redirect(301, '/esplora');
  });
  app.get(/^\/esperienze(\/.*)?$/, (_req, res) => {
    res.redirect(301, '/esplora');
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const pathname = new URL(url, `http://${req.headers.host || 'localhost'}`).pathname;
        const status = await resolveAppStatus(pathname);
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        let metaInjected = false;
        if (url.startsWith('/articolo/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const article = await fetchArticle(slug);
            if (article) {
              const fullUrl = (process.env.APP_URL || `http://localhost:${PORT}`) + url;
              template = injectMetaTags(template, article, fullUrl);
              metaInjected = true;
            }
          }
        }

        if (!metaInjected && !LITE_MODE && url.startsWith('/shop/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const product = await fetchProductBySlug(slug);
            if (product) {
              const fullUrl = (process.env.APP_URL || `http://localhost:${PORT}`) + url;
              template = injectProductMetaTags(template, product, fullUrl);
              metaInjected = true;
            }
          }
        }

        if (!metaInjected) {
          const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
          const origin = process.env.APP_URL || `http://localhost:${PORT}`;
          template = injectStaticMeta(template, normalizedPath, origin);
          if (normalizedPath === '/') {
            template = injectSentieroPrerender(template);
          }
        }

        res.status(status).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (error: unknown) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        const pathname = new URL(url, `http://${req.headers.host || 'localhost'}`).pathname;
        const status = await resolveAppStatus(pathname);
        let template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

        let metaInjected = false;
        if (url.startsWith('/articolo/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const article = await fetchArticle(slug);
            if (article) {
              const fullUrl = (process.env.APP_URL || `https://${req.headers.host}`) + url;
              template = injectMetaTags(template, article, fullUrl);
              metaInjected = true;
            }
          }
        }

        if (!metaInjected && !LITE_MODE && url.startsWith('/shop/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const product = await fetchProductBySlug(slug);
            if (product) {
              const fullUrl = (process.env.APP_URL || `https://${req.headers.host}`) + url;
              template = injectProductMetaTags(template, product, fullUrl);
              metaInjected = true;
            }
          }
        }

        if (!metaInjected) {
          const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
          const origin = process.env.APP_URL || `https://${req.headers.host}`;
          template = injectStaticMeta(template, normalizedPath, origin);
          if (normalizedPath === '/') {
            template = injectSentieroPrerender(template);
          }
        }

        res.status(status).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (error) {
        res.status(500).end(error instanceof Error ? error.message : String(error));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
