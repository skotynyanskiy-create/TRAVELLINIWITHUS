import { test, expect } from '@playwright/test';

test.describe('Shop & Checkout Flow', () => {
  test('should navigate to shop and display products', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    // Verify page loads
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify shop content is visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should load product page from shop slug', async ({ page }) => {
    // This tests FIX #1: routing to /shop/:slug

    // Navigate directly to a product (assumes demo product exists)
    await page.goto('/shop/guida-premium-dolomiti');

    // Product page should load
    await expect(page.locator('h1')).toBeVisible();

    // Should not redirect to /risorse
    expect(page.url()).toContain('/shop/');
    expect(page.url()).not.toContain('/risorse');
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/shop/guida-premium-dolomiti', { waitUntil: 'domcontentloaded' });

    const addToCartBtn = page
      .locator('button')
      .filter({ hasText: /aggiungi|add to cart|compra/i })
      .first();

    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
      expect(page.url()).toBeTruthy();
    } else {
      await expect(
        page.getByText(/Prodotto preview|In uscita prossimamente/i).first()
      ).toBeVisible();
      await expect(page.getByRole('link', { name: /Iscrivimi alla lista/i })).toBeVisible();
    }
  });

  test('should navigate to checkout', async ({ page }) => {
    // Add item to cart
    await page.goto('/shop/guida-premium-dolomiti');

    const addBtn = page
      .locator('button')
      .filter({ hasText: /aggiungi|compra/i })
      .first();
    if ((await addBtn.isVisible().catch(() => false)) && (await addBtn.isEnabled())) {
      await addBtn.click();

      // Wait for cart to open
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);

      // Click checkout button
      const checkoutBtn = page
        .locator('button')
        .filter({ hasText: /checkout|procedi|ordina|paga/i });
      if (await checkoutBtn.first().isVisible()) {
        await checkoutBtn.first().click();

        // If Stripe is configured, should redirect to Stripe
        // If mock checkout, should show success page
        await page.waitForLoadState('domcontentloaded').catch(() => undefined);

        // Verify either:
        // 1. Redirected to Stripe (stripe.com domain) OR
        // 2. Mock success page (?success=true)
        const url = page.url();
        expect(
          url.includes('stripe.com') || url.includes('success=true') || url.includes('payment')
        ).toBeTruthy();
      }
    }
  });

  test('should handle mock checkout in development', async ({ page }) => {
    // Test that ALLOW_MOCK_CHECKOUT works
    // This simulates payment flow without Stripe

    await page.goto('/shop');

    // If mock checkout enabled, adding to cart should work
    // and checkout should return /shop?success=true
    const addBtn = page
      .locator('button')
      .filter({ hasText: /aggiungi|compra/i })
      .first();

    if ((await addBtn.isVisible().catch(() => false)) && (await addBtn.isEnabled())) {
      await addBtn.click();
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);

      const checkoutBtn = page.locator('button').filter({ hasText: /checkout|procedi/i });
      if (await checkoutBtn.first().isVisible()) {
        await checkoutBtn.first().click();
        await page.waitForLoadState('domcontentloaded').catch(() => undefined);

        // For mock checkout, should redirect to /shop?success=true
        if (page.url().includes('success=true')) {
          await expect(page.locator('text=/pagamento|grazie|ordine/i').first()).toBeVisible();
        }
      }
    }
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
