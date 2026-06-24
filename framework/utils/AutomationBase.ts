import { Page, Locator } from '@playwright/test';
import {
  safeClick,
  safeFill,
  safeNavigate,
  waitForElement,
  getText,
  safeSelect,
  safeCheck,
  safeUncheck,
  safeHover,
  safeUpload,
  safeScroll,
  waitForUrl,
  waitForResponse,
  isVisible,
  getAttribute,
} from './interactions';
import { takeScreenshot } from './screenshots';

/**
 * Clase abstracta padre de BasePage, BaseFlow y BaseValidation.
 * Centraliza todos los métodos de interacción reforzados (safe*).
 *
 * NO instanciar directamente. Extender vía BasePage, BaseFlow o BaseValidation.
 *
 * @param page - Instancia de Playwright Page
 * @param timeout - Timeout por defecto para todas las interacciones (ms).
 *                  Default: 10_000ms. Sobreescribible por subclase o por llamada individual.
 */
export abstract class AutomationBase {
  protected readonly page: Page;
  protected readonly timeout: number;

  constructor(page: Page, timeout: number = 10_000) {
    this.page = page;
    this.timeout = timeout;
  }

  /** Click reforzado: espera visible + scroll into view + click. */
  protected async safeClick(locator: Locator, timeout?: number): Promise<void> {
    return safeClick(locator, timeout ?? this.timeout);
  }

  /** Fill reforzado con clear + verificación. */
  protected async safeFill(locator: Locator, value: string, timeout?: number): Promise<void> {
    return safeFill(locator, value, timeout ?? this.timeout);
  }

  /** Navegación reforzada con waitForLoadState. */
  protected async safeNavigate(path: string): Promise<void> {
    return safeNavigate(this.page, path);
  }

  /** Espera elemento visible. */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    return waitForElement(locator, timeout ?? this.timeout);
  }

  /** Obtiene texto con trim + validación. */
  protected async getText(locator: Locator, timeout?: number): Promise<string> {
    return getText(locator, timeout ?? this.timeout);
  }

  /** Select dropdown reforzado. */
  protected async safeSelect(locator: Locator, value: string, timeout?: number): Promise<void> {
    return safeSelect(locator, value, timeout ?? this.timeout);
  }

  /** Check checkbox/radio reforzado. */
  protected async safeCheck(locator: Locator, timeout?: number): Promise<void> {
    return safeCheck(locator, timeout ?? this.timeout);
  }

  /** Uncheck checkbox reforzado. */
  protected async safeUncheck(locator: Locator, timeout?: number): Promise<void> {
    return safeUncheck(locator, timeout ?? this.timeout);
  }

  /** Hover reforzado. */
  protected async safeHover(locator: Locator, timeout?: number): Promise<void> {
    return safeHover(locator, timeout ?? this.timeout);
  }

  /** Upload de archivo reforzado. */
  protected async safeUpload(
    locator: Locator,
    filePath: string | string[],
    timeout?: number,
  ): Promise<void> {
    return safeUpload(locator, filePath, timeout ?? this.timeout);
  }

  /** Scroll a elemento. */
  protected async safeScroll(locator: Locator, timeout?: number): Promise<void> {
    return safeScroll(locator, timeout ?? this.timeout);
  }

  /** Espera URL específica (string o RegExp). */
  protected async waitForUrl(urlOrRegex: string | RegExp, timeout?: number): Promise<void> {
    return waitForUrl(this.page, urlOrRegex, timeout ?? this.timeout);
  }

  /** Espera response del backend. */
  protected async waitForResponse(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    return waitForResponse(this.page, urlPattern, timeout ?? this.timeout);
  }

  /** Check boolean de visibilidad sin throw. */
  protected async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
    return isVisible(locator, timeout ?? this.timeout);
  }

  /** Obtiene atributo con validación. */
  protected async getAttribute(locator: Locator, attr: string, timeout?: number): Promise<string> {
    return getAttribute(locator, attr, timeout ?? this.timeout);
  }

  /** Screenshot manual nombrado, adjuntado a Allure. */
  protected async takeScreenshot(name: string, fullPage: boolean = true): Promise<void> {
    return takeScreenshot(this.page, name, fullPage);
  }
}
