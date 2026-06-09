---
name: pom-conventions
description: Define las convenciones obligatorias del Page Object Model (POM) en qadan para tests Playwright en TypeScript. Usar este skill cada vez que se genere, lea o edite archivos bajo /framework/pages/, /framework/flows/, /framework/utils/, /framework/data/, /framework/models/, o cualquier código de tests Playwright en este proyecto.
---

# Skill: POM Conventions (qadan)

## Stack
- **Lenguaje:** TypeScript (strict mode)
- **Framework:** Playwright Test
- **Reporting:** Allure (`allure-playwright`)
- **Logs:** `console.log` con formato estándar (ver sección Logs)
- **Data:** JSON files + TypeScript models tipados

## Estructura de carpetas

```
framework/
├── pages/              # Page Objects (clases por página)
├── flows/              # Flows (clases que orquestan múltiples pages)
├── tests/              # Specs Playwright (un archivo por feature)
│   └── {feature}/
│       └── {feature}.spec.ts
├── utils/              # Helpers reforzados (safeClick, etc.)
│   ├── BasePage.ts
│   ├── BaseFlow.ts
│   ├── decorators.ts   # @step, @screenshotOnEnd
│   ├── interactions.ts # safeClick, safeFill, etc.
│   ├── screenshots.ts  # takeScreenshot util
│   └── logger.ts       # log() formateado
├── data/               # Data Providers (JSON + capa tipada TypeScript)
│   └── {feature}/
│       ├── {feature}.data.json
│       └── {feature}.provider.ts
├── models/             # Interfaces TypeScript (User, Product, etc.)
│   └── {entity}.model.ts
├── fixtures/           # Playwright fixtures custom
└── playwright.config.ts
```

## Reglas de nombrado

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clase Page | PascalCase + sufijo `Page` | `LoginPage` |
| Clase Flow | PascalCase + sufijo `Flow` | `AuthFlow` |
| Clase Model | PascalCase, sin sufijo | `User`, `Product` |
| Archivo Page | PascalCase = nombre clase | `LoginPage.ts` |
| Archivo Flow | PascalCase = nombre clase | `AuthFlow.ts` |
| Archivo Model | kebab-case + `.model.ts` | `user.model.ts` |
| Archivo Data | kebab-case + `.data.json` | `login.data.json` |
| Archivo Spec | kebab-case + `.spec.ts` | `login.spec.ts` |
| Métodos | camelCase, verbo de acción | `fillEmail`, `submitForm` |
| Locators (private) | camelCase | `emailInput`, `submitButton` |
| Carpetas feature | kebab-case | `login/`, `gestion-carrito/` |

## Estrategia de selectores (orden de prioridad obligatorio)

```
1. data-testid    → page.getByTestId('login-submit')
2. getByRole      → page.getByRole('button', { name: 'Iniciar sesión' })
3. getByLabel     → page.getByLabel('Email')
4. getByText      → page.getByText('Bienvenido')
5. CSS / XPath    → page.locator('.btn-primary')  ← ÚLTIMO recurso
```

**Regla:** Si subís un nivel en la lista, debe haber justificación documentada en comentario.

**Configuración del atributo testid:**
El nombre del atributo se configura en `playwright.config.ts` con `testIdAttribute`.
Por defecto Playwright usa `data-testid`. Cada proyecto debe ajustar este valor según su app target.
Ejemplo: Sauce Demo usa `data-test`, por lo que el config tiene `testIdAttribute: 'data-test'`.

```typescript
// CSS selector justificado: el logo no tiene data-test ni role accesible.
private loginLogo = (): Locator => this.page.locator('.login_logo');
```

## Clase Page (template obligatorio)

Todo Page Object DEBE extender `BasePage` y seguir esta estructura:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';
import { step } from '../utils/decorators';

export class LoginPage extends BasePage {
  // 1. URL (si aplica)
  private readonly path = '/login';

