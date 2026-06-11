# SAUCE-101: Iniciar sesión en Sauce Demo

**Tipo:** Historia de Usuario
**Épica:** SAUCE-100 - Autenticación
**Módulo:** Autenticación
**Prioridad:** Alta
**Estado:** Ready for QA

## Descripción

Como **usuario registrado del e-commerce Sauce Demo**,
quiero **iniciar sesión con mi nombre de usuario y contraseña**,
para **acceder al catálogo de productos y poder realizar compras**.

## Criterios de Aceptación

### CA-1: Login exitoso
**Dado** que soy un usuario válido del sistema
**Cuando** ingreso credenciales correctas y hago click en "Login"
**Entonces** el sistema me redirige a la página de inventario (`/inventory.html`)
**Y** veo el catálogo de productos disponible.

### CA-2: Usuario bloqueado
**Dado** que mi cuenta ha sido bloqueada
**Cuando** intento iniciar sesión con mis credenciales
**Entonces** el sistema muestra un mensaje indicando que el usuario está bloqueado (contiene "locked out")
**Y** permanezco en la página de login.

### CA-3: Credenciales incorrectas
**Dado** que ingreso un usuario o contraseña que no existen
**Cuando** hago click en "Login"
**Entonces** el sistema muestra un mensaje indicando que las credenciales no coinciden (contiene "do not match")
**Y** permanezco en la página de login.

### CA-4: Campos requeridos
**Dado** que estoy en la página de login
**Cuando** hago click en "Login" sin llenar el campo Usuario
**Entonces** el sistema muestra el mensaje "Username is required"
**Y** no se realiza ningún intento de autenticación.

**Dado** que estoy en la página de login
**Cuando** llene el campo Usuario pero deje vacío el campo Contraseña
**Y** hago click en "Login"
**Entonces** el sistema muestra el mensaje "Password is required".

## Notas técnicas

- URL de login: `/`
- Endpoint de autenticación: interno (no expuesto)
- Cookie de sesión válida por 24 horas
- El sistema bloquea automáticamente cuentas tras múltiples intentos fallidos (fuera de alcance de esta HU)

## Datos de prueba (proporcionados por QA)

| Tipo | Usuario | Contraseña |
|------|---------|------------|
| Válido | standard_user | secret_sauce |
| Bloqueado | locked_out_user | secret_sauce |
| Inválido | invalid_user_xyz | wrong_password |

## Definition of Done

- [x] Implementación completa
- [x] Test cases de QA generados y revisados
- [ ] Tests automatizados verdes
- [ ] Code review aprobado
