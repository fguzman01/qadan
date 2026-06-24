import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';
import { step } from '../utils/decorators';

/**
 * Page Object de la vista del carrito de Sauce Demo.
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage extends BasePage {
  private readonly path = '/cart.html';

  private cartList = (): Locator => this.page.getByTestId('cart-list');
  private cartItems = (): Locator => this.page.getByTestId('inventory-item');
  private itemRow = (productName: string): Locator =>
    this.cartItems().filter({ hasText: productName });
  private itemName = (productName: string): Locator =>
    this.itemRow(productName).getByTestId('inventory-item-name');
  private itemPrice = (productName: string): Locator =>
    this.itemRow(productName).getByTestId('inventory-item-price');
  private removeButton = (productName: string): Locator =>
    this.itemRow(productName).getByRole('button', { name: 'Remove' });

  constructor(page: Page) {
    super(page);
  }

  /** Navega a la página del carrito y espera que la lista esté visible. */
  @step('Navegar a la página del carrito')
  async goto(): Promise<void> {
    await this.safeNavigate(this.path);
    await this.waitForElement(this.cartList());
  }

  /** Verifica si un producto está visible en la lista del carrito. */
  @step('Verificar si {0} está en el carrito')
  async isProductInCart(productName: string): Promise<boolean> {
    return await this.isVisible(this.itemName(productName));
  }

  /** Obtiene el precio mostrado para un producto en el carrito. */
  @step('Obtener precio del producto en el carrito: {0}')
  async getProductPrice(productName: string): Promise<string> {
    return await this.getText(this.itemPrice(productName));
  }

  /** Obtiene la cantidad de items listados en el carrito. */
  @step('Obtener cantidad de items en el carrito')
  async getItemsCount(): Promise<number> {
    return await this.cartItems().count();
  }

  /** Elimina un producto desde la vista del carrito. */
  @step('Eliminar producto del carrito: {0}')
  async removeProduct(productName: string): Promise<void> {
    await this.safeClick(this.removeButton(productName));
  }

  /** Verifica si el carrito no tiene productos listados. */
  @step('Verificar si el carrito está vacío')
  async isEmpty(): Promise<boolean> {
    return (await this.getItemsCount()) === 0;
  }
}
