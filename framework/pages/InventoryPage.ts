import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';
import { step } from '../utils/decorators';

/**
 * Page Object del catálogo de productos de Sauce Demo (post-login).
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage extends BasePage {

  // ═══ 1. CONSTANTES ═══
  private readonly path = '/inventory.html';

  // ═══ 2. LOCATORS ESTÁTICOS ═══
  // CSS selectors justificados: estos elementos no exponen data-test
  // ni roles semánticos en Sauce Demo. Las clases CSS son estables.
  private appLogo = (): Locator => this.page.locator('.app_logo');
  private inventoryContainer = (): Locator => this.page.getByTestId('inventory-container');
  // CSS selector justificado: .inventory_item no tiene data-test en Sauce Demo.
  private inventoryItems = (): Locator => this.page.locator('.inventory_item');
  private cartBadge = (): Locator => this.page.getByTestId('shopping-cart-badge');

  // ═══ 3. LOCATORS DINÁMICOS ═══
  // data-test dinámico por producto (confirmado con Playwright Agent CLI):
  // patrón: add-to-cart-{slug} / remove-{slug}
  // slug = nombre en minúsculas con espacios reemplazados por guiones
  private addToCartButton = (productName: string): Locator =>
    this.page.getByTestId(`add-to-cart-${this.toSlug(productName)}`);
  private removeButton = (productName: string): Locator =>
    this.page.getByTestId(`remove-${this.toSlug(productName)}`);

  // ═══ 4. CONSTRUCTOR ═══
  constructor(page: Page) {
    super(page);
  }

  // ═══ 5. HELPERS PRIVADOS ═══
  /**
   * Convierte un nombre de producto al formato slug usado en los atributos data-test.
   * Ejemplo: "Sauce Labs Backpack" → "sauce-labs-backpack"
   */
  private toSlug(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  // ═══ 6. NAVEGACIÓN ═══

  /** Espera a que la página de inventario esté completamente cargada. */
  @step('Esperar carga de página de inventario')
  async waitForLoaded(): Promise<void> {
    await this.waitForElement(this.appLogo());
    await this.waitForElement(this.inventoryContainer());
  }

  /** Intenta navegar directo al inventario sin pasar por login (valida protección de rutas). */
  @step('Navegar directo a inventario sin autenticación')
  async gotoDirect(): Promise<void> {
    await this.safeNavigate(this.path);
  }

  // ═══ 7. ACCIONES ═══

  /** Agrega un producto al carrito desde el catálogo. */
  @step('Agregar al carrito: {0}')
  async addToCart(productName: string): Promise<void> {
    await this.safeClick(this.addToCartButton(productName));
  }

  /** Elimina un producto del carrito desde el catálogo. */
  @step('Eliminar del carrito: {0}')
  async removeFromCart(productName: string): Promise<void> {
    await this.safeClick(this.removeButton(productName));
  }

  // ═══ 8. QUERIES ═══

  /** Verifica si la página de inventario está visible. */
  @step('Verificar carga de página de inventario')
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer());
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

  /** Verifica si un producto está marcado como agregado al carrito (el botón muestra "Remove"). */
  @step('Verificar si {0} está en el carrito')
  async isProductInCart(productName: string): Promise<boolean> {
    return await this.isVisible(this.removeButton(productName));
  }

  /** Verifica si el badge del carrito está visible. */
  @step('Verificar visibilidad del badge del carrito')
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isVisible(this.cartBadge());
  }

  /** Obtiene la cantidad mostrada en el badge del carrito (0 si no está visible). */
  @step('Obtener cantidad del badge del carrito')
  async getCartBadgeCount(): Promise<number> {
    if (!(await this.isCartBadgeVisible())) {
      return 0;
    }
    return parseInt(await this.getText(this.cartBadge()), 10);
  }
}