  // 2. Locators como métodos privados (lazy evaluation)
  private emailInput = (): Locator => this.page.getByTestId('email-input');
  private passwordInput = (): Locator => this.page.getByTestId('password-input');
  private submitButton = (): Locator => this.page.getByRole('button', { name: 'Iniciar sesión' });
  private errorMessage = (): Locator => this.page.getByTestId('error-message');

  // 3. Constructor delegando a BasePage
  constructor(page: Page) {
    super(page);
  }

  // 4. Métodos de navegación
  @step('Navegar a página de login')
  async goto(): Promise<void> {
    await this.safeNavigate(this.path);
  }

  // 5. Métodos de interacción (atómicos, no flows completos)
  @step('Ingresar email: {0}')
  async fillEmail(email: string): Promise<void> {
    await this.safeFill(this.emailInput(), email);
  }

  @step('Ingresar password')
  async fillPassword(password: string): Promise<void> {
    await this.safeFill(this.passwordInput(), password);
  }

  @step('Click en botón "Iniciar sesión"')
  async clickSubmit(): Promise<void> {
    await this.safeClick(this.submitButton());
  }

  // 6. Métodos de obtención de estado
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage());
  }
}
```

### Reglas para Pages
- ❌ NO hacer flujos completos en Page (eso va en Flow)
- ❌ NO usar `page.click()` directo — usar `safeClick` de BasePage
- ❌ NO usar `page.fill()` directo — usar `safeFill` de BasePage
- ✅ Locators como métodos privados que retornan `Locator` (lazy)
- ✅ Todo método público con `@step` para Allure
- ✅ Tipos de retorno explícitos (`Promise<void>`, `Promise<string>`, etc.)

## Clase Flow (template obligatorio)

Los Flows orquestan múltiples Pages para representar flujos de negocio completos.

```typescript
import { Page } from '@playwright/test';
import { BaseFlow } from '../utils/BaseFlow';
import { LoginPage } from '../pages/LoginPage';
import { step, screenshotOnEnd } from '../utils/decorators';
import { User } from '../models/user.model';

export class AuthFlow extends BaseFlow {
  private loginPage: LoginPage;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
  }

  @step('Login completo con usuario: {0.email}')
  @screenshotOnEnd('login-completo')
  async loginAsUser(user: User): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.fillEmail(user.email);
    await this.loginPage.fillPassword(user.password);
    await this.loginPage.clickSubmit();
  }

  @step('Logout')
  @screenshotOnEnd('logout-completo')
  async logout(): Promise<void> {
    // ...
  }
}
```

### Reglas para Flows
- ✅ Todo método público con `@step` Y `@screenshotOnEnd`
- ✅ Un Flow puede usar múltiples Pages
- ✅ Los Flows NO conocen locators (eso es responsabilidad de Pages)
- ❌ NO duplicar lógica de Page dentro de Flow

## Clase Model (template)

```typescript
// models/user.model.ts
export interface User {
  email: string;
  password: string;
  name?: string;
  role?: 'admin' | 'customer' | 'guest';
}
```

## Data Provider (Patrón obligatorio)

Cada feature tiene DOS archivos en su carpeta de data:

```
data/
└── {feature}/
    ├── {feature}.data.json       # Datos raw (sin lógica)
    └── {feature}.provider.ts     # Capa tipada con métodos de acceso
```

### Reglas
- ✅ Los specs NUNCA importan el JSON directamente
- ✅ Los specs SIEMPRE consumen datos a través del Provider
- ✅ El Provider centraliza el cast de tipos (`as Tipo` solo aquí, una vez)
- ✅ El Provider expone métodos descriptivos: `getValidUser()`, `getLockedUser()`, etc.
- ✅ El Provider puede tener métodos de construcción: `buildUser(overrides)`
- ✅ El Provider puede tener métodos de búsqueda: `getUserByRole(role)`

### Archivo JSON (datos raw)
```json
{
  "validUser": {
    "email": "valid@test.com",
    "password": "Pass123!",
    "role": "customer"
  },
  "invalidUser": {
    "email": "notanemail",
    "password": "Pass123!"
  }
}
```

### Archivo Provider (capa tipada)
```typescript
import rawData from './login.data.json';
import { User } from '../../models/user.model';

