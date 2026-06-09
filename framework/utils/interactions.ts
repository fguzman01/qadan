import { Page, Locator } from '@playwright/test';
import { log } from './logger';

/**
 * Funciones puras de interacción reforzadas.
 * Estas son la fuente de verdad de los métodos safe*.
 * AutomationBase las expone como métodos protected.
 */

const DEFAULT_TIMEOUT = 15_000;

/**
 * Click reforzado: espera state='visible' + scroll into view + click.
 * Nota: NO verifica explícitamente el estado enabled del elemento.
 */
export async function safeClick(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  log('debug', `safeClick: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.scrollIntoViewIfNeeded();
  await locator.click({ timeout });
}

/**
 * Fill reforzado: espera visible + clear + fill + verifica valor.
 */
export async function safeFill(
  locator: Locator,
  value: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `safeFill: "${value}"`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.clear();
  await locator.fill(value);
  const actual = await locator.inputValue();
  if (actual !== value) {
    throw new Error(`safeFill falló: se esperaba "${value}", se obtuvo "${actual}"`);
  }
}

/**
 * Navegación reforzada: goto + waitForLoadState('networkidle').
 */
export async function safeNavigate(page: Page, path: string): Promise<void> {
  log('info', `safeNavigate: ${path}`);
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Espera elemento visible con timeout configurable.
 */
export async function waitForElement(
  locator: Locator,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `waitForElement: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Obtiene texto: espera visible + textContent + trim + valida no vacío.
 */
export async function getText(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<string> {
  log('debug', `getText: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  const raw = await locator.textContent();
  const text = (raw ?? '').trim();
  if (text === '') {
    throw new Error(`getText falló: el elemento está vacío (${locator})`);
  }
  return text;
}

/**
 * Select reforzado en dropdown: selectOption + verifica valor seleccionado.
 */
export async function safeSelect(
  locator: Locator,
  value: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `safeSelect: "${value}"`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.selectOption(value);
  const actual = await locator.inputValue();
  if (actual !== value) {
    throw new Error(`safeSelect falló: se esperaba "${value}", se obtuvo "${actual}"`);
  }
}

/**
 * Check reforzado en checkbox/radio: check + verifica estado.
 */
export async function safeCheck(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  log('debug', `safeCheck: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.check();
  if (!(await locator.isChecked())) {
    throw new Error('safeCheck falló: el elemento no quedó marcado');
  }
}

/**
 * Uncheck reforzado en checkbox: uncheck + verifica estado.
 */
export async function safeUncheck(
  locator: Locator,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `safeUncheck: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.uncheck();
  if (await locator.isChecked()) {
    throw new Error('safeUncheck falló: el elemento sigue marcado');
  }
}

/**
 * Hover reforzado: espera visible + hover + estabilidad.
 */
export async function safeHover(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  log('debug', `safeHover: ${locator}`);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();
}

/**
 * Upload reforzado en input[type=file]: setInputFiles.
 */
export async function safeUpload(
  locator: Locator,
  filePath: string | string[],
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `safeUpload: ${Array.isArray(filePath) ? filePath.join(', ') : filePath}`);
  await locator.waitFor({ state: 'attached', timeout });
  await locator.setInputFiles(filePath);
}

/**
 * Scroll reforzado a elemento.
 */
export async function safeScroll(
  locator: Locator,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `safeScroll: ${locator}`);
  await locator.waitFor({ state: 'attached', timeout });
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Espera que la URL coincida (string exacto o RegExp).
 */
export async function waitForUrl(
  page: Page,
  urlOrRegex: string | RegExp,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `waitForUrl: ${urlOrRegex}`);
  await page.waitForURL(urlOrRegex, { timeout });
}

/**
 * Espera una response del backend que coincida con el patrón de URL.
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  log('debug', `waitForResponse: ${urlPattern}`);
  await page.waitForResponse(urlPattern, { timeout });
}

/**
 * Check no-throw de visibilidad. Devuelve true/false en vez de fallar.
 */
export async function isVisible(locator: Locator, timeout: number = 3_000): Promise<boolean> {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene atributo con validación de no-null.
 */
export async function getAttribute(
  locator: Locator,
  attr: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<string> {
  await locator.waitFor({ state: 'attached', timeout });
  const value = await locator.getAttribute(attr);
  if (value === null) {
    throw new Error(`getAttribute falló: el atributo "${attr}" no existe en el elemento`);
  }
  return value;
}
