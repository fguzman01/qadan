---
name: framework-setup
description: Procedimiento para inicializar el setup base de un proyecto qadan. Genera package.json, tsconfig.json, playwright.config.ts, estructura de carpetas, .gitignore y scripts npm. Usar este skill al crear un nuevo proyecto qadan desde cero, o al regenerar la base de uno existente. NO instala el core (BasePage, decoradores, etc.) — eso lo hace el skill framework-core.
---

# Skill: Framework Setup

## Propósito
Generar todo el andamiaje inicial de un proyecto qadan: configuración de dependencias, TypeScript, Playwright, estructura de carpetas vacías, scripts npm y archivos de configuración. Este skill es la base sobre la que después se monta `framework-core` (los archivos del POM base).

## Inputs requeridos del usuario
Antes de ejecutar este skill, preguntar al usuario y reemplazar en los templates:

| Placeholder | Descripción | Default si no responde |
|-------------|-------------|------------------------|
| `{{PROJECT_NAME}}` | Nombre del proyecto npm | `qadan-project` |
| `{{AUTHOR}}` | Autor del proyecto | `qadan-user` |
| `{{BASE_URL}}` | URL del sistema bajo prueba | `https://example.com` |
| `{{DESCRIPTION}}` | Descripción del proyecto | `QA framework powered by qadan` |

## Pasos del procedimiento

### Paso 1: Verificar prerequisitos
- Verificar que Node.js >= 18 esté instalado (`node --version`)
- Verificar que el directorio actual sea el root del repo (debe existir `.claude/`)
- Si ya existe `package.json`, preguntar al usuario si desea sobrescribir o abortar

### Paso 2: Crear estructura de carpetas

````
framework/
├── pages/
├── flows/
├── tests/
├── utils/
├── data/
├── models/
└── fixtures/

context/                # Output del Context Harvester
testcases/              # Output del Test Strategist
reports/                # Output de tests + Allure
allure-results/         # Raw data de Allure (gitignored)
allure-report/          # HTML generado de Allure (gitignored)
scripts/                # Scripts auxiliares
docs/                   # Documentación
````

Crear cada carpeta con un archivo `.gitkeep` para que Git las trackee vacías.

### Paso 3: Generar package.json

````json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "description": "{{DESCRIPTION}}",
  "author": "{{AUTHOR}}",
  "license": "MIT",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:smoke": "playwright test --grep @smoke",
    "test:regression": "playwright test --grep @regression",
    "test:and:report": "npm run test:clean && npm run test && npm run allure:report",
    "test:clean": "rimraf allure-results allure-report reports",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:report": "npm run allure:generate && npm run allure:open",
    "allure:serve": "allure serve allure-results",
    "playwright:install": "playwright install chromium",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.ts\""
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@types/node": "^22.0.0",
    "allure-commandline": "^2.30.0",
    "allure-playwright": "^3.0.0",
    "allure-js-commons": "^3.0.0",
    "rimraf": "^6.0.0",
    "typescript": "^5.6.0",
    "ts-node": "^10.9.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "prettier": "^3.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
````

### Paso 4: Generar tsconfig.json

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": false,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["framework/pages/*"],
      "@flows/*": ["framework/flows/*"],
      "@utils/*": ["framework/utils/*"],
      "@data/*": ["framework/data/*"],
      "@models/*": ["framework/models/*"],
      "@fixtures/*": ["framework/fixtures/*"]
    }
  },
  "include": [
    "framework/**/*.ts",
    "scripts/**/*.ts",
    "*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "allure-report",
    "allure-results"
  ]
}
````

### Paso 5: Generar playwright.config.ts

````typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './framework/tests',
  fullyParallel: false,  // Tests corren en serie por defecto (más predecible para QA)
                         // Cambiar a true si el proyecto requiere máxima velocidad en CI
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['allure-playwright', {
      detail: false,       // Oculta sub-steps internos de Playwright
                            // Muestra solo los @step definidos por el equipo (más legible)
      outputFolder: 'allure-results',
      suiteTitle: false,
      environmentInfo: {
        framework: 'qadan',
        node_version: process.version,
      },
    }],
  ],
  use: {
    baseURL: process.env.BASE_URL || '{{BASE_URL}}',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'reports/test-results',
});
````

