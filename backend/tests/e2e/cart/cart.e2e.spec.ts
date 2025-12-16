import { test, expect } from '@playwright/test';

/**
 * E2E cart flow.
 * In this codebase the cart is handled client-side (CartContext + localStorage).
 * This test validates the user-visible behavior (black-box at UI level).
 */

test('cart: add item -> see it in /carrito -> proceed to checkout', async ({ page }) => {
  // Start from catalog
  await page.goto('/productos');

  // Add first product to cart
  await page.getByRole('button', { name: /añadir al carrito/i }).first().click();

  // Navigate to cart page
  await page.goto('/carrito');
  await expect(page.getByRole('heading', { name: /mi carrito/i })).toBeVisible();

  // Should show at least one cart item (CartItem component renders product model/title)
  await expect(page.locator('li').first()).toBeVisible();

  // Proceed to checkout
  await page.getByRole('button', { name: /pagar pedido/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
});
