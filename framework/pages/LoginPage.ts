import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';
import { step } from '../utils/decorators';

/**
 * Page Object de la pantalla de login de Sauce Demo.
 * URL: https://www.saucedemo.com/
 */
export class LoginPage extends BasePage {
  private readonly path = '/';

  private usernameInput = (): Locator => this.page.getByTestId('username');
  private passwordInput = (): Locator => this.page.getByTestId('password');
  private loginButton = (): Locator => this.page.getByTestId('login-button');
  private errorMessage = (): Locator => this.page.getByTestId('error');
  // CSS selector justificado: el logo no tiene data-test ni role accesible en Sauce Demo.
  private loginLogo = (): Locator => this.page.locator('.login_logo');

  constructor(page: Page) {
    super(page);
  }

  /** Navega a la página de login y espera el logo visible. */
  @step('Navegar a página de login')
  async goto(): Promise<void> {
    await this.safeNavigate(this.path);
    await this.waitForElement(this.loginLogo());
  }

  /** Ingresa el nombre de usuario. */
  @step('Ingresar usuario: {0}')
  async fillUsername(username: string): Promise<void> {
    await this.safeFill(this.usernameInput(), username);
  }

  /** Ingresa la contraseña. */
  @step('Ingresar contraseña')
  async fillPassword(password: string): Promise<void> {
    await this.safeFill(this.passwordInput(), password);
  }

  /** Click en el botón "Login". */
  @step('Click en botón Login')
  async clickLogin(): Promise<void> {
    await this.safeClick(this.loginButton());
  }

  /** Obtiene el mensaje de error mostrado. */
  @step('Obtener mensaje de error de login')
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage());
  }

  /** Verifica si hay un mensaje de error visible. */
  @step('Verificar visibilidad de mensaje de error')
  async hasError(): Promise<boolean> {
    return await this.isVisible(this.errorMessage(), 3_000);
  }
}
