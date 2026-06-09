/**
 * Modelo de usuario para autenticación.
 *
 * Nota: el campo `email` es un identificador genérico de usuario.
 * En apps reales contiene un email; en Sauce Demo contiene un username.
 * Se mantiene `email` por consistencia con apps reales.
 */
export interface User {
  email: string;
  password: string;
  name?: string;
  role?: 'standard' | 'locked' | 'problem' | 'performance' | 'error' | 'visual';
}
