import fs from 'node:fs';
import path from 'node:path';
import {
  DESTINATION_HUBS,
  countMatchingArticles,
  isHubVisible,
  type DestinationHub,
} from '../src/config/destinationHubs';

const BASE_URL = 'https://travelliniwithus.it';

// Static routes always present (independent of Firestore content).
const staticRoutes = [
  '/',
  '/destinazioni',
  '/destinazioni/italia',
  '/destinazioni/grecia',
  '/destinazioni/portogallo',
  '/guide',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/trasparenza',
  '/contatti',
  '/risorse',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

// Archive editoriale unificato: tutti gli articoli vivono sotto /guide/:slug.
// Mirrors `src/utils/articleRoutes.ts` (getPublicArticleSection) so canonical
// URLs produced here match the runtime canonical exactly.
function getPublicArticleSection() {
  return 'guide';
}

function timestampToIso(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    try {
      return value.toDate().toISOString();
    } catch {
      return null;
    }
  }
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString();
  }
  return null;
}

async function tryInitFirebaseAdmin() {
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

  if (!credsPath && !inlineJson) {
    return null;
  }

  try {
    const { initializeApp, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    let credential;
    if (inlineJson) {
      credential = cert(JSON.parse(inlineJson));
    } else {
      const json = JSON.parse(fs.readFileSync(path.resolve(credsPath), 'utf8'));
      credential = cert(json);
    }

    initializeApp({ credential, projectId });
    return getFirestore();
  } catch (error) {
    console.warn('[sitemap] firebase-admin init skipped:', error?.message ?? error);
    return null;
  }
}

async function fetchPublishedArticles(firestore) {
  if (!firestore) return [];
  try {
    const snapshot = await firestore
      .collection('articles')
      .where('published', '==', true)
      .limit(500)
      .get();
    return snapshot.docs
      .map((doc) => {
        const data = doc.data() ?? {};
        const slug = typeof data.slug === 'string' && data.slug.trim() ? data.slug.trim() : doc.id;
        return {
          slug,
          category: typeof data.category === 'string' ? data.category : '',
          type: typeof data.type === 'string' ? data.type : '',
          updatedAt: timestampToIso(data.updatedAt) || timestampToIso(data.createdAt),
        };
      })
      .filter((article) => Boolean(article.slug));
  } catch (error) {
    console.warn('[sitemap] articles fetch failed:', error?.message ?? error);
    return [];
  }
}

interface UrlEntryOptions {
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

function urlEntry(
  route: string,
  { changefreq = 'weekly', priority = '0.8', lastmod }: UrlEntryOptions = {}
) {
  const fullUrl = `${BASE_URL}${route === '/' ? '' : route}`;
  return `
    <url>
      <loc>${fullUrl}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
      `;
}

async function main() {
  const buildIso = new Date().toISOString();
  const firestore = await tryInitFirebaseAdmin();

  const articles = await fetchPublishedArticles(firestore);

  if (firestore) {
    console.log(`[sitemap] Firestore reachable: ${articles.length} articles.`);
  } else {
    console.log('[sitemap] Firestore unreachable, using static fallback only.');
  }

  const articleRoutes = articles.map((article) => {
    const section = getPublicArticleSection();
    return { route: `/${section}/${article.slug}`, lastmod: article.updatedAt ?? buildIso };
  });

  // Regional hubs visibili (Italia/regione, Grecia/area, Portogallo/area).
  // Sono inclusi solo quando hanno >= minArticlesToPublish articoli matchanti
  // il regionMatcher (auto-arricchimento da contenuti reali).
  const regionalHubRoutes: Array<{ route: string; lastmod: string }> = [];
  for (const hub of Object.values(DESTINATION_HUBS) as DestinationHub[]) {
    if (!hub.parent) continue;
    const matchCount = countMatchingArticles(hub, articles);
    if (!isHubVisible(hub, matchCount)) continue;
    regionalHubRoutes.push({ route: `/destinazioni/${hub.slug}`, lastmod: buildIso });
  }

  const staticEntries = staticRoutes
    .map((route) =>
      urlEntry(route, {
        changefreq: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? '1.0' : '0.8',
        lastmod: buildIso,
      })
    )
    .join('');

  const articleEntries = articleRoutes
    .map(({ route, lastmod }) =>
      urlEntry(route, { changefreq: 'weekly', priority: '0.7', lastmod })
    )
    .join('');

  const regionalHubEntries = regionalHubRoutes
    .map(({ route, lastmod }) =>
      urlEntry(route, { changefreq: 'weekly', priority: '0.8', lastmod })
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}${regionalHubEntries}${articleEntries}
</urlset>
`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(
    `[sitemap] generated: ${staticRoutes.length} static + ${regionalHubRoutes.length} regional hub + ${articleRoutes.length} article URLs.`
  );

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /account
Disallow: /account/*
Disallow: /articolo
Disallow: /articolo/*
Disallow: /shop

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('[sitemap] robots.txt updated.');
}

main().catch((error) => {
  console.error('[sitemap] fatal:', error);
  process.exit(1);
});
