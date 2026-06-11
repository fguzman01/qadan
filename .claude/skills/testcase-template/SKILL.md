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
- **Regla de consistencia:** Usar la MISMA forma para precondiciones equivalentes
  dentro del mismo archivo. NO mezclar versiones cortas y largas.

#### Forma canónica para "sistema limpio"
Cuando el TC requiere que el sistema esté en estado inicial (sin sesión, sin datos previos),
usar SIEMPRE esta forma completa:

`Sistema en estado inicial (usuario no autenticado)`

NO usar variantes cortas como:
- ❌ `Sistema en estado inicial`
- ❌ `Sin sesión`
- ❌ `Limpio`
- ❌ `—` (si la precondición existe, declararla)

#### Otros ejemplos correctos
- ✅ `Usuario activo en BD`
- ✅ `Carrito con 3 productos <br> Sesión iniciada`
- ✅ `Producto con SKU PROD-001 disponible en stock`
- ✅ `—` (cuando genuinamente no hay precondiciones técnicas)

#### Ejemplos incorrectos
- ❌ `Hacer login` (esto es un paso, no una precondición)
- ❌ `App funcionando` (vago, todo TC asume eso)
- ❌ Mezclar `Sistema en estado inicial` y `Sistema en estado inicial (usuario no autenticado)`
  en el mismo archivo

### 4. Pasos
- Lista numerada (1. 2. 3.), cada paso en su propia línea con `<br>`
- Verbo imperativo al inicio de cada paso
- Ser específico: "Click en `Iniciar sesión`" en vez de "Hacer click en botón"
- Referenciar elementos UI con backticks
- **Regla anti-redundancia:** NO repetir información en pasos consecutivos.
  Si un paso ya implica una acción, no hace falta describir el contexto en el siguiente.

#### Ejemplos correctos
- ✅
```
1. Navegar a `/login`
2. Ingresar email
3. Click en `Iniciar sesión`
```
- ✅
```
1. Navegar a `/`
2. Click en `Login` sin llenar el campo `Usuario`
```

#### Ejemplos incorrectos
- ❌
```
1. Navegar a `/`
2. Dejar campo `Usuario` vacío        ← redundante
3. Click en `Login` sin ingresar usuario   ← repite lo del paso 2
```
  **Mejor:**
```
1. Navegar a `/`
2. Click en `Login` sin llenar el campo `Usuario`
```

- ❌ `Hacer el flujo de login` (muy vago, no numerado)

#### Regla de longitud
- Cada paso debe expresar UNA acción concreta
- Si necesitás 2 acciones combinadas, separalas en 2 pasos
- Si un paso es más largo que 15 palabras, probablemente necesita dividirse

### 5. Resultado Esperado
- Un criterio por línea con `<br>`
- Solo resultados observables y verificables
- Cubrir estado UI, URL, datos, efectos colaterales
- Ejemplos:
  - ✅ `Redirige a \`/dashboard\` <br> Header muestra nombre del usuario <br> Token JWT en localStorage`
  - ❌ `Funciona correctamente` (no verificable)

## Tipos de Test Case y convenciones de nombrado

Usar estos prefijos en los títulos según el tipo de TC:

| Tipo | Prefijo título (OBLIGATORIO) | Cuándo usar |
|------|------------------------------|-------------|
| Happy Path | (sin prefijo) | Flujo principal exitoso |
| Negative | `"Error al..."` | Validaciones, errores esperados, fallos de input |
| Edge | `"Edge:"` | Límites, valores extremos, casos borde |
| Smoke | `"Smoke:"` | Validación crítica mínima |
| Regression | `"Regression:"` | Bugs previos que no deben reaparecer |

**Regla:** El prefijo "Error al..." es OBLIGATORIO para todo TC de tipo Negative.
NO usar variantes como "Falla al...", "Falla cuando...", "Validación de...", etc.

### Ejemplos correctos
- ✅ `**TC-001** — Iniciar sesión con credenciales válidas` (Happy)
- ✅ `**TC-002** — Error al usar credenciales inválidas` (Negative)
- ✅ `**TC-003** — Error al enviar formulario sin usuario` (Negative)
- ✅ `**TC-004** — Edge: Password con caracteres especiales` (Edge)
- ✅ `**TC-005** — Smoke: Botón "Olvidé mi contraseña" navega` (Smoke)

### Ejemplos incorrectos
- ❌ `**TC-002** — Falla al usar credenciales inválidas` (debe ser "Error al...")
- ❌ `**TC-003** — Validación de campo email vacío` (debe ser "Error al...")
- ❌ `**TC-004** — Usuario bloqueado no puede iniciar sesión` (sin prefijo, ambiguo)

## Heurísticas de cobertura
Al generar test cases para una feature, asegurar cobertura de:
- ✅ Al menos 1 Happy Path
- ✅ Validaciones de campos vacíos (cada campo requerido)
- ✅ Validaciones de formato inválido (email, teléfono, números)
- ✅ Valores límite (longitud min/max, cantidad min/max)
- ✅ Permisos/autorización (si aplica)
- ✅ Escenarios de red/timeout (si aplica)

## Diseño de TCs negativos: aislamiento de variables

Cuando diseñes un TC negative que prueba una validación específica, **aislá la variable que estás probando**. Los demás campos deben tener valores válidos.

### Por qué importa
Si un TC tiene múltiples errores simultáneos, no sabés cuál disparó la respuesta del sistema. Aislar variables hace que el TC sea más confiable y debuggeable.

### Ejemplo correcto: aislar "usuario vacío"
```
TC: Error al enviar formulario sin usuario
Datos: Usuario: `""` <br> Password: `secret_sauce`   ← password válido
```
→ Sabemos con certeza que el error viene del campo Usuario vacío.

### Ejemplo incorrecto: variables mezcladas
```
TC: Error al enviar formulario sin usuario
Datos: Usuario: `""` <br> Password: `""`             ← ambos vacíos
```
→ Si el sistema valida primero Password, este TC nunca probaría la validación de Usuario.

### Excepción válida: TC explícito de "formulario completamente vacío"
Si la HU explícitamente cubre el escenario de "todos los campos vacíos", crear un TC adicional
con ese título claro:
```
TC: Error al enviar formulario vacío
Datos: Usuario: `""` <br> Password: `""`
```
Este TC NO reemplaza los TCs individuales por cada campo — los complementa.

### Regla de oro
**Un TC negative = una variable bajo prueba.** Si necesitás probar 2 cosas, son 2 TCs.

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
