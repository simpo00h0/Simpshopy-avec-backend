import { test, expect } from '@playwright/test';

test.describe('Page de connexion', () => {
  test('affiche le formulaire de connexion', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /Simpshopy/i })).toBeVisible();
    await expect(page.getByText('Connectez-vous à votre compte')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  });

  test('lien Mot de passe oublié présent', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('link', { name: 'Mot de passe oublié ?' })).toBeVisible();
  });

  test('lien S\'inscrire mène à /signup', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: "S'inscrire" }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('validation affiche erreur si email vide', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByText('Email requis')).toBeVisible();
  });
});
