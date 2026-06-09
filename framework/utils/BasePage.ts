import { AutomationBase } from './AutomationBase';

/**
 * Clase base para todos los Page Objects de qadan.
 *
 * Toda clase Page debe extender BasePage y:
 *   - Definir locators como métodos privados que retornan Locator (lazy)
 *   - Decorar métodos públicos con @step
 *   - Usar los métodos safe* protected heredados (no usar page.click/fill/etc directos)
 *
 * @example
 *   export class LoginPage extends BasePage {
 *     private emailInput = (): Locator => this.page.getByTestId('email');
 *
 *     @step('Ingresar email: {0}')
 *     async fillEmail(email: string): Promise<void> {
 *       await this.safeFill(this.emailInput(), email);
 *     }
 *   }
 */
export abstract class BasePage extends AutomationBase {}
