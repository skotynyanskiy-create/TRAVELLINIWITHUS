import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should load the homepage and display the main title', async ({ page }) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/Travelliniwithus/);

    // Asserisce l'invariante di CLAUDE.md ("one strong h1"), non la copy: il
    // vecchio hasText /Posti particolari/ e rimasto indietro al redesign della
    // home e faceva fallire la suite pur con la pagina perfettamente sana.
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toHaveCount(1);
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).not.toBeEmpty();
  });

  test('legacy /destinazioni redirects to /esplora', async ({ page }) => {
    await page.goto('/destinazioni');

    // Consolidamento 2026-05-15: legacy redirects via <Navigate replace> client-side
    await expect(page).toHaveURL(/.*\/esplora/);

    // Esplora hero h1
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should load Esplora page directly', async ({ page }) => {
    await page.goto('/esplora');

    await expect(page).toHaveURL(/.*\/esplora/);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
