import { collection, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { normalizeFirestoreArticle, type NormalizedArticle } from '../utils/articleData';
import type { SiteContentKey, SiteContentMap } from '../config/siteContent';
import { DEMO_PRODUCT, DEMO_ARTICLE_PREVIEW } from '../config/demoContent';

export async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((product) => product.published === true);
}

export async function fetchProductBySlug(slug: string) {
  const q = query(collection(db, 'products'), where('slug', '==', slug), where('published', '==', true));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function fetchArticles() {
  const publicArticlesQuery = query(collection(db, 'articles'), where('published', '==', true));
  const querySnapshot = await getDocs(publicArticlesQuery);
  return querySnapshot.docs.map((doc) => normalizeFirestoreArticle(doc.id, doc.data()));
}

export async function fetchArticleBySlug(slug: string): Promise<NormalizedArticle | null> {
  const slugQuery = query(collection(db, 'articles'), where('slug', '==', slug), where('published', '==', true));
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
  } catch {
    return null;
  }
}

export async function fetchContinents() {
  const articles = await fetchArticles();
  const continents = new Set<string>();
  articles.forEach((article: Record<string, unknown>) => {
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
    updatedAt: serverTimestamp()
  });
}

export async function fetchSiteContent<K extends SiteContentKey>(key: K): Promise<Partial<SiteContentMap[K]> | null> {
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

export async function saveSiteContent<K extends SiteContentKey>(key: K, content: SiteContentMap[K]) {
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
    createdAt: serverTimestamp()
  });
}

export async function saveNewsletterLead(email: string) {
  await saveLead({
    type: 'newsletter',
    source: 'newsletter-form',
    email
  });
}

export async function saveContactLead({
  name,
  email,
  topic,
  message
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
    message
  });
}

export async function logActivity(action: string, userEmail: string, details: string = '') {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      userEmail,
      details,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function fetchLogs() {
  const querySnapshot = await getDocs(collection(db, 'logs'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchCoupons() {
  const querySnapshot = await getDocs(collection(db, 'coupons'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addCoupon(coupon: Record<string, unknown>) {
  await addDoc(collection(db, 'coupons'), {
    ...coupon,
    createdAt: serverTimestamp()
  });
}

export function exportToCSV<T extends object>(data: T[], filename: string) {
  if (data.length === 0) return;

  const rows = data as Array<Record<string, unknown>>;
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const val = row[header];
        // Handle timestamps or objects
        if (val && typeof val === 'object' && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
          return `"${(val as { toDate: () => Date }).toDate().toISOString()}"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    )
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
    { customerName: 'Mario Rossi', email: 'mario.rossi@example.com', total: 49.90, status: 'completed', createdAt: serverTimestamp() },
    { customerName: 'Giulia Bianchi', email: 'giulia.b@example.com', total: 25.00, status: 'pending', createdAt: serverTimestamp() },
    { customerName: 'Luca Verdi', email: 'luca.verdi@test.it', total: 120.50, status: 'cancelled', createdAt: serverTimestamp() }
  ];

  for (const order of orders) {
    await addDoc(collection(db, 'orders'), order);
  }

  // Seed Products if none exist
  const productsSnapshot = await getDocs(collection(db, 'products'));
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
  const articlesSnapshot = await getDocs(collection(db, 'articles'));
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

export interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: unknown;
  items?: { id: string; name: string; price: number; quantity: number }[];
  userId?: string;
  stripeSessionId?: string;
}

export async function fetchUserOrders(userEmail: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('email', '==', userEmail),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
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
  isPartner?: boolean;
  order?: number;
  published?: boolean;
}

export async function fetchResources(): Promise<Resource[]> {
  const q = query(
    collection(db, 'resources'),
    where('published', '==', true),
    orderBy('order', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Resource, 'id'>),
  }));
}
