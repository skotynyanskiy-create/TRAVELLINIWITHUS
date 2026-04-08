import { expect, test, type Page } from '@playwright/test';

async function gotoFast(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
}

test.describe('Public Smoke', () => {
  test('homepage renders the current hero and primary navigation', async ({ page }) => {
    await gotoFast(page, '/');

    await expect(page).toHaveTitle(/Travelliniwithus/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Luoghi che meritano il viaggio|Posti particolari/i
    );
    await expect(
      page.getByText(
        /Posti particolari, tavole memorabili e guide utili|Luoghi che lasciano qualcosa/i
      )
    ).toBeVisible();

    const archiveCta = page.getByRole('link', { name: /Apri l'archivio/i }).first();
    const destinationsCta = page.getByRole('link', { name: /Scopri i posti/i }).first();

    if (await archiveCta.isVisible().catch(() => false)) {
      await archiveCta.click();
      await expect(page).toHaveURL(/\/archivio$/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/L'archivio/i);
    } else {
      await destinationsCta.click();
      await expect(page).toHaveURL(/\/destinazioni$/);
      await expect(page.locator('h1').first()).toContainText(/Destinazioni|regioni/i);
    }
  });

  test('archive and article flow stay truthful whether or not guide content exists', async ({ page }) => {
    await gotoFast(page, '/');

    const guideLink = page.getByRole('link', { name: /Leggi le guide/i }).first();
    await guideLink.click();

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const firstArticleLink = page.locator('a[href^="/articolo/"]').first();
    await firstArticleLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    const hasArticle = await firstArticleLink.isVisible().catch(() => false);

    if (hasArticle) {
      await firstArticleLink.click();
      await expect(page).toHaveURL(/\/articolo\//);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    } else {
      await expect(page.getByRole('textbox', { name: /Cerca nell'archivio/i })).toBeVisible();
      await expect(page.getByText(/risultato|contenuto/i)).toBeVisible();
    }
  });
});
