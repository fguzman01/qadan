import { test } from '../../fixtures/login.fixture';
import { LoginDataProvider } from '../../data/login/login.provider';
import { log } from '../../utils/logger';

test.describe('Login - SAUCE-101 (Sauce Demo)', () => {

  test('TC-001 - Iniciar sesión con credenciales válidas @smoke', async ({
    authFlow,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-001');
    const validUser = LoginDataProvider.getValidUser();

    await authFlow.loginAsUser(validUser);
    await loginValidations.assertLoginSuccess();

    log('info', 'Fin TC-001 - OK');
  });

  test('TC-002 - Error al usar usuario bloqueado', async ({
    authFlow,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-002');
    const lockedUser = LoginDataProvider.getLockedUser();

    await authFlow.attemptLogin(lockedUser);
    await loginValidations.assertLoginError('locked out');

    log('info', 'Fin TC-002 - OK');
  });

  test('TC-003 - Error al usar credenciales inválidas', async ({
    authFlow,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-003');
    const invalidUser = LoginDataProvider.getInvalidUser();

    await authFlow.attemptLogin(invalidUser);
    await loginValidations.assertLoginError('do not match');

    log('info', 'Fin TC-003 - OK');
  });

  // Page directo en vez de Flow: el flujo es parcial (campo Usuario se omite a propósito).
  test('TC-004 - Error al enviar formulario sin usuario', async ({
    loginPage,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-004');
    const emptyEmailUser = LoginDataProvider.buildUser({ email: '' });

    await loginPage.goto();
    await loginPage.fillPassword(emptyEmailUser.password);
    await loginPage.clickLogin();

    await loginValidations.assertLoginError('Username is required');
    log('info', 'Fin TC-004 - OK');
  });

  // Page directo en vez de Flow: el flujo es parcial (campo Password se omite a propósito).
  test('TC-005 - Error al enviar formulario sin contraseña', async ({
    loginPage,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-005');
    const emptyPasswordUser = LoginDataProvider.buildUser({ password: '' });

    await loginPage.goto();
    await loginPage.fillUsername(emptyPasswordUser.email);
    await loginPage.clickLogin();

    await loginValidations.assertLoginError('Password is required');
    log('info', 'Fin TC-005 - OK');
  });
});
