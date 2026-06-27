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
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App as FirebaseAdminApp,
} from 'firebase-admin/app';
import { FieldValue, getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import {
  sendEmail,
  renderContactNotification,
  renderContactAutoReply,
  renderMediaKitNotification,
  renderMediaKitAutoReply,
  renderWelcomeEmail,
  renderOrderConfirmation,
} from './src/lib/email';

dotenv.config();

const OWNER_EMAIL = process.env.MAIL_TO_OWNER || 'hello@travelliniwithus.it';
const MEDIA_KIT_URL =
  process.env.MEDIA_KIT_URL ||
  `${process.env.APP_URL || 'https://travelliniwithus.it'}/media-kit.pdf`;
const LEAD_MAGNET_URL =
  process.env.LEAD_MAGNET_URL ||
  `${process.env.APP_URL || 'https://travelliniwithus.it'}/lead-magnet-posti-italiani.pdf`;

const ssrCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null;

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: Record<string, string> = {};
let adminDb: Firestore | null | undefined;

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
}

interface CouponRecord {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
  active: boolean;
  expiryDate: string | null;
}

interface ProductAssetRecord {
  downloadUrl: string | null;
}

interface DemoSettings {
  showEditorialDemo: boolean;
  showShopDemo: boolean;
}

interface StripeOrderRecord {
  customerName: string;
  email: string;
  total: number;
  status: 'completed';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    downloadUrl: string | null;
    isDigital: boolean;
  }>;
  userId: string | null;
  stripeSessionId: string;
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
  '/vieni-con-noi',
  '/lead-magnet',
  '/iscrivi',
  '/esplora',
  '/destinazioni',
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
];

const STATIC_APP_ROUTES = new Set(
  ALL_STATIC_APP_ROUTES.filter((route) => !isLiteDisabledPath(route))
);

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

function parseServiceAccount(raw: string) {
  return raw.trim().startsWith('{')
    ? JSON.parse(raw)
    : JSON.parse(fs.readFileSync(path.resolve(raw), 'utf-8'));
}

function getFirebaseAdminDb() {
  if (adminDb !== undefined) {
    return adminDb;
  }

  try {
    const serviceAccountRaw =
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT;
    let app: FirebaseAdminApp;

    if (getApps().length > 0) {
      app = getApps()[0];
    } else if (serviceAccountRaw) {
      app = initializeApp({
        credential: cert(parseServiceAccount(serviceAccountRaw)),
        projectId: firebaseConfig.projectId || undefined,
      });
    } else {
      app = initializeApp({
        credential: applicationDefault(),
        projectId: firebaseConfig.projectId || undefined,
      });
    }

    adminDb = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    return adminDb;
  } catch (error) {
    console.error('[firebase-admin] Firestore admin init failed:', error);
    adminDb = null;
    return adminDb;
  }
}

/**
 * Verifica il bearer token Firebase nell'Authorization header.
 * Ritorna { uid, email } se valido, null se assente o invalido.
 * Non lancia: se la verifica fallisce torniamo null e il chiamante gestisce
 * la richiesta come "anonima" (senza pollution di metadata altrui).
 */
async function verifyOptionalIdToken(authHeader: string | undefined): Promise<{
  uid: string;
  email: string | null;
} | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    if (!getApps().length) {
      getFirebaseAdminDb();
    }
    const decoded = await getAuth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email || null };
  } catch {
    return null;
  }
}