// Única coerción de tipos del módulo — centralizada aquí
const data = rawData as Record<string, User>;

export const LoginDataProvider = {
  getValidUser(): User {
    return data.validUser;
  },
  getInvalidUser(): User {
    return data.invalidUser;
  },
  buildUser(overrides: Partial<User>): User {
    return { ...data.validUser, ...overrides };
  },
  getUserByRole(role: NonNullable<User['role']>): User | undefined {
    return Object.values(data).find((u) => u.role === role);
  },
};
```

### Uso en specs
```typescript
import { LoginDataProvider } from '../../data/login/login.provider';

const validUser = LoginDataProvider.getValidUser();
const customUser = LoginDataProvider.buildUser({ email: 'otro_user' });
```

### Convenciones de nombrado
- Provider: `{Feature}DataProvider` — ej: `LoginDataProvider`, `CheckoutDataProvider`
- Archivo: `{feature}.provider.ts` (kebab-case)
- Métodos: verbo + descripción — `getValidUser`, `buildUser`, `getUserByRole`

## Spec / Test (template obligatorio)

```typescript
import { test, expect } from '@playwright/test';
import { AuthFlow } from '../../flows/AuthFlow';
import { LoginPage } from '../../pages/LoginPage';
import { LoginDataProvider } from '../../data/login/login.provider';
import { log } from '../../utils/logger';

test.describe('Login - JIRA-123', () => {  // ← JIRA ID obligatorio en el describe

  test('TC-001 - Iniciar sesión con credenciales válidas', async ({ page }) => {
    log('info', 'Inicio TC-001');
    const authFlow = new AuthFlow(page);
    const validUser = LoginDataProvider.getValidUser();  // ← Provider, nunca JSON directo

    await authFlow.loginAsUser(validUser);

    await expect(page).toHaveURL(/.*dashboard/);
    log('info', 'Fin TC-001 - OK');
  });

  test('TC-002 - Falla al usar credenciales inválidas', async ({ page }) => {
    log('info', 'Inicio TC-002');
    const loginPage = new LoginPage(page);
    const invalidUser = LoginDataProvider.getInvalidUser();

    await loginPage.goto();
    await loginPage.fillEmail(invalidUser.email);
    await loginPage.fillPassword(invalidUser.password);
    await loginPage.clickSubmit();

    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Email inválido');
    log('info', 'Fin TC-002 - OK');
  });
});
```

### Reglas para Specs
- ✅ `test.describe` por feature, con JIRA ID en el nombre
- ✅ Nombre del test inicia con el ID del TC (`TC-XXX`) y verbo de acción
- ✅ Logs al inicio y fin de cada test
- ✅ Datos consumidos siempre vía `{Feature}DataProvider` — NUNCA importar el JSON directamente
- ❌ NO incluir lógica de UI directa — usar Pages/Flows

## Utils de Interacción (reforzados)

Todos estos métodos viven en `utils/interactions.ts` y son expuestos vía `BasePage`. Cada uno tiene timeout, validación previa y log automático.

| Método | Responsabilidad |
|--------|-----------------|
| `safeClick(locator)` | wait visible + enabled + scroll into view + click |
| `safeFill(locator, value)` | wait visible + clear + fill + verify value |
| `safeNavigate(path)` | goto + waitForLoadState('networkidle') |
| `waitForElement(locator, timeout?)` | wait visible con timeout configurable |
| `getText(locator)` | wait visible + textContent + trim + assert no vacío |
| `safeSelect(locator, value)` | dropdown select + verificación |
| `safeCheck(locator)` | checkbox/radio check + verificación |
| `safeUncheck(locator)` | checkbox uncheck + verificación |
| `safeHover(locator)` | hover + wait estabilidad |
| `safeUpload(locator, filePath)` | setInputFiles + wait carga completa |
| `safeScroll(locator)` | scrollIntoViewIfNeeded |
| `waitForUrl(urlOrRegex)` | espera URL específica |
| `waitForResponse(urlPattern)` | espera response del backend |
| `isVisible(locator)` | boolean check sin throw |
| `getAttribute(locator, attr)` | get atributo + validación |
| `takeScreenshot(name)` | screenshot manual nombrado |

## Screenshots (3 niveles)

### 1. Automático en falla (configurado en playwright.config.ts)
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
}
```

