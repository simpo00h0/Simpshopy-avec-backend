import { test, expect } from '@playwright/test';

test.describe('Page d\'inscription', () => {
  test('affiche le formulaire d\'inscription', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('heading', { name: /Simpshopy/i })).toBeVisible();
    await expect(page.getByPlaceholder('Jean')).toBeVisible();
    await expect(page.getByPlaceholder('Dupont')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel(/Mot de passe/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
  });

  test('lien Se connecter mène à /login', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
