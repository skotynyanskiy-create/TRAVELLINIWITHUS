import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { normalizeFirestoreArticle, type NormalizedArticle } from '../utils/articleData';
import type { SiteContentKey, SiteContentMap } from '../config/siteContent';
import { DEMO_PRODUCT, DEMO_ARTICLE_PREVIEW } from '../config/demoContent';
import {
  getHotelBySlug as getFallbackHotelBySlug,
  getPublishedHotels,
} from '../config/hotelDirectory';
import type { Product } from '../types';
import type { HotelEntry } from '../types';
import { isTimestamp } from '../utils/dateValue';

type FirestoreProductData = Partial<Omit<Product, 'id'>> & Record<string, unknown>;

const PRODUCT_COLLECTION_READ_LIMIT = 100;
const ARTICLE_COLLECTION_READ_LIMIT = 250;
const HOTEL_COLLECTION_READ_LIMIT = 100;

const asString = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const asNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : undefined;

const asStringRecord = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string'
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

function normalizeFirestoreProduct(id: string, data: FirestoreProductData): Product | null {
  const name = asString(data.name);
  const slug = asString(data.slug);
  const category = asString(data.category);
  const price = asNumber(data.price);

  if (!name || !slug || !category || price === null) {
    return null;
  }

  return {
    id,
    name,
    slug,
    price,
    category,
    published: data.published === true,
    imageUrl: asString(data.imageUrl),
    isDigital: data.isDigital === true,
    downloadUrl: asString(data.downloadUrl),
    isBestseller: data.isBestseller === true,
    description: asString(data.description),
    features: asStringArray(data.features),
    gallery: asStringArray(data.gallery),
    specifications: asStringRecord(data.specifications),
    relatedProductIds: asStringArray(data.relatedProductIds),
    reviews: Array.isArray(data.reviews)
      ? data.reviews
          .map((review) => {
            if (!review || typeof review !== 'object') return null;
            const candidate = review as Record<string, unknown>;
            const rating = asNumber(candidate.rating);
            const comment = asString(candidate.comment);
            const author = asString(candidate.author);

            if (rating === null || !comment || !author) {
              return null;
            }

            return { rating, comment, author };
          })
          .filter((review): review is NonNullable<Product['reviews']>[number] => review !== null)
      : undefined,
  };
}

function normalizeFirestoreHotel(id: string, data: Record<string, unknown>): HotelEntry | null {
  const name = asString(data.name) || asString(data.title);
  const slug = asString(data.slug);
  const destination = asString(data.destination);
  const destinationSlug = asString(data.destinationSlug);
  const destinationHref = asString(data.destinationHref);
  const country = asString(data.country);
  const category = asString(data.category);
  const image = asString(data.image) || asString(data.heroImage);
  const bookingUrl = asString(data.bookingUrl);
  const summary = asString(data.summary) || asString(data.description);
  const fit = asString(data.fit);
  const editorialNote = asString(data.editorialNote);
  const pros = asStringArray(data.pros);
  const cons = asStringArray(data.cons);
  const idealFor = asStringArray(data.idealFor);

  if (
    !name ||
    !slug ||
    !destination ||
    !destinationSlug ||
    !destinationHref ||
    !country ||
    !category ||
    !image ||
    !bookingUrl ||
    !summary ||
    !fit ||
    !editorialNote ||
    !pros?.length ||
    !cons?.length ||
    !idealFor?.length
  ) {
    return null;
  }

  return {
    id,
    slug,
    title: name,
    name,
    description: summary,
    destination,
    destinationSlug,
    destinationHref,
    country,
    region: asString(data.region),
    area: asString(data.area),
    category,
    heroImage: image,
    image,
    gallery: asStringArray(data.gallery),
    bookingUrl,
    priceHint: asString(data.priceHint),
    budgetBand: asString(data.budgetBand) as HotelEntry['budgetBand'],
    rating: asNumber(data.rating) ?? undefined,
    badge: asString(data.badge),
    summary,
    fit,
    idealFor,
    pros,
    cons,
    affiliateDisclosure: asString(data.affiliateDisclosure) as HotelEntry['affiliateDisclosure'],
    verifiedAt: data.verifiedAt,
    editorialNote,
    relatedGuideHref: asString(data.relatedGuideHref),
    relatedArticles: asStringArray(data.relatedArticles),
    mapLabel: asString(data.mapLabel),
    published: data.published === true,
  };
}

