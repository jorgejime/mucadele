# E2E Test Suite Ready: Plataforma E-Commerce y POS Mucadele Licores

## 1. Información General de la Suite (Test Suite Overview)
- **Proyecto**: Mucadele Licores (Santa Marta, Colombia)
- **Directorio del Código**: `C:\Users\DELL\mucadele-licores`
- **Fuente de Especificación**: `ORIGINAL_REQUEST.md` (§ 2026-11-04T20:47:46Z) y `PROJECT.md`
- **Total de Casos de Prueba**: 29 pruebas automatizadas distribuidas en 4 Tiers sistemáticos
- **Runner Principal**: `C:\Users\DELL\mucadele-licores\test\e2e-security-ops.test.js`
- **Documento de Infraestructura de Pruebas**: `C:\Users\DELL\TEST_INFRA.md`
- **Dependencias Externas**: Cero (Usa Node.js v18+ nativo con `fetch` y `assert`)

---

## 2. Comandos de Ejecución de Pruebas

```bash
# Navegar al directorio del proyecto
cd C:\Users\DELL\mucadele-licores

# 1. Ejecución estándar completa contra producción (default)
npm test

# 2. Ejecución explícita contra producción
npm run test:prod

# 3. Ejecución contra entorno de desarrollo local (Wrangler Pages Dev)
node test/e2e-security-ops.test.js http://localhost:8788
# O mediante variable de entorno:
BASE_URL=http://localhost:8788 npm test

# 4. Ejecución filtrada por Tier
npm run test:tier1    # Tier 1: Cobertura Funcional Aislada (7 pruebas)
npm run test:tier2    # Tier 2: Casos Límite y Vectores Adversariales (10 pruebas)
npm run test:tier3    # Tier 3: Combinaciones Cruzadas y Estado (8 pruebas)
npm run test:tier4    # Tier 4: Escenarios Reales y Seguridad Global (4 pruebas)

# 5. Salida estructurada en JSON (ideal para CI/CD y logs)
node test/e2e-security-ops.test.js --json
```

---

## 3. Resultados de la Línea Base Inicial (Baseline Diagnostic Run)
*Ejecutado de forma reproducible contra el entorno en vivo de producción en `https://mucadele.com.co`.*

| Tier | Descripción | Casos Totales | Aprobados (PASS) | Fallidos (FAIL) | Tasa de Aprobación |
|------|-------------|:-------------:|:----------------:|:---------------:|:------------------:|
| **Tier 1** | Cobertura Funcional Aislada | 7 | 6 | 1 | 85.7% |
| **Tier 2** | Casos Límite y Vectores Adversariales | 10 | 1 | 9 | 10.0% |
| **Tier 3** | Combinaciones Cruzadas y Transición de Estados | 8 | 7 | 1 | 87.5% |
| **Tier 4** | Escenarios Reales y Seguridad Global | 4 | 1 | 3 | 25.0% |
| **TOTAL** | **Suite E2E Integral Completa** | **29** | **15** | **14** | **51.7%** |

---

## 4. Desglose Detallado de Pruebas y Diagnóstico por Caso

### Tier 1: Cobertura Funcional Aislada (7 pruebas)
| ID | Prueba | Estado | Diagnóstico / Comportamiento Observado |
|---|---|:---:|---|
| **T1.1** | Login superadmin con credenciales válidas | ✅ **PASS** | Autentica exitosamente en `/api/auth`, emite token HMAC y cookie `HttpOnly`. |
| **T1.2** | Consulta de catálogo público D1 | ✅ **PASS** | `/api/catalog` responde con 16 productos activos y tipos numéricos correctos. |
| **T1.3** | Pedido válido en modo mostrador POS | ✅ **PASS** | Genera orden `POS-xxxxxx` con total exacto y estado `COMPLETED_AT_COUNTER`. |
| **T1.4** | Pedido válido en modo domicilio express | ❌ **FAIL** | Responde HTTP 502 Bad Gateway por incompatibilidad en payload a Shipday (`orderItem` con `id` y `detail`). |
| **T1.5** | Verificación de receipt y orden generada | ✅ **PASS** | Entrega consecutivo, dirección de local, fecha/hora Bogotá y datos completos. |
| **T1.6** | Verificación de sesión administrativa activa | ✅ **PASS** | `GET /api/auth` con cookie responde HTTP 200 con `{ ok: true, user: 'superadmin' }`. |
| **T1.7** | Cierre de sesión seguro y eliminación de cookie | ✅ **PASS** | `GET /api/logout` invalida cookie con `Max-Age=0` y redirige con HTTP 303. |

