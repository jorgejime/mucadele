# E2E Test Infra: Plataforma E-Commerce y POS Mucadele Licores

## 1. Filosofía de Pruebas (Test Philosophy)
- **Opaque-box, requirement-driven**: Todas las validaciones se derivan de forma estricta de `ORIGINAL_REQUEST.md` (§ 2026-11-04T20:47:46Z) y la matriz de especificación en `PROJECT.md`.
- **Independencia de Entorno (Dual Target)**: La suite opera sin dependencias externas complejas usando Node.js nativo (v18+) con `fetch` y `assert`. Se ejecuta indistintamente contra entorno local (`http://localhost:8788` o URL local) y contra producción (`https://mucadele.com.co`).
- **Cero Tolerancia a Brechas de Seguridad**: Ninguna prueba de seguridad o integridad transaccional se considera aprobada mediante mocks o simulacros superficiales. Se verifica la resistencia efectiva contra ataques de fuerza bruta, open redirect, manipulación de precios contra D1, sobreventa de inventario, filtración de datos de domiciliarios y clickjacking/CSP.

---

## 2. Matriz de Cobertura de Características (Feature Inventory & Test Mapping)

| # | Característica | Requerimiento Original | Tier 1 (Funcional) | Tier 2 (Límites/Negativas) | Tier 3 (Cross-Feature) | Tier 4 (Real-World) |
|---|----------------|------------------------|:------------------:|:--------------------------:|:----------------------:|:-------------------:|
| 1 | F1: Cloudflare Pages Secrets | ORIGINAL_REQUEST §R1 | — | — | — | T4.4 |
| 2 | F2: Constant-Time Auth & Rate Limiting | ORIGINAL_REQUEST §R1 | T1.1, T1.6 | T2.1 | — | — |
| 3 | F3: Open Redirect Elimination | ORIGINAL_REQUEST §R1 | T1.7 | T2.2, T2.3, T2.4, T2.5 | — | — |
| 4 | F4: D1 Order Validation & Stock Protection | ORIGINAL_REQUEST §R1 | T1.3, T1.4 | T2.6, T2.7, T2.8, T2.9, T2.10 | T3.1 | T4.1 |
| 5 | F5: PII Leak Prevention in Orders | ORIGINAL_REQUEST §R1 | — | — | T3.2 | — |
| 6 | F6: HTTP Security Headers | ORIGINAL_REQUEST §R1 | — | — | — | T4.2 |
| 7 | F7: Protected Paths Normalization | ORIGINAL_REQUEST §R1 | — | — | T3.3, T3.4, T3.5, T3.6, T3.7 | — |
| 8 | F8: SQL Canonical Schema | Survey Explorer 1 | T1.2 | — | T3.1, T3.8 | — |
| 9 | F9: XSS Sanitization DOM | ORIGINAL_REQUEST §R1 | — | — | — | T4.4 |
| 10 | F10: Route Privacy Hardening | ORIGINAL_REQUEST §R1 | — | — | T3.3, T3.4, T3.5 | T4.4 |
| 11 | F11: UX/UI Native Dialogs | ORIGINAL_REQUEST §R2 | T1.5 | — | — | — |
| 12 | F12: Responsive & Touch Usability | ORIGINAL_REQUEST §R2 | T1.3 | — | — | T4.1 |
| 13 | F13: Design Tokens & Style Unification | ORIGINAL_REQUEST §R2 | — | — | — | T4.4 |
| 14 | F14: Operational Workflows Preservation | ORIGINAL_REQUEST §R2 | T1.3, T1.4, T1.5 | — | T3.1, T3.8 | T4.1, T4.3 |
| 15 | F15: Operational Manual Alignment | ORIGINAL_REQUEST §R3 | — | — | T3.5 | — |
| 16 | F16: Automated E2E Test Suite | Verification Resource | T1.1–T1.7 | T2.1–T2.10 | T3.1–T3.8 | T4.1–T4.4 |
| 17 | F17: Cloudflare Production Deployment | ORIGINAL_REQUEST §R4 | — | — | — | T4.1, T4.2 |
| 18 | F18: Vulnerability & Remediation Report| ORIGINAL_REQUEST §R4 | — | — | — | T4.1–T4.4 |

---

## 3. Arquitectura del Runner de Pruebas

