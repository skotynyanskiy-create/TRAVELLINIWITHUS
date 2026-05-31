import { collection, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { normalizeFirestoreArticle, type NormalizedArticle } from '../utils/articleData';
import type { SiteContentKey, SiteContentMap } from '../config/siteContent';
import { DEMO_PRODUCT, DEMO_ARTICLE_PREVIEW } from '../config/demoContent';

export async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as unknown as import('../types').Product))
    .filter((product) => product.published === true);
}

export async function fetchProductBySlug(slug: string): Promise<import('../types').Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), where('published', '==', true));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as unknown as import('../types').Product;
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
    const data = docSnap.data();
    return {
      igFollowers: String(data.igFollowers ?? ''),
      monthlyReach: String(data.monthlyReach ?? ''),
      uniqueUsers: String(data.uniqueUsers ?? ''),
      engagementRate: String(data.engagementRate ?? ''),
    };
  }
  return null;
}

export async function fetchSiteContent(key: SiteContentKey): Promise<SiteContentMap[typeof key] | null> {
  const docRef = doc(db, 'site-content', key);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as SiteContentMap[typeof key];
  }
  return null;
}

export async function saveSiteContent<K extends SiteContentKey>(key: K, data: SiteContentMap[K]): Promise<void> {
  const docRef = doc(db, 'site-content', key);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function fetchPublishedArticles(continent?: string) {
  const constraints = [where('published', '==', true)];
  if (continent && continent !== 'Tutti') {
    constraints.push(where('continent', '==', continent));
  }
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(20));

  const q = query(collection(db, 'articles'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => normalizeFirestoreArticle(d.id, d.data()));
}

export async function submitCollabRequest(data: {
  name: string;
  email: string;
  company?: string;
  type: string;
  message: string;
}) {
  await addDoc(collection(db, 'collab-requests'), {
    ...data,
    createdAt: serverTimestamp(),
    status: 'pending',
  });
}

export async function submitContactRequest(data: {
  name: string;
  email: string;
  message: string;
}) {
  await addDoc(collection(db, 'contact-requests'), {
    ...data,
    createdAt: serverTimestamp(),
    status: 'new',
  });
}