### Paso 6: Generar .gitignore

````gitignore
# Dependencias
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
dist/
*.tsbuildinfo

# Reportes y resultados
allure-results/
allure-report/
reports/
test-results/
playwright-report/
playwright/.cache/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# Sistema operativo
.DS_Store
Thumbs.db

# Variables de entorno
.env
.env.local
.env.*.local

# Contexto generado (decidir por equipo)
# context/

# Temporal
*.tmp
.tmp/
````

### Paso 7: Generar .env.example

````env
# URL base del sistema bajo prueba
BASE_URL={{BASE_URL}}

# Credenciales (NO commitear el .env real)
TEST_USER_EMAIL=
TEST_USER_PASSWORD=

# Configuración de ejecución
HEADLESS=true
WORKERS=4

# Integraciones (Fase 2)
JIRA_API_TOKEN=
JIRA_BASE_URL=
FIGMA_API_TOKEN=
````

### Paso 8: Generar eslint.config.js

ESLint 9 usa "flat config" — ya no soporta `.eslintrc.*` ni el flag `--ext`.

````javascript
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'allure-results/**',
      'allure-report/**',
      'reports/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
````

### Paso 9: Generar .prettierrc

````json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
````

### Paso 10: Generar README.md inicial

````markdown
# {{PROJECT_NAME}}

{{DESCRIPTION}}

Framework de QA automation impulsado por agentes IA, construido sobre [qadan](https://github.com/fguzman01/qadan).

## Stack

- **Lenguaje:** TypeScript
- **Runner:** Playwright Test
- **Reporting:** Allure
- **Patrón:** Page Object Model (POM) con Flows
- **Target:** {{BASE_URL}}

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
npm install
npm run playwright:install
```

## Ejecutar tests

```bash
# Todos los tests
npm test

# En modo headed (ver navegador)
npm run test:headed

# En modo debug (paso a paso)
npm run test:debug

# UI mode interactivo
npm run test:ui

# Solo tests smoke
npm run test:smoke

# Tests + generar y abrir reporte Allure
npm run test:and:report
```

## Estructura

````
framework/
├── pages/      # Page Objects
├── flows/      # Flows de negocio (orquestan Pages)
├── tests/      # Specs Playwright
├── utils/      # Utilities (BasePage, BaseFlow, decoradores)
├── data/       # Data Providers (JSON)
├── models/     # Interfaces TypeScript
└── fixtures/   # Playwright fixtures

testcases/      # Test Cases en Markdown
context/        # Contexto extraído (HUs, Figma, DOM)
reports/        # Reportes de ejecución
````

## Documentación

- [Convenciones POM](.claude/skills/pom-conventions/SKILL.md)
- [Formato Test Cases](.claude/skills/testcase-template/SKILL.md)
````

### Paso 11: Validar instalación

Ejecutar en orden:
1. `npm install` — instalar dependencias
2. `npm run playwright:install` — descargar Chromium
3. `npx tsc --noEmit` — validar TypeScript sin errores
4. `npx playwright --version` — confirmar Playwright
5. `npm run lint` — confirmar ESLint sin errores

Reportar al usuario el resultado de cada paso.

## Resultado esperado

Al finalizar este skill, el proyecto debe tener:
- ✅ Todas las carpetas de la estructura creadas (con `.gitkeep`)
- ✅ `package.json` con dependencias y scripts
- ✅ `tsconfig.json` con paths aliases
- ✅ `playwright.config.ts` configurado con Allure
- ✅ `.gitignore`, `.env.example`, `eslint.config.js`, `.prettierrc`
- ✅ `README.md` inicial
- ✅ Dependencias instaladas
- ✅ Chromium descargado

## Lo que NO hace este skill (lo hace framework-core)

- ❌ NO crea `BasePage.ts`, `BaseFlow.ts`
- ❌ NO crea decoradores (`@step`, `@screenshotOnEnd`)
- ❌ NO crea utils de interacción (`safeClick`, etc.)
- ❌ NO crea logger
- ❌ NO crea tests de ejemplo
