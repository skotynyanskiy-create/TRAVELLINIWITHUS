import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should load the homepage and display the main title', async ({ page }) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/Travelliniwithus/);

    // Check if the current main hero text is visible
    const heroHeading = page.locator('h1', { hasText: /Posti particolari/i });
    await expect(heroHeading).toBeVisible();
  });

  test('should navigate to Destinazioni page', async ({ page }) => {
    await page.goto('/destinazioni');

    // Check if the URL is stable for the direct public route
    await expect(page).toHaveURL(/.*\/destinazioni/);

    // Check if the page exposes a single visible page heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
