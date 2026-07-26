import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', label: 'Home' },
  { path: '/esplora', label: 'Esplora' },
  { path: '/mappa', label: 'Mappa' },
  { path: '/collaborazioni', label: 'Collaborazioni' },
  { path: '/media-kit', label: 'Media Kit' },
  { path: '/shop', label: 'Shop' },
  { path: '/contatti', label: 'Contatti' },
  { path: '/chi-siamo', label: 'Chi Siamo' },
  { path: '/itinerari', label: 'Itinerari' },
  { path: '/guide', label: 'Guide' },
  { path: '/risorse', label: 'Risorse' },
  { path: '/vieni-con-noi', label: 'Vieni con Noi' },
  { path: '/club', label: 'Club' },
];

const mobileViewports = [
  { width: 375, height: 667, name: '375px iPhone SE / standard mobile' },
  { width: 320, height: 568, name: '320px ultra-small mobile' },
];

test.describe('Milestone 3 Compliance Audit — WCAG AA & 375px Mobile Viewport', () => {
  for (const viewport of mobileViewports) {
    test.describe(`Mobile Viewport ${viewport.width}px (${viewport.name})`, () => {
      for (const route of routes) {
        test(`${route.label} (${route.path}) has 0 horizontal scrollbar overflow at ${viewport.width}px`, async ({
          page,
        }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(750);

          const layoutMetrics = await page.evaluate(() => {
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              windowWidth: window.innerWidth,
              bodyScrollWidth: document.body.scrollWidth,
            };
          });

          // Horizontal scroll overflow check: scrollWidth must equal clientWidth (within 1px margin)
          expect(
            layoutMetrics.scrollWidth,
            `Horizontal overflow detected on ${route.path} at ${viewport.width}px! scrollWidth (${layoutMetrics.scrollWidth}) > clientWidth (${layoutMetrics.clientWidth})`
          ).toBeLessThanOrEqual(layoutMetrics.clientWidth + 1);

          expect(
            layoutMetrics.bodyScrollWidth,
            `Body overflow detected on ${route.path} at ${viewport.width}px! bodyScrollWidth (${layoutMetrics.bodyScrollWidth}) > clientWidth (${layoutMetrics.clientWidth})`
          ).toBeLessThanOrEqual(layoutMetrics.clientWidth + 1);
        });
      }
    });
  }

  test.describe('WCAG AA Accessibility Checks across all main routes', () => {
    for (const route of routes) {
      test(`${route.label} (${route.path}) satisfies key WCAG AA standards`, async ({ page }) => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(750);

        const a11yAudit = await page.evaluate(() => {
          const htmlLang = document.documentElement.getAttribute('lang');

          // Check single H1
          const h1s = Array.from(document.querySelectorAll('h1'));
          const h1Count = h1s.length;

          // Check images
          const images = Array.from(document.querySelectorAll('img'));
          const imagesWithoutAlt = images.filter((img) => {
            const hasAlt = img.hasAttribute('alt');
            const ariaHidden = img.getAttribute('aria-hidden') === 'true';
            const rolePresentation = img.getAttribute('role') === 'presentation';
            return !hasAlt && !ariaHidden && !rolePresentation;
          });

          // Check interactive elements (buttons & links)
          const interactiveElements = Array.from(
            document.querySelectorAll('button, a[href], input, select, textarea')
          );
          const unlabeledInteractive = interactiveElements.filter((el) => {
            const textContent = el.textContent?.trim() || '';
            const ariaLabel = el.getAttribute('aria-label')?.trim() || '';
            const ariaLabelledBy = el.getAttribute('aria-labelledby')?.trim() || '';
            const title = el.getAttribute('title')?.trim() || '';
            const value = (el as HTMLInputElement).value?.trim() || '';
            const placeholder = (el as HTMLInputElement).placeholder?.trim() || '';
            const alt = (el as HTMLImageElement).alt?.trim() || '';
            const id = el.getAttribute('id');
            const hasAssociatedLabel = id
              ? document.querySelector(`label[for="${id}"]`) !== null
              : false;

            return (
              !textContent &&
              !ariaLabel &&
              !ariaLabelledBy &&
              !title &&
              !value &&
              !placeholder &&
              !alt &&
              !hasAssociatedLabel
            );
          });

          return {
            htmlLang,
            h1Count,
            totalImages: images.length,
            missingAltCount: imagesWithoutAlt.length,
            totalInteractive: interactiveElements.length,
            unlabeledInteractiveCount: unlabeledInteractive.length,
          };
        });

        expect(a11yAudit.htmlLang, `HTML tag missing lang attribute on ${route.path}`).toBe('it');
        expect(a11yAudit.h1Count, `Page ${route.path} should have exactly 1 H1 heading`).toBe(1);
        expect(
          a11yAudit.missingAltCount,
          `Found ${a11yAudit.missingAltCount} <img> elements without alt attribute on ${route.path}`
        ).toBe(0);
        expect(
          a11yAudit.unlabeledInteractiveCount,
          `Found ${a11yAudit.unlabeledInteractiveCount} interactive elements without accessible labels on ${route.path}`
        ).toBe(0);
      });
    }
  });
});
