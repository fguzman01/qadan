---
name: playwright-cli-usage
description: Documenta el uso de Playwright Agent CLI (npx playwright-cli) en qadan. Esta es la herramienta token-eficiente que usan los agentes de qadan para explorar la app real, descubrir selectores y validar interacciones UI. Usar este skill cuando un agente necesite interactuar con un browser (POM Architect, Validator-Healer, o cualquier futuro agente que requiera exploración de UI).
---

# Skill: Playwright Agent CLI (uso en qadan)

## Qué es

Playwright Agent CLI es una herramienta de línea de comandos diseñada específicamente para agentes de IA que necesitan controlar un browser. Es la alternativa **token-eficiente** a Playwright MCP.

- **Paquete npm:** `@playwright/cli`
- **Binario:** `npx playwright-cli`
- **Modelo:** Daemon persistente + comandos stateless desde el agente
- **Output:** Snapshots en disco (no en context window)
- **Eficiencia:** 4-10x menos tokens que Playwright MCP

## Por qué qadan lo usa

| Característica | Por qué importa para qadan |
|---|---|
| Snapshots en disco | El agente lee solo lo que necesita, no infla el contexto |
| Element refs (`e11`, `e13`) | Identificación determinística sin selectores CSS frágiles |
| Daemon persistente | El browser queda vivo entre comandos = workflows largos posibles |
| Skill-based | Encaja con la arquitectura de qadan basada en skills |

## Comandos esenciales

### Iniciar sesión y abrir la app
```bash
# Abre Sauce Demo en un browser headed (visible) — modo agente
npx playwright-cli open https://www.saucedemo.com --headed

# Modo headless (default, para CI o exploración rápida)
npx playwright-cli open https://www.saucedemo.com
```

### Tomar snapshot del estado actual
```bash
npx playwright-cli snapshot
```
**Output:** archivo YAML en `.playwright-cli/page-{timestamp}.yml` con el accessibility tree de la página y refs `e1`, `e2`, etc.

**Ejemplo de snapshot:**
```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - textbox "Username" [ref=e11]
    - textbox "Password" [ref=e13]
    - button "Login" [ref=e15]
```

### Interactuar con elementos
```bash
# Escribir en un textbox usando su ref
npx playwright-cli type e11 "standard_user"

# Click en un botón
npx playwright-cli click e15

# Presionar Enter
npx playwright-cli press Enter

# Marcar checkbox por ref
npx playwright-cli check e21
```

### Navegación
```bash
npx playwright-cli navigate https://www.saucedemo.com/inventory.html
npx playwright-cli back
npx playwright-cli forward
npx playwright-cli reload
```

### Screenshots
```bash
# Pantalla completa
npx playwright-cli screenshot

# De un elemento específico
npx playwright-cli screenshot --ref e15
```

### Cerrar sesión
```bash
npx playwright-cli close
```

## Workflow típico de exploración (para POM Architect)

Este es el patrón estándar que los agentes de qadan siguen para descubrir la UI:

```bash
# 1. Abrir la app
npx playwright-cli open https://www.saucedemo.com

# 2. Snapshot inicial (descubrir elementos)
npx playwright-cli snapshot
# → leer el .yml generado para identificar refs

# 3. Interactuar para llegar al estado deseado (ej: post-login)
npx playwright-cli type e11 "standard_user"
npx playwright-cli type e13 "secret_sauce"
npx playwright-cli click e15

# 4. Nuevo snapshot del estado post-acción
npx playwright-cli snapshot

# 5. Repetir hasta cubrir todos los estados relevantes

# 6. Cerrar
npx playwright-cli close
```

## Cómo mapear refs a selectores Playwright

Los refs (`e11`, `e13`) son útiles **durante exploración**, pero el código de tests final NO debe usar refs (no son estables entre sesiones). El agente debe **traducir** los refs a selectores estables:

| Snapshot dice... | Selector que el agente debe generar |
|---|---|
| `textbox "Username" [ref=e11]` con `data-test="username"` en HTML | `page.getByTestId('username')` |
| `button "Login" [ref=e15]` | `page.getByRole('button', { name: 'Login' })` |
| `textbox "Username" [ref=e11]` (sin testid ni role específico) | `page.getByLabel('Username')` |

**Orden de prioridad obligatorio en qadan:**
1. `getByTestId` (si el elemento tiene data-test/data-testid)
2. `getByRole` (si tiene rol semántico)
3. `getByLabel` (para inputs con label asociado)
4. `getByText` (para texto visible)
5. CSS/XPath (último recurso, requiere comentario justificativo)

## Cómo saber el atributo testid real

El snapshot YAML del CLI muestra refs y roles, pero NO los atributos HTML específicos. Para descubrir el `data-test` real, el agente debe:

1. Hacer snapshot básico para ver la estructura
2. Si necesita confirmar el atributo de un elemento específico, usar:
```bash
npx playwright-cli eval "document.querySelector('input[type=text]').getAttribute('data-test')"
```
3. O hacer una inspección dirigida con el ref:
```bash
npx playwright-cli inspect e11
```

## Manejo de errores comunes

| Error | Causa | Solución |
|---|---|---|
| `Daemon not running` | No se ejecutó `open` previo | Ejecutar `npx playwright-cli open <url>` primero |
| `Element not found` | El ref ya no es válido (página cambió) | Tomar nuevo snapshot y usar refs frescos |
| `Snapshot file is huge` | Página con muchísimos elementos | Usar `--ref` para snapshot parcial de una región |
| Timeout en el CLI | Página lenta o app no carga | Aumentar timeout: `--timeout 30000` |

## Restricciones y buenas prácticas

- ✅ Usar refs SOLO durante exploración, NUNCA en código de tests final
- ✅ Tomar snapshot DESPUÉS de cada acción significativa
- ✅ Cerrar el daemon (`close`) al terminar para liberar recursos
- ❌ NO mantener refs viejos entre snapshots distintos — son volátiles
- ❌ NO usar el CLI para reemplazar tests reales — es para exploración/discovery

## Cuándo usar Playwright Agent CLI vs Playwright Test runner

| Caso de uso | Herramienta correcta |
|---|---|
| Agente explora app para diseñar POM | Playwright Agent CLI |
| Agente debuggea un test que falla | Playwright Agent CLI |
| Correr una suite de tests | Playwright Test (`npm test`) |
| Ejecutar un único spec | Playwright Test (`npx playwright test <file>`) |
| Desarrollar tests con UI mode | Playwright Test (`npm run test:ui`) |

## Archivos generados

| Archivo | Propósito | ¿Versionar? |
|---|---|---|
| `.playwright-cli/page-*.yml` | Snapshots de páginas | ❌ NO (gitignored) |
| `.playwright-cli/daemon.pid` | PID del daemon activo | ❌ NO |
| `.playwright-cli/screenshots/*.png` | Screenshots manuales | ❌ NO |

Todo el directorio `.playwright-cli/` debe estar en `.gitignore`.

## Referencias

- Doc oficial: https://playwright.dev/agent-cli/introduction
- Paquete npm: https://www.npmjs.com/package/@playwright/cli
- Comparación con MCP: https://playwright.dev/agent-cli/introduction#playwright-cli-vs-mcp
