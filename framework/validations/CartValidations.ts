import { Page, expect } from '@playwright/test';
import { BaseValidation } from '../utils/BaseValidation';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { step, screenshotOnEnd } from '../utils/decorators';

/**
 * Validaciones del módulo de Carrito.
 *
 * Agrupa las assertions sobre el estado del carrito, tanto desde la vista
 * de inventario (badge, botones por producto) como desde la vista dedicada
 * del carrito (/cart.html).
 */
export class CartValidations extends BaseValidation {
  private inventoryPage: InventoryPage;
  private cartPage: CartPage;

  constructor(page: Page) {
    super(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
  }

  /**
   * Valida la cantidad mostrada en el badge del carrito.
   * Si `expectedCount` es 0, valida que el badge no esté visible (Sauce Demo
   * no renderiza el badge cuando el carrito está vacío).
   */
  @step('Validar badge del carrito: {0}')
  @screenshotOnEnd('validacion-cart-badge')
  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      expect(await this.inventoryPage.isCartBadgeVisible()).toBe(false);
    } else {
      expect(await this.inventoryPage.getCartBadgeCount()).toBe(expectedCount);
    }
  }

  /**
   * Valida el estado del botón del producto en el inventario.
   * @param inCart - `true` espera botón "Remove" (agregado), `false` espera "Add to cart"
   */
  @step('Validar estado en inventario de {0}: en carrito = {1}')
  @screenshotOnEnd('validacion-producto-estado-inventario')
  async assertProductInCartState(productName: string, inCart: boolean): Promise<void> {
    expect(await this.inventoryPage.isProductInCart(productName)).toBe(inCart);
  }

  /**
   * Valida que un producto esté visible en la vista del carrito, con su precio.
   */
  @step('Validar producto visible en el carrito: {0}')
  @screenshotOnEnd('validacion-producto-en-carrito')
  async assertProductVisibleInCart(productName: string): Promise<void> {
    expect(await this.cartPage.isProductInCart(productName)).toBe(true);
    expect(await this.cartPage.getProductPrice(productName)).toBeTruthy();
  }

  /**
   * Valida la cantidad de items listados en la vista del carrito.
   */
  @step('Validar cantidad de items en el carrito: {0}')
  @screenshotOnEnd('validacion-cart-items-count')
  async assertCartItemsCount(expectedCount: number): Promise<void> {
    expect(await this.cartPage.getItemsCount()).toBe(expectedCount);
  }

  /**
   * Valida que el carrito esté completamente vacío (sin items listados y sin badge).
   */
  @step('Validar carrito vacío')
  @screenshotOnEnd('validacion-cart-vacio')
  async assertCartIsEmpty(): Promise<void> {
    expect(await this.cartPage.isEmpty()).toBe(true);
    expect(await this.inventoryPage.isCartBadgeVisible()).toBe(false);
  }

  /**
   * Valida que el usuario fue redirigido a la página de login (acceso sin autenticación).
   */
  @step('Validar redirección a login por falta de autenticación')
  @screenshotOnEnd('validacion-redirect-login')
  async assertRedirectedToLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/saucedemo\.com\/$/);
  }
}
