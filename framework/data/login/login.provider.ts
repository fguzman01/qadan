import rawData from './login.data.json';
import { User } from '../../models/user.model';

/**
 * Tipado centralizado del raw JSON.
 * Esta es la única coerción de tipos para los datos de login en el proyecto.
 */
const data = rawData as Record<string, User>;

/**
 * Data Provider de Login.
 *
 * Centraliza el acceso a los datos de prueba del módulo de autenticación.
 * Todos los specs consumen datos a través de este provider — NUNCA importan
 * el JSON directamente.
 *
 * Patrón obligatorio en qadan: un objeto Provider por feature.
 */
export const LoginDataProvider = {
  /** Retorna el usuario estándar válido para flujos happy path. */
  getValidUser(): User {
    return data.validUser;
  },

  /** Retorna el usuario bloqueado para casos negativos. */
  getLockedUser(): User {
    return data.lockedUser;
  },

  /** Retorna credenciales inválidas para casos negativos. */
  getInvalidUser(): User {
    return data.invalidUser;
  },

  /**
   * Construye un usuario partiendo del usuario válido y aplicando overrides.
   * Útil para tests que necesitan variantes específicas sin duplicar fixtures.
   *
   * @example
   *   const customUser = LoginDataProvider.buildUser({ email: 'otro_user' });
   */
  buildUser(overrides: Partial<User>): User {
    return { ...data.validUser, ...overrides };
  },

  /**
   * Retorna el primer usuario que tenga el rol indicado.
   * Devuelve `undefined` si no existe ningún usuario con ese rol.
   */
  getUserByRole(role: NonNullable<User['role']>): User | undefined {
    return Object.values(data).find((u) => u.role === role);
  },
};
