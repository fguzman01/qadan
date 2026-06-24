import { Page } from '@playwright/test';
import { BaseFlow } from '../utils/BaseFlow';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { step, screenshotOnEnd } from '../utils/decorators';

/**
 * Flow de carrito: orquesta acciones de agregar/ver productos entre
 * InventoryPage y CartPage.
 */
export class CartFlow extends BaseFlow {
  private inventoryPage: InventoryPage;
  private cartPage: CartPage;

  constructor(page: Page) {
    super(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
  }

  /**
   * Agrega un producto al carrito desde el catálogo.
   * @param productName - Nombre exacto del producto a agregar
   */
  @step('Agregar producto al carrito: {0}')
  @screenshotOnEnd('cart-producto-agregado')
  async addProductToCart(productName: string): Promise<void> {
    await this.inventoryPage.addToCart(productName);
  }

  /**
   * Agrega varios productos al carrito en secuencia.
   * @param productNames - Nombres exactos de los productos a agregar
   */
  @step('Agregar múltiples productos al carrito: {0}')
  @screenshotOnEnd('cart-multiples-productos-agregados')
  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.inventoryPage.addToCart(productName);
    }
  }

  /**
   * Agrega un producto al carrito y navega a la vista del carrito para verificarlo.
   * @param productName - Nombre exacto del producto a agregar
   */
  @step('Agregar producto y ver carrito: {0}')
  @screenshotOnEnd('cart-producto-en-vista-carrito')
  async addProductAndViewCart(productName: string): Promise<void> {
    await this.inventoryPage.addToCart(productName);
    await this.cartPage.goto();
  }
}
