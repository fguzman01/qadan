import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { log } from './logger';

/**
 * Toma un screenshot del estado actual de la página y lo adjunta a Allure.
 *
 * @param page - Instancia de Playwright Page
 * @param name - Nombre descriptivo del screenshot (aparece en Allure)
 * @param fullPage - Si true, captura toda la página con scroll (default: true)
 *
 * @example
 *   await takeScreenshot(page, 'login-exitoso');
 *   await takeScreenshot(page, 'carrito-con-3-items', false);
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage: boolean = true,
): Promise<void> {
  try {
    const buffer = await page.screenshot({ fullPage });
    await allure.attachment(name, buffer, { contentType: 'image/png' });
    log('debug', `Screenshot tomado: ${name}`);
  } catch (error) {
    log('warn', `No se pudo tomar screenshot "${name}"`, {
      error: (error as Error).message,
    });
  }
}
