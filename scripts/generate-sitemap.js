import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://travelliniwithus.it';

const staticRoutes = [
  '/',
  '/destinazioni',
  '/esperienze',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/shop',
  '/club',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

/**
 * Fetch published article and product slugs from Firestore REST API.
 * Falls back to static-only sitemap if Firebase is unavailable.
 */
async function fetchDynamicSlugs() {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(configPath)) return { articles: [], products: [] };

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const { projectId, firestoreDatabaseId } = config;
  if (!projectId || !firestoreDatabaseId) return { articles: [], products: [] };

  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents:runQuery`;

  async function querySlugs(collectionId) {
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'published' },
                op: 'EQUAL',
                value: { booleanValue: true },
              },
            },
            select: { fields: [{ fieldPath: 'slug' }] },
            limit: 500,
          },
        }),
      });
      if (!res.ok) return [];
      const docs = await res.json();
      return docs
        .filter((d) => d.document?.fields?.slug?.stringValue)
        .map((d) => d.document.fields.slug.stringValue);
    } catch {
      return [];
    }
  }

  const [articles, products] = await Promise.all([
    querySlugs('articles'),
    querySlugs('products'),
  ]);

  return { articles, products };
}

async function generate() {
  const { articles, products } = await fetchDynamicSlugs();

  const dynamicRoutes = [
    ...articles.map((slug) => ({ path: `/articolo/${slug}`, priority: '0.7', freq: 'weekly' })),
    ...products.map((slug) => ({ path: `/shop/${slug}`, priority: '0.6', freq: 'monthly' })),
  ];

  const allEntries = [
    ...staticRoutes.map((route) => ({
      path: route,
      priority: route === '/' ? '1.0' : '0.8',
      freq: route === '/' ? 'daily' : 'weekly',
    })),
    ...dynamicRoutes,
  ];

  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allEntries
    .map(
      (entry) => `
    <url>
      <loc>${BASE_URL}${entry.path === '/' ? '' : entry.path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${entry.freq}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`
    )
    .join('')}
</urlset>
`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`Sitemap generated: ${staticRoutes.length} static + ${articles.length} articles + ${products.length} products`);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully.');
}

generate();