- **Ubicación del Runner**: `C:\Users\DELL\mucadele-licores\test\e2e-security-ops.test.js`
- **Runner Nativo**: Compatible con Node.js 18, 20 y 22. Utiliza la Fetch API nativa y aserciones estrictas.
- **Soporte de Invocación Dual**:
  ```bash
  # Ejecución por defecto (producción o target definido)
  node test/e2e-security-ops.test.js

  # Ejecución pasando URL explícita por argumento
  node test/e2e-security-ops.test.js https://mucadele.com.co
  node test/e2e-security-ops.test.js http://localhost:8788

  # Ejecución mediante variable de entorno
  BASE_URL=http://localhost:8788 node test/e2e-security-ops.test.js
  TEST_TARGET=https://mucadele.com.co node test/e2e-security-ops.test.js

  # Ejecución vía script npm
  npm test
  npm run test:prod
  ```
- **Filtros por Tier y Formatos**:
  ```bash
  # Ejecutar únicamente un Tier específico
  npm run test:tier1    # o node test/e2e-security-ops.test.js --tier=1
  npm run test:tier2    # o node test/e2e-security-ops.test.js --tier=2
  npm run test:tier3    # o node test/e2e-security-ops.test.js --tier=3
  npm run test:tier4    # o node test/e2e-security-ops.test.js --tier=4

  # Salida en JSON para pipelines y herramientas CI/CD
  node test/e2e-security-ops.test.js --json
  ```
- **Semántica de Salida (Exit Codes)**:
  - `0`: Todas las pruebas evaluadas resultaron exitosas (`PASS`).
  - `1`: Se detectó uno o más fallos (`FAIL`), con diagnóstico claro de la causa raíz.

---

## 4. Desglose Sistemático de los 4 Tiers

### Tier 1: Cobertura Funcional Aislada (7 Casos)
Evalúa las rutas felices fundamentales de la plataforma:
- **`T1.1` (Login Superadmin)**: Valida autenticación con `superadmin` / `Mucadele2026Breiner`, generación de cookie `mucadele_session` (con flags `HttpOnly; Secure; SameSite`) y entrega de token HMAC.
- **`T1.2` (Catálogo D1)**: Verifica endpoint `/api/catalog`, estructura de array de productos, validación de tipos (`id`, `name`, `price`, `stock`, `active`) y conectividad D1.
- **`T1.3` (Pedido Mostrador POS)**: Creación de orden en modo `pos_counter` (`skipShipday: true`), prefijo `POS-`, estado `COMPLETED_AT_COUNTER` y total matemático exacto.
- **`T1.4` (Pedido Domicilio Express)**: Creación de orden en modo `delivery`, prefijo `MUC-`, recargo de envío ($6.000 COP) y registro de dirección y cliente.
- **`T1.5` (Receipt / Comprobante)**: Confirmación de entrega de receipt con fecha/hora de Bogotá, dirección formateada y número consecutivo.
- **`T1.6` (Verificación de Sesión Activa)**: Endpoint `/api/auth` (GET) con cookie de sesión devuelve `200 { ok: true, user: 'superadmin' }`.
- **`T1.7` (Logout Seguro)**: Endpoint `/api/logout` revoca la cookie de sesión con `Max-Age=0` y redirige con código 303 a ruta local segura.