function markFallbackHotel(hotel: HotelEntry): HotelEntry {
  return {
    ...hotel,
    title: hotel.title ?? hotel.name,
    description: hotel.description ?? hotel.summary,
    heroImage: hotel.heroImage ?? hotel.image,
    affiliateDisclosure: hotel.affiliateDisclosure ?? 'affiliate',
    isFallback: true,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const productsQuery = query(
    collection(db, 'products'),
    where('published', '==', true),
    limit(PRODUCT_COLLECTION_READ_LIMIT)
  );
  const querySnapshot = await getDocs(productsQuery);
  return querySnapshot.docs
    .map((docSnap) => normalizeFirestoreProduct(docSnap.id, docSnap.data() as FirestoreProductData))
    .filter((product): product is Product => product !== null);
}

export async function fetchHotels(): Promise<HotelEntry[]> {
  try {
    const hotelsQuery = query(
      collection(db, 'hotels'),
      where('published', '==', true),
      limit(HOTEL_COLLECTION_READ_LIMIT)
    );
    const querySnapshot = await getDocs(hotelsQuery);
    const hotels = querySnapshot.docs
      .map((docSnap) =>
        normalizeFirestoreHotel(docSnap.id, docSnap.data() as Record<string, unknown>)
      )
      .filter((hotel): hotel is HotelEntry => hotel !== null);

    return hotels.length > 0 ? hotels : getPublishedHotels().map(markFallbackHotel);
  } catch (error) {
    console.error('Error fetching hotels, using local fallback:', error);
    return getPublishedHotels().map(markFallbackHotel);
  }
}

export async function fetchHotelBySlug(slug: string): Promise<HotelEntry | null> {
  try {
    const slugQuery = query(
      collection(db, 'hotels'),
      where('slug', '==', slug),
      where('published', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(slugQuery);
    if (!querySnapshot.empty) {
      const hotelDoc = querySnapshot.docs[0];
      return normalizeFirestoreHotel(hotelDoc.id, hotelDoc.data() as Record<string, unknown>);
    }
  } catch (error) {
    console.error(`Error fetching hotel by slug "${slug}", using fallback:`, error);
  }

  const fallbackHotel = getFallbackHotelBySlug(slug);
  return fallbackHotel ? markFallbackHotel(fallbackHotel) : null;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const q = query(
    collection(db, 'products'),
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const productDoc = querySnapshot.docs[0];
  return normalizeFirestoreProduct(productDoc.id, productDoc.data() as FirestoreProductData);
}

export async function fetchArticles() {
  const publicArticlesQuery = query(
    collection(db, 'articles'),
    where('published', '==', true),
    limit(ARTICLE_COLLECTION_READ_LIMIT)
  );
  const querySnapshot = await getDocs(publicArticlesQuery);
  return querySnapshot.docs.map((doc) => normalizeFirestoreArticle(doc.id, doc.data()));
}

export async function fetchArticleBySlug(slug: string): Promise<NormalizedArticle | null> {
  const slugQuery = query(
    collection(db, 'articles'),
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  );
  const slugSnapshot = await getDocs(slugQuery);

  if (!slugSnapshot.empty) {
    const articleDoc = slugSnapshot.docs[0];
    return normalizeFirestoreArticle(articleDoc.id, articleDoc.data());
  }

  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    if (data.published !== true) {
      return null;
    }

    return normalizeFirestoreArticle(docSnap.id, data);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'permission-denied' || code === 'not-found') {
      return null;
    }
    console.warn(`Article fallback fetch failed for "${slug}":`, error);
    return null;
  }
}

export async function fetchContinents() {
  const articles = await fetchArticles();
  const continents = new Set<string>();
  articles.forEach((article) => {
    if (typeof article.country === 'string' && article.country) {
      continents.add(article.country);
    } else if (typeof article.continent === 'string' && article.continent) {
      continents.add(article.continent);
    }
  });
  return Array.from(continents);
}

export interface SiteStats {
  igFollowers: string;
  monthlyReach: string;
  uniqueUsers: string;
  engagementRate: string;
}

export async function fetchStats(): Promise<SiteStats | null> {
  const docRef = doc(db, 'settings', 'stats');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as SiteStats;
  }
  return null;
}

export async function updateStats(stats: SiteStats) {
  const docRef = doc(db, 'settings', 'stats');
  await setDoc(docRef, {
    ...stats,
    updatedAt: serverTimestamp(),
  });
}

export async function fetchSiteContent<K extends SiteContentKey>(
  key: K
): Promise<Partial<SiteContentMap[K]> | null> {
  const docRef = doc(db, 'siteContent', key);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as Partial<SiteContentMap[K]> & { updatedAt?: unknown };
  const { updatedAt: _updatedAt, ...content } = data;
  void _updatedAt;
  return content as Partial<SiteContentMap[K]>;
}

export async function saveSiteContent<K extends SiteContentKey>(
  key: K,
  content: SiteContentMap[K]
) {
  const docRef = doc(db, 'siteContent', key);
  await setDoc(docRef, {
    ...content,
    updatedAt: serverTimestamp(),
  });
}

export async function saveMediaKitLead({
  email,
  company,
  website,
  topic,
  message,
}: {
  email: string;
  company: string;
  website?: string;
  topic?: string;
  message?: string;
}) {
  await saveLead({
    type: 'media-kit',
    source: 'media-kit-page',
    email,
    company,
    website,
    topic,
    message,
  });
}

interface LeadPayload {
  type: 'contact' | 'newsletter' | 'media-kit';
  source: string;
  email: string;
  name?: string;
  company?: string;
  website?: string;
  topic?: string;
  message?: string;
}

export async function saveLead(payload: LeadPayload) {
  await addDoc(collection(db, 'leads'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function saveNewsletterLead(email: string) {
  await saveLead({
    type: 'newsletter',
    source: 'newsletter-form',
    email,
  });
}

export async function saveContactLead({
  name,
  email,
  topic,
  message,
}: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  await saveLead({
    type: 'contact',
    source: 'contact-form',
    name,
    email,
    topic,
    message,
  });
}

export async function logActivity(action: string, userEmail: string, details: string = '') {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      userEmail,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function fetchLogs() {
  const querySnapshot = await getDocs(collection(db, 'logs'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function fetchCoupons() {
  const querySnapshot = await getDocs(collection(db, 'coupons'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addCoupon(coupon: Record<string, unknown>) {
  const code = typeof coupon.code === 'string' ? coupon.code.trim().toUpperCase() : '';
  if (!code) {
    throw new Error('Coupon code is required');
  }

  await setDoc(
    doc(db, 'coupons', code),
    {
      ...coupon,
      code,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function exportToCSV<T extends object>(data: T[], filename: string) {
  if (data.length === 0) return;

  const rows = data as Array<Record<string, unknown>>;
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          // Handle timestamps or objects
          if (isTimestamp(val)) {
            return `"${val.toDate().toISOString()}"`;
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function seedTestData(authorId: string) {
  // Seed Orders
  const orders = [
    {
      customerName: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      total: 49.9,
      status: 'completed',
      createdAt: serverTimestamp(),
    },
    {
      customerName: 'Giulia Bianchi',
      email: 'giulia.b@example.com',
      total: 25.0,
      status: 'pending',
      createdAt: serverTimestamp(),
    },
    {
      customerName: 'Luca Verdi',
      email: 'luca.verdi@test.it',
      total: 120.5,
      status: 'cancelled',
      createdAt: serverTimestamp(),
    },
  ];

  for (const order of orders) {
    await addDoc(collection(db, 'orders'), order);
  }

  // Seed Products if none exist
  const productsSnapshot = await getDocs(query(collection(db, 'products'), limit(1)));
  if (productsSnapshot.empty) {
    const products = [
      {
        name: DEMO_PRODUCT.name,
        slug: DEMO_PRODUCT.slug,
        price: DEMO_PRODUCT.price,
        category: 'planner',
        published: false,
        description: DEMO_PRODUCT.description,
        imageUrl: DEMO_PRODUCT.imageUrl,
        createdAt: serverTimestamp(),
      },
    ];
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
  }

  // Seed Articles if none exist
  const articlesSnapshot = await getDocs(query(collection(db, 'articles'), limit(1)));
  if (articlesSnapshot.empty) {
    const articles = [
      {
        title: DEMO_ARTICLE_PREVIEW.title,
        slug: DEMO_ARTICLE_PREVIEW.slug,
        excerpt: DEMO_ARTICLE_PREVIEW.excerpt,
        description: DEMO_ARTICLE_PREVIEW.excerpt,
        coverImage: DEMO_ARTICLE_PREVIEW.image,
        content:
          'Contenuto demo creato per verificare la struttura editoriale del sito prima della pubblicazione definitiva.',
        category: 'Guide',
        published: true,
        authorId,
        createdAt: serverTimestamp(),
      },
    ];
    for (const article of articles) {
      await addDoc(collection(db, 'articles'), article);
    }
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  downloadUrl?: string | null;
  isDigital?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: unknown;
  items?: OrderItem[];
  userId?: string;
  stripeSessionId?: string;
}

const mapOrderSnapshot = (querySnapshot: Awaited<ReturnType<typeof getDocs>>) =>
  querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<Order, 'id'>;
    return { id: docSnap.id, ...data };
  });

export async function fetchUserOrders({
  uid,
  email,
}: {
  uid?: string | null;
  email?: string | null;
}): Promise<Order[]> {
  try {
    if (uid) {
      const ordersByUid = query(
        collection(db, 'orders'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(ordersByUid);
      if (!snapshot.empty || !email) {
        return mapOrderSnapshot(snapshot);
      }
    }

    if (!email) {
      return [];
    }

    const ordersByEmail = query(
      collection(db, 'orders'),
      where('email', '==', email),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(ordersByEmail);
    return mapOrderSnapshot(snapshot);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Order, 'id'>;
      return { id: docSnap.id, ...data };
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}
export async function saveOrder(order: Omit<Order, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string; // 'booking' | 'digital' | 'gear'
  tags?: string[];
  badge?: string;
  /** Nome del programma affiliate/partner per tracking UTM e analytics (default: 'generic'). */
  partner?: string;
  isPartner?: boolean;
  order?: number;
  published?: boolean;
}

export async function fetchResources(): Promise<Resource[]> {
  const q = query(
    collection(db, 'resources'),
    where('published', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Resource, 'id'>),
  }));
}
