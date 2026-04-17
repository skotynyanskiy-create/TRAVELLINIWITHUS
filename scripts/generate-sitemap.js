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

const now = new Date().toISOString();

function urlEntry(route, { changefreq = 'weekly', priority = '0.8' } = {}) {
  const fullUrl = `${BASE_URL}${route === '/' ? '' : route}`;
  return `
    <url>
      <loc>${fullUrl}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
      `;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map((route) =>
      urlEntry(route, {
        changefreq: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? '1.0' : '0.8',
      })
    )
    .join('')}${filterRoutes
      .map((route) => urlEntry(route, { changefreq: 'weekly', priority: '0.6' }))
      .join('')}
</urlset>
`;

const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully.');

const robotsTxt = `User-agent: *
Allow: /
Disallow: /shop
Disallow: /club
Disallow: /account/acquisti

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('robots.txt generated successfully.');
