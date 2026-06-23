import { test as base } from '@playwright/test';
import { AuthFlow } from '../flows/AuthFlow';
import { LoginPage } from '../pages/LoginPage';
import { LoginValidations } from '../validations/LoginValidations';

/**
 * Fixture de Login para qadan.
 *
 * Extiende el `test` base de Playwright para inyectar automáticamente
 * las instancias de Flows, Pages y Validations del módulo de Login.
 *
 * Uso en specs:
 *   import { test } from '../../fixtures/login.fixture';
 *
 *   test('TC-001', async ({ authFlow, loginValidations }) => {
 *     await authFlow.loginAsUser(user);
 *     await loginValidations.assertLoginSuccess();
 *   });
 *
 * Ventajas:
 *   - Elimina instanciación repetida en cada test
 *   - Playwright maneja el lifecycle automáticamente
 *   - page no necesita importarse — se inyecta via fixture
 *   - Cada test recibe instancias frescas (sin estado compartido)
 */
export const test = base.extend<{
  authFlow: AuthFlow;
  loginPage: LoginPage;
  loginValidations: LoginValidations;
}>({
  authFlow: async ({ page }, use) => {
    await use(new AuthFlow(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  loginValidations: async ({ page }, use) => {
    await use(new LoginValidations(page));
  },
});

export { expect } from '@playwright/test';
