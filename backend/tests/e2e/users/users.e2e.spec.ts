import { test, expect } from '@playwright/test';

/**
 * E2E users flow.
 * Checks user profile, editing info, and logout flow.
 */
test('users: ver perfil -> editar info -> cerrar sesión', async ({ page }) => {
  // First, login with a test user
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('e2e_user@example.com');
  await page.getByPlaceholder('Contraseña').fill('secret123');
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/\/$/);

  // Navigate to profile
  await page.goto('/perfil');
  await expect(page.getByRole('heading', { name: /mi perfil/i })).toBeVisible();

  // Edit user info
  await page.getByPlaceholder('Nombre completo').fill('Usuario E2E Modificado');
  let dialogText = '';
  page.on('dialog', async (dialog) => {
    dialogText = dialog.message();
    await dialog.accept();
  });
  await page.getByRole('button', { name: /guardar cambios/i }).click();
  await expect.poll(() => dialogText).toMatch(/Perfil actualizado/i);

  // Logout
  await page.getByRole('button', { name: /cerrar sesión/i }).click();
  await expect(page).toHaveURL(/\/login$/);
});
