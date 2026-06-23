import { AutomationBase } from './AutomationBase';

/**
 * Clase base para todas las Validations de qadan.
 *
 * Las Validations orquestan assertions sobre el estado de la UI,
 * separando la responsabilidad de "verificar" de la de "actuar" (Flows)
 * y de la de "interactuar" (Pages).
 *
 * Patrón de uso:
 *   - Flows ejecutan acciones (login, agregar al carrito)
 *   - Validations verifican resultados (login exitoso, error mostrado)
 *   - Specs orquestan: flow.accion() + validations.assert()
 *
 * Toda clase Validation debe extender BaseValidation y:
 *   - Instanciar las Pages que necesite en el constructor para leer estado
 *   - Decorar métodos públicos con @step (aparecen como steps en Allure)
 *   - Usar expect() de Playwright para assertions
 *   - Nombrar métodos con prefijo `assert` (assertLoginSuccess, assertErrorMessage, etc.)
 *
 * @example
 *   export class LoginValidations extends BaseValidation {
 *     private loginPage: LoginPage;
 *
 *     constructor(page: Page) {
 *       super(page);
 *       this.loginPage = new LoginPage(page);
 *     }
 *
 *     @step('Validar login exitoso')
 *     async assertLoginSuccess(): Promise<void> {
 *       await expect(this.page).toHaveURL(/.*inventory/);
 *       expect(await this.inventoryPage.isLoaded()).toBe(true);
 *     }
 *   }
 */
export abstract class BaseValidation extends AutomationBase {
  // Espacio para métodos comunes de validación en el futuro.
  // Por ejemplo: assertPageTitle, assertNoConsoleErrors, etc.
}
