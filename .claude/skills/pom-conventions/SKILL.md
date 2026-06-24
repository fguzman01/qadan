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
├── validations/        # Validations (clases que agrupan assertions)
├── tests/              # Specs Playwright (un archivo por feature)
│   └── {feature}/
│       └── {feature}.spec.ts
├── utils/              # Helpers reforzados (safeClick, etc.)
│   ├── AutomationBase.ts
│   ├── BasePage.ts
│   ├── BaseFlow.ts
│   ├── BaseValidation.ts
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
├── fixtures/           # Playwright fixtures por feature
│   └── {feature}.fixture.ts
└── playwright.config.ts
```

## Reglas de nombrado

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clase Page | PascalCase + sufijo `Page` | `LoginPage` |
| Clase Flow | PascalCase + sufijo `Flow` | `AuthFlow` |
| Clase Validation | PascalCase + sufijo `Validations` | `LoginValidations` |
| Clase Model | PascalCase, sin sufijo | `User`, `Product` |
| Archivo Page | PascalCase = nombre clase | `LoginPage.ts` |
| Archivo Flow | PascalCase = nombre clase | `AuthFlow.ts` |
| Archivo Validation | PascalCase = nombre clase | `LoginValidations.ts` |
| Archivo Fixture | kebab-case + `.fixture.ts` | `login.fixture.ts` |
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

### Orden estándar de secciones en un Page Object

Todo Page Object DEBE seguir este orden de secciones (usar comentarios de separación):

```typescript
export class FeaturePage extends BasePage {

  // ═══ 1. CONSTANTES ═══
  private readonly path = '/ruta';

  // ═══ 2. LOCATORS ESTÁTICOS (sin parámetros) ═══
  private elemento = (): Locator => this.page.getByTestId('elemento');

  // ═══ 3. LOCATORS DINÁMICOS (con parámetros) ═══
  private elementoDinamico = (id: string): Locator =>
    this.page.getByTestId(`elemento-${id}`);

  // ═══ 4. CONSTRUCTOR ═══
  constructor(page: Page) {
    super(page);
  }

  // ═══ 5. HELPERS PRIVADOS ═══
  private toSlug(name: string): string { ... }

  // ═══ 6. NAVEGACIÓN ═══
  @step('...') async goto(): Promise<void> { ... }

  // ═══ 7. ACCIONES ═══
  @step('...') async clickAlgo(): Promise<void> { ... }

  // ═══ 8. QUERIES (lectura de estado, sin efectos) ═══
  @step('...') async isAlgoVisible(): Promise<boolean> { ... }
}
```

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

### Timeout configurable

`AutomationBase` expone `this.timeout` (default: 10_000ms). Todos los métodos `safe*`
e `isVisible` lo usan automáticamente si no se pasa un timeout explícito.

```typescript
// ✅ Correcto — usa this.timeout automáticamente
async isLoaded(): Promise<boolean> {
  return await this.isVisible(this.container());
}

// ⚠️ Solo si necesitás un timeout diferente al default
async isVisibleQuickCheck(): Promise<boolean> {
  return await this.isVisible(this.element(), 2_000);
}

// ❌ Incorrecto — hardcodear timeouts arbitrarios
async isLoaded(): Promise<boolean> {
  return await this.isVisible(this.container(), 5_000);
}
```

Si una Page completa necesita timeouts más cortos (ej: componentes rápidos):
```typescript
constructor(page: Page) {
  super(page, 5_000);  // override del timeout para toda la clase
}
```

### isVisible vs isVisibleNow

`AutomationBase` expone dos métodos para verificar visibilidad con semánticas distintas:

| Método | Cuándo usar | Timeout |
|--------|-------------|---------|
| `isVisible(locator)` | Espero que el elemento APAREZCA | `this.timeout` (10s) |
| `isVisibleNow(locator)` | Verifico si está ahora (puede no estar) | 1_500ms |

**Regla:** Si el elemento puede legítimamente NO estar presente, usar `isVisibleNow`.

```typescript
// ✅ Correcto — badge puede no existir cuando el carrito está vacío
async isCartBadgeVisible(): Promise<boolean> {
  return await this.isVisibleNow(this.cartBadge());
}

// ✅ Correcto — esperamos que el inventario aparezca
async waitForLoaded(): Promise<void> {
  await this.waitForElement(this.inventoryContainer()); // usa timeout largo
}

