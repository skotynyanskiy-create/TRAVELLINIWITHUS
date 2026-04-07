import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should load the homepage and display the main title', async ({ page }) => {
    await page.goto('/');
    
    // Check if the title is correct
    await expect(page).toHaveTitle(/Travelliniwithus/);
    
    // Check if the main hero text is visible
    const heroHeading = page.locator('h1', { hasText: /L'Arte di/i });
    await expect(heroHeading).toBeVisible();
  });

  test('should navigate to Destinazioni page', async ({ page }) => {
    await page.goto('/');
    
    // Click on the Destinazioni link in the navbar
    const destinazioniLink = page.locator('nav a', { hasText: /Destinazioni/i }).first();
    await destinazioniLink.click();
    
    // Check if the URL changed
    await expect(page).toHaveURL(/.*\/destinazioni/);
    
    // Check if the page heading is correct
    const heading = page.locator('h1', { hasText: /Destinazioni/i });
    await expect(heading).toBeVisible();
  });
});
