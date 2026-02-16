import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil', () => {
  test('affiche le titre Simpshopy et le hero', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Simpshopy/i })).toBeVisible();
    await expect(page.getByText(/Vendez en ligne en Afrique de l'Ouest/i)).toBeVisible();
  });

  test('les liens Se connecter et Démarrer mènent aux bonnes pages', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href="/login"]').first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await page.goto('/');
    await page.locator('a[href="/signup"]').first().click();
    await expect(page).toHaveURL(/\/signup/, { timeout: 15000 });
  });

  test('affiche les 3 étapes de lancement', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Lancez-vous en 3 étapes')).toBeVisible();
    await expect(page.getByText('Créez votre compte')).toBeVisible();
    await expect(page.getByText('Ajoutez vos produits', { exact: true })).toBeVisible();
    await expect(page.getByText('Configurez les paiements')).toBeVisible();
  });
});
