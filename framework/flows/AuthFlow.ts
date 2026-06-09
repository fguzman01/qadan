import { Page } from '@playwright/test';
import { BaseFlow } from '../utils/BaseFlow';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { step, screenshotOnEnd } from '../utils/decorators';
import { User } from '../models/user.model';

/**
 * Flow de autenticación: orquesta login y verificación post-login.
 */
export class AuthFlow extends BaseFlow {
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  /**
   * Realiza el flujo completo de login exitoso y espera la página de inventario.
   * @param user - Usuario válido a autenticar
   */
  @step('Login completo con usuario: {0.email}')
  @screenshotOnEnd('login-flow-completo')
  async loginAsUser(user: User): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.fillUsername(user.email);
    await this.loginPage.fillPassword(user.password);
    await this.loginPage.clickLogin();
    await this.inventoryPage.waitForLoaded();
  }

  /**
   * Intenta hacer login (sin esperar éxito) — útil para casos negativos.
   * @param user - Usuario a probar (puede ser inválido)
   */
  @step('Intento de login con: {0.email}')
  @screenshotOnEnd('login-attempt')
  async attemptLogin(user: User): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.fillUsername(user.email);
    await this.loginPage.fillPassword(user.password);
    await this.loginPage.clickLogin();
  }
}
