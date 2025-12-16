import { test, expect } from '@playwright/test';

test('cart: add item -> open cart modal -> go to checkout', async ({ page }) => {
  await page.goto('/productos');
  await page.getByRole('button', { name: /añadir al carrito/i }).first().click();

  await expect(page.locator('span').filter({ hasText: /^1$/ }).first()).toBeVisible();
  await page.getByRole('button', { name: /mi carrito/i }).click();
  await expect(page.getByRole('heading', { name: /carrito/i }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'HAG-PB5MP-VF-A', level: 4 })).toBeVisible();

  await page.getByRole('button', { name: /pagar pedido/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.locator('main').getByRole('heading', { name: /contacto/i })).toBeVisible();
});
