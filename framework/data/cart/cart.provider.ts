import rawData from './cart.data.json';
import { Product } from '../../models/product.model';

/**
 * Tipado centralizado del raw JSON.
 * Esta es la única coerción de tipos para los datos de carrito en el proyecto.
 */
const data = rawData as Record<string, Product>;

/**
 * Data Provider de Carrito.
 *
 * Centraliza el acceso a los datos de prueba del módulo de carrito.
 * Todos los specs consumen datos a través de este provider — NUNCA importan
 * el JSON directamente.
 */
export const CartDataProvider = {
  /** Retorna el producto "Sauce Labs Backpack". */
  getBackpack(): Product {
    return data.backpack;
  },

  /** Retorna el producto "Sauce Labs Bike Light". */
  getBikeLight(): Product {
    return data.bikeLight;
  },

  /** Retorna todos los productos disponibles en el data set. */
  getAll(): Product[] {
    return Object.values(data);
  },
};
