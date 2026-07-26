import { Request, Response, Router } from 'express';

export function createSeoRouter(
  fetchAllArticles: () => Promise<
    { title: string; description: string; slug: string; date: string }[]
  >,
  escapeHtml: (str: string) => string
): Router {
  const router = Router();

  router.get('/sitemap.xml', async (req: Request, res: Response) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const articles = await fetchAllArticles();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const staticRoutes = [
      '',
      '/esplora',
      '/mappa',
      '/itinerari',
      '/risorse',
      '/shop',
      '/club',
      '/collaborazioni',
      '/media-kit',
      '/contatti',
      '/chi-siamo',
      '/press',
      '/destinazione/puglia',
      '/destinazione/sicilia',
      '/destinazione/sardegna',
      '/destinazione/toscana',
      '/destinazione/campania',
      '/destinazione/trentino-alto-adige',
      '/privacy',
      '/cookie',
      '/termini',
      '/disclaimer',
    ];

    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${origin}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    const now = Date.now();
    for (const article of articles) {
      const lastmod = article.date.includes('T') ? article.date.split('T')[0] : article.date;
      const ageMs = now - new Date(article.date).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      const priority = ageDays < 30 ? '0.9' : ageDays < 90 ? '0.7' : '0.5';
      xml += `  <url>\n    <loc>${origin}/articolo/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  router.get('/rss.xml', async (req: Request, res: Response) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const articles = await fetchAllArticles();

    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    xml += '<rss version="2.0">\n<channel>\n';
    xml += '  <title>Travelliniwithus</title>\n';
    xml += `  <link>${origin}</link>\n`;
    xml += '  <description>Travel blog di Rodrigo &amp; Betta</description>\n';

    for (const article of articles) {
      xml += '  <item>\n';
      xml += `    <title>${escapeHtml(article.title)}</title>\n`;
      xml += `    <link>${origin}/articolo/${article.slug}</link>\n`;
      xml += `    <description>${escapeHtml(article.description)}</description>\n`;
      xml += `    <pubDate>${new Date(article.date).toUTCString()}</pubDate>\n`;
      xml += '  </item>\n';
    }

    xml += '</channel>\n</rss>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  return router;
}
