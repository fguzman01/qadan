---
name: framework-core
description: Genera el código core del framework qadan: clases base (AutomationBase, BasePage, BaseFlow), decoradores (@step, @screenshotOnEnd), utils de interacción reforzados (safeClick, safeFill, etc.), logger y helper de screenshots. Usar este skill después de framework-setup. Requiere que ya existan los archivos de configuración (package.json, tsconfig.json, playwright.config.ts) y la estructura de carpetas.
---

# Skill: Framework Core

## Propósito
Generar el código fundacional del framework qadan. Todo el código de tests (Pages, Flows, Specs) que se cree después va a depender de estos archivos.

## Prerequisitos
- Ya ejecutado el skill `framework-setup`
- `npm install` completado
- Carpeta `framework/utils/` existente

## Archivos que genera

| Archivo | Responsabilidad |
|---------|-----------------|
| `framework/utils/logger.ts` | Función `log()` estandarizada |
| `framework/utils/screenshots.ts` | Helper `takeScreenshot()` con attachment a Allure |
| `framework/utils/interactions.ts` | Funciones puras `safeClick`, `safeFill`, etc. |
| `framework/utils/decorators.ts` | Decoradores `@step` y `@screenshotOnEnd` |
| `framework/utils/AutomationBase.ts` | Clase abstracta padre de BasePage y BaseFlow |
| `framework/utils/BasePage.ts` | Clase base para todos los Page Objects |
| `framework/utils/BaseFlow.ts` | Clase base para todos los Flows |
| `framework/utils/index.ts` | Barrel export para imports limpios |

## Reglas de generación

1. Todos los archivos usan TypeScript estricto
2. Tipos de retorno explícitos en todos los métodos
3. JSDoc en todos los métodos públicos y protected
4. Imports ordenados: Playwright → Allure → externos → internos
5. NO usar `any` salvo en argumentos de decoradores (justificado con `// eslint-disable-next-line`)
6. Todos los `safe*` deben loggear su acción vía `log('debug', ...)` incluyendo el locator
7. Cualquier fallo en `safe*` debe lanzar Error con mensaje descriptivo

## Decoradores (API TC39 Stage 3 — OBLIGATORIO)

Los decoradores usan la API TC39 Stage 3 de TypeScript 5.0+. **NO** usar la API legacy
`(target, propertyKey, descriptor)`. **NO** agregar `experimentalDecorators: true` al tsconfig.

Playwright 1.44+ transpila TypeScript en runtime usando Stage 3 independientemente del tsconfig.
Usar la API legacy causa `TypeError: Cannot read properties of undefined (reading 'value')` en runtime.

### Firma correcta (Stage 3)

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function step(nameTemplate?: string): any {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext,      // ← Stage 3: context object
  ) {
    const methodName = String(context.name);  // ← Stage 3: context.name en lugar de propertyKey
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (this: any, ...args: any[]) {
      const stepName = nameTemplate
        ? interpolate(nameTemplate, args)
        : `${this.constructor.name}.${methodName}`;

      log('info', `▶ ${stepName}`);
      const start = Date.now();

      try {
        const result = await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
        const duration = Date.now() - start;
        log('info', `✓ ${stepName} (${duration}ms)`);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        const errorMsg = (error as Error).message;
        log('error', `✗ ${stepName} (${duration}ms) - ${errorMsg}`);
        throw error;
      }
    };
  };
}
```

### Firma INCORRECTA (legacy — NO usar)

```typescript
// ❌ NUNCA usar esta firma — rompe en runtime con Playwright 1.44+
export function step(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  // descriptor.value será undefined en runtime → TypeError
}
```

### Comportamiento de @step

`@step` hace 3 cosas automáticamente:
1. Crea un step en Allure y en el reporte HTML de Playwright
2. Logea: `[INFO] ▶ {nombre}` al inicio, `[INFO] ✓ {nombre} ({ms}ms)` al finalizar, `[ERROR] ✗ {nombre} ({ms}ms) - {error}` al fallar
3. Mide la duración

Como `@step` ya loggea, **NO agregar `log('info', ...)` manualmente dentro del método** — sería duplicado.

## Cómo extender en el futuro
- Agregar un nuevo método `safeX`: implementar en `interactions.ts` + exponer en `AutomationBase`
- Agregar un nuevo decorador: agregarlo en `decorators.ts` y exportarlo en `index.ts`
- NO modificar `BasePage`/`BaseFlow` directamente para agregar interactions — siempre vía `AutomationBase`
