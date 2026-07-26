import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const EVIDENCE_DIR = path.join(process.cwd(), 'docs', 'audit', 'evidence');
const SCREENSHOTS_DIR = path.join(EVIDENCE_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

interface ConsoleLogItem {
  type: string;
  text: string;
  location: unknown;
}

interface NetworkFailureItem {
  url: string;
  status: number;
  statusText: string;
}

interface RouteResultItem {
  route: string;
  status: number;
  title: string;
  finalUrl: string;
}

interface ResponsiveResultItem {
  viewport: string;
  width: number;
  height: number;
  hasHorizontalOverflow: boolean;
  status: string;
}

const routesToTest = [
  '/',
  '/guida-in-regalo',
  '/esplora',
  '/destinazione',
  '/destinazione/toscana',
  '/articolo/dolomiti-rifugi-design',
  '/itinerari',
  '/itinerari/compare',
  '/itinerari/sicilia-orientale-5gg',
  '/guide/guida-alla-toscana',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/shop',
  '/shop/guida-premium-dolomiti',
  '/club',
  '/posto/emilia-granduca-di-campigna',
  '/preferiti',
  '/account/acquisti',
  '/lead-magnet',
  '/admin',
  '/admin/users',
  '/admin/orders',
  '/manifesto',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
  '/vieni-con-noi',
  '/non-existent-route-999',
];

const viewports = [
  { width: 320, height: 568, name: '320x568' },
  { width: 375, height: 812, name: '375x812' },
  { width: 390, height: 844, name: '390x844' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 1024, height: 768, name: '1024x768' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 2560, height: 1440, name: '2560x1440' },
];

test.describe('Forensic Real Playwright Audit Suite', () => {
  test('Inspect All 33 Routes & Collect Console/Network Logs', async ({ page }) => {
    const consoleLogs: ConsoleLogItem[] = [];
    const networkFailures: NetworkFailureItem[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location(),
        });
      }
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkFailures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    const routeResults: RouteResultItem[] = [];

    for (const route of routesToTest) {
      const targetUrl = `${BASE_URL}${route}`;
      let responseStatus = 0;
      let title = '';

      try {
        const res = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        responseStatus = res ? res.status() : 0;
        title = await page.title();
      } catch (err: unknown) {
        responseStatus = 500;
        title = err instanceof Error ? err.message : 'Unknown error';
      }

      routeResults.push({
        route,
        status: responseStatus,
        title,
        finalUrl: page.url(),
      });

      // Capture key screenshots
      if (
        ['/', '/esplora', '/destinazione', '/mappa', '/shop', '/guida-in-regalo'].includes(route)
      ) {
        const cleanName = route === '/' ? 'home' : route.replace(/\//g, '_');
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${cleanName}_desktop.png`),
          fullPage: false,
        });
      }
    }

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'playwright-route-results.json'),
      JSON.stringify(routeResults, null, 2)
    );
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'console-errors.json'),
      JSON.stringify(consoleLogs, null, 2)
    );
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'network-failures.json'),
      JSON.stringify(networkFailures, null, 2)
    );

    expect(routeResults.length).toBe(routesToTest.length);
  });

  test('Strict Route Verification: /guida-in-regalo (200 OK) vs /vieni-con-noi (404 Not Found)', async ({
    page,
    request,
  }) => {
    // 1. Test /guida-in-regalo -> HTTP 200 OK on direct GET
    const resGuida = await page.goto(`${BASE_URL}/guida-in-regalo`, {
      waitUntil: 'domcontentloaded',
    });
    expect(resGuida?.status()).toBe(200);
    expect(page.url()).toBe(`${BASE_URL}/guida-in-regalo`);
    await expect(page.locator('h1')).toBeVisible();
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/guida-in-regalo\/?$/);

    // Refresh must stay 200 on same URL
    const resRefresh = await page.reload({ waitUntil: 'domcontentloaded' });
    expect(resRefresh?.status()).toBe(200);
    expect(page.url()).toBe(`${BASE_URL}/guida-in-regalo`);

    // 2. Test /vieni-con-noi -> HTTP 404 Not Found, NO redirect, standard 404 page
    const resVieniHttp = await request.get(`${BASE_URL}/vieni-con-noi`, {
      maxRedirects: 0,
    });
    expect(resVieniHttp.status()).toBe(404);
    expect(resVieniHttp.headers()['location']).toBeUndefined();

    const resVieni = await page.goto(`${BASE_URL}/vieni-con-noi`, {
      waitUntil: 'domcontentloaded',
    });
    expect(resVieni?.status()).toBe(404);
    expect(page.url()).toBe(`${BASE_URL}/vieni-con-noi`);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'vieni_con_noi_404_verified.png'),
    });

    // 3. Sitemap must not list /vieni-con-noi; /guida-in-regalo is private/noindex
    const sitemap = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).not.toContain('/vieni-con-noi');
  });

  test('Multi-Viewport Responsive & Overflow Audit', async ({ page }) => {
    const responsiveResults: ResponsiveResultItem[] = [];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      responsiveResults.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        hasHorizontalOverflow,
        status: hasHorizontalOverflow ? 'FAIL_OVERFLOW' : 'PASS',
      });

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `home_viewport_${vp.name}.png`),
        fullPage: false,
      });
    }

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'playwright-responsive-matrix.json'),
      JSON.stringify(responsiveResults, null, 2)
    );
    expect(responsiveResults.length).toBe(viewports.length);
  });

  test('E2E Cart & Shop Journey Trace', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`, { waitUntil: 'domcontentloaded' });
    const productCard = page.locator('a[href^="/shop/"]').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'e2e_product_detail.png') });
    }
  });
});
