import { test as base } from '@playwright/test';
import { AuthFlow } from '../flows/AuthFlow';
import { CartFlow } from '../flows/CartFlow';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CartValidations } from '../validations/CartValidations';

/**
 * Fixture de Carrito para qadan.
 *
 * Extiende `test` de Playwright para inyectar Flows, Pages y Validations
 * del módulo de Carrito. Incluye `authFlow` porque todos los TCs de carrito
 * requieren un usuario autenticado como precondición.
 *
 * Uso en specs:
 *   import { test } from '../../fixtures/cart.fixture';
 *
 *   test('TC-001', async ({ authFlow, cartFlow, cartValidations }) => {
 *     await authFlow.loginAsUser(user);
 *     await cartFlow.addProductToCart('Sauce Labs Backpack');
 *     await cartValidations.assertCartBadgeCount(1);
 *   });
 */
export const test = base.extend<{
  authFlow: AuthFlow;
  cartFlow: CartFlow;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  cartValidations: CartValidations;
}>({
  authFlow: async ({ page }, use) => {
    await use(new AuthFlow(page));
  },
  cartFlow: async ({ page }, use) => {
    await use(new CartFlow(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  cartValidations: async ({ page }, use) => {
    await use(new CartValidations(page));
  },
});

export { expect } from '@playwright/test';
