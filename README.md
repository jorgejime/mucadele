# Mucadele Licores · Sistema POS, Tienda Web y Control de Cartera

Plataforma integral de comercio electrónico, facturación en punto de venta (POS) y gestión de cartera a crédito para **Mucadele Licores** (Santa Marta, Colombia).

Desplegado en producción sobre **Cloudflare Pages**, **Cloudflare Workers** en el Edge, **Cloudflare D1** (SQLite distribuido) e integración con la API de **Shipday** para despacho y tracking GPS de motorizados.

---

## 🚀 Arquitectura y Tecnologías

- **Frontend Tienda Web:** HTML5 Semántico, CSS nativo moderno con variables de diseño, Vanilla JavaScript ES Modules, soporte Offline y Mobile First.
- **Caja Registradora POS (`/pos`):** Interfaz táctil de alta velocidad para mostrador y domicilios:
  - Múltiples hojas de venta abiertas simultáneamente en pestañas independientes (persistidas en `localStorage`).
  - 7 métodos de pago integrados: Efectivo, Tarjeta de Crédito, Tarjeta Débito, Transferencia (Nequi/Daviplata/Banco), Pago Combinado (multimétodo), A CRÉDITO y Otros Métodos.
  - Sistema de descuentos por venta (porcentaje `%` o valor fijo en pesos `$ COP`) con justificación y recálculo automático.
  - Impresión térmica de recibos de 80mm y envío de comprobantes digitales a WhatsApp.
- **Gestión de Clientes Recurrentes y Cartera (`/clientes`):**
  - Segmentación automática: VIP / Frecuente (≥3 compras), Recurrente (2 compras), Nuevo (1 compra).
  - Control de saldos pendientes por compras a crédito.
  - Enlaces automáticos de WhatsApp con mensajes de cobro estructurados y datos bancarios oficiales.
  - Liquidación y abonos de crédito en tiempo real contra Cloudflare D1.
- **Panel Administrativo (`/admin`):**
  - Control de inventario en bodega y catálogo.
  - Reorden automático por stock mínimo (`OC-AUTO`).
  - Asignación y gestión de domiciliarios motorizados en Shipday.
  - Historial de despachos y arqueo de caja por método de pago.
- **Edge Backend:** `_worker.js` ejecutado en Cloudflare Workers con seguridad JWT en cookies HttpOnly y rate-limiting en base de datos.
- **Base de Datos:** Cloudflare D1 (`mucadele-db`).

---

## 📦 Estructura del Proyecto

```text
├── _worker.js             # Edge Backend en Cloudflare Worker (APIs, Auth, D1, Shipday)
├── index.html             # Tienda web pública y banner de promociones por combos
├── app.js                 # Lógica de carrito, checkout y filtros de la tienda
├── styles.css             # Estilos de la tienda web y banner promocional
├── pos.html               # Sistema POS de caja registradora táctil
├── pos.js                 # Lógica del POS (hojas múltiples, pagos, descuentos, arqueo)
├── pos.css                # Estilos del POS optimizados para pantallas táctiles y móviles
├── clientes.html          # Módulo de clientes recurrentes y cartera de crédito
├── clientes.js            # Lógica de clientes, métricas LTV, cobro y WhatsApp
├── admin.html             # Panel de administración (Inventario, Proveedores, Domiciliarios)
├── admin.js               # Lógica del panel administrativo
├── catalog.js             # Definición base del catálogo de productos y combos
├── schema.sql             # Esquema DDL oficial de Cloudflare D1
├── test/                  # Suites de verificación E2E en producción
│   ├── verify-pos-payments.js          # Test de los 7 métodos de pago y arqueo D1
│   ├── verify-customers-and-whatsapp.js # Test de clientes y protección en el Edge
│   └── verify-combos-and-discounts.js  # Test de combos y sistema de descuentos
├── wrangler.toml          # Configuración del proyecto para Cloudflare Pages / Workers
└── README.md              # Documentación técnica
```

---

## 🛠️ Despliegue en Producción

El proyecto se despliega automáticamente en Cloudflare Pages mediante Wrangler:

```bash
npx wrangler pages deploy . --project-name=mucadele
```

---

## 🧪 Pruebas Automatizadas

Para ejecutar las pruebas E2E contra el entorno en vivo:

```bash
# Validar métodos de pago y base de datos D1
node test/verify-pos-payments.js

# Validar módulo de clientes, WhatsApp y seguridad
node test/verify-customers-and-whatsapp.js

# Validar combos promocionales y descuentos
node test/verify-combos-and-discounts.js
```

---

## 📄 Licencia

Propiedad privada de Mucadele Licores · Santa Marta, Colombia.
