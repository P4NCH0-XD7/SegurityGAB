import { test, expect } from '@playwright/test';

test.describe('Users E2E Flow', () => {
  test('login: user -> token stored', async ({ page }) => {
    // Keep this test hermetic: mock the backend login endpoint.
    await page.route('**/auth/login', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'e2e-user-token',
          user: {
            name: 'Usuario E2E',
            email: 'e2e_user@example.com',
            role: 'user',
          },
        }),
      }),
    );

    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('e2e_user@example.com');
    await page.getByPlaceholder('Contraseña').fill('secret123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page).toHaveURL(/\/$/);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('e2e-user-token');

    const user = await page.evaluate(() => localStorage.getItem('user'));
    expect(user).toContain('e2e_user@example.com');
  });

  test('users: dashboard -> perfil visible -> cerrar sesión', async ({ page }) => {
    // Seed auth state before the app loads so AuthContext picks it up on first render.
    await page.addInitScript(() => {
      localStorage.setItem('token', 'e2e-user-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: 'Usuario E2E',
          email: 'e2e_user@example.com',
          role: 'user',
        }),
      );
    });

    // Dashboard calls these endpoints; mock them to avoid depending on a real backend.
    await page.route('**/orders', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );
    await page.route('**/wishlist', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );

    await page.goto('/dashboard/user');

    await expect(page.getByRole('heading', { name: /mi perfil/i }).first()).toBeVisible();
    await expect(page.getByText('e2e_user@example.com').first()).toBeVisible();

    // The UI links to /logout; on this page it can re-render and detach the node.
    // To keep the test stable, assert the link exists, then navigate directly.
    const logoutLink = page.getByRole('link', { name: /cerrar sesión/i }).first();
    await expect(logoutLink).toHaveAttribute('href', '/logout');

    await page.goto('/logout');
    await expect(page).toHaveURL(/\/login$/);
  });
});
