import { expect, test } from '@playwright/test';

const ROUTES = [
  { path: '/', label: 'home' },
  { path: '/destinazioni', label: 'destinazioni' },
  { path: '/esperienze', label: 'esperienze' },
  { path: '/guide', label: 'guide' },
  { path: '/risorse', label: 'risorse' },
  { path: '/collaborazioni', label: 'collaborazioni' },
  { path: '/media-kit', label: 'media-kit' },
  { path: '/shop', label: 'shop' },
  { path: '/chi-siamo', label: 'chi-siamo' },
  { path: '/contatti', label: 'contatti' },
  { path: '/articolo/puglia-roadtrip-borghi-bianchi', label: 'articolo-preview' },
];

const VIEWPORTS = [
  { width: 375, height: 812, label: 'mobile' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1280, height: 800, label: 'desktop' },
];

const CONSOLE_ERROR_ALLOWLIST = [
  /\[vite\]/i,
  /Failed to load resource.*favicon/i,
  /Download the React DevTools/i,
];

test.describe('Visual quality smoke', () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.label} (${viewport.width}px)`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of ROUTES) {
        test(`${route.label} renders clean`, async ({ page }, testInfo) => {
          const failedImages: string[] = [];
          const consoleErrors: string[] = [];

          page.on('response', (response) => {
            if (
              response.request().resourceType() === 'image' &&
              response.status() >= 400
            ) {
              failedImages.push(`${response.status()} ${response.url()}`);
            }
          });

          page.on('console', (msg) => {
            if (msg.type() !== 'error') return;
            const text = msg.text();
            if (CONSOLE_ERROR_ALLOWLIST.some((re) => re.test(text))) return;
            consoleErrors.push(text);
          });

          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForLoadState('load');
          await expect(page.locator('body')).toBeVisible();
          await expect(page.locator('h1').first()).toBeVisible();
          await page.waitForTimeout(900);

          const layoutMetrics = await page.evaluate(() => {
            const docEl = document.documentElement;
            const viewportWidth = docEl.clientWidth;
            const overflowers = [...document.querySelectorAll('body *')]
              .map((el) => {
                const rect = el.getBoundingClientRect();
                return {
                  tag: el.tagName.toLowerCase(),
                  cls: (el.getAttribute('class') || '').slice(0, 80),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                };
              })
              .filter((x) => x.right > viewportWidth + 1)
              .sort((a, b) => b.right - a.right)
              .slice(0, 5);
            return {
              scrollWidth: docEl.scrollWidth,
              clientWidth: viewportWidth,
              bodyTextLength: document.body.innerText.trim().length,
              visibleLinks: [...document.querySelectorAll('a, button')].filter(
                (element) => {
                  const rect = element.getBoundingClientRect();
                  return rect.width > 0 && rect.height > 0;
                },
              ).length,
              overflowers,
            };
          });

          expect(layoutMetrics.bodyTextLength).toBeGreaterThan(80);
          expect(layoutMetrics.visibleLinks).toBeGreaterThan(0);
          expect(
            layoutMetrics.scrollWidth,
            `Horizontal overflow on ${route.path} (${viewport.label}). Top overflowers: ${JSON.stringify(layoutMetrics.overflowers, null, 2)}`,
          ).toBeLessThanOrEqual(layoutMetrics.clientWidth + 1);
          expect(
            failedImages,
            `Broken images on ${route.path} (${viewport.label})`,
          ).toEqual([]);
          expect(
            consoleErrors,
            `Console errors on ${route.path} (${viewport.label})`,
          ).toEqual([]);

          const screenshot = await page.screenshot({ fullPage: true });
          await testInfo.attach(`${route.label}-${viewport.label}`, {
            body: screenshot,
            contentType: 'image/png',
          });
        });
      }
    });
  }
});