### 2. Automático al final de cada método de Flow (decorador)
```typescript
@step('Login completo')
@screenshotOnEnd('login-completo')
async loginAsUser(user: User) { ... }
```

### 3. Manual en puntos específicos
```typescript
await this.takeScreenshot('antes-de-click-pagar');
```

## Logs estándar

```typescript
// utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export function log(level: LogLevel, message: string, data?: object): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  if (data) {
    console.log(`${prefix} ${message}`, JSON.stringify(data));
  } else {
    console.log(`${prefix} ${message}`);
  }
}
```

### Reglas de logs
- ✅ Inicio y fin de cada test
- ✅ Acciones críticas (login, checkout, submit)
- ✅ Datos no sensibles solamente (NUNCA passwords ni tokens)
- ❌ NO usar `console.log` directo — usar `log()` de logger

## Decoradores

### `@step('mensaje con {0} y {1.email}')`
Envuelve el método en `test.step()` de Playwright (que Allure captura automáticamente).

**Hace 3 cosas automáticamente:**
1. Crea un step en Allure y en el reporte HTML de Playwright
2. Logea a consola: `[INFO] ▶ {nombre}` al inicio, `[INFO] ✓ {nombre} ({ms}ms)` al finalizar exitoso, `[ERROR] ✗ {nombre} ({ms}ms) - {error}` al fallar
3. Mide la duración del step

**Como `@step` ya loggea, NO agregar `log('info', ...)` manualmente dentro del método** — sería duplicado.

Soporta interpolación de parámetros:
- `{0}` → primer parámetro
- `{1.email}` → propiedad `email` del segundo parámetro
- `{0.user.name}` → acceso anidado

### `@screenshotOnEnd('nombre-screenshot')`
Toma screenshot al finalizar exitosamente el método. Adjunta a Allure como evidencia.

### Implementación
Estos decoradores usan la API TC39 Stage 3. NO requieren `experimentalDecorators` en tsconfig.
Ver `.claude/skills/framework-core/SKILL.md` para la firma correcta y la firma incorrecta (legacy).

## Comentarios de código

```typescript
/**
 * Realiza el flujo completo de autenticación.
 * @param user - Usuario a autenticar
 * @throws Error si el login falla después del timeout
 */
@step('Login con usuario: {0.email}')
async loginAsUser(user: User): Promise<void> {
  // ...
}
```

- ✅ JSDoc obligatorio en métodos públicos de Page y Flow
- ✅ Comentarios inline solo cuando la lógica no sea obvia
- ❌ NO comentar lo evidente (`// click button`)

## Checklist para nuevos archivos

Antes de dar por finalizado un Page/Flow/Test, verificar:

- [ ] Imports ordenados (Playwright → utils → pages → flows → models → data)
- [ ] Clase extiende `BasePage` o `BaseFlow`
- [ ] Locators son métodos privados que retornan `Locator`
- [ ] Selectores siguen el orden de prioridad (data-testid primero)
- [ ] Métodos públicos tienen `@step`
- [ ] Métodos de Flow tienen también `@screenshotOnEnd`
- [ ] Tipos de retorno explícitos
- [ ] JSDoc en métodos públicos
- [ ] Logs en puntos críticos (no en cada línea; `@step` ya loggea inicio/fin/error automáticamente)
- [ ] No usa `page.click/fill/goto` directo — usa los safe* equivalentes
- [ ] No expone locators a Flows o Tests
- [ ] Si es una feature con datos: tiene archivo `*.provider.ts` además del `*.data.json`
- [ ] Los specs consumen datos vía `{Feature}DataProvider`, NO importan el JSON directamente
