import { AutomationBase } from './AutomationBase';

/**
 * Clase base para todos los Flows de qadan.
 *
 * Toda clase Flow debe extender BaseFlow y:
 *   - Instanciar las Pages que necesite en el constructor
 *   - Decorar métodos públicos con @step Y @screenshotOnEnd
 *   - Orquestar múltiples Pages para representar flujos de negocio completos
 *
 * @example
 *   export class AuthFlow extends BaseFlow {
 *     private loginPage: LoginPage;
 *
 *     constructor(page: Page) {
 *       super(page);
 *       this.loginPage = new LoginPage(page);
 *     }
 *
 *     @step('Login con usuario {0.email}')
 *     @screenshotOnEnd('login-completo')
 *     async loginAsUser(user: User): Promise<void> {
 *       await this.loginPage.goto();
 *       await this.loginPage.fillEmail(user.email);
 *       ...
 *     }
 *   }
 */
export abstract class BaseFlow extends AutomationBase {}
