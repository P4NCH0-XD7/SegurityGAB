import { test, expect } from '@playwright/test';

test('login: admin -> redirects to admin dashboard', async ({ page }) => {
  // Mock de login y dashboard
  await page.route('**/auth/login', route => route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({
      access_token: 'e2e-token',
      user: { name: 'Admin', email: 'admin@example.com', role: 'admin' }
    })
  }));
  await page.route('**/admin/users', route => route.fulfill({ status: 200, body: '[]', contentType: 'application/json' }));
  await page.route('**/products', route => route.fulfill({ status: 200, body: '[]', contentType: 'application/json' }));

  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('admin@example.com');
  await page.getByPlaceholder('Contraseña').fill('secret');
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/admin$/);
  await expect(page.getByRole('heading', { name: /panel de administración/i }).first()).toBeVisible();

  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBe('e2e-token');
});
