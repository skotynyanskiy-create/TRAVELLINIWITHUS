import express from 'express';
import { createServer as createViteServer } from 'vite';
import NodeCache from 'node-cache';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {
  sendEmail,
  renderContactNotification,
  renderContactAutoReply,
  renderMediaKitNotification,
  renderMediaKitAutoReply,
} from './src/lib/email';

dotenv.config();

const OWNER_EMAIL = process.env.MAIL_TO_OWNER || 'hello@travelliniwithus.it';
const MEDIA_KIT_URL = process.env.MEDIA_KIT_URL || `${process.env.APP_URL || 'https://travelliniwithus.it'}/media-kit.pdf`;

const ssrCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null;

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: Record<string, string> = {};

if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, string>;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  booleanValue?: boolean;
  arrayValue?: {
    values?: FirestoreValue[];
  };
  mapValue?: {
    fields?: Record<string, FirestoreValue>;
  };
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

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

interface CheckoutItem {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  isDigital?: boolean;
  downloadUrl?: string;
}

interface CouponRecord {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
  active: boolean;
  expiryDate: string | null;
}

interface DemoSettings {
  showEditorialDemo: boolean;
  showShopDemo: boolean;
}

const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';
const DEMO_PRODUCT_SLUGS = new Set([
  'guida-premium-dolomiti',
  'guida-premium-giappone',
  'itinerario-puglia',
  'planner-viaggio-islanda',
  'safari-template-sudafrica',
  'weekend-trentino-spa',
]);

const STATIC_APP_ROUTES = new Set([
  '/',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
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
]);

function getString(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.stringValue || '';
}

function getTimestamp(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.timestampValue || new Date().toISOString();
}

function getBoolean(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.booleanValue === true;
}

function getArray(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.arrayValue?.values || [];
}

function getMapFields(value: FirestoreValue | undefined) {
  return value?.mapValue?.fields;
}

function getDocumentId(doc: FirestoreDocument) {
  return doc.name?.split('/').pop() || '';
}

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

function isCheckoutRequestItem(value: unknown): value is CheckoutRequestItem {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.quantity === 'number' &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0 &&
    candidate.quantity <= 10
  );
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url);
  if (!response.ok) return null;
  return (await response.json()) as T;
}

function getArticlesCollectionUrl() {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/articles`;
}

function getProductsCollectionUrl() {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/products`;
}

function getSiteContentDocumentUrl(documentId: string) {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/siteContent/${documentId}`;
}

function getNumber(fields: Record<string, FirestoreValue> | undefined, key: string) {
  const value = fields?.[key];

  if (!value) {
    return null;
  }

  if (typeof value.doubleValue === 'number') {
    return value.doubleValue;
  }

  if (typeof value.integerValue === 'string') {
    const parsed = Number(value.integerValue);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (typeof value.stringValue === 'string') {
    const parsed = Number(value.stringValue);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

async function fetchDemoSettings(): Promise<DemoSettings> {
  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
    return {
      showEditorialDemo: false,
      showShopDemo: false,
    };
  }

  try {
    const data = await fetchJson<FirestoreDocument>(getSiteContentDocumentUrl('demo'));
    const fields = data?.fields;
    const showEditorialDemo = fields?.showEditorialDemo?.booleanValue;
    const showShopDemo = fields?.showShopDemo?.booleanValue;

    return {
      showEditorialDemo: typeof showEditorialDemo === 'boolean' ? showEditorialDemo : false,
      showShopDemo: typeof showShopDemo === 'boolean' ? showShopDemo : false,
    };
  } catch (error) {
    console.error('Error fetching demo settings:', error);
    return {
      showEditorialDemo: false,
      showShopDemo: false,
    };
  }
}

async function resolveAppStatus(pathname: string) {
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

    if (slug === DEMO_ARTICLE_SLUG) {
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

  if (pathname.startsWith('/admin/editor/') || pathname.startsWith('/admin/product-editor/')) {
    return 200;
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

async function fetchProductById(
  productId: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<ProductRecord | null> {
  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
    return null;
  }

  try {
    const url = `${getProductsCollectionUrl()}/${productId}`;
    const data = await fetchJson<FirestoreDocument>(url);
    const fields = data?.fields;

    if (!fields || (!options.includeUnpublished && !getBoolean(fields, 'published'))) {
      return null;
    }

    const numericPrice = getNumber(fields, 'price');

    if (numericPrice === null) {
      return null;
    }

    return {
      id: productId,
      name: getString(fields, 'name') || 'Prodotto Travelliniwithus',
      slug: getString(fields, 'slug') || productId,
      price: numericPrice,
      description: getString(fields, 'description') || undefined,
      imageUrl: getString(fields, 'imageUrl') || undefined,
      category: getString(fields, 'category') || undefined,
      isDigital: getBoolean(fields, 'isDigital'),
      downloadUrl: getString(fields, 'downloadUrl') || undefined,
    };
  } catch {
    return null;
  }
}

async function fetchProductBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<ProductRecord | null> {
  const cacheKey = `product_${slug}`;
  const cached = ssrCache.get<ProductRecord>(cacheKey);
  if (cached) return cached;

  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
    return null;
  }

  try {
    const response = await fetch(`${getProductsCollectionUrl()}:runQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'products' }],
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

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as FirestoreRunQueryResponse[];
    const document = results.find((entry) => entry.document)?.document;
    const fields = document?.fields;

    if (!fields || (!options.includeUnpublished && !getBoolean(fields, 'published'))) {
      return null;
    }

    const numericPrice = getNumber(fields, 'price');

    if (numericPrice === null) {
      return null;
    }

    const product = {
      id: getDocumentId(document),
      name: getString(fields, 'name') || 'Prodotto Travelliniwithus',
      slug: getString(fields, 'slug') || slug,
      price: numericPrice,
      description: getString(fields, 'description') || undefined,
      imageUrl: getString(fields, 'imageUrl') || undefined,
      category: getString(fields, 'category') || undefined,
      isDigital: getBoolean(fields, 'isDigital'),
      downloadUrl: getString(fields, 'downloadUrl') || undefined,
    };
    ssrCache.set(cacheKey, product);
    return product;
  } catch {
    return null;
  }
}