async function saveStripeOrder(order: StripeOrderRecord, stripeEventId: string) {
  const db = getFirebaseAdminDb();

  if (!db) {
    throw new Error('Firestore admin is not configured for Stripe order persistence.');
  }

  const orderRef = db.collection('orders').doc(order.stripeSessionId);
  const existing = await orderRef.get();

  if (existing.exists) {
    return { created: false, id: orderRef.id };
  }

  await orderRef.create({
    ...order,
    source: 'stripe_webhook',
    stripeEventId,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { created: true, id: orderRef.id };
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

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?=\s|$)/);
  const sentence = (match ? match[0] : trimmed).trim();
  return sentence.length > 0 ? sentence : trimmed;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for future SSR demo gating; unused at runtime today
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

  if (pathname.startsWith('/admin/editor/') || pathname.startsWith('/admin/product-editor/')) {
    return 200;
  }

  // Demo content types (Sprint 4): client renders NotFound if slug missing.
  if (pathname.startsWith('/itinerari/') || pathname.startsWith('/guide/')) {
    return 200;
  }

  if (pathname.startsWith('/destinazione/')) {
    const slug = pathname.split('/').pop();
    if (!slug) {
      return 404;
    }
    return REGION_LANDING_SLUGS.has(slug) ? 200 : 404;
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
    };
    ssrCache.set(cacheKey, product);
    return product;
  } catch {
    return null;
  }
}

// Coupons are not publicly readable in firestore.rules — this lookup runs via
// Firebase Admin SDK so the public discount catalog stays private.
async function fetchCouponByCode(code: string): Promise<CouponRecord | null> {
  const db = getFirebaseAdminDb();

  if (!db) {
    return null;
  }

  try {
    const snapshot = await db.collection('coupons').doc(code).get();

    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data() as
      | {
          active?: boolean;
          expiryDate?: { toDate?: () => Date } | string | null;
          type?: string;
          discountType?: string;
          value?: number | string;
          description?: string;
        }
      | undefined;

    if (!data) {
      return null;
    }

    const active = data.active ?? true;

    let expiryDate: string | null = null;
    if (data.expiryDate) {
      if (typeof data.expiryDate === 'string') {
        expiryDate = data.expiryDate;
      } else if (typeof data.expiryDate.toDate === 'function') {
        expiryDate = data.expiryDate.toDate().toISOString();
      }
    }

    const rawType = (data.type ?? data.discountType ?? '').toString();
    const rawValue = data.value;
    const numericValue =
      typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? Number(rawValue) : 0;
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    const normalizedType: 'percent' | 'fixed' =
      rawType === 'fixed'
        ? 'fixed'
        : rawType === 'percentage' || rawType === 'percent'
          ? 'percent'
          : 'percent';

    if (!active || safeValue <= 0) {
      return null;
    }

    if (expiryDate && new Date(expiryDate).getTime() < Date.now()) {
      return null;
    }

    if (normalizedType === 'percent' && safeValue > 100) {
      return null;
    }

    return {
      code,
      type: normalizedType,
      value: safeValue,
      description:
        (typeof data.description === 'string' && data.description) ||
        `Sconto ${normalizedType === 'percent' ? `${safeValue}%` : `€${safeValue}`}`,
      active,
      expiryDate,
    };
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return null;
  }
}