### Tier 2: Casos Límite y Vectores Adversariales (10 Casos)
Evalúa resiliencia ante ataques, manipulaciones y condiciones de error:
- **`T2.1` (Fuerza Bruta & Rate Limiting)**: 5+ intentos fallidos consecutivos en `/api/auth` o `/api/login` activan HTTP 429 (`Too Many Requests`).
- **`T2.2` (Open Redirect Absoluto)**: `GET /api/logout?next=https://evil.com/phish` rechaza redirigir fuera del dominio local.
- **`T2.3` (Open Redirect Relativo al Protocolo)**: `GET /api/logout?next=//evil.com/phish` rechaza esquemas `//`.
- **`T2.4` (Open Redirect con Barra Invertida)**: `GET /api/logout?next=/\evil.com/phish` rechaza bypass `/\`.
- **`T2.5` (Open Redirect en Login POST)**: `POST /api/login` con `{ redirect: '//attacker.com/steal-session' }` rechaza redirección arbitraria.
- **`T2.6` (Manipulación de Precios)**: Envío de `price: 100` o `$0` en `POST /api/order` para producto de $155.000 COP es rechazado o recalculado contra D1.
- **`T2.7` (Sobreventa por Encima de Stock)**: Intento de compra de 99.999 unidades cuando el stock es limitado es rechazado con error de stock insuficiente (HTTP 400/409).
- **`T2.8` (Producto Inexistente)**: Intento de compra con ID fantasma no registrado en D1 es rechazado con HTTP 400.
- **`T2.9` (Cantidades Inválidas / Negativas)**: Solicitud con `quantity: -2` o `0` es rechazada con HTTP 400.
- **`T2.10` (Carrito Vacío)**: Pedido sin ítems (`items: []`) es rechazado con HTTP 400.

### Tier 3: Combinaciones Cruzadas e Interacciones (8 Casos)
Evalúa coherencia de estado y controles de acceso entre múltiples características:
- **`T3.1` (Decremento Atómico de Stock)**: Consulta de stock inicial, compra exitosa de 1 unidad, verificación de que el stock en catálogo disminuyó exactamente en 1 unidad.
- **`T3.2` (Privacidad de Domiciliarios en GET /api/order)**: Peticiones anónimas a `/api/order` no deben exponer números celulares privados de domiciliarios.
- **`T3.3` (Protección de /admin sin Sesión)**: Bloquea entrega de HTML administrativo a anónimos (muestra login gate en servidor).
- **`T3.4` (Protección de /pos sin Sesión)**: Bloquea interfaz de caja POS a anónimos.
- **`T3.5` (Protección de /manual sin Sesión)**: Bloquea manual confidencial a anónimos.
- **`T3.6` (Protección de Scripts Privados)**: Peticiones anónimas a `/admin.js` y `/pos.js` retornan HTTP 401 Unauthorized.
- **`T3.7` (Bloqueo de APIs Administrativas)**: Peticiones sin sesión a `/api/admin/products`, `/api/admin/suppliers`, `/api/admin/purchase-orders` y `/api/admin/carriers` retornan HTTP 401.
- **`T3.8` (Acceso Autorizado a APIs Administrativas)**: Peticiones autenticadas con cookie de superadmin a `/api/catalog?all=1` y `/api/admin/suppliers` responden HTTP 200 con datos de D1.

### Tier 4: Escenarios Reales de Aplicación y Postura de Seguridad Global (4 Casos)
Evalúa flujos de usuario reales de punta a punta y la postura defensiva global:
- **`T4.1` (Flujo Completo E2E)**: Catálogo $\rightarrow$ Selección de producto con stock $\rightarrow$ Checkout con entrega a domicilio en Santa Marta $\rightarrow$ Comprobante de orden $\rightarrow$ Consulta y verificación de estado.
- **`T4.2` (Cabeceras HTTP de Seguridad Global)**: Inyección de `Strict-Transport-Security` (HSTS con `max-age=31536000`), `Content-Security-Policy` (CSP), `X-Frame-Options` (`DENY` o `SAMEORIGIN`), `X-Content-Type-Options: nosniff`, y `Referrer-Policy`.
- **`T4.3` (Despacho e Integración Shipday)**: En pedidos con domicilio, verificación de estados reconocidos de despacho (`ASSIGNED`, `NOT_ASSIGNED`, `PICKUP_AT_STORE`) o enlace de tracking.
- **`T4.4` (Sigilo en Tienda Pública y Ausencia de Secretos)**: Verificación de que `index.html` no contiene hipervínculos directos visibles a `/admin`, `/pos` o `/manual`, y que `app.js` y `catalog.js` no exponen contraseñas ni API keys.

---

## 5. Protocolo de Verificación para Agentes Implementadores

A medida que los agentes de remediación completen sus tareas asignadas en los hitos M1 a M4, deben ejecutar los filtros de la suite para validar su código antes del despliegue final:
1. **Worker M1 (Seguridad Backend & D1)**: Ejecutar `npm run test:tier2` y `npm run test:tier3`. Deben corregirse:
   - Rate limiting (T2.1).
   - Sanitización de Open Redirect (T2.2, T2.3, T2.4, T2.5).
   - Validación de precios y stock en D1 (T2.6, T2.7, T2.8, T2.9).
   - Privacidad de domiciliarios en GET /api/order (T3.2).
   - Sanitización de payload Shipday (`orderItem` únicamente `{ name, unitPrice, quantity }` sin `id` ni `detail` para resolver el 502 en T1.4, T4.1, T4.3).
   - Cabeceras de seguridad globales (T4.2).
2. **Worker M2 (Frontend XSS & Hardening)**: Ejecutar `node test/e2e-security-ops.test.js` verificando T4.4 (cero enlaces a consolas privadas y cero secretos en cliente).
3. **Worker M3 (UX/UI & Dialogs)**: Verificar flujos en mostrador (T1.3) y receipts (T1.5).
4. **Worker M4 (Manual Operativo)**: Verificar sincronización de manual con rate limiting y pestañas administrativas.
5. **Worker M5 (Despliegue Final a Producción)**: Ejecutar `npm run test:prod` hasta alcanzar **29/29 PASS (100% de cumplimiento)**.
