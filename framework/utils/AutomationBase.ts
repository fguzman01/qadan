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
 * Clase abstracta padre de BasePage y BaseFlow.
 * Centraliza todos los métodos de interacción reforzados (safe*).
 *
 * NO instanciar directamente. Extender vía BasePage o BaseFlow.
 */
export abstract class AutomationBase {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Click reforzado: espera visible + scroll into view + click. No verifica explícitamente enabled. */
  protected async safeClick(locator: Locator, timeout?: number): Promise<void> {
    return safeClick(locator, timeout);
  }

  /** Fill reforzado con clear + verificación. */
  protected async safeFill(locator: Locator, value: string, timeout?: number): Promise<void> {
    return safeFill(locator, value, timeout);
  }

  /** Navegación reforzada con waitForLoadState. */
  protected async safeNavigate(path: string): Promise<void> {
    return safeNavigate(this.page, path);
  }

  /** Espera elemento visible. */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    return waitForElement(locator, timeout);
  }

  /** Obtiene texto con trim + validación. */
  protected async getText(locator: Locator, timeout?: number): Promise<string> {
    return getText(locator, timeout);
  }

  /** Select dropdown reforzado. */
  protected async safeSelect(locator: Locator, value: string, timeout?: number): Promise<void> {
    return safeSelect(locator, value, timeout);
  }

  /** Check checkbox/radio reforzado. */
  protected async safeCheck(locator: Locator, timeout?: number): Promise<void> {
    return safeCheck(locator, timeout);
  }

  /** Uncheck checkbox reforzado. */
  protected async safeUncheck(locator: Locator, timeout?: number): Promise<void> {
    return safeUncheck(locator, timeout);
  }

  /** Hover reforzado. */
  protected async safeHover(locator: Locator, timeout?: number): Promise<void> {
    return safeHover(locator, timeout);
  }

  /** Upload de archivo reforzado. */
  protected async safeUpload(
    locator: Locator,
    filePath: string | string[],
    timeout?: number,
  ): Promise<void> {
    return safeUpload(locator, filePath, timeout);
  }

  /** Scroll a elemento. */
  protected async safeScroll(locator: Locator, timeout?: number): Promise<void> {
    return safeScroll(locator, timeout);
  }

  /** Espera URL específica (string o RegExp). */
  protected async waitForUrl(urlOrRegex: string | RegExp, timeout?: number): Promise<void> {
    return waitForUrl(this.page, urlOrRegex, timeout);
  }

  /** Espera response del backend. */
  protected async waitForResponse(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    return waitForResponse(this.page, urlPattern, timeout);
  }

  /** Check boolean de visibilidad sin throw. */
  protected async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
    return isVisible(locator, timeout);
  }

  /** Obtiene atributo con validación. */
  protected async getAttribute(locator: Locator, attr: string, timeout?: number): Promise<string> {
    return getAttribute(locator, attr, timeout);
  }

  /** Screenshot manual nombrado, adjuntado a Allure. */
  protected async takeScreenshot(name: string, fullPage: boolean = true): Promise<void> {
    return takeScreenshot(this.page, name, fullPage);
  }
}
