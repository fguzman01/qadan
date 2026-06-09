# Test Cases — Feature: Login

**HU:** SMOKE-001 | **Módulo:** Autenticación | **Generado:** 2026-06-09

| Test Case | Datos | Precondiciones | Pasos | Resultado Esperado |
|-----------|-------|----------------|-------|---------------------|
| **TC-001** — Iniciar sesión con credenciales válidas | Usuario: `standard_user` <br> Password: `secret_sauce` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Redirige a `/inventory.html` <br> Página de inventario visible <br> Al menos 1 producto visible |
| **TC-002** — Falla al usar usuario bloqueado | Usuario: `locked_out_user` <br> Password: `secret_sauce` | Sistema en estado inicial | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Muestra mensaje con texto `locked out` <br> NO redirige a inventory <br> Permanece en `/` |
| **TC-003** — Falla al usar credenciales inválidas | Usuario: `invalid_user_xyz` <br> Password: `wrong_password` | Sistema en estado inicial | 1. Navegar a `/` <br> 2. Ingresar usuario <br> 3. Ingresar password <br> 4. Click en `Login` | Muestra mensaje con texto `do not match` <br> NO redirige <br> Permanece en `/` |
| **TC-004** — Falla al enviar formulario vacío | — | Sistema en estado inicial | 1. Navegar a `/` <br> 2. Click en `Login` sin llenar campos | Muestra mensaje con texto `Username is required` <br> No redirige |
