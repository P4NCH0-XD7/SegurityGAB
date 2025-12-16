import { test, expect } from '@playwright/test';

test('products: catálogo renders and allows adding to cart', async ({ page }) => {
  await page.goto('/productos');

  await expect(page.getByRole('heading', { name: /catálogo de cámaras cctv/i })).toBeVisible();

  // One known local product from app/data/productos.ts
  await expect(page.getByRole('heading', { name: 'HAG-PB5MP-VF-A' }).first()).toBeVisible();

  await page.getByRole('button', { name: /añadir al carrito/i }).first().click();

  // Navbar shows a numeric badge when cart has items.
  await expect(page.locator('span').filter({ hasText: /^1$/ }).first()).toBeVisible();
});