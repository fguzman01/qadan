/**
 * Logger estandarizado para qadan.
 * Formato: [ISO timestamp] [LEVEL] mensaje {data opcional}
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Registra un mensaje en consola con timestamp y nivel.
 * Allure captura los console.log automáticamente como logs del test.
 *
 * @param level - Nivel del log (info, warn, error, debug)
 * @param message - Mensaje principal
 * @param data - Datos opcionales (objeto, se serializa con JSON.stringify)
 *
 * @example
 *   log('info', 'Inicio de test TC-001');
 *   log('debug', 'Click en botón', { selector: 'submit-btn' });
 */
export function log(level: LogLevel, message: string, data?: object): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  if (data !== undefined) {
    // eslint-disable-next-line no-console
    console.log(`${prefix} ${message}`, JSON.stringify(data));
  } else {
    // eslint-disable-next-line no-console
    console.log(`${prefix} ${message}`);
  }
}