async function fetchCouponByCode(code: string): Promise<CouponRecord | null> {
  if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
    return null;
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/coupons/${encodeURIComponent(code)}`;
    const data = await fetchJson<FirestoreDocument>(url);
    const fields = data?.fields;

    if (!fields) {
      return null;
    }

    const active = fields.active?.booleanValue ?? true;
    const expiryDate = fields.expiryDate?.timestampValue || null;
    const rawType = getString(fields, 'type') || getString(fields, 'discountType');
    const numericValue = getNumber(fields, 'value') ?? 0;
    const normalizedType =
      rawType === 'fixed'
        ? 'fixed'
        : rawType === 'percentage' || rawType === 'percent'
          ? 'percent'
          : 'percent';

    if (!active || numericValue <= 0) {
      return null;
    }

    if (expiryDate && new Date(expiryDate).getTime() < Date.now()) {
      return null;
    }

    if (normalizedType === 'percent' && numericValue > 100) {
      return null;
    }

    return {
      code,
      type: normalizedType,
      value: numericValue,
      description:
        getString(fields, 'description') ||
        `Sconto ${normalizedType === 'percent' ? `${numericValue}%` : `€${numericValue}`}`,
      active,
      expiryDate,
    };
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return null;
  }
}

function injectMetaTags(html: string, article: ArticleMeta, url: string) {
  const title = `${article.title} | Travelliniwithus`;

  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
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
        name: `Consiglio utile per ${article.location || article.title}`,
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
    <script type="application/ld+json">${safeJsonLd(structuredData)}</script>
  `;

  return html.replace(/<title>.*?<\/title>/, '').replace('</head>', `${metaTags}</head>`);
}

