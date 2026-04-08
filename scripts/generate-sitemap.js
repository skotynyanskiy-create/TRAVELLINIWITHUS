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
  '/shop',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map((route) => {
      const fullUrl = `${BASE_URL}${route === '/' ? '' : route}`;
      return `
    <url>
      <loc>${fullUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
      <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>
      `;
    })
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

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('robots.txt generated successfully.');
