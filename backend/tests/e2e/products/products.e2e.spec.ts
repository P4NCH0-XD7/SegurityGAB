import { test, expect } from '@playwright/test';

/**
 * E2E products flow.
 * Checks listing, detail view, and adding a product to favorites (simulated client action).
 */
test('products: ver listado -> ver detalle -> agregar a favoritos', async ({ page }) => {
  await page.goto('/productos');

  // Check that at least one product is visible
  const firstProduct = page.locator('li').first();
  await expect(firstProduct).toBeVisible();

  // Navigate to product detail
  await firstProduct.getByRole('link').click();
  await expect(page.getByRole('heading', { name: /detalle del producto/i })).toBeVisible();

  // Simulate "add to favorites" (or similar client-side action)
  let dialogText = '';
  page.on('dialog', async (dialog) => {
    dialogText = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: /añadir a favoritos/i }).click();
  await expect.poll(() => dialogText).toMatch(/Producto agregado a favoritos/i);
});
