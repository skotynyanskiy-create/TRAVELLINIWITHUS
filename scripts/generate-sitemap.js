import fs from 'fs';
import path from 'path';
import { isIndexable, sitemapPaths } from '../src/config/surfaces.ts';
import { DESTINATIONS, getDestinationUrl } from '../src/config/destinations.ts';
import { DEMO_GUIDES } from '../src/config/demoGuides.ts';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const contentSeed = require('../src/data/content-seed.json');

const BASE_URL = 'https://travelliniwithus.it';

// Lo stato delle superfici e la fonte unica: niente copia locale della logica
// lite, che qui era riscritta a mano ed era la terza in giro per il repo.
const staticRoutes = sitemapPaths();

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
// Mappa di sole priorita SEO: non e verita di superficie (quella vive in
// surfaces.ts), e per questo resta locale a questo script.
const ROLE_BY_PATH = new Map([
  ['/', 'home'],
  ['/esplora', 'discovery'],
  ['/destinazione', 'discovery'],
  ['/press', 'press'],
  ['/mappa', 'map'],
  ['/chi-siamo', 'brand'],
  ['/family', 'brand'],
  ['/family/consigli', 'discovery'],
  ['/collaborazioni', 'b2b-sales'],
  ['/media-kit', 'b2b-lead'],
  ['/contatti', 'contact'],
  ['/risorse', 'resources'],
  ['/club', 'waitlist'],
  ['/privacy', 'legal'],
  ['/cookie', 'legal'],
  ['/termini', 'legal'],
  ['/disclaimer', 'legal'],
]);
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
    const productsSnap = await db.collection('products').where('published', '==', true).get();

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

  // Destinazioni (zone + regioni/paesi dall'albero DESTINATIONS): niente flag
  // isPlaceholder qui (non esiste sul DestinationNode) e Destinazione.tsx non le
  // mette mai in noindex — ma passano comunque da isIndexable() sulla stessa
  // fonte unica (surfaces.ts) usata dal componente, cosi la sitemap resta
  // corretta anche se lo stato di superficie cambia in futuro. getDestinationUrl
  // e' la stessa funzione che il componente usa per il proprio canonical: niente
  // URL alternativi (es. /destinazione/toscana a un segmento) fuori sync col
  // canonical dichiarato dalla pagina.
  const indexableDestinations = DESTINATIONS.filter((node) =>
    isIndexable(getDestinationUrl(node))
  );
  const destinationEntries = indexableDestinations
    .map((node) =>
      urlEntry(getDestinationUrl(node), {
        changefreq: 'weekly',
        priority: node.parentSlug ? '0.7' : '0.8',
        lastmod: now,
      })
    )
    .join('');

  // Guide: SOLO quelle non demo. Doppio controllo, in OR come fa isIndexable()
  // stesso — la superficie /guide/:slug e' 'preview' finche' non c'e' almeno una
  // guida vera (vedi surfaces.ts), e il singolo item ha il suo isDemo (vedi
  // Guida.tsx: noindex={guide.isDemo}). Oggi entrambi escludono tutte e 3 le
  // guide demo: la sitemap risulta vuota qui finche' non lo sono davvero, non
  // per omissione.
  const indexableGuides = DEMO_GUIDES.filter(
    (guide) => !guide.isDemo && isIndexable(`/guide/${guide.slug}`)
  );
  const guideEntries = indexableGuides
    .map((guide) => urlEntry(`/guide/${guide.slug}`, { changefreq: 'monthly', priority: '0.6', lastmod: now }))
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

  // Pagine-posto: SOLO i posti reali (isPlaceholder:false). I placeholder sono
  // noindex (vedi Posto.tsx) ed esclusi dalla sitemap — pass di onestà: niente
  // ~40 pagine finte indicizzate. Tornano in sitemap quando l'import Instagram
  // porta il dato reale. Priority 0.7, changefreq monthly.
  const indexablePosti = contentSeed.filter((item) => !item.isPlaceholder);
  const postoEntries = indexablePosti
    .map((item) =>
      urlEntry(`/posto/${item.id}`, { changefreq: 'monthly', priority: '0.7', lastmod: now })
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}${regionEntries}${filterEntries}${destinationEntries}${guideEntries}${articleEntries}${productEntries}${postoEntries}
</urlset>
`;

  // Guardia di validità: niente <loc> duplicati (Google tratta i duplicati come
  // segnale di sitemap non curata) e ogni <loc> deve essere un URL assoluto
  // valido sotto BASE_URL. Blocca la build invece di scrivere un file rotto.
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) duplicates.add(loc);
    seen.add(loc);
  }
  if (duplicates.size > 0) {
    throw new Error(
      `[sitemap] URL duplicati in sitemap.xml:\n  ${[...duplicates].join('\n  ')}`
    );
  }
  const malformed = locs.filter((loc) => {
    if (!loc.startsWith(BASE_URL)) return true;
    try {
      new URL(loc);
      return false;
    } catch {
      return true;
    }
  });
  if (malformed.length > 0) {
    throw new Error(`[sitemap] URL non validi in sitemap.xml:\n  ${malformed.join('\n  ')}`);
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  const dynamicCount = (dynamic?.articleRoutes.length || 0) + (dynamic?.productRoutes.length || 0);
  console.log(
    `Sitemap generated. Static: ${staticRoutes.length + discoveryRoutes.length}, regions: ${regionLandingSlugs.length}, filters: ${filterRoutes.length}, destinazioni: ${indexableDestinations.length}/${DESTINATIONS.length}, guide: ${indexableGuides.length}/${DEMO_GUIDES.length} reali, posto: ${indexablePosti.length}/${contentSeed.length} reali, dynamic: ${dynamicCount}, url totali: ${locs.length}.`
  );

  // robots.txt: keep public routes crawlable (incl. /shop, /lead-magnet,
  // /guida-in-regalo which use HTML <meta name="robots" noindex> on private/
  // preview pages). Blocking via robots.txt PREVENTS Googlebot from reading noindex,
  // so noindex is the canonical mechanism.
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account/acquisti
Disallow: /iscrivi
Disallow: /*?zone=
Disallow: /*?type=
Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully.');
}

buildSitemap().catch((error) => {
  console.error('[sitemap] generation failed:', error);
  process.exit(1);
});
