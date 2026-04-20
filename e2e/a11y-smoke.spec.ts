import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/destinazioni',
  '/esperienze',
  '/guide',
  '/shop',
  '/chi-siamo',
  '/contatti',
];

test.describe('A11y smoke (critical + serious)', () => {
  for (const path of ROUTES) {
    test(`${path} has no critical or serious a11y violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('load');
      await expect(page.locator('main h1').first()).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(500);

      // color-contrast violations are tracked as brand-debt in
      // docs/14_Bugs/QA_FASE_2_5.md and require an owner decision on
      // --color-accent before they can be resolved.
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      const report = blocking.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.target),
      }));

      expect(blocking, JSON.stringify(report, null, 2)).toEqual([]);
    });
  }
});
