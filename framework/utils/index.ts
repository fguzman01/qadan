/**
 * Barrel export del core de qadan.
 * Permite imports limpios:
 *   import { BasePage, step, log } from '@utils/index';
 */

export { AutomationBase } from './AutomationBase';
export { BasePage } from './BasePage';
export { BaseFlow } from './BaseFlow';
export { step, screenshotOnEnd } from './decorators';
export { log } from './logger';
export type { LogLevel } from './logger';
export { takeScreenshot } from './screenshots';
export * from './interactions';
