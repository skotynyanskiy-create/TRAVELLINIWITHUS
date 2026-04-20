import { expect, test } from '@playwright/test';

test.describe('Forms', () => {
  test('newsletter footer accepts email and shows success', async ({ page }) => {
    await page.route('**/api/newsletter-subscribe', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const newsletterSection = page.locator('#newsletter');
    await newsletterSection.scrollIntoViewIfNeeded();

    const emailInput = newsletterSection.locator('input[type="email"]').first();
    await emailInput.fill('qa@example.com');

    const submitButton = newsletterSection
      .locator('button[type="submit"], button:has-text("Iscriviti")')
      .first();
    await submitButton.click();

    await expect(page.getByText('Iscrizione confermata.')).toBeVisible({ timeout: 8000 });
  });

  test('contatti form submits and shows confirmation', async ({ page }) => {
    await page.route('**/api/contact-lead', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto('/contatti', { waitUntil: 'domcontentloaded' });

    await page.locator('#name').fill('QA Tester');
    await page.locator('#email').fill('qa@example.com');
    await page.locator('#topic').selectOption('other');
    await page
      .locator('#message')
      .fill('Test automatico QA Fase 2.5 — ignora questo messaggio.');

    await page.locator('form button[type="submit"]').click();

    await expect(page.getByRole('heading', { name: 'Messaggio inviato' })).toBeVisible({
      timeout: 8000,
    });
  });
});
