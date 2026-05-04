import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://travelliniwithus.it';

const staticRoutes = [
  '/',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

const DESTINATION_GROUPS = ['Italia', 'Europa', 'Asia', 'Americhe', 'Africa', 'Oceania'];

const EXPERIENCE_TYPES = [
  'Posti particolari',
  'Food & Ristoranti',
  'Locali insoliti',
  'Hotel con carattere',
  'Weekend romantici',
  "Borghi e città d'arte",
  'Passeggiate panoramiche',
  'Relax, terme e spa',
  'Esperienze insolite',
  'Gite e day trip',
];

function slugifyExperienceType(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const filterRoutes = [
  ...DESTINATION_GROUPS.map((group) => `/destinazioni?group=${encodeURIComponent(group)}`),
  ...DESTINATION_GROUPS.map((group) => `/guide?group=${encodeURIComponent(group)}`),
  ...EXPERIENCE_TYPES.map((type) => `/esperienze?type=${slugifyExperienceType(type)}`),
];

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

  const staticEntries = staticRoutes
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
    `Sitemap generated. Static: ${staticRoutes.length}, filters: ${filterRoutes.length}, dynamic: ${dynamicCount}.`
  );

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /shop
Disallow: /club
Disallow: /account/acquisti

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully.');
}

buildSitemap().catch((error) => {
  console.error('[sitemap] generation failed:', error);
  process.exit(1);
});
