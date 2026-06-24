# SAUCE-102: Gestionar carrito de compras

**Tipo:** Historia de Usuario
**Épica:** SAUCE-100 - Compras
**Módulo:** Carrito
**Prioridad:** Alta
**Estado:** Ready for QA

## Descripción

Como **usuario autenticado en Sauce Demo**,
quiero **agregar y eliminar productos del carrito**,
para **gestionar mi selección antes de proceder al checkout**.

## Criterios de Aceptación

### CA-1: Agregar producto al carrito
**Dado** que estoy en la página de inventario (`/inventory.html`)
**Cuando** hago click en el botón `Add to cart` de un producto
**Entonces** el badge del carrito se actualiza mostrando la cantidad de productos
**Y** el botón del producto cambia a `Remove`.

### CA-2: Verificar producto en el carrito
**Dado** que agregué al menos un producto al carrito
**Cuando** navego al carrito (`/cart.html`)
**Entonces** veo el producto agregado con su nombre y precio
**Y** la cantidad de items en el carrito es correcta.

### CA-3: Eliminar producto del carrito
**Dado** que tengo al menos un producto en el carrito
**Cuando** hago click en `Remove` desde la página de inventario
**Entonces** el badge del carrito se actualiza (disminuye o desaparece)
**Y** el botón vuelve a mostrar `Add to cart`.

### CA-4: Carrito vacío
**Dado** que no he agregado ningún producto
**Cuando** navego al carrito (`/cart.html`)
**Entonces** el carrito aparece vacío (sin items listados).

## Notas técnicas

- URL inventario: `/inventory.html`
- URL carrito: `/cart.html`
- El badge del carrito está en el header y muestra el total de items
- Precondición de todos los TCs: usuario debe estar autenticado
- El flujo de login ya existe en `AuthFlow.loginAsUser()`

## Datos de prueba

| Tipo | Valor |
|------|-------|
| Producto 1 | Sauce Labs Backpack |
| Producto 2 | Sauce Labs Bike Light |
| Usuario | standard_user / secret_sauce |

## Definition of Done

- [ ] Test cases de QA generados y revisados
- [ ] Tests automatizados verdes
- [ ] Code review aprobado