// ❌ Incorrecto — usa timeout largo para verificar ausencia
async isCartBadgeVisible(): Promise<boolean> {
  return await this.isVisible(this.cartBadge()); // espera 10s innecesariamente
}
```

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

## Clase Validation (template obligatorio)

Las Validations agrupan assertions por feature, separando la responsabilidad de "verificar" de la de "actuar" (Flows).

```typescript
import { Page, expect } from '@playwright/test';
import { BaseValidation } from '../utils/BaseValidation';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { step } from '../utils/decorators';

export class LoginValidations extends BaseValidation {
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  @step('Validar login exitoso')
  @screenshotOnEnd('validacion-login-exitoso')
  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    expect(await this.inventoryPage.isLoaded()).toBe(true);
    expect(await this.inventoryPage.getItemsCount()).toBeGreaterThan(0);
  }

  @step('Validar error de login: {0}')
  @screenshotOnEnd('validacion-login-error')
  async assertLoginError(expectedText: string): Promise<void> {
    expect(await this.loginPage.hasError()).toBe(true);
    const errorMsg = await this.loginPage.getErrorMessage();
    expect(errorMsg).toContain(expectedText);
    await expect(this.page).not.toHaveURL(/.*inventory/);
  }
}
```

### Reglas para Validations
- ✅ Extiende `BaseValidation`
- ✅ Instancia Pages necesarias en el constructor (para leer estado)
- ✅ Métodos públicos con `@step`
- ✅ Todos los métodos empiezan con prefijo `assert` (assertLoginSuccess, assertLoginError)
- ✅ Usa `expect()` de Playwright para assertions
- ✅ Métodos de validación principales llevan `@screenshotOnEnd` para evidencia visual
- ⚠️ Métodos helper simples (`assertHasError`, `assertNoError`) NO llevan `@screenshotOnEnd`
- ❌ NO ejecuta acciones (click, fill, navigate) — eso es responsabilidad de Flows/Pages
- ❌ NO se importa directamente en Flows — Validations y Flows son capas paralelas

### Relación entre capas

```
Pages       → Interacciones atómicas con la UI (click, fill, getText)
Flows       → Orquestación de acciones (login completo, checkout)
Validations → Orquestación de assertions (verificar login exitoso, verificar error)
Specs       → Combinan Flows + Validations (la "receta" del test case)
```

Un Flow NUNCA importa una Validation. Una Validation NUNCA ejecuta una acción. Un Spec SIEMPRE combina ambos.

## Fixtures (patrón obligatorio)

Cada feature debe tener un archivo de fixture que extiende `test` de Playwright e inyecta las instancias de Flows, Pages y Validations.

### Ubicación y nombrado
- Ruta: `framework/fixtures/{feature}.fixture.ts`
- Nombre: kebab-case + `.fixture.ts` (ej: `login.fixture.ts`, `cart.fixture.ts`)

### Template

```typescript
import { test as base } from '@playwright/test';
import { AuthFlow } from '../flows/AuthFlow';
import { LoginPage } from '../pages/LoginPage';
import { LoginValidations } from '../validations/LoginValidations';

/**
 * Fixture de {Feature} para qadan.
 *
 * Extiende `test` de Playwright para inyectar Flows, Pages y Validations
 * del módulo de {Feature} automáticamente.
 */
