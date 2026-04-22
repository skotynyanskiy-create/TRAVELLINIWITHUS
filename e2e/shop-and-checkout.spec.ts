import { test, expect } from '@playwright/test';

test.describe('Shop & Checkout Flow', () => {
  test('should navigate to shop and display products', async ({ page }) => {
    await page.goto('/shop');

    await expect(page).toHaveTitle(/Travelliniwithus/i);
    await expect(
      page.getByRole('heading', { level: 1, name: /Guide e toolkit/i })
    ).toBeVisible();
    await expect(page.getByText(/Boutique in apertura/i)).toBeVisible();
  });

  test('should load product page from shop slug', async ({ page }) => {
    await page.goto('/shop/guida-premium-dolomiti');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(page.url()).toContain('/shop/');
    expect(page.url()).not.toContain('/risorse');
  });

  test('should keep demo product in preview mode', async ({ page }) => {
    await page.goto('/shop/guida-premium-dolomiti');

    await expect(page.getByText(/Prodotto preview/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Iscrivimi alla lista/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Aggiungi al carrello/i })).toHaveCount(0);
  });

  test('should render the success state when checkout returns to shop', async ({ page }) => {
    await page.goto('/shop?success=true');

    await expect(page.getByRole('heading', { name: /Pagamento completato/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Chiudi/i })).toBeVisible();
  });
});

test.describe('Admin Access', () => {
  test('should require authentication for admin pages', async ({ page }) => {
    // Navigate to admin without logging in
    await page.goto('/admin');

    // Should show login screen
    await expect(page.locator('text=/accesso|login|google/i').first()).toBeVisible();
  });

  test('should allow admin preview on localhost', async ({ page }) => {
    // Test that localhost preview mode works
    const LOCAL_PREVIEW_URL = '/admin?previewAdmin=1';

    await page.goto(LOCAL_PREVIEW_URL);

    // On localhost, should allow access
    const isLocalhost = page.url().includes('localhost') || page.url().includes('127.0.0.1');

    if (isLocalhost) {
      // Dashboard should load
      await expect(page.locator('text=/dashboard|admin|gestione/i').first()).toBeVisible();
    }
  });
});
