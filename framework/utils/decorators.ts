import { test } from '@playwright/test';
import { takeScreenshot } from './screenshots';
import { log } from './logger';

/**
 * Decoradores para Pages y Flows de qadan.
 * Usa la API TC39 Stage 3 de decoradores, soportada por TypeScript 5.0+ y Playwright 1.44+.
 * NO requiere `experimentalDecorators` en tsconfig.json.
 */

/**
 * Reemplaza placeholders {0}, {1.prop}, {0.user.name} con los argumentos del método.
 */
function interpolate(template: string, args: unknown[]): string {
  return template.replace(/\{(\d+)(?:\.([^}]+))?\}/g, (match, indexStr: string, path?: string) => {
    const index = parseInt(indexStr, 10);
    const arg = args[index];
    if (arg === undefined || arg === null) return match;
    if (!path) return String(arg);
    const value = path
      .split('.')
      .reduce<unknown>((obj, key) => (obj as Record<string, unknown> | undefined)?.[key], arg);
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Decorador que envuelve un método en `test.step()` para que aparezca como step
 * en Allure y en el reporte HTML de Playwright.
 *
 * Además, registra automáticamente en consola:
 *   - Inicio del step:  [INFO] ▶ {nombre}
 *   - Fin exitoso:      [INFO] ✓ {nombre} ({duración}ms)
 *   - Fin con error:    [ERROR] ✗ {nombre} ({duración}ms) - {error}
 *
 * Soporta interpolación de argumentos:
 *   - {0}       → primer argumento
 *   - {1.email} → propiedad email del segundo argumento
 *   - {0.user.name} → acceso anidado
 *
 * @param nameTemplate - Nombre del step (puede incluir placeholders)
 *
 * @example
 *   @step('Login con usuario {0.email}')
 *   async loginAsUser(user: User) { ... }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function step(nameTemplate?: string): any {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext,
  ) {
    const methodName = String(context.name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (this: any, ...args: any[]) {
      const stepName = nameTemplate
        ? interpolate(nameTemplate, args)
        : `${this.constructor.name}.${methodName}`;

      log('info', `▶ ${stepName}`);
      const start = Date.now();

      try {
        const result = await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
        const duration = Date.now() - start;
        log('info', `✓ ${stepName} (${duration}ms)`);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        const errorMsg = (error as Error).message;
        log('error', `✗ ${stepName} (${duration}ms) - ${errorMsg}`);
        throw error;
      }
    };
  };
}

/**
 * Decorador que toma un screenshot al finalizar exitosamente el método y lo
 * adjunta a Allure como evidencia.
 *
 * Requiere que la clase tenga `this.page` accesible (provisto por AutomationBase).
 *
 * @param name - Nombre del screenshot (opcional, default: ClassName-methodName-end)
 *
 * @example
 *   @screenshotOnEnd('login-completo')
 *   async loginAsUser(user: User) { ... }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function screenshotOnEnd(name?: string): any {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext,
  ) {
    const methodName = String(context.name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (this: any, ...args: any[]) {
      const result = await originalMethod.apply(this, args);
      const screenshotName = name ?? `${this.constructor.name}-${methodName}-end`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = (this as any).page;
      if (page) {
        await takeScreenshot(page, screenshotName);
      } else {
        log('warn', `@screenshotOnEnd: this.page no está disponible en ${screenshotName}`);
      }
      return result;
    };
  };
}
