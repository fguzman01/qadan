import { test } from '../../fixtures/cart.fixture';
import { CartDataProvider } from '../../data/cart/cart.provider';
import { LoginDataProvider } from '../../data/login/login.provider';
import { log } from '../../utils/logger';

test.describe('Carrito - SAUCE-102 (Sauce Demo)', () => {

  test('TC-001 - Agregar un producto al carrito @smoke', async ({
    authFlow,
    cartFlow,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-001');
    const validUser = LoginDataProvider.getValidUser();
    const backpack = CartDataProvider.getBackpack();

    await authFlow.loginAsUser(validUser);
    await cartFlow.addProductToCart(backpack.name);

    await cartValidations.assertCartBadgeCount(1);
    await cartValidations.assertProductInCartState(backpack.name, true);

    log('info', 'Fin TC-001 - OK');
  });

  test('TC-002 - Verificar producto agregado en la vista del carrito', async ({
    authFlow,
    cartFlow,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-002');
    const validUser = LoginDataProvider.getValidUser();
    const backpack = CartDataProvider.getBackpack();

    await authFlow.loginAsUser(validUser);
    await cartFlow.addProductAndViewCart(backpack.name);

    await cartValidations.assertProductVisibleInCart(backpack.name);
    await cartValidations.assertCartItemsCount(1);

    log('info', 'Fin TC-002 - OK');
  });

  // Page directo en vez de Flow: la única acción del TC es eliminar; el agregado
  // previo es precondición de setup, no el paso bajo prueba.
  test('TC-003 - Eliminar producto desde la página de inventario', async ({
    authFlow,
    cartFlow,
    inventoryPage,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-003');
    const validUser = LoginDataProvider.getValidUser();
    const backpack = CartDataProvider.getBackpack();

    await authFlow.loginAsUser(validUser);
    await cartFlow.addProductToCart(backpack.name);
    await inventoryPage.removeFromCart(backpack.name);

    await cartValidations.assertCartBadgeCount(0);
    await cartValidations.assertProductInCartState(backpack.name, false);

    log('info', 'Fin TC-003 - OK');
  });

  // Page directo en vez de Flow: navegación simple, sin acción de negocio compuesta.
  test('TC-004 - Visualizar carrito vacío', async ({
    authFlow,
    cartPage,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-004');
    const validUser = LoginDataProvider.getValidUser();

    await authFlow.loginAsUser(validUser);
    await cartPage.goto();

    await cartValidations.assertCartIsEmpty();

    log('info', 'Fin TC-004 - OK');
  });

  test('TC-005 - Edge: Agregar múltiples productos al carrito', async ({
    authFlow,
    cartFlow,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-005');
    const validUser = LoginDataProvider.getValidUser();
    const backpack = CartDataProvider.getBackpack();
    const bikeLight = CartDataProvider.getBikeLight();

    await authFlow.loginAsUser(validUser);
    await cartFlow.addMultipleProductsToCart([backpack.name, bikeLight.name]);

    await cartValidations.assertCartBadgeCount(2);
    await cartValidations.assertProductInCartState(backpack.name, true);
    await cartValidations.assertProductInCartState(bikeLight.name, true);

    log('info', 'Fin TC-005 - OK');
  });

  // Page directo en vez de Flow: la precondición es "no autenticado", no hay
  // login que orquestar antes del intento de acceso.
  test('TC-006 - Error al intentar agregar producto sin autenticación', async ({
    inventoryPage,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-006');

    await inventoryPage.gotoDirect();

    await cartValidations.assertRedirectedToLogin();

    log('info', 'Fin TC-006 - OK');
  });

  // Page directo en vez de Flow: eliminar desde el carrito es la única acción del TC.
  test('TC-007 - Edge: Eliminar producto desde la vista del carrito', async ({
    authFlow,
    cartFlow,
    cartPage,
    cartValidations,
  }) => {
    log('info', 'Inicio TC-007');
    const validUser = LoginDataProvider.getValidUser();
    const backpack = CartDataProvider.getBackpack();

    await authFlow.loginAsUser(validUser);
    await cartFlow.addProductAndViewCart(backpack.name);
    await cartPage.removeProduct(backpack.name);

    await cartValidations.assertCartIsEmpty();

    log('info', 'Fin TC-007 - OK');
  });
});
