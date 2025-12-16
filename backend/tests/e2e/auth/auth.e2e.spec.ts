import { test, expect } from '@playwright/test';

/**
 * E2E (frontend -> backend) auth flow.
 * - Uses real UI pages (/login/register and /login)
 * - Uses real backend endpoint /auth/register and /auth/login
 *
 * Requirements:
 * - Servers are started by playwright.config.ts webServer.
 * - If you don't have a local DB, set E2E_START_BACKEND=false and E2E_BACKEND_URL to staging.
 */

test('auth: register -> login -> token stored', async ({ page }) => {
  const uniqueEmail = `e2e_${Date.now()}@example.com`;

  // Register
  await page.goto('/login/register');

  // FormRegister.tsx uses placeholders in Spanish.
  await page.getByPlaceholder('Nombre completo').fill('E2E User');
  await page.getByPlaceholder('Correo electrónico').fill(uniqueEmail);
  await page.getByPlaceholder('Contraseña').fill('secret123');
  await page.getByPlaceholder('Confirmar contraseña').fill('secret123');

  // Handle success alert dialog ("✅ Registro exitoso...")
  let dialogText = '';
  page.on('dialog', async (dialog) => {
    dialogText = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: /registrarme/i }).click();

  // Should navigate to /login
  await expect(page).toHaveURL(/\/login$/);
  await expect.poll(() => dialogText).toMatch(/Registro exitoso/i);

  // Login
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Contraseña').fill('secret123');
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  // Non-admin users should be redirected to '/'
  await expect(page).toHaveURL(/\/$/);

  // Verify token persisted
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();

  const user = await page.evaluate(() => localStorage.getItem('user'));
  expect(user).toContain(uniqueEmail);
});
