# Test Cases — Feature: Carrito de Compras

**HU:** SAUCE-102 | **Módulo:** Carrito | **Generado:** 2026-06-23

| Test Case | Datos | Precondiciones | Pasos | Resultado Esperado |
|-----------|-------|----------------|-------|---------------------|
| **TC-001** — Agregar un producto al carrito | Producto: `Sauce Labs Backpack` | Usuario autenticado en `/inventory.html` | 1. Localizar el producto `Sauce Labs Backpack` <br> 2. Click en `Add to cart` | Badge del carrito muestra `1` <br> Botón del producto cambia a `Remove` |
| **TC-002** — Verificar producto agregado en la vista del carrito | Producto: `Sauce Labs Backpack` | Usuario autenticado <br> Producto `Sauce Labs Backpack` agregado al carrito | 1. Navegar a `/cart.html` | Producto `Sauce Labs Backpack` visible en la lista <br> Precio del producto visible <br> Cantidad de items en el carrito es `1` |
| **TC-003** — Eliminar producto desde la página de inventario | Producto: `Sauce Labs Backpack` | Usuario autenticado en `/inventory.html` <br> Producto `Sauce Labs Backpack` agregado al carrito | 1. Localizar el producto `Sauce Labs Backpack` <br> 2. Click en `Remove` | Badge del carrito desaparece o muestra `0` <br> Botón del producto cambia a `Add to cart` |
| **TC-004** — Visualizar carrito vacío | — | Usuario autenticado <br> Carrito sin productos | 1. Navegar a `/cart.html` | No hay items listados en el carrito <br> Badge del carrito no es visible |
| **TC-005** — Edge: Agregar múltiples productos al carrito | Producto 1: `Sauce Labs Backpack` <br> Producto 2: `Sauce Labs Bike Light` | Usuario autenticado en `/inventory.html` | 1. Click en `Add to cart` del producto `Sauce Labs Backpack` <br> 2. Click en `Add to cart` del producto `Sauce Labs Bike Light` | Badge del carrito muestra `2` <br> Ambos botones de productos muestran `Remove` |
| **TC-006** — Error al intentar agregar producto sin autenticación | Producto: `Sauce Labs Backpack` | Sistema en estado inicial (usuario no autenticado) | 1. Navegar a `/inventory.html` sin autenticarse | Redirige a `/` (página de login) <br> No se puede acceder al inventario |
| **TC-007** — Edge: Eliminar producto desde la vista del carrito | Producto: `Sauce Labs Backpack` | Usuario autenticado <br> Producto `Sauce Labs Backpack` agregado al carrito <br> Usuario en `/cart.html` | 1. Click en `Remove` del producto en el carrito | Producto removido de la lista <br> Badge del carrito desaparece o muestra `0` <br> Carrito aparece vacío |
