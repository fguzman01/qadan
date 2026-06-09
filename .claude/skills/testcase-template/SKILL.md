---
name: testcase-template
description: Define el formato canónico para Test Cases en qadan. Usar este skill cada vez que se genere, lea o edite archivos de test cases bajo /testcases/. Los test cases se escriben en tablas Markdown para claridad visual y compatibilidad con Git.
---

# Skill: Test Case Template

## Propósito
Todos los test cases en qadan siguen un formato único y consistente: una tabla Markdown con 5 columnas fijas. Este formato prioriza la legibilidad visual (flujo izquierda a derecha) y se mantiene amigable con Git, además de ser convertible a CSV/XLSX cuando sea necesario.

## Ubicación y nombrado de archivos
- Ruta: `testcases/{nombre-feature}/{nombre-feature}-testcases.md`
- Un archivo por feature (no un archivo por test case)
- Nombre de feature en kebab-case (ej: `login`, `checkout`, `gestion-carrito`)

## Estructura del archivo

Todo archivo de test cases DEBE comenzar con este encabezado:

```markdown
# Test Cases — Feature: {Nombre Feature}

**HU:** {JIRA-ID} | **Módulo:** {Nombre Módulo} | **Generado:** {YYYY-MM-DD}
```

Seguido por la tabla de test cases:

```markdown
| Test Case | Datos | Precondiciones | Pasos | Resultado Esperado |
|-----------|-------|----------------|-------|---------------------|
| **TC-001** — {Título descriptivo} | {clave}: `{valor}` <br> {clave}: `{valor}` | {Estado previo} o `—` | 1. {Paso} <br> 2. {Paso} <br> 3. {Paso} | {Criterio} <br> {Criterio} |
```

## Reglas por columna

### 1. Test Case
- Formato: `**TC-XXX** — Título descriptivo`
- ID: 3 dígitos con ceros a la izquierda (TC-001, TC-002, ..., TC-099, TC-100)
- Título: comienza con verbo de acción, describe el escenario claramente
- Ejemplos:
  - ✅ `**TC-001** — Login con credenciales válidas`
  - ✅ `**TC-014** — Carrito persiste tras cerrar sesión`
  - ❌ `**TC-001** — Test login` (muy vago)
  - ❌ `**TC-1** — login ok` (formato incorrecto)

### 2. Datos
- Formato: `{clave}: \`{valor}\``
- Una clave por línea, separadas por `<br>`
- Valores envueltos en backticks (código en línea)
- Usar `""` para strings vacíos, `—` cuando no se requieran datos
- Ejemplos:
  - `Email: \`valid@test.com\` <br> Password: \`Pass123!\``
  - `Cantidad: \`5\` <br> SKU: \`PROD-001\``
  - `—` (sin datos)

### 3. Precondiciones
- Estilo bullet si hay múltiples, separadas por `<br>`
- Usar `—` si no hay
- Describir estado del sistema o datos, NO acciones
- Ejemplos:
  - ✅ `Usuario activo en BD`
  - ✅ `Carrito con 3 productos <br> Sesión iniciada`
  - ❌ `Hacer login` (esto es un paso, no una precondición)

### 4. Pasos
- Lista numerada (1. 2. 3.), cada paso en su propia línea con `<br>`
- Verbo imperativo al inicio de cada paso
- Ser específico: "Click en `Iniciar sesión`" en vez de "Hacer click en botón"
- Referenciar elementos UI con backticks
- Ejemplos:
  - ✅ `1. Navegar a \`/login\` <br> 2. Ingresar email <br> 3. Click en \`Iniciar sesión\``
  - ❌ `Hacer el flujo de login` (muy vago, no numerado)

### 5. Resultado Esperado
- Un criterio por línea con `<br>`
- Solo resultados observables y verificables
- Cubrir estado UI, URL, datos, efectos colaterales
- Ejemplos:
  - ✅ `Redirige a \`/dashboard\` <br> Header muestra nombre del usuario <br> Token JWT en localStorage`
  - ❌ `Funciona correctamente` (no verificable)

## Tipos de Test Case y convenciones de nombrado
Usar estos prefijos en los títulos cuando apliquen (opcional pero recomendado):

| Tipo | Prefijo título | Cuándo usar |
|------|----------------|-------------|
| Happy Path | (sin prefijo) | Flujo principal exitoso |
| Negative | "Error al..." o "Falla cuando..." | Validaciones, errores esperados |
| Edge | "Edge:" | Límites, valores extremos |
| Smoke | "Smoke:" | Validación crítica mínima |
| Regression | "Regression:" | Bugs previos que no deben reaparecer |

## Heurísticas de cobertura
Al generar test cases para una feature, asegurar cobertura de:
- ✅ Al menos 1 Happy Path
- ✅ Validaciones de campos vacíos (cada campo requerido)
- ✅ Validaciones de formato inválido (email, teléfono, números)
- ✅ Valores límite (longitud min/max, cantidad min/max)
- ✅ Permisos/autorización (si aplica)
- ✅ Escenarios de red/timeout (si aplica)

## Ejemplo completo

```markdown
# Test Cases — Feature: Login

**HU:** JIRA-123 | **Módulo:** Autenticación | **Generado:** 2026-06-09

| Test Case | Datos | Precondiciones | Pasos | Resultado Esperado |
|-----------|-------|----------------|-------|---------------------|
| **TC-001** — Login con credenciales válidas | Email: `valid@test.com` <br> Password: `Pass123!` | Usuario activo en BD | 1. Navegar a `/login` <br> 2. Ingresar email <br> 3. Ingresar password <br> 4. Click en `Iniciar sesión` | Redirige a `/dashboard` <br> Header muestra nombre del usuario <br> Token JWT en localStorage |
| **TC-002** — Error al ingresar email inválido | Email: `notanemail` <br> Password: `Pass123!` | — | 1. Navegar a `/login` <br> 2. Ingresar email mal formado <br> 3. Click en `Iniciar sesión` | Muestra mensaje: `Email inválido` <br> No redirige <br> Campo email con borde rojo |
| **TC-003** — Error al enviar formulario vacío | Email: `""` <br> Password: `""` | — | 1. Navegar a `/login` <br> 2. Click en `Iniciar sesión` sin llenar campos | Muestra: `Campos obligatorios` <br> Botón permanece habilitado <br> No hace request al backend |
| **TC-004** — Edge: Password con caracteres especiales | Email: `valid@test.com` <br> Password: `P@$$w0rd!#%` | Usuario activo con esa password | 1. Navegar a `/login` <br> 2. Ingresar credenciales <br> 3. Click en `Iniciar sesión` | Redirige a `/dashboard` <br> Sin errores de parsing |
| **TC-005** — Smoke: Botón "Olvidé mi contraseña" navega | — | — | 1. Navegar a `/login` <br> 2. Click en `Olvidé mi contraseña` | Redirige a `/forgot-password` |
```

## Reglas de output (para el agente)
Al generar archivos de test cases:
1. Todo el contenido va en español (títulos, descripciones, mensajes esperados)
2. Identificadores técnicos en inglés (IDs TC, nombres de archivo, referencias de código)
3. Siempre envolver elementos UI, URLs y valores de datos en backticks
4. Siempre separar contenido multilínea dentro de una celda con `<br>`
5. Nunca usar tablas HTML — siempre tablas Markdown
6. Nunca dividir una feature en múltiples archivos — una feature = un archivo
