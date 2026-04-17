import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', label: 'home' },
  { path: '/destinazioni', label: 'destinazioni' },
  { path: '/collaborazioni', label: 'collaborazioni' },
  { path: '/media-kit', label: 'media-kit' },
  { path: '/shop', label: 'shop' },
  { path: '/contatti', label: 'contatti' },
];

test.describe('Visual quality smoke checks', () => {
  for (const route of routes) {
    test(`${route.label} has stable premium page basics`, async ({ page }, testInfo) => {
      const failedImages: string[] = [];

      page.on('response', (response) => {
        const request = response.request();
        if (request.resourceType() === 'image' && response.status() >= 400) {
          failedImages.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto(route.path, { waitUntil: 'networkidle' });
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible();

      const viewportWidth = page.viewportSize()?.width ?? 0;
      const layoutMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyTextLength: document.body.innerText.trim().length,
        visibleLinks: [...document.querySelectorAll('a, button')].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length,
      }));

      expect(layoutMetrics.bodyTextLength).toBeGreaterThan(80);
      expect(layoutMetrics.visibleLinks).toBeGreaterThan(0);
      expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(layoutMetrics.clientWidth + 1);
      expect(failedImages, `Broken images on ${route.path}`).toEqual([]);

      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach(`${route.label}-${viewportWidth}px`, {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  }
});
