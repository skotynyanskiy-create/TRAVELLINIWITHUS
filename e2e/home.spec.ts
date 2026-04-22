import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should load the homepage and display the main title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Travelliniwithus/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Posti particolari che valgono davvero/i,
      })
    ).toBeVisible();
  });

  test('should navigate to Destinazioni page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Scopri destinazioni/i }).click();
    await expect(page).toHaveURL(/.*\/destinazioni/);
    await expect(
      page.getByRole('heading', { level: 1, name: /Trova posti particolari/i }).first()
    ).toBeVisible();
  });
});