### Tier 2: Casos Límite y Vectores Adversariales (10 pruebas)
| ID | Prueba | Estado | Diagnóstico / Comportamiento Observado |
|---|---|:---:|---|
| **T2.1** | Mitigación de fuerza bruta en login (HTTP 429) | ❌ **FAIL** | 7 intentos consecutivos fallidos no activaron HTTP 429 (`Too Many Requests`). |
| **T2.2** | Open Redirect absoluto (`https://evil.com`) | ❌ **FAIL** | `GET /api/logout?next=https://evil.com` redirige directamente a URL externa. |
| **T2.3** | Open Redirect relativo (`//evil.com`) | ❌ **FAIL** | `GET /api/logout?next=//evil.com` redirige al esquema relativo externo. |
| **T2.4** | Open Redirect con barra invertida (`/\evil.com`) | ❌ **FAIL** | `GET /api/logout?next=/\evil.com` redirige eludiendo el filtro básico. |
| **T2.5** | Open Redirect en POST `/api/login` | ❌ **FAIL** | Payload `{ redirect: '//attacker.com' }` redirige a la URL atacante. |
| **T2.6** | Manipulación de precio a $100 COP o $0 | ❌ **FAIL** | El backend acepta el precio enviado por el cliente ($100 COP) sin validar contra D1. |
| **T2.7** | Sobreventa superando el inventario físico | ❌ **FAIL** | El backend acepta compra de 99.999 unidades sin validar stock contra D1. |
| **T2.8** | Rechazo de producto inexistente en D1 | ❌ **FAIL** | El backend acepta compras con IDs inexistentes (`licor-fantasma-999`). |
| **T2.9** | Rechazo de cantidades inválidas o negativas | ❌ **FAIL** | El backend acepta compras con `quantity: -2` sin validar que sea entero positivo. |
| **T2.10** | Rechazo de pedido con carrito vacío | ✅ **PASS** | El servidor valida `items.length === 0` y rechaza con HTTP 400. |

### Tier 3: Combinaciones Cruzadas y Transición de Estados (8 pruebas)
| ID | Prueba | Estado | Diagnóstico / Comportamiento Observado |
|---|---|:---:|---|
| **T3.1** | Decremento atómico de stock tras compra | ✅ **PASS** | El stock físico del producto decrece exactamente en 1 unidad tras la compra. |
| **T3.2** | Privacidad de domiciliarios en GET `/api/order` | ❌ **FAIL** | Endpoint anónimo expone número celular privado de Jorge Jiménez (`+573184131391`). |
| **T3.3** | Protección perimetral de `/admin` sin sesión | ✅ **PASS** | El Edge intercepta la petición y entrega pantalla de login en servidor. |
| **T3.4** | Protección perimetral de `/pos` sin sesión | ✅ **PASS** | El Edge intercepta la petición y oculta el espacio de trabajo del cajero. |
| **T3.5** | Protección perimetral de `/manual` sin sesión | ✅ **PASS** | El Edge intercepta la petición y oculta el manual operativo. |
| **T3.6** | Protección de scripts `/admin.js` y `/pos.js` | ✅ **PASS** | Peticiones sin sesión retornan HTTP 401 Unauthorized. |
| **T3.7** | Bloqueo de APIs `/api/admin/*` sin sesión | ✅ **PASS** | Retornan HTTP 401 a usuarios anónimos. |
| **T3.8** | Acceso autorizado a APIs administrativas | ✅ **PASS** | Con sesión válida de superadmin, `/api/catalog?all=1` y `/api/admin/suppliers` retornan 200 con datos de D1. |

### Tier 4: Escenarios Reales y Seguridad Global (4 pruebas)
| ID | Prueba | Estado | Diagnóstico / Comportamiento Observado |
|---|---|:---:|---|
| **T4.1** | Flujo completo E2E de compra | ❌ **FAIL** | Se interrumpe en el checkout de domicilio por el error 502 de Shipday. |
| **T4.2** | Cabeceras HTTP de seguridad global | ❌ **FAIL** | `Strict-Transport-Security`, `Content-Security-Policy` y `X-Frame-Options` ausentes. |
| **T4.3** | Integración y despacho Shipday en domicilio | ❌ **FAIL** | No genera enlace de tracking ni despacho por el error 502 de Shipday. |
| **T4.4** | Sigilo en tienda pública y ausencia de secretos | ✅ **PASS** | Cero enlaces a consolas privadas en `index.html` y cero credenciales expuestas en frontend. |

---

## 5. Protocolo de Verificación para Agentes Implementadores

A medida que los agentes remediadores avancen en los hitos M1 a M4:
1. **Worker Backend M1**: Debe ejecutar `npm test` periódicamente. La corrección de rate limiting, validación estricta de D1 (precios y stock), bloqueo de Open Redirect, privacidad de domiciliarios en `GET /api/order`, inyección de cabeceras de seguridad HTTP y corrección del formato de `orderItem` en Shipday llevará la aprobación del **51.7% al 100% (29/29 PASS)**.
2. **Worker Frontend M2**: Debe verificar que `T4.4` se mantenga en PASS tras la erradicación de XSS.
3. **Worker UX/UI M3**: Debe asegurar que `T1.3` y `T1.5` continúen en PASS con los modales nativos `<dialog>`.
4. **Verificación Previa al Despliegue Final (M5)**: No se autoriza el despliegue a producción hasta que `npm run test:prod` alcance **100% de aprobación**.
