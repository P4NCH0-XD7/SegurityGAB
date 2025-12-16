import { test, expect } from '@playwright/test';

/**
 * Black-box tests for the frontend UI.
 * - No imports from Next.js source code.
 * - Validates the key user journey: browse -> cart -> checkout.
 */

test('frontend: browse products -> add to cart -> checkout (simulated)', async ({ page }) => {
  // Home should load
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  // Go to products
  await page.goto('/productos');
  await expect(page.getByRole('heading', { name: /catálogo/i })).toBeVisible();

  // Add a product
  await page.getByRole('button', { name: /añadir al carrito/i }).first().click();

  // Cart page
  await page.goto('/carrito');
  await expect(page.getByRole('heading', { name: /mi carrito/i })).toBeVisible();

  // Checkout
  await page.getByRole('button', { name: /pagar pedido/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  // Pay
  let dialogText = '';
  page.on('dialog', async (dialog) => {
    dialogText = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: /pagar ahora/i }).click();
  await expect.poll(() => dialogText).toMatch(/Simulación de pago/i);

  // Cart should be cleared on checkout page
  await expect(page.getByText(/Tu carrito está vacío/i)).toBeVisible();
});
