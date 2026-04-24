import { test, expect } from '@playwright/test';

test.describe('Dove dormire — hotel flow', () => {
  test('landing renders unique h1, breadcrumb and 4 destination blocks', async ({ page }) => {
    await page.goto('/dove-dormire');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Gli hotel che consigliamo davvero/i
    );

    await expect(page.getByRole('link', { name: 'Guide' }).first()).toBeVisible();

    const destinations = ['Dolomiti', 'Puglia', 'Grecia delle isole', 'Portogallo'];
    for (const destination of destinations) {
      await expect(
        page.getByRole('heading', {
          level: 3,
          name: new RegExp(`I nostri alloggi consigliati a ${destination}`, 'i'),
        })
      ).toBeVisible();
    }
  });

  test('hotel cards expose affiliate rel attributes and open in new tab', async ({ page }) => {
    await page.goto('/dove-dormire');

    const outbound = page.locator('a[target="_blank"][rel*="sponsored"]');
    await expect(outbound.first()).toBeVisible();

    const count = await outbound.count();
    expect(count).toBeGreaterThan(0);

    const firstRel = await outbound.first().getAttribute('rel');
    expect(firstRel).toMatch(/nofollow/);
    expect(firstRel).toMatch(/sponsored/);
    expect(firstRel).toMatch(/noopener/);
    expect(firstRel).toMatch(/noreferrer/);
  });

  test('Portogallo "Apri destinazione" navigates to the country hub', async ({ page }) => {
    await page.goto('/dove-dormire');

    await page
      .getByRole('link', { name: /Apri destinazione/i })
      .last()
      .click();

    await expect(page).toHaveURL(/.*\/destinazioni\/portogallo/);
  });
});
