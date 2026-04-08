import { expect, test, type Page } from '@playwright/test';

async function gotoFast(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
}

test.describe('Shop, Leads and Admin Smoke', () => {
  test('shop shows either real products or an explicit not-yet-open state', async ({ page }) => {
    await gotoFast(page, '/shop');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Shop|Strumenti per il viaggio/i
    );
    await expect(
      page.getByText(/Guide, planner e strumenti digitali|Queste guide e risorse nascono/i)
    ).toBeVisible();

    const productLink = page.locator('a[href^="/shop/"]').first();
    await productLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    const hasProduct = await productLink.isVisible().catch(() => false);

    if (hasProduct) {
      await productLink.click();
      await expect(page).toHaveURL(/\/shop\//);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    } else {
      await expect(page.getByText(/Apertura shop in preparazione/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /Chiedi aggiornamenti/i })).toBeVisible();
    }
  });

  test('contact form submits successfully', async ({ page }) => {
    await page.route('**/api/contact-lead', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoFast(page, '/contatti');

    await page.locator('#name').fill('Test Brand');
    await page.locator('#email').fill('test@example.com');
    await page
      .getByRole('combobox', { name: /Motivo del contatto/i })
      .selectOption({ label: 'Altro / informazioni generali' });
    await page.getByLabel(/Messaggio/i).fill('Vorremmo capire come proporvi un progetto mirato.');
    await page.getByRole('button', { name: /Invia richiesta/i }).click();

    await expect(page.getByRole('heading', { name: /Messaggio inviato/i })).toBeVisible();
  });

  test('media kit CTA from collaborations reaches the lead surface', async ({ page }) => {
    await gotoFast(page, '/collaborazioni');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Contenuti che portano|Solo brand che amano/i
    );

    await page.getByRole('link', { name: /Richiedi il media kit/i }).first().click();
    await expect(page).toHaveURL(/media-kit|collaborazioni/i);
    await expect(
      page.getByRole('heading', { name: /Richiedi il media kit|Media kit/i }).first()
    ).toBeVisible();
  });

  test('admin remains protected and local preview still works on localhost', async ({ page }) => {
    await gotoFast(page, '/admin');
    await expect(page.getByRole('heading', { name: /Accesso Riservato/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Accedi con Google/i })).toBeVisible();

    await gotoFast(page, '/admin?previewAdmin=1');
    await expect(page.getByText(/Dashboard|Gestione contenuti|Panoramica/i).first()).toBeVisible();
  });
});
