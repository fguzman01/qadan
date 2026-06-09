import { test, expect } from '@playwright/test';
import { AuthFlow } from '../../flows/AuthFlow';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginDataProvider } from '../../data/login/login.provider';
import { log } from '../../utils/logger';

test.describe('Login - SMOKE-001 (Sauce Demo)', () => {

  test('TC-001 - Iniciar sesión con credenciales válidas @smoke', async ({ page }) => {
    log('info', 'Inicio TC-001 - Login válido');
    const authFlow = new AuthFlow(page);
    const inventoryPage = new InventoryPage(page);
    const validUser = LoginDataProvider.getValidUser();

    await authFlow.loginAsUser(validUser);

    await expect(page).toHaveURL(/.*inventory\.html/);
    expect(await inventoryPage.isLoaded()).toBe(true);
    expect(await inventoryPage.getItemsCount()).toBeGreaterThan(0);
    log('info', 'Fin TC-001 - OK');
  });

  test('TC-002 - Falla al usar usuario bloqueado', async ({ page }) => {
    log('info', 'Inicio TC-002 - Usuario bloqueado');
    const authFlow = new AuthFlow(page);
    const loginPage = new LoginPage(page);
    const lockedUser = LoginDataProvider.getLockedUser();

    await authFlow.attemptLogin(lockedUser);

    expect(await loginPage.hasError()).toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('locked out');
    await expect(page).not.toHaveURL(/.*inventory\.html/);
    log('info', 'Fin TC-002 - OK');
  });

  test('TC-003 - Falla al usar credenciales inválidas', async ({ page }) => {
    log('info', 'Inicio TC-003 - Credenciales inválidas');
    const authFlow = new AuthFlow(page);
    const loginPage = new LoginPage(page);
    const invalidUser = LoginDataProvider.getInvalidUser();

    await authFlow.attemptLogin(invalidUser);

    expect(await loginPage.hasError()).toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('do not match');
    await expect(page).not.toHaveURL(/.*inventory\.html/);
    log('info', 'Fin TC-003 - OK');
  });

  test('TC-004 - Falla al enviar formulario vacío', async ({ page }) => {
    log('info', 'Inicio TC-004 - Formulario vacío');
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.clickLogin();

    expect(await loginPage.hasError()).toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username is required');
    log('info', 'Fin TC-004 - OK');
  });

});
