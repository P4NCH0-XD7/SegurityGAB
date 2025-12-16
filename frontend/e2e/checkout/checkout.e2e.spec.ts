import { test, expect } from '@playwright/test';

test('checkout: from cart -> checkout -> pagar ahora clears cart', async ({ page }) => {
  await page.goto('/productos');

  // Add any product to cart.
  await page.getByRole('button', { name: /añadir al carrito/i }).first().click();

  // Open cart modal via navbar.
  await page.getByRole('button', { name: /mi carrito/i }).click();
  await expect(page.getByRole('heading', { name: /carrito/i }).first()).toBeVisible();

  // Proceed to checkout.
  await page.getByRole('button', { name: /pagar pedido/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.locator('main').getByRole('heading', { name: /contacto/i })).toBeVisible();

  // Handle the payment simulation alert.
  let dialogText = '';
  page.on('dialog', async (dialog) => {
    dialogText = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: /pagar ahora/i }).click();
  await expect.poll(() => dialogText).toMatch(/Compra realizada/i);

  // CartContext removes the key when cart is empty.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('cart')))
    .toBeNull();
});