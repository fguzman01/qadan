# qadan

Framework de QA automation impulsado por agentes IA

Framework de QA automation impulsado por agentes IA, construido sobre [qadan](https://github.com/fguzman01/qadan).

## Stack

- **Lenguaje:** TypeScript
- **Runner:** Playwright Test
- **Reporting:** Allure
- **Patrón:** Page Object Model (POM) con Flows
- **Target:** https://www.saucedemo.com

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

# Modo lento (1s entre acciones, con browser visible)
npm run test:slow

# Modo super lento (2s, ideal para demos)
npm run test:slow:2x

# Velocidad custom
SLOW_MO=3000 npm test -- --headed
```

## Estructura

```
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
```

## Documentación

- [Convenciones POM](.claude/skills/pom-conventions/SKILL.md)
- [Formato Test Cases](.claude/skills/testcase-template/SKILL.md)
