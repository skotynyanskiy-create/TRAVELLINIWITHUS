import fs from 'fs';
import path from 'path';
import { PUBLIC_ROUTE_MANIFEST } from './public-route-manifest.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const contentSeed = require('../src/data/content-seed.json');

const BASE_URL = 'https://travelliniwithus.it';
const LITE_MODE = process.env.VITE_LITE_MODE === 'true';
const LITE_DISABLED_PREFIXES = ['/esplora', '/itinerari', '/shop', '/club', '/preferiti'];

function isLiteDisabled(route) {
  if (!LITE_MODE) return false;
  return LITE_DISABLED_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`));
}

const allStaticRoutes = PUBLIC_ROUTE_MANIFEST.filter((route) => route.sitemap).map(
  (route) => route.path
);

const staticRoutes = allStaticRoutes.filter((route) => !isLiteDisabled(route));

// Consolidamento 2026-05-15: /destinazioni, /esperienze, /guide rimossi
// come pagine standalone. Restano `/esplora` (archivio universale + finder)
// e `/mappa` (vista geo) come unici hub discovery: entrambi sono ora in
// staticRoutes come hub canonici.
const discoveryRoutes = [];

// Landing regione SEO (mantenuto in sync con src/lib/regions.ts → REGIONS_DATA
// e server.ts → REGION_LANDING_SLUGS). Priority 0.8 perche' sono entry-point
// per query come "viaggio in puglia", "cosa vedere in sicilia".
// 2026-06-23: noindex rimosso da Destinazione.tsx (ContentItem reali). Rimettere
// REGION_LANDINGS_PUBLISHED = true dopo verifica che ogni slug ha articoli pubblicati
// su Firestore (articles collection) oppure ContentItem sufficienti.
const REGION_LANDINGS_PUBLISHED = false;
const regionLandingSlugs = REGION_LANDINGS_PUBLISHED
  ? ['puglia', 'sicilia', 'sardegna', 'toscana', 'campania', 'trentino-alto-adige']
  : [];

// Filter routes (?zone=, ?type=) sono intenzionalmente esclusi dalla sitemap:
// Google li tratta come duplicate content del canonical `/esplora`. Quando
// avremo pagine fisiche `/esplora/italia` o `/esplora/posti-particolari`,
// si aggiungono qui come staticRoutes.
const filterRoutes = [];

// Priority differenziata per ruolo: evita il segnale piatto 0.8 su tutto.
// Le legali e le utility scendono; discovery/brand/B2B restano alte.
const ROLE_BY_PATH = new Map(PUBLIC_ROUTE_MANIFEST.map((r) => [r.path, r.role]));
const PRIORITY_BY_ROLE = {
  home: '1.0',
  discovery: '0.9',
  brand: '0.8',
  'b2b-sales': '0.8',
  'b2b-lead': '0.8',
  resources: '0.7',
  press: '0.6',
  contact: '0.6',
  map: '0.6',
  tools: '0.6',
  waitlist: '0.5',
  legal: '0.3',
};

function priorityForRoute(route) {
  if (route === '/') return '1.0';
  const role = ROLE_BY_PATH.get(route);
  return (role && PRIORITY_BY_ROLE[role]) || '0.7';
}

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
    const articlesSnap = await db.collection('articles').where('published', '==', true).get();
    const productsSnap = LITE_MODE
      ? { docs: [] }
      : await db.collection('products').where('published', '==', true).get();

    const articleRoutes = articlesSnap.docs
      .map((doc) => doc.data())
      .filter((data) => typeof data.slug === 'string' && data.slug.length > 0)
      .map((data) => ({
        route: `/articolo/${data.slug}`,
        lastmod:
          toIsoLastmod(data.updatedAt) || toIsoLastmod(data.date) || new Date().toISOString(),
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
        priority: priorityForRoute(route),
        lastmod: now,
      })
    )
    .join('');

  const regionEntries = regionLandingSlugs
    .map((slug) =>
      urlEntry(`/destinazione/${slug}`, {
        changefreq: 'weekly',
        priority: '0.8',
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

  // Pagine-posto indicizzabili: una per ogni ContentItem nel seed.
  // Priority 0.7 (discovery content), changefreq monthly (dati stabili).
  const postoEntries = contentSeed
    .map((item) =>
      urlEntry(`/posto/${item.id}`, { changefreq: 'monthly', priority: '0.7', lastmod: now })
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}${regionEntries}${filterEntries}${articleEntries}${productEntries}${postoEntries}
</urlset>
`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  const dynamicCount = (dynamic?.articleRoutes.length || 0) + (dynamic?.productRoutes.length || 0);
  console.log(
    `Sitemap generated. Static: ${staticRoutes.length + discoveryRoutes.length}, regions: ${regionLandingSlugs.length}, filters: ${filterRoutes.length}, posto: ${contentSeed.length}, dynamic: ${dynamicCount}.`
  );

  // robots.txt: keep public routes crawlable (incl. /shop, /vieni-con-noi,
  // /lead-magnet which use HTML <meta name="robots" noindex> on demo/preview
  // pages). Blocking via robots.txt PREVENTS Googlebot from reading noindex,
  // so noindex is the canonical mechanism.
  const liteDisallow = LITE_MODE
    ? `Disallow: /esplora
Disallow: /itinerari
Disallow: /shop
Disallow: /club
Disallow: /preferiti
`
    : '';

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account/acquisti
Disallow: /iscrivi
Disallow: /*?zone=
Disallow: /*?type=
${liteDisallow}
Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully.');
}

buildSitemap().catch((error) => {
  console.error('[sitemap] generation failed:', error);
  process.exit(1);
});