// MIGRATION REQUIRED: move downloadUrl from products/{id} to productAssets/{id}
// via admin script. Until the migration runs, paid orders will get
// downloadUrl: null and the owner must email the file manually. Public
// firestore.rules deny read/write on productAssets so only Admin SDK can
// access this collection.
async function fetchProductAssets(productId: string): Promise<ProductAssetRecord | null> {
  const db = getFirebaseAdminDb();

  if (!db) {
    return null;
  }

  try {
    const snapshot = await db.collection('productAssets').doc(productId).get();
    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data() as { downloadUrl?: unknown } | undefined;
    const value = data?.downloadUrl;

    if (typeof value !== 'string' || value.length === 0) {
      return { downloadUrl: null };
    }

    return { downloadUrl: value };
  } catch (error) {
    console.error('[productAssets] lookup failed:', error);
    return null;
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
// (/vieni-con-noi, /itinerari, /lead-magnet, preview) restano FUORI da qui.
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
        'Otto anni di viaggi in coppia raccontati con criterio. Come scegliamo i posti, perché ne consigliamo pochi, cosa garantiamo a chi ci legge.',
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
    // Stripe webhook burst durante retry/outage NON deve cadere sotto rate
    // limit (perderebbe ordini definitivamente dopo 3gg di tentativi).
    // Anche /api/health resta libero per probe esterne (uptime monitor).
    skip: (req) =>
      req.path === '/webhook' ||
      req.path === '/api/webhook' ||
      req.path === '/health' ||
      req.path === '/api/health',
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
  // Generic /api/* limiter, but skip /api/webhook so Stripe retry bursts are
  // never throttled (signature verification + idempotent doc.create() already
  // protect that route).
  app.use(/^\/api\/(?!webhook(?:\/|$)).*/, generalApiLimiter);

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

            const assets = product.isDigital ? await fetchProductAssets(product.id) : null;

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
              downloadUrl: assets?.downloadUrl ?? null,
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
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        items: enrichedItems,
        userId: userId || null,
        stripeSessionId: session.id,
      };

      let orderSaveResult: { created: boolean; id: string };
      try {
        orderSaveResult = await saveStripeOrder(order, event.id);
      } catch (error) {
        console.error('[stripe-webhook] failed to persist order:', error);
        res.status(500).json({ error: 'Order persistence failed.' });
        return;
      }

      if (!orderSaveResult.created) {
        console.log(
          `[stripe-webhook] duplicate checkout.session.completed ignored for ${order.stripeSessionId}.`
        );
        res.json({ received: true, duplicate: true });
        return;
      }

      // Order confirmation email: invia al customer se ho email + items.
      // Fire-and-forget, sendEmail e no-op se RESEND_API_KEY manca.
      if (order.email && order.items.length > 0) {
        const hasDigital = order.items.some((item) => item.isDigital);
        const confirmation = renderOrderConfirmation({
          customerName: order.customerName !== 'Unknown' ? order.customerName : undefined,
          orderId: order.stripeSessionId,
          total: order.total,
          items: order.items.map((item) => ({
            name: item.name ?? 'Prodotto',
            quantity: item.quantity,
            price: item.price,
          })),
          isDigital: hasDigital,
        });
        void sendEmail({
          to: order.email,
          ...confirmation,
          tags: [{ name: 'type', value: 'order_confirmation' }],
        }).catch((err) => {
          console.error('[stripe-webhook] order confirmation email failed:', err);
        });
      }
    }

    res.json({ received: true });
  });

  // 32kb is enough for any contact-lead message; bigger payloads are dropped
  // before they reach our handlers, capping JSON-parse CPU under abuse.
  app.use(express.json({ limit: '32kb' }));

  const saveLeadBackup = async ({
    type,
    source,
    email,
    name,
    company,
    website,
    topic,
    message,
    budget,
    period,
  }: {
    type: 'contact' | 'newsletter' | 'media-kit';
    source: string;
    email: string;
    name?: string;
    company?: string;
    website?: string;
    topic?: string;
    message?: string;
    budget?: string;
    period?: string;
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
    if (budget) fields.budget = { stringValue: budget };
    if (period) fields.period = { stringValue: period };

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
    const {
      email,
      source = 'website',
      website,
    } = req.body as {
      email?: string;
      source?: string;
      website?: string;
    };

    if (typeof website === 'string' && website.trim().length > 0) {
      res.json({ success: true });
      return;
    }

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
          'Newsletter in save-lead-only mode.'
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

    // Welcome email: fire-and-forget, non bloccare la response.
    // sendEmail e gia no-op se RESEND_API_KEY manca (predisposizione mode).
    const welcome = renderWelcomeEmail({ source, leadMagnetUrl: LEAD_MAGNET_URL });
    void sendEmail({ to: email, ...welcome }).catch((err) => {
      console.error('[newsletter] welcome email failed:', err);
    });

    res.json({ success: true });
  });

  app.post('/api/contact-lead', async (req, res) => {
    const { name, email, topic, message, website } = req.body as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
      website?: string;
    };

    if (typeof website === 'string' && website.trim().length > 0) {
      res.json({ success: true });
      return;
    }

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
    const { email, company, website, topic, message, budget, period } = req.body as {
      email?: string;
      company?: string;
      website?: string;
      topic?: string;
      message?: string;
      budget?: string;
      period?: string;
    };

    if (
      !email?.trim() ||
      !company?.trim() ||
      !topic?.trim() ||
      !message?.trim() ||
      !budget?.trim() ||
      !period?.trim()
    ) {
      res.status(400).json({ error: 'Compila azienda, email, focus, budget, periodo e brief.' });
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
      budget: budget.trim(),
      period: period.trim(),
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
        budget: lead.budget,
        period: lead.period,
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
        userId?: string; // accettato per backward-compat ma ignorato se id-token presente
        userEmail?: string; // idem
      };

      // M8 fix: verifica id-token Firebase se presente, e usa i valori
      // verificati invece di quelli dal body (evita pollution storico ordini).
      // Se l'id-token manca, l'ordine resta anonimo (userId vuoto): coerente
      // con il pattern guest checkout, niente pollution lato Firestore.
      const verifiedIdentity = await verifyOptionalIdToken(req.headers.authorization);
      const trustedUserId = verifiedIdentity?.uid || '';
      const trustedUserEmail = verifiedIdentity?.email || '';

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
              amount_off: Math.min(
                Math.round(coupon.value * 100),
                Math.max(
                  0,
                  lineItems.reduce(
                    (sum, item) => sum + item.price_data.unit_amount * item.quantity,
                    0
                  )
                )
              ),
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
        success_url: `${origin}/shop?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        customer_email: trustedUserEmail || body.userEmail || undefined,
        discounts: stripeDiscount ? [{ coupon: stripeDiscount.id }] : undefined,
        metadata: {
          userId: trustedUserId,
          userEmail: trustedUserEmail,
          couponCode: coupon?.code || '',
          cartItems: JSON.stringify(
            checkoutItems.map((item) => ({ id: item.id, quantity: item.quantity }))
          ),
        },
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Checkout non disponibile in questo momento.' });
    }
  });

  /**
   * AI verification — admin only. Sostituisce il vecchio client-side
   * `aiVerificationService` che leggeva VITE_GEMINI_API_KEY (leak bundle).
   * Verifica id-token + email whitelist, poi chiama Gemini server-side con
   * `GEMINI_API_KEY` (mai esposta al client).
   */
  app.post('/api/admin/ai-verify', async (req, res) => {
    try {
      const identity = await verifyOptionalIdToken(req.headers.authorization);
      const adminEmail = process.env.ADMIN_EMAIL || 'skotynyanskiy@gmail.com';
      if (!identity || identity.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        res.status(403).json({ error: 'Forbidden: admin only.' });
        return;
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        res
          .status(503)
          .json({ error: 'AI verification non configurata (GEMINI_API_KEY mancante).' });
        return;
      }

      const body = req.body as { mode?: 'search' | 'maps'; content?: string; title?: string };
      const mode = body.mode === 'maps' ? 'maps' : 'search';
      const content = typeof body.content === 'string' ? body.content : '';
      const title = typeof body.title === 'string' ? body.title : '';

      if (!content || content.length < 50 || content.length > 50000) {
        res.status(400).json({ error: 'Contenuto non valido (50-50000 caratteri).' });
        return;
      }

      // Dynamic import: non vogliamo che `@google/genai` finisca nel bundle
      // server di partenza. Lazy.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      const prompt =
        mode === 'search'
          ? `Sei un editor esperto di viaggi. Verifica e arricchisci il seguente articolo. Usa la ricerca Google per fatti storici, culturali e generali precisi e aggiornati. Correggi inesattezze e aggiungi dettagli se utili. Mantieni tono diretto, concreto, autentico — niente retorica luxury/brochure.\n\nTitolo: ${title}\nContenuto:\n${content}\n\nRestituisci SOLO l'articolo revisionato in Markdown.`
          : `Sei un editor esperto di viaggi. Verifica informazioni geografiche e logistiche dell'articolo. Usa Google Maps per nomi luoghi, indirizzi, distanze, vicinanze. Correggi e aggiungi dettagli utili (quartieri, punti d'interesse). Tono diretto, autentico — niente retorica luxury.\n\nTitolo: ${title}\nContenuto:\n${content}\n\nRestituisci SOLO l'articolo revisionato in Markdown.`;

      const response = await ai.models.generateContent({
        model: mode === 'search' ? 'gemini-2.5-flash' : 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [mode === 'search' ? { googleSearch: {} } : { googleMaps: {} }] },
      });

      res.json({ content: response.text || content });
    } catch (err) {
      console.error('[ai-verify] error:', err);
      res.status(500).json({ error: 'AI verification failed.' });
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

  /*
   * /api/ai-companion — AI Travel Companion "Chiedi a R+B" (Marathon FASE 2.A)
   *
   * Stato attuale: STUB. Endpoint risponde 503 finche ANTHROPIC_API_KEY +
   * OPENAI_API_KEY + vector store non sono configurati.
   *
   * Quando configurato:
   *   1. Embedding query con OpenAI text-embedding-3-small
   *   2. Cosine similarity contro Firestore vector store (collezione `ai_corpus`)
   *   3. Top-K chunks → context window Claude Haiku
   *   4. System prompt severo (vedi src/config/aiCompanion.ts)
   *   5. Refusal patterns deterministic prima del LLM call
   *   6. Cost cap tracking in `ai_companion_usage/{YYYY-MM}`
   *   7. Citation enforcement nel response shape
   *
   * Rate limit: 100/15min generico copre. Per ulteriore protezione anti-abuse
   * aggiungere cap per-session via cookie quando si attiva.
   */
  app.post('/api/ai-companion', async (req, res) => {
    const { query } = req.body as { query?: string; history?: unknown };

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query mancante.' });
      return;
    }
    if (query.length > 500) {
      res.status(400).json({ error: 'Query troppo lunga (max 500 caratteri).' });
      return;
    }

    const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);
    const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
    const corpusReady = process.env.AI_COMPANION_CORPUS_READY === 'true';

    if (!hasAnthropicKey || !hasOpenAiKey || !corpusReady) {
      // Mode 'disabled' — client cade su keyword matching demo.
      res.status(503).json({
        error: 'ai-companion-not-configured',
        message: 'Il companion AI non e ancora attivo. Stiamo lavorando per accendere il backend.',
        mode: 'disabled',
      });
      return;
    }

    // TODO Marathon FASE 2.A implementazione completa:
    //   1. const embedding = await openai.embeddings.create({ ... });
    //   2. const chunks = await vectorStore.query({ vector: embedding, topK: AI_COMPANION_TOP_K });
    //   3. const context = chunks.map(c => `[${c.title}](${c.url})\n${c.text}`).join('\n---\n');
    //   4. const response = await anthropic.messages.create({
    //        model: AI_COMPANION_MODEL,
    //        max_tokens: AI_COMPANION_MAX_OUTPUT_TOKENS,
    //        system: AI_COMPANION_SYSTEM_PROMPT,
    //        messages: [{ role: 'user', content: `Contesto:\n${context}\n\nDomanda: ${query}` }],
    //      });
    //   5. await incrementCostTracker({ inputTokens, outputTokens });
    //   6. res.json({ reply: response.content[0].text, sources: chunks.map(c => ({ title, url })) });
    res.status(503).json({
      error: 'ai-companion-implementation-pending',
      mode: 'maintenance',
    });
  });

  app.get('/sitemap.xml', async (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const articles = await fetchAllArticles();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Consolidamento Esplora 2026-05-15: /destinazioni, /esperienze, /guide
    // ora redirigono a /esplora — escluse dalla sitemap canonical.
    const staticRoutes = [
      '',
      '/vieni-con-noi',
      '/esplora',
      '/mappa',
      '/itinerari',
      '/risorse',
      '/shop',
      '/club',
      '/collaborazioni',
      '/media-kit',
      '/contatti',
      '/chi-siamo',
      '/press',
      '/strumenti',
      '/destinazione/puglia',
      '/destinazione/sicilia',
      '/destinazione/sardegna',
      '/destinazione/toscana',
      '/destinazione/campania',
      '/destinazione/trentino-alto-adige',
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
