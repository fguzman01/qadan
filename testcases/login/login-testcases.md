# Test Cases — Feature: Login

**HU:** SAUCE-101 | **Módulo:** Autenticación | **Generado:** 2026-06-10

| Test Case | Datos | Precondiciones | Pasos | Resultado Esperado |
|-----------|-------|----------------|-------|---------------------|
| **TC-001** — Iniciar sesión con credenciales válidas | Usuario: `standard_user` <br> Password: `secret_sauce` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Redirige a `/inventory.html` <br> Catálogo de productos visible |
| **TC-002** — Error al usar usuario bloqueado | Usuario: `locked_out_user` <br> Password: `secret_sauce` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Muestra mensaje con texto `locked out` <br> No redirige a `/inventory.html` <br> Permanece en `/` |
| **TC-003** — Error al usar credenciales inválidas | Usuario: `invalid_user_xyz` <br> Password: `wrong_password` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Muestra mensaje con texto `do not match` <br> No redirige a `/inventory.html` <br> Permanece en `/` |
| **TC-004** — Error al enviar formulario sin usuario | Usuario: `""` <br> Password: `secret_sauce` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Click en `Login` sin llenar el campo `Usuario` | Muestra mensaje `Username is required` <br> No redirige <br> Sin intento de autenticación |
| **TC-005** — Error al enviar formulario sin contraseña | Usuario: `standard_user` <br> Password: `""` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Click en `Login` sin llenar el campo `Password` | Muestra mensaje `Password is required` <br> No redirige |
