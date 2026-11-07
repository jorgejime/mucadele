# DESIGN.md — Mucadele Licores (E-commerce + POS + Admin + Manual Operativo)

## 1. Filosofía: Sustracción Radical y Precisión Operativa
El sistema se gobierna bajo el principio de sustracción funcional: cero adornos superfluos, máxima velocidad táctil en mostrador y claridad absoluta para el operador.

- **Tienda Cliente (`/index.html`):** Catálogo conectado a Cloudflare D1 en tiempo real (precios y stock en vivo), filtro instantáneo, indicador de agotados y checkout en 4 campos conectado a Shipday.
- **Caja Registradora POS (`/pos.html`):** Protegida por autenticación (`superadmin`), modo Mostrador (sin domicilio) y modo Domicilio (con selección de motorizado), descuento automático de inventario en D1, calculadora de cambio e impresión térmica de 80mm.
- **Panel de Administración (`/admin.html`):** Control total protegido por sesión HMAC: CRUD de productos, ajuste rápido de stock (`−` / `+`), gestión de domiciliarios sincronizada con la API de Shipday y auditoría de ventas.
- **Manual Operativo para Dummies (`/manual.html`):** Guía paso a paso interactiva e imprimible para cajeros, administradores y domiciliarios.

## 2. Tokens Semánticos de Diseño
```css
:root {
  --bg: #FFFFFF;
  --surface: #F6F6F7;
  --border: #E5E5EA;
  --text: #111111;
  --muted: #6E6E73;
  --action: #00A844; /* Único acento primario funcional */
  --danger: #D92D20; /* Alertas de stock agotado / eliminación */
  --warning: #D97706; /* Stock bajo (<= 5 unidades) */
}
```
- **Tipografía:** `Plus Jakarta Sans` con `font-variant-numeric: tabular-nums` obligatorio en precios, stock, arqueos y teléfonos.
- **Superficies:** Bordes hairline de `1px solid var(--border)`, sin gradientes decorativos ni sombras pesadas.
