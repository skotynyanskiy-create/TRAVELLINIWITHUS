import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://travelliniwithus.it';

const staticRoutes = [
  '/',
  '/esplora',
  '/itinerari',
  '/itinerari/compare',
  '/quiz',
  '/strumenti',
  '/press',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/shop',
  '/club',
  '/lead-magnet',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

// Consolidamento 2026-05-15: /destinazioni, /esperienze, /guide rimossi
// come pagine standalone. Restano `/esplora` (archivio universale + finder)
// e `/mappa` (vista geo) come unici hub discovery: entrambi sono ora in
// staticRoutes come hub canonici.
const discoveryRoutes = [];

// Filter routes (?zone=, ?type=) sono intenzionalmente esclusi dalla sitemap:
// Google li tratta come duplicate content del canonical `/esplora`. Quando
// avremo pagine fisiche `/esplora/italia` o `/esplora/posti-particolari`,
// si aggiungono qui come staticRoutes.
const filterRoutes = [];

function urlEntry(route, { changefreq = 'weekly', priority = '0.8', lastmod } = {}) {
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

async function fetchDynamicRoutes() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;

  try {
    const credentialJson = raw.trim().startsWith('{')
      ? JSON.parse(raw)
      : JSON.parse(fs.readFileSync(raw, 'utf8'));

    const { initializeApp, getApps, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    if (getApps().length === 0) {
      initializeApp({ credential: cert(credentialJson) });
    }

    const db = getFirestore();
    const [articlesSnap, productsSnap] = await Promise.all([
      db.collection('articles').where('published', '==', true).get(),
      db.collection('products').where('published', '==', true).get(),
    ]);

    const articleRoutes = articlesSnap.docs
      .map((doc) => doc.data())
      .filter((data) => typeof data.slug === 'string' && data.slug.length > 0)
      .map((data) => ({
        route: `/articolo/${data.slug}`,
        lastmod: toIsoLastmod(data.updatedAt) || toIsoLastmod(data.date) || new Date().toISOString(),
      }));

    const productRoutes = productsSnap.docs
      .map((doc) => doc.data())
      .filter((data) => typeof data.slug === 'string' && data.slug.length > 0)
      .map((data) => ({
        route: `/shop/${data.slug}`,
        lastmod: toIsoLastmod(data.updatedAt) || new Date().toISOString(),
      }));

    return { articleRoutes, productRoutes };
  } catch (error) {
    console.warn('[sitemap] Firestore lookup skipped:', error?.message || error);
    return null;
  }
}

function toIsoLastmod(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  if (typeof value === 'object' && value !== null && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (typeof value === 'object' && value !== null && typeof value._seconds === 'number') {
    return new Date(value._seconds * 1000).toISOString();
  }
  return null;
}

async function buildSitemap() {
  const now = new Date().toISOString();
  const dynamic = await fetchDynamicRoutes();

  const staticEntries = [...staticRoutes, ...discoveryRoutes]
    .map((route) =>
      urlEntry(route, {
        changefreq: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? '1.0' : '0.8',
        lastmod: now,
      })
    )
    .join('');

  const filterEntries = filterRoutes
    .map((route) => urlEntry(route, { changefreq: 'weekly', priority: '0.6', lastmod: now }))
    .join('');

  const articleEntries = (dynamic?.articleRoutes || [])
    .map(({ route, lastmod }) =>
      urlEntry(route, { changefreq: 'monthly', priority: '0.7', lastmod })
    )
    .join('');

  const productEntries = (dynamic?.productRoutes || [])
    .map(({ route, lastmod }) =>
      urlEntry(route, { changefreq: 'monthly', priority: '0.5', lastmod })
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}${filterEntries}${articleEntries}${productEntries}
</urlset>
`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  const dynamicCount = (dynamic?.articleRoutes.length || 0) + (dynamic?.productRoutes.length || 0);
  console.log(
    `Sitemap generated. Static: ${staticRoutes.length + discoveryRoutes.length}, filters: ${filterRoutes.length}, dynamic: ${dynamicCount}.`
  );

  // robots.txt: keep public routes crawlable (incl. /shop, /vieni-con-noi,
  // /lead-magnet which use HTML <meta name="robots" noindex> on demo/preview
  // pages). Blocking via robots.txt PREVENTS Googlebot from reading noindex,
  // so noindex is the canonical mechanism.
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account/acquisti
Disallow: /iscrivi

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully.');
}

buildSitemap().catch((error) => {
  console.error('[sitemap] generation failed:', error);
  process.exit(1);
});
