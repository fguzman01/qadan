import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';
import { step } from '../utils/decorators';

/**
 * Page Object del catálogo de productos de Sauce Demo (post-login).
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage extends BasePage {
  // CSS selectors justificados: estos elementos no exponen data-test ni roles
  // semánticos en Sauce Demo. Las clases CSS son estables en la app.
  private appLogo = (): Locator => this.page.locator('.app_logo');
  private inventoryItems = (): Locator => this.page.locator('.inventory_item');
  private inventoryContainer = (): Locator => this.page.getByTestId('inventory-container');

  constructor(page: Page) {
    super(page);
  }

  /** Espera a que la página de inventario esté completamente cargada. */
  @step('Esperar carga de página de inventario')
  async waitForLoaded(): Promise<void> {
    await this.waitForElement(this.appLogo());
    await this.waitForElement(this.inventoryContainer());
  }

  /** Verifica si la página de inventario está visible. */
  @step('Verificar carga de página de inventario')
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer(), 5_000);
  }

  /** Obtiene el número de productos visibles en el catálogo. */
  @step('Obtener cantidad de productos en inventario')
  async getItemsCount(): Promise<number> {
    await this.waitForElement(this.inventoryItems().first());
    return await this.inventoryItems().count();
  }

  /** Obtiene el texto del logo de la app. */
  @step('Obtener texto del logo')
  async getAppLogoText(): Promise<string> {
    return await this.getText(this.appLogo());
  }
}
