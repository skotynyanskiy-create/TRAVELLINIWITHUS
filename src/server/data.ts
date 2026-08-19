import fs from 'fs';
import path from 'path';
import NodeCache from 'node-cache';
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App as FirebaseAdminApp,
} from 'firebase-admin/app';
import { FieldValue, getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type {
  CheckoutRequestItem,
  CouponRecord,
  FirestoreDocument,
  FirestoreRunQueryResponse,
  FirestoreValue,
  ProductAssetRecord,
  ProductRecord,
  StripeOrderRecord,
} from './types';

/**
 * Cache condivisa fra questo data layer e l'SSR di `server.ts`, che la importa.
 * Vive qui perche' e' il data layer a popolarla per primo (prodotti, coupon) e
 * perche' la Cloud Function ne ha bisogno senza tirarsi dietro server.ts.
 * In Functions e' per-istanza: e' una cache, non uno stato di verita'.
 */
export const ssrCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

/**
 * Data layer condiviso: accesso a Firestore (REST e admin SDK), prodotti,
 * coupon, ordini Stripe e verifica dei token.
 *
 * Estratto da `server.ts` allo stadio 2 perche' la Cloud Function deve
 * costruire le stesse dipendenze che il dev server passa a `createApiRouter`.
 * `server.ts` e' uno script di avvio, non importabile, quindi finche' questo
 * codice viveva li' la function avrebbe dovuto duplicarlo.
 */

/**
 * La configurazione Firebase arriva da due posti diversi a seconda di dove
 * gira il codice:
 *  - dev server: `firebase-applet-config.json` nella cwd del repo;
 *  - Cloud Function: quel file non esiste, e projectId/databaseId arrivano
 *    dall'ambiente (FIREBASE_CONFIG / GCLOUD_PROJECT sono iniettate dal
 *    runtime, FIRESTORE_DATABASE_ID la impostiamo noi).
 * Leggere solo il file avrebbe fatto puntare la function al database sbagliato
 * in silenzio: il nostro Firestore NON e' `(default)` ma un database con nome.
 */
function loadFirebaseConfig(): Record<string, string> {
  const fromFile = (() => {
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (!fs.existsSync(configPath)) return {};
      return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, string>;
    } catch {
      return {};
    }
  })();

  const projectId =
    fromFile.projectId || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || '';
  const firestoreDatabaseId =
    fromFile.firestoreDatabaseId || process.env.FIRESTORE_DATABASE_ID || '';

  return { ...fromFile, projectId, firestoreDatabaseId };
}

export const firebaseConfig: Record<string, string> = loadFirebaseConfig();

let adminDb: Firestore | null | undefined;

export const OWNER_EMAIL = process.env.MAIL_TO_OWNER || 'hello@travelliniwithus.it';

export const MEDIA_KIT_URL =
  process.env.MEDIA_KIT_URL ||
  `${process.env.APP_URL || 'https://travelliniwithus.it'}/media-kit.pdf`;

export const LEAD_MAGNET_URL =
  process.env.LEAD_MAGNET_URL ||
  `${process.env.APP_URL || 'https://travelliniwithus.it'}/lead-magnet-posti-italiani.pdf`;

export function getString(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.stringValue || '';
}

export function getTimestamp(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.timestampValue || new Date().toISOString();
}

export function getBoolean(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.booleanValue === true;
}

export function getArray(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.arrayValue?.values || [];
}

export function getMapFields(value: FirestoreValue | undefined) {
  return value?.mapValue?.fields;
}

export function parseServiceAccount(raw: string) {
  return raw.trim().startsWith('{')
    ? JSON.parse(raw)
    : JSON.parse(fs.readFileSync(path.resolve(raw), 'utf-8'));
}

export function getFirebaseAdminDb() {
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

export async function verifyOptionalIdToken(authHeader: string | undefined): Promise<{
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

export async function saveStripeOrder(order: StripeOrderRecord, stripeEventId: string) {
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

export function getDocumentId(doc: FirestoreDocument) {
  return doc.name?.split('/').pop() || '';
}

export function isCheckoutRequestItem(value: unknown): value is CheckoutRequestItem {
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

export async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url);
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export function getArticlesCollectionUrl() {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/articles`;
}

export function getProductsCollectionUrl() {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/products`;
}

export function getNumber(fields: Record<string, FirestoreValue> | undefined, key: string) {
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

export async function fetchProductById(
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

export async function fetchProductBySlug(
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

export async function fetchCouponByCode(code: string): Promise<CouponRecord | null> {
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

export async function fetchProductAssets(productId: string): Promise<ProductAssetRecord | null> {
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
