import { Page, expect } from '@playwright/test';
import { BaseValidation } from '../utils/BaseValidation';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { step } from '../utils/decorators';

/**
 * Validaciones del módulo de Login.
 *
 * Agrupa todas las assertions relacionadas con autenticación,
 * separándolas de los Flows (acciones) y de los Specs (orquestación).
 */
export class LoginValidations extends BaseValidation {
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  /**
   * Valida que el login fue exitoso: redirige a inventory, página cargada,
   * productos visibles.
   */
  @step('Validar login exitoso')
  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    expect(await this.inventoryPage.isLoaded()).toBe(true);
    expect(await this.inventoryPage.getItemsCount()).toBeGreaterThan(0);
  }

  /**
   * Valida que el login falló con un mensaje de error específico
   * y que el usuario permanece en la página de login.
   *
   * @param expectedText - Texto que debe contener el mensaje de error
   */
  @step('Validar error de login: {0}')
  async assertLoginError(expectedText: string): Promise<void> {
    expect(await this.loginPage.hasError()).toBe(true);
    const errorMsg = await this.loginPage.getErrorMessage();
    expect(errorMsg).toContain(expectedText);
    await expect(this.page).not.toHaveURL(/.*inventory/);
  }

  /**
   * Valida que se muestra un mensaje de error visible (sin verificar el texto).
   */
  @step('Validar que hay error visible')
  async assertHasError(): Promise<void> {
    expect(await this.loginPage.hasError()).toBe(true);
  }

  /**
   * Valida que NO hay mensaje de error visible.
   */
  @step('Validar que no hay error visible')
  async assertNoError(): Promise<void> {
    expect(await this.loginPage.hasError()).toBe(false);
  }
}