function injectProductMetaTags(html: string, product: ProductRecord, url: string) {
  const title = `${product.name} | Travelliniwithus`;
  const description =
    product.description ||
    'Prodotto premium Travelliniwithus pensato per organizzare meglio il viaggio.';
  const image = product.imageUrl || 'https://travelliniwithus.it/og-default.svg';
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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());

  // Rate limiting — protegge da abuse e spam
  const newsletterLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi tentativi. Riprova tra un minuto.' },
  });
  const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi tentativi di checkout. Riprova tra poco.' },
  });
  const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi invii ravvicinati. Riprova tra qualche minuto.' },
  });
  app.use('/api/newsletter-subscribe', newsletterLimiter);
  app.use('/api/create-checkout-session', checkoutLimiter);
  app.use('/api/contact-lead', contactLimiter);
  app.use('/api/media-kit-lead', contactLimiter);
  app.use('/api/', generalApiLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const rawBody = req.body;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !endpointSecret || !sig || typeof sig !== 'string') {
      res.status(400).send('Webhook Error: Missing configuration or signature');
      return;
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const metadataItems = (() => {
        const raw = session.metadata?.cartItems;
        if (!raw) return [];

        try {
          const parsed = JSON.parse(raw) as unknown[];
          return Array.isArray(parsed) ? parsed.filter(isCheckoutRequestItem) : [];
        } catch (error) {
          console.error('Failed to parse cartItems metadata:', error);
          return [];
        }
      })();

      let enrichedItems = (
        await Promise.all(
          metadataItems.map(async (item) => {
            const product = await fetchProductById(item.id, { includeUnpublished: true });
            if (!product) return null;

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
              downloadUrl: product.downloadUrl || null,
              isDigital: product.isDigital || false,
            };
          })
        )
      ).filter((item): item is NonNullable<typeof item> => item !== null);

      if (enrichedItems.length === 0) {
        let lineItems: Stripe.LineItem[] = [];
        try {
          const result = await stripe.checkout.sessions.listLineItems(session.id);
          lineItems = result.data;
        } catch (e) {
          console.error('Failed to fetch line items from Stripe:', e);
        }

        enrichedItems = lineItems.map((item) => ({
          id: String(item.price?.product || item.description || 'unknown'),
          name: item.description,
          price: (item.amount_total || 0) / Math.max(item.quantity || 1, 1) / 100,
          quantity: item.quantity || 1,
          downloadUrl: null,
          isDigital: false,
        }));
      }

      const order = {
        customerName: session.customer_details?.name || 'Unknown',
        email:
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.userEmail ||
          '',
        total: (session.amount_total || 0) / 100,
        status: 'completed',
        createdAt: new Date().toISOString(),
        items: enrichedItems,
        userId: userId || null,
        stripeSessionId: session.id,
      };

      if (firebaseConfig.projectId && firebaseConfig.firestoreDatabaseId) {
        try {
          const response = await fetch(
            `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/orders`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: {
                  customerName: { stringValue: order.customerName },
                  email: { stringValue: order.email },
                  total: { doubleValue: order.total },
                  status: { stringValue: order.status },
                  createdAt: { timestampValue: order.createdAt },
                  items: {
                    arrayValue: {
                      values: order.items.map((item) => ({
                        mapValue: {
                          fields: {
                            id: { stringValue: item.id },
                            name: { stringValue: item.name },
                            price: { doubleValue: item.price },
                            quantity: { integerValue: String(item.quantity) },
                            downloadUrl: item.downloadUrl
                              ? { stringValue: item.downloadUrl }
                              : { nullValue: null },
                            isDigital: { booleanValue: item.isDigital },
                          },
                        },
                      })),
                    },
                  },
                  userId: order.userId ? { stringValue: order.userId } : { nullValue: null },
                  stripeSessionId: { stringValue: order.stripeSessionId },
                },
              }),
            }
          );
          if (!response.ok) {
            console.error(
              'Failed to save order to Firestore:',
              response.status,
              await response.text()
            );
          } else {
            console.log('Order saved to Firestore successfully with items.');
          }
        } catch (e) {
          console.error('Failed to save order to Firestore:', e);
        }
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  const saveLeadBackup = async ({
    type,
    source,
    email,
    name,
    company,
    website,
    topic,
    message,
  }: {
    type: 'contact' | 'newsletter' | 'media-kit';
    source: string;
    email: string;
    name?: string;
    company?: string;
    website?: string;
    topic?: string;
    message?: string;
  }) => {
    if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
      return;
    }

    const fields: Record<string, FirestoreValue> = {
      email: { stringValue: email },
      type: { stringValue: type },
      source: { stringValue: source },
      createdAt: { timestampValue: new Date().toISOString() },
    };

    if (name) fields.name = { stringValue: name };
    if (company) fields.company = { stringValue: company };
    if (website) fields.website = { stringValue: website };
    if (topic) fields.topic = { stringValue: topic };
    if (message) fields.message = { stringValue: message };

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/leads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      throw new Error(`Lead save failed: ${response.status} ${await response.text()}`);
    }
  };

  app.post('/api/newsletter-subscribe', async (req, res) => {
    const { email, source = 'website' } = req.body as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListIdRaw = process.env.BREVO_LIST_ID;
    const brevoListId = brevoListIdRaw ? Number(brevoListIdRaw) : null;
    let savedSubscription = false;

    if (brevoApiKey && Number.isInteger(brevoListId) && brevoListId && brevoListId > 0) {
      try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            email,
            listIds: [brevoListId],
            updateEnabled: true,
            attributes: { SOURCE: source, SIGNUP_DATE: new Date().toISOString().split('T')[0] },
          }),
        });

        if (!response.ok && response.status !== 204) {
          const errorBody = await response.text();
          console.error('Brevo API error:', response.status, errorBody);
        } else {
          savedSubscription = true;
        }
      } catch (err) {
        console.error('Brevo request failed:', err);
      }
    } else if (brevoApiKey && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[newsletter] BREVO_API_KEY presente ma BREVO_LIST_ID mancante o non valido. ' +
          'Newsletter in save-lead-only mode.',
      );
    }

    try {
      await saveLeadBackup({
        email,
        type: 'newsletter',
        source,
      });
      savedSubscription = true;
    } catch (err) {
      console.error('Firestore newsletter save failed:', err);
    }

    if (!savedSubscription) {
      res.status(503).json({
        error: 'Iscrizione temporaneamente non disponibile. Riprova tra poco.',
      });
      return;
    }

    res.json({ success: true });
  });

  app.post('/api/contact-lead', async (req, res) => {
    const { name, email, topic, message } = req.body as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'Tutti i campi obbligatori devono essere compilati.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const lead = {
      name: name.trim(),
      email: email.trim(),
      topic: topic.trim(),
      message: message.trim(),
    };

    try {
      await saveLeadBackup({
        type: 'contact',
        source: 'contact-form',
        ...lead,
      });
    } catch (error) {
      console.error('Contact lead save failed:', error);
      res.status(500).json({ error: 'Impossibile salvare la richiesta.' });
      return;
    }

    const notification = renderContactNotification(lead);
    const autoReply = renderContactAutoReply({ name: lead.name });

    void Promise.allSettled([
      sendEmail({ to: OWNER_EMAIL, replyTo: lead.email, ...notification }),
      sendEmail({ to: lead.email, ...autoReply }),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === 'rejected') console.error('Contact email failed:', r.reason);
      });
    });

    res.json({ success: true });
  });

  app.post('/api/media-kit-lead', async (req, res) => {
    const { email, company, website, topic, message } = req.body as {
      email?: string;
      company?: string;
      website?: string;
      topic?: string;
      message?: string;
    };

    if (!email?.trim() || !company?.trim() || !topic?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'Compila azienda, email, focus e brief.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const lead = {
      email: email.trim(),
      company: company.trim(),
      website: website?.trim(),
      focus: topic.trim(),
      brief: message.trim(),
    };

    try {
      await saveLeadBackup({
        type: 'media-kit',
        source: 'media-kit-page',
        email: lead.email,
        company: lead.company,
        website: lead.website,
        topic: lead.focus,
        message: lead.brief,
      });
    } catch (error) {
      console.error('Media kit lead save failed:', error);
      res.status(500).json({ error: 'Impossibile salvare la richiesta.' });
      return;
    }

    const notification = renderMediaKitNotification(lead);
    const autoReply = renderMediaKitAutoReply({
      company: lead.company,
      mediaKitUrl: MEDIA_KIT_URL,
    });

    void Promise.allSettled([
      sendEmail({ to: OWNER_EMAIL, replyTo: lead.email, ...notification }),
      sendEmail({ to: lead.email, ...autoReply }),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === 'rejected') console.error('Media kit email failed:', r.reason);
      });
    });

    res.json({ success: true });
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const body = req.body as {
        items?: unknown;
        couponCode?: string;
        userId?: string;
        userEmail?: string;
      };
      const requestedItems = Array.isArray(body.items)
        ? body.items.filter(isCheckoutRequestItem)
        : [];

      if (requestedItems.length === 0) {
        res.status(400).json({ error: 'No valid items received.' });
        return;
      }

      const normalizedCouponCode =
        typeof body.couponCode === 'string' && body.couponCode.trim().length > 0
          ? body.couponCode.trim().toUpperCase()
          : '';
      const coupon = normalizedCouponCode ? await fetchCouponByCode(normalizedCouponCode) : null;

      if (normalizedCouponCode && !coupon) {
        res.status(400).json({ error: 'Coupon non valido o scaduto.' });
        return;
      }

      const checkoutItems = (
        (await Promise.all(
          requestedItems.map(async (item) => {
            const product = await fetchProductById(item.id);

            if (!product) {
              return null;
            }

            return {
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              quantity: item.quantity,
            } satisfies CheckoutItem;
          })
        )) as Array<CheckoutItem | null>
      ).filter((item): item is CheckoutItem => item !== null);

      if (checkoutItems.length !== requestedItems.length) {
        res.status(400).json({ error: 'One or more products are invalid or unavailable.' });
        return;
      }

      if (!stripe) {
        if (process.env.ALLOW_MOCK_CHECKOUT === 'true') {
          res.json({
            url: '/shop?success=true',
            mock: true,
          });
          return;
        }

        res.status(503).json({ error: 'Checkout is not configured yet.' });
        return;
      }

      const lineItems = checkoutItems.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const stripeDiscount =
        coupon?.type === 'fixed'
          ? await stripe.coupons.create({
              amount_off: Math.round(coupon.value * 100),
              currency: 'eur',
              duration: 'once',
              name: coupon.code,
              metadata: {
                source: 'travelliniwithus',
                couponCode: coupon.code,
              },
            })
          : coupon
            ? await stripe.coupons.create({
                percent_off: coupon.value,
                duration: 'once',
                name: coupon.code,
                metadata: {
                  source: 'travelliniwithus',
                  couponCode: coupon.code,
                },
              })
            : null;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/shop?success=true`,
        cancel_url: `${origin}/shop?canceled=true`,
        customer_email: body.userEmail || undefined,
        discounts: stripeDiscount ? [{ coupon: stripeDiscount.id }] : undefined,
        metadata: {
          userId: body.userId || '',
          userEmail: body.userEmail || '',
          couponCode: coupon?.code || '',
          cartItems: JSON.stringify(
            checkoutItems.map((item) => ({ id: item.id, quantity: item.quantity }))
          ),
        },
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Coupon validation endpoint
  app.post('/api/validate-coupon', async (req, res) => {
    const { code } = req.body as { code?: string };
    if (!code || typeof code !== 'string' || !code.trim()) {
      res.status(400).json({ valid: false, error: 'Codice coupon mancante.' });
      return;
    }
    const normalizedCode = code.trim().toUpperCase();
    try {
      const coupon = await fetchCouponByCode(normalizedCode);
      if (!coupon) {
        res.json({ valid: false, error: 'Codice non valido.' });
        return;
      }

      res.json({
        valid: true,
        code: normalizedCode,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      });
    } catch (err) {
      console.error('Coupon validation error:', err);
      res.status(500).json({ valid: false, error: 'Errore durante la validazione.' });
    }
  });

  app.get('/sitemap.xml', async (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const articles = await fetchAllArticles();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const staticRoutes = [
      '',
      '/destinazioni',
      '/esperienze',
      '/guide',
      '/risorse',
      '/shop',
      '/club',
      '/mappa',
      '/collaborazioni',
      '/media-kit',
      '/contatti',
      '/chi-siamo',
      '/privacy',
      '/cookie',
      '/termini',
      '/disclaimer',
    ];
    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${origin}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    const now = Date.now();
    for (const article of articles) {
      const lastmod = article.date.includes('T') ? article.date.split('T')[0] : article.date;
      const ageMs = now - new Date(article.date).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      const priority = ageDays < 30 ? '0.9' : ageDays < 90 ? '0.7' : '0.5';
      xml += `  <url>\n    <loc>${origin}/articolo/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  app.get('/rss.xml', async (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const articles = await fetchAllArticles();

    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    xml += '<rss version="2.0">\n<channel>\n';
    xml += '  <title>Travelliniwithus</title>\n';
    xml += `  <link>${origin}</link>\n`;
    xml += '  <description>Travel blog di Rodrigo &amp; Betta</description>\n';

    for (const article of articles) {
      xml += '  <item>\n';
      xml += `    <title>${escapeHtml(article.title)}</title>\n`;
      xml += `    <link>${origin}/articolo/${article.slug}</link>\n`;
      xml += `    <description>${escapeHtml(article.description)}</description>\n`;
      xml += `    <pubDate>${new Date(article.date).toUTCString()}</pubDate>\n`;
      xml += '  </item>\n';
    }

    xml += '</channel>\n</rss>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
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

        if (url.startsWith('/articolo/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const article = await fetchArticle(slug);
            if (article) {
              const fullUrl = (process.env.APP_URL || `http://localhost:${PORT}`) + url;
              template = injectMetaTags(template, article, fullUrl);
            }
          }
        }

        if (url.startsWith('/shop/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const product = await fetchProductBySlug(slug);
            if (product) {
              const fullUrl = (process.env.APP_URL || `http://localhost:${PORT}`) + url;
              template = injectProductMetaTags(template, product, fullUrl);
            }
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

        if (url.startsWith('/articolo/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const article = await fetchArticle(slug);
            if (article) {
              const fullUrl = (process.env.APP_URL || `https://${req.headers.host}`) + url;
              template = injectMetaTags(template, article, fullUrl);
            }
          }
        }

        if (url.startsWith('/shop/')) {
          const slug = url.split('/').pop();
          if (slug) {
            const product = await fetchProductBySlug(slug);
            if (product) {
              const fullUrl = (process.env.APP_URL || `https://${req.headers.host}`) + url;
              template = injectProductMetaTags(template, product, fullUrl);
            }
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