export const test = base.extend<{
  authFlow: AuthFlow;
  loginPage: LoginPage;
  loginValidations: LoginValidations;
}>({
  authFlow: async ({ page }, use) => {
    await use(new AuthFlow(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  loginValidations: async ({ page }, use) => {
    await use(new LoginValidations(page));
  },
});

export { expect } from '@playwright/test';
```

### Reglas para Fixtures
- ✅ Un archivo fixture por feature
- ✅ Exportar `test` (el extendido) y re-exportar `expect`
- ✅ Nombrar los fixtures con camelCase descriptivo: `authFlow`, `loginPage`, `loginValidations`
- ✅ JSDoc explicando el propósito del fixture
- ✅ Cada fixture inyecta instancia fresca por test (sin estado compartido)
- ❌ NO incluir lógica de setup compleja — solo instanciación
- ❌ NO compartir estado entre tests vía fixtures

### Convenciones de nombrado para fixtures inyectados

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Flow | camelCase sin sufijo `Flow` si no hay ambigüedad | `authFlow`, `cartFlow` |
| Page | camelCase con sufijo `Page` | `loginPage`, `cartPage` |
| Validation | camelCase con sufijo `Validations` | `loginValidations`, `cartValidations` |

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

Los specs importan `test` desde el fixture de la feature (NO desde `@playwright/test` directo).
Esto inyecta automáticamente Flows, Pages y Validations sin instanciación manual.

```typescript
import { test } from '../../fixtures/login.fixture';
import { LoginDataProvider } from '../../data/login/login.provider';
import { log } from '../../utils/logger';

test.describe('Login - SAUCE-101 (Sauce Demo)', () => {

  test('TC-001 - Iniciar sesión con credenciales válidas @smoke', async ({
    authFlow,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-001');
    const validUser = LoginDataProvider.getValidUser();

    await authFlow.loginAsUser(validUser);
    await loginValidations.assertLoginSuccess();

    log('info', 'Fin TC-001 - OK');
  });

  test('TC-002 - Error al usar usuario bloqueado', async ({
    authFlow,
    loginValidations,
  }) => {
    log('info', 'Inicio TC-002');
    const lockedUser = LoginDataProvider.getLockedUser();

    await authFlow.attemptLogin(lockedUser);
    await loginValidations.assertLoginError('locked out');

    log('info', 'Fin TC-002 - OK');
  });
});
```

### Reglas para Specs
- ✅ Importar `test` desde el fixture de la feature (`../../fixtures/login.fixture`)
- ✅ `test.describe` por feature, con HU ID en el nombre
- ✅ Nombre del test inicia con el ID del TC (`TC-XXX`)
- ✅ `@smoke` tag en el primer happy path
- ✅ Logs al inicio y fin de cada test
- ✅ Datos vía Provider (nunca import JSON directo)
- ✅ Acciones vía Flows (o Pages para flujos parciales, documentando por qué)
- ✅ Validaciones vía Validations (`assert*`)
- ✅ Destructurar solo los fixtures que el test necesita
- ❌ NO instanciar Pages/Flows/Validations manualmente con `new`
- ❌ NO importar `test` desde `@playwright/test` — siempre desde el fixture
- ❌ NO usar `expect()` directo en el spec — usar Validations
- ❌ NO usar `page.locator/getByTestId` directo

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

## Exploración de la app con Playwright Agent CLI

Cuando un agente necesita diseñar Pages, Flows o validar interacciones contra la app real, debe usar **Playwright Agent CLI** (`npx playwright-cli`).

Esta es la herramienta token-eficiente que qadan adoptó como reemplazo de Playwright MCP. Detalle completo en el skill `playwright-cli-usage`.

### Flujo típico para diseñar un Page Object

1. **Explorar la página relevante:**
```bash
npx playwright-cli open <BASE_URL>/login
npx playwright-cli snapshot
```

2. **Identificar elementos en el snapshot YAML:**
   - Refs (`e11`, `e13`) — útiles solo durante exploración
   - Roles (`button`, `textbox`) — útiles para `getByRole`
   - Labels (`"Username"`) — útiles para `getByLabel`

3. **Mapear refs a selectores estables** siguiendo el orden de prioridad:
   - `data-testid` > `getByRole` > `getByLabel` > `getByText` > CSS

4. **Validar interactivamente con el CLI** antes de escribir código:
```bash
npx playwright-cli type e11 "test"
npx playwright-cli snapshot   # verificar respuesta
```

5. **Cerrar el daemon al terminar:**
```bash
npx playwright-cli close
```

### Regla importante

**Los refs (e11, e13) NUNCA aparecen en el código del Page Object final.** Son herramienta de exploración del agente. El código generado usa selectores semánticos estables.

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
- [ ] Si es una feature: tiene archivo de Validations (`{Feature}Validations.ts`)
- [ ] Los specs usan Validations para assertions, NO assertions directas
- [ ] Validations extienden `BaseValidation`
- [ ] Métodos de Validations empiezan con `assert`
- [ ] Validations NO ejecutan acciones (solo leen estado)
- [ ] Si es una feature nueva: tiene archivo de fixture (`{feature}.fixture.ts`)
- [ ] Los specs importan `test` desde el fixture, NO desde `@playwright/test`
- [ ] Los specs NO instancian Pages/Flows/Validations con `new` — usan destructuring del fixture
