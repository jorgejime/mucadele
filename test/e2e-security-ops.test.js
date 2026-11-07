/**
 * ==============================================================================
 * SUITE DE PRUEBAS AUTOMATIZADA E2E DE SEGURIDAD Y OPERACIONES
 * Plataforma: Mucadele Licores (Santa Marta, Colombia)
 * Arquitectura: 4 Tiers Sistemáticos (Node.js 18+ nativo sin dependencias externas)
 * Targets: Localhost (http://localhost:8788) y Producción (https://mucadele.com.co)
 * ==============================================================================
 */

const rawTarget =
  process.env.BASE_URL ||
  process.env.TEST_TARGET ||
  process.argv.find((arg) => arg.startsWith('http://') || arg.startsWith('https://')) ||
  'https://mucadele.com.co';

const TARGET_URL = rawTarget.replace(/\/+$/, '');

const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const selectedTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
const jsonOutput = args.includes('--json');

const SUPERADMIN_USER = 'superadmin';
const SUPERADMIN_PASS = 'Mucadele2026Breiner';

const results = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTestCase(tier, id, name, fn) {
  if (selectedTier !== null && selectedTier !== tier) {
    return;
  }

  if (!jsonOutput) {
    process.stdout.write(`  [${id}] ${name}... `);
  }

  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    if (!jsonOutput) {
      console.log(`\x1b[32mPASS\x1b[0m (${duration}ms)`);
    }
    results.push({ tier, id, name, status: 'PASS', duration });
  } catch (err) {
    const duration = Date.now() - start;
    if (!jsonOutput) {
      console.log(`\x1b[31mFAIL\x1b[0m (${duration}ms)`);
      console.log(`         \x1b[33mDetalle:\x1b[0m ${err.message}`);
    }
    results.push({ tier, id, name, status: 'FAIL', duration, error: err.message });
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function getAuthenticatedSession() {
  const res = await fetchWithTimeout(`${TARGET_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: SUPERADMIN_USER, password: SUPERADMIN_PASS }),
  });
  const data = await res.json().catch(() => ({}));
  const rawCookie = res.headers.get('set-cookie') || '';
  const cookieMatch = rawCookie.match(/mucadele_session=[^;]+/);
  const cookieHeader = cookieMatch ? cookieMatch[0] : '';
  const token = data.token || '';
  return { ok: res.ok && data.ok === true, cookieHeader, token };
}

async function main() {
  if (!jsonOutput) {
    console.log(`\n==============================================================================`);
    console.log(`🚀 SUITE E2E DE PRUEBAS: SEGURIDAD, OPERACIONES Y E-COMMERCE MUCADELE`);
    console.log(`🎯 Target URL: ${TARGET_URL}`);
    console.log(`⏰ Inicio:     ${new Date().toISOString()}`);
    if (selectedTier) console.log(`📌 Filtro:     Ejecutando únicamente Tier ${selectedTier}`);
    console.log(`==============================================================================\n`);
  }

  // ============================================================================
  // TIER 1: FEATURE COVERAGE (Core Functional Paths)
  // ============================================================================
  if (!jsonOutput && (!selectedTier || selectedTier === 1)) {
    console.log(`--- TIER 1: Cobertura Funcional Aislada (Feature Coverage) ---`);
  }

  await runTestCase(1, 'T1.1', 'Login con credenciales válidas superadmin/Mucadele2026Breiner', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: SUPERADMIN_USER, password: SUPERADMIN_PASS }),
    });
    assert(res.status === 200, `Status inesperado: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, `Respuesta no exitosa: ${JSON.stringify(data)}`);
    assert(data.user === SUPERADMIN_USER, `Usuario no coincide con superadmin: ${data.user}`);
    assert(typeof data.token === 'string' && data.token.length > 20, 'Token JWT HMAC ausente o inválido');

    const cookie = res.headers.get('set-cookie') || '';
    assert(cookie.includes('mucadele_session='), 'Cookie de sesión mucadele_session no configurada');
    assert(cookie.toLowerCase().includes('httponly'), 'Cookie de sesión carece de flag HttpOnly');
  });

  await runTestCase(1, 'T1.2', 'Consulta del catálogo de productos D1 (/api/catalog)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    assert(res.status === 200, `Status inesperado en catálogo: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, 'Respuesta ok !== true en /api/catalog');
    assert(Array.isArray(data.products), 'data.products no es un arreglo');
    assert(data.products.length > 0, 'El catálogo está vacío (0 productos)');

    const sample = data.products[0];
    assert(sample.id && typeof sample.id === 'string', 'Producto carece de id');
    assert(sample.name && typeof sample.name === 'string', 'Producto carece de name');
    assert(typeof sample.price === 'number' && sample.price > 0, 'Precio de producto inválido');
    assert(typeof sample.stock === 'number', 'Stock de producto inválido');
  });

  await runTestCase(1, 'T1.3', 'Creación de pedido válido en modo Mostrador POS (pos_counter)', async () => {
    const catRes = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    const catData = await catRes.json().catch(() => ({}));
    const product = catData.products?.[0] || { id: 'old-parr-750', name: 'Whisky Grand Old Parr 12 Años', price: 155000 };

    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Cliente Prueba E2E Mostrador',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: product.id, name: product.name, price: product.price, quantity: 1, presentation: product.presentation || '750 ml' },
        ],
        skipShipday: true,
      }),
    });

    assert(res.status === 200, `POST /api/order respondió con status ${res.status}`);
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, `Error en creación de pedido: ${JSON.stringify(data)}`);
    assert(typeof data.orderNumber === 'string' && data.orderNumber.startsWith('POS-'), `Número de orden inválido: ${data.orderNumber}`);
    assert(data.orderState === 'COMPLETED_AT_COUNTER', `Estado inesperado en mostrador: ${data.orderState}`);
    assert(data.totalOrderCost === product.price, `Total calculado incorrecto: ${data.totalOrderCost} vs ${product.price}`);
  });

  await runTestCase(1, 'T1.4', 'Creación de pedido válido en modo Domicilio Express (delivery)', async () => {
    const catRes = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    const catData = await catRes.json().catch(() => ({}));
    const product = catData.products?.[0] || { id: 'old-parr-750', name: 'Whisky Grand Old Parr 12 Años', price: 155000 };
    const deliveryFee = 6000;

    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'delivery',
        customerName: 'Cliente Prueba Domicilio E2E',
        customerPhone: '3015153867',
        customerAddress: 'Carrera 1C # 22-10',
        neighborhood: 'Bello Horizonte',
        deliveryInstruction: 'Llamar al llegar a recepción',
        paymentMethod: 'cash',
        deliveryFee,
        items: [
          { id: product.id, name: product.name, price: product.price, quantity: 1, presentation: product.presentation || '750 ml' },
        ],
      }),
    });

    assert(res.status === 200, `POST /api/order domicilio respondió con status ${res.status}`);
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, `Error en creación de pedido domicilio: ${JSON.stringify(data)}`);
    assert(typeof data.orderNumber === 'string' && data.orderNumber.startsWith('MUC-'), `Número de orden inválido: ${data.orderNumber}`);
    assert(data.deliveryFee === deliveryFee, `Tarifa de domicilio incorrecta: ${data.deliveryFee}`);
    assert(data.totalOrderCost === product.price + deliveryFee, `Total incorrecto con domicilio: ${data.totalOrderCost}`);
  });

  await runTestCase(1, 'T1.5', 'Verificación de receipt y detalles de orden generada', async () => {
    const orderNum = `POS-${Date.now().toString().slice(-6)}`;
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Cliente Receipt E2E',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: 'six-club-dorada', name: 'Six Pack Club Colombia Dorada', price: 26000, quantity: 1, presentation: '6 Latas' },
        ],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, 'Falló creación de orden para receipt');
    assert(data.orderNumber, 'La orden no contiene orderNumber');
    assert(data.expectedDeliveryDate, 'La orden no contiene expectedDeliveryDate');
    assert(data.expectedDeliveryTime, 'La orden no contiene expectedDeliveryTime');
    assert(data.customerAddress, 'La orden no contiene customerAddress');
  });

  await runTestCase(1, 'T1.6', 'Verificación de sesión administrativa activa (/api/auth GET)', async () => {
    const session = await getAuthenticatedSession();
    assert(session.ok, 'No fue posible iniciar sesión para verificar estado');

    const verifyRes = await fetchWithTimeout(`${TARGET_URL}/api/auth`, {
      method: 'GET',
      headers: {
        Cookie: session.cookieHeader,
        Authorization: `Bearer ${session.token}`,
      },
    });
    assert(verifyRes.status === 200, `GET /api/auth con sesión activa devolvió status ${verifyRes.status}`);
    const data = await verifyRes.json().catch(() => ({}));
    assert(data.ok === true && data.user === SUPERADMIN_USER, `Sesión no reconocida: ${JSON.stringify(data)}`);
  });

  await runTestCase(1, 'T1.7', 'Cierre de sesión seguro y eliminación de cookie (/api/logout)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/logout`, { redirect: 'manual' });
    assert(res.status === 303 || res.status === 302, `Status inesperado en logout: ${res.status}`);
    const setCookie = res.headers.get('set-cookie') || '';
    assert(setCookie.includes('mucadele_session='), 'Cabecera Set-Cookie ausente en logout');
    assert(
      setCookie.includes('Max-Age=0') || setCookie.includes('expires='),
      'Set-Cookie no invalida la sesión con Max-Age=0'
    );
  });

  // ============================================================================
  // TIER 2: BOUNDARY & CORNER CASES (Adversarial, Rates & Limits)
  // ============================================================================
  if (!jsonOutput && (!selectedTier || selectedTier === 2)) {
    console.log(`\n--- TIER 2: Casos Límite y Vectores Adversariales (Boundary & Corner Cases) ---`);
  }

  await runTestCase(2, 'T2.1', 'Mitigación de fuerza bruta en login activando HTTP 429', async () => {
    let triggeredRateLimit = false;
    for (let i = 0; i < 7; i++) {
      const res = await fetchWithTimeout(`${TARGET_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: SUPERADMIN_USER,
          password: `IntentoErroneo_${Date.now()}_${i}`,
        }),
      });
      if (res.status === 429) {
        triggeredRateLimit = true;
        break;
      }
    }
    assert(triggeredRateLimit, 'Fuerza bruta desprotegida: 7 intentos fallidos no dispararon HTTP 429 (Too Many Requests)');
  });

  await runTestCase(2, 'T2.2', 'Prevención de Open Redirect con URL absoluta externa (https://evil.com)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/logout?next=https://evil.com/phish`, { redirect: 'manual' });
    const loc = res.headers.get('location') || '';
    assert(
      !loc.startsWith('https://evil.com') && !loc.startsWith('http://evil.com'),
      `Vulnerable a Open Redirect absoluto: redirigió a "${loc}"`
    );
  });

  await runTestCase(2, 'T2.3', 'Prevención de Open Redirect con URL relativa al protocolo (//evil.com)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/logout?next=//evil.com/phish`, { redirect: 'manual' });
    const loc = res.headers.get('location') || '';
    assert(!loc.startsWith('//'), `Vulnerable a Open Redirect relativo al protocolo: redirigió a "${loc}"`);
  });

  await runTestCase(2, 'T2.4', 'Prevención de Open Redirect con bypass de barra invertida (/\\evil.com)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/logout?next=/\\evil.com/phish`, { redirect: 'manual' });
    const loc = res.headers.get('location') || '';
    assert(!loc.startsWith('/\\') && !loc.startsWith('/%5C'), `Vulnerable a bypass de barra invertida: redirigió a "${loc}"`);
  });

  await runTestCase(2, 'T2.5', 'Prevención de Open Redirect en POST /api/login (redirect arbitrario)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: SUPERADMIN_USER,
        password: SUPERADMIN_PASS,
        redirect: '//attacker.com/steal-session',
      }),
      redirect: 'manual',
    });
    const loc = res.headers.get('location') || '';
    assert(!loc.startsWith('//') && !loc.startsWith('https://attacker.com'), `Vulnerable a Open Redirect en Login: redirigió a "${loc}"`);
  });

  await runTestCase(2, 'T2.6', 'Rechazo o corrección estricta de manipulación de precio ($100 COP o $0)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Audit Malicious Price',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: 'old-parr-750', name: 'Whisky Grand Old Parr 12 Años', price: 100, quantity: 1, presentation: '750 ml' },
        ],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    const priceManipulated = res.status === 200 && data.ok === true && data.totalOrderCost === 100;
    assert(!priceManipulated, `Vulnerabilidad de integridad de precios: el servidor aceptó cobrar $100 COP`);
    assert(res.status >= 400 || (data.ok === true && data.totalOrderCost >= 100000), 'El servidor no validó ni rechazó el precio manipulado');
  });

  await runTestCase(2, 'T2.7', 'Rechazo de sobreventa superando el inventario físico disponible', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Audit Overstock Test',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: 'old-parr-750', name: 'Whisky Grand Old Parr 12 Años', price: 155000, quantity: 99999, presentation: '750 ml' },
        ],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(
      res.status >= 400 || data.ok === false,
      `Vulnerable a sobreventa: el servidor aceptó compra de 99,999 unidades sin stock físico (Status: ${res.status})`
    );
  });

  await runTestCase(2, 'T2.8', 'Rechazo de pedido con ID de producto inexistente en D1', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Audit Ghost Product',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: 'licor-fantasma-inexistente-999', name: 'Licor Desconocido Fake', price: 50000, quantity: 1 },
        ],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(
      res.status >= 400 || data.ok === false,
      `El servidor aceptó un producto fantasma inexistente en D1 (Status: ${res.status})`
    );
  });

  await runTestCase(2, 'T2.9', 'Rechazo de cantidades no positivas o inválidas (quantity <= 0)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Audit Invalid Quantity',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: 'old-parr-750', name: 'Whisky Grand Old Parr 12 Años', price: 155000, quantity: -2 },
        ],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(
      res.status >= 400 || data.ok === false,
      `El servidor aceptó una cantidad negativa (-2) en el pedido (Status: ${res.status})`
    );
  });

  await runTestCase(2, 'T2.10', 'Rechazo de pedido con carrito vacío (items: [])', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Audit Empty Cart',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [],
        skipShipday: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(res.status >= 400 || data.ok === false, `El servidor aceptó un carrito vacío (Status: ${res.status})`);
  });

  // ============================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS & STATE TRANSITIONS
  // ============================================================================
  if (!jsonOutput && (!selectedTier || selectedTier === 3)) {
    console.log(`\n--- TIER 3: Combinaciones Cruzadas y Transición de Estados (Cross-Feature) ---`);
  }

  await runTestCase(3, 'T3.1', 'Validación de decremento atómico de stock tras orden de compra', async () => {
    const catRes1 = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    const catData1 = await catRes1.json().catch(() => ({}));
    const product = catData1.products?.find((p) => p.stock > 5) || catData1.products?.[0];
    assert(product, 'No hay productos disponibles para probar decremento de stock');
    const initialStock = product.stock;

    const orderRes = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: 'Stock Decrement Audit',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        items: [
          { id: product.id, name: product.name, price: product.price, quantity: 1, presentation: product.presentation },
        ],
        skipShipday: true,
      }),
    });
    const orderData = await orderRes.json().catch(() => ({}));
    assert(orderRes.ok && orderData.ok === true, 'Falló orden para prueba de decremento');

    const catRes2 = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    const catData2 = await catRes2.json().catch(() => ({}));
    const updatedProduct = catData2.products?.find((p) => p.id === product.id);
    assert(updatedProduct, 'Producto no encontrado tras actualización');
    assert(
      updatedProduct.stock === initialStock - 1,
      `El stock no decreció exactamente en 1 unidad: Inicial=${initialStock}, Final=${updatedProduct.stock}`
    );
  });

  await runTestCase(3, 'T3.2', 'Privacidad de datos: GET /api/order anónimo no expone teléfonos de domiciliarios', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`);
    const data = await res.json().catch(() => ({}));
    if (data.carriers && Array.isArray(data.carriers) && data.carriers.length > 0) {
      for (const carrier of data.carriers) {
        assert(
          !carrier.phone && !carrier.phoneNumber,
          `Fuga de PII: Teléfono privado expuesto en domiciliario ${carrier.name}: "${carrier.phone || carrier.phoneNumber}"`
        );
      }
    }
  });

  await runTestCase(3, 'T3.3', 'Protección perimetral de /admin y /admin.html sin sesión activa', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/admin`, { redirect: 'manual' });
    const text = await res.text();
    assert(
      !text.includes('1. Inventario y Catálogo') && !text.includes('id="product-list"'),
      'El HTML operativo del panel administrativo fue entregado a un cliente anónimo'
    );
  });

  await runTestCase(3, 'T3.4', 'Protección perimetral de /pos y /pos.html sin sesión activa', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/pos`, { redirect: 'manual' });
    const text = await res.text();
    assert(
      !text.includes('pos-workspace') && !text.includes('Cobrar en mostrador'),
      'El HTML operativo de la caja POS fue entregado a un cliente anónimo'
    );
  });

  await runTestCase(3, 'T3.5', 'Protección perimetral de /manual y /manual.html sin sesión activa', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/manual`, { redirect: 'manual' });
    const text = await res.text();
    assert(
      !text.includes('Manual de Procedimientos') && !text.includes('Calle 11 # 24-36'),
      'El manual confidencial fue entregado a un cliente anónimo'
    );
  });

  await runTestCase(3, 'T3.6', 'Protección de scripts administrativos /admin.js y /pos.js (HTTP 401 a anónimos)', async () => {
    const resAdmin = await fetchWithTimeout(`${TARGET_URL}/admin.js`, { redirect: 'manual' });
    const resPos = await fetchWithTimeout(`${TARGET_URL}/pos.js`, { redirect: 'manual' });
    assert(resAdmin.status === 401, `/admin.js devolvió status ${resAdmin.status} en vez de 401`);
    assert(resPos.status === 401, `/pos.js devolvió status ${resPos.status} en vez de 401`);
  });

  await runTestCase(3, 'T3.7', 'Bloqueo de APIs administrativas sin sesión (/api/admin/* retorna 401)', async () => {
    const endpoints = [
      '/api/admin/products',
      '/api/admin/suppliers',
      '/api/admin/purchase-orders',
      '/api/admin/carriers',
    ];
    for (const ep of endpoints) {
      const res = await fetchWithTimeout(`${TARGET_URL}${ep}`);
      assert(res.status === 401, `Endpoint ${ep} sin sesión devolvió status ${res.status} en vez de 401`);
    }
  });

  await runTestCase(3, 'T3.8', 'Acceso autorizado a APIs administrativas con sesión de superadmin', async () => {
    const session = await getAuthenticatedSession();
    assert(session.ok, 'No fue posible autenticar sesión de superadmin');

    const headers = {
      Cookie: session.cookieHeader,
      Authorization: `Bearer ${session.token}`,
    };

    const resCatalog = await fetchWithTimeout(`${TARGET_URL}/api/catalog?all=1`, { headers });
    assert(resCatalog.status === 200, `/api/catalog?all=1 respondió con ${resCatalog.status}`);
    const dataCatalog = await resCatalog.json().catch(() => ({}));
    assert(dataCatalog.ok === true && Array.isArray(dataCatalog.products), 'Fallo en obtención de productos admin en /api/catalog?all=1');

    const resSuppliers = await fetchWithTimeout(`${TARGET_URL}/api/admin/suppliers`, { headers });
    assert(resSuppliers.status === 200, `/api/admin/suppliers respondió con ${resSuppliers.status}`);
    const dataSuppliers = await resSuppliers.json().catch(() => ({}));
    assert(dataSuppliers.ok === true && Array.isArray(dataSuppliers.suppliers), 'Fallo en obtención de proveedores admin en /api/admin/suppliers');
  });

  // ============================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS & SECURITY POSTURE
  // ============================================================================
  if (!jsonOutput && (!selectedTier || selectedTier === 4)) {
    console.log(`\n--- TIER 4: Escenarios Reales de Aplicación y Postura de Seguridad Global ---`);
  }

  await runTestCase(4, 'T4.1', 'Flujo completo E2E de compra extremo a extremo', async () => {
    // 1. Explorar catálogo
    const catRes = await fetchWithTimeout(`${TARGET_URL}/api/catalog`);
    const catData = await catRes.json().catch(() => ({}));
    assert(catData.ok && Array.isArray(catData.products) && catData.products.length > 0, 'Paso 1: Catálogo inaccesible');

    // 2. Seleccionar producto con stock
    const selected = catData.products.find((p) => p.stock > 0) || catData.products[0];
    const unitPrice = selected.price;
    const qty = 1;
    const deliveryFee = 6000;

    // 3. Crear pedido a domicilio en Santa Marta
    const orderRes = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'delivery',
        customerName: 'Comprador Real Flujo E2E',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        neighborhood: 'Centro',
        paymentMethod: 'cash',
        deliveryFee,
        items: [
          { id: selected.id, name: selected.name, price: unitPrice, quantity: qty, presentation: selected.presentation },
        ],
      }),
    });
    assert(orderRes.status === 200, `Paso 3: Creación de pedido devolvió status ${orderRes.status}`);
    const orderData = await orderRes.json().catch(() => ({}));
    assert(orderData.ok === true, `Paso 3: Creación fallida: ${JSON.stringify(orderData)}`);
    assert(orderData.orderNumber && orderData.orderNumber.startsWith('MUC-'), 'Paso 3: Prefijo MUC ausente');
    assert(orderData.totalOrderCost === unitPrice * qty + deliveryFee, 'Paso 3: Total del pedido discrepante');

    // 4. Consultar comprobante y estado del pedido
    const checkRes = await fetchWithTimeout(`${TARGET_URL}/api/order?orderNumber=${encodeURIComponent(orderData.orderNumber)}`);
    assert(checkRes.status === 200, `Paso 4: Consulta de comprobante devolvió status ${checkRes.status}`);
    const checkData = await checkRes.json().catch(() => ({}));
    assert(checkData.ok === true, 'Paso 4: Verificación de estado fallida');
  });

  await runTestCase(4, 'T4.2', 'Verificación de cabeceras HTTP de seguridad global (CSP, HSTS, XFO, nosniff, Referrer)', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/`, { redirect: 'manual' });

    // HSTS
    const hsts = res.headers.get('strict-transport-security');
    assert(hsts && hsts.includes('max-age='), `Strict-Transport-Security ausente o inválido: "${hsts}"`);

    // CSP
    const csp = res.headers.get('content-security-policy');
    assert(csp && csp.length > 10, `Content-Security-Policy ausente: "${csp}"`);

    // X-Frame-Options o frame-ancestors
    const xfo = res.headers.get('x-frame-options');
    assert(
      (xfo && (xfo.toUpperCase() === 'DENY' || xfo.toUpperCase() === 'SAMEORIGIN')) || (csp && csp.includes('frame-ancestors')),
      `Protección contra Clickjacking ausente: X-Frame-Options="${xfo}"`
    );

    // nosniff
    const xcto = res.headers.get('x-content-type-options');
    assert(xcto && xcto.toLowerCase().includes('nosniff'), `X-Content-Type-Options inválido: "${xcto}"`);

    // Referrer-Policy
    const referrer = res.headers.get('referrer-policy');
    assert(referrer && referrer.length > 0, `Referrer-Policy ausente: "${referrer}"`);
  });

  await runTestCase(4, 'T4.3', 'Verificación de integración y estructura de despacho Shipday', async () => {
    const res = await fetchWithTimeout(`${TARGET_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: 'delivery',
        customerName: 'Shipday Tracking Audit',
        customerPhone: '3015153867',
        customerAddress: 'Calle 11 # 24-36',
        neighborhood: 'Pescaito',
        deliveryFee: 6000,
        items: [
          { id: 'antioqueno-azul-750', name: 'Aguardiente Antioqueño Tapa Azul', price: 54000, quantity: 1 },
        ],
      }),
    });
    const data = await res.json().catch(() => ({}));
    assert(data.ok === true, `Error en creación de pedido para verificación Shipday: ${JSON.stringify(data)}`);
    assert(data.orderState, 'Propiedad orderState ausente en respuesta de orden');
    // En pedidos delivery, o bien hay trackingLink o orderState está entre los estados reconocidos de despacho
    const validStates = ['ASSIGNED', 'NOT_ASSIGNED', 'PICKUP_AT_STORE', 'STARTED', 'COMPLETED_AT_COUNTER'];
    assert(validStates.includes(data.orderState), `Estado de despacho Shipday no reconocido: ${data.orderState}`);
  });

  await runTestCase(4, 'T4.4', 'Sigilo en tienda pública y ausencia de secretos en scripts cliente', async () => {
    // 1. Verificar index.html
    const indexRes = await fetchWithTimeout(`${TARGET_URL}/`);
    const indexHtml = await indexRes.text();
    assert(!/href=["'](\/admin|\/pos|\/manual)["']/i.test(indexHtml), 'index.html contiene enlaces visibles a consolas privadas');

    // 2. Verificar app.js
    const appRes = await fetchWithTimeout(`${TARGET_URL}/app.js`);
    if (appRes.status === 200) {
      const appJs = await appRes.text();
      assert(!appJs.includes(SUPERADMIN_PASS), 'app.js expone contraseña de superadmin');
      assert(!appJs.includes('HnBZld1e92'), 'app.js expone clave de API Shipday');
    }

    // 3. Verificar catalog.js
    const catRes = await fetchWithTimeout(`${TARGET_URL}/catalog.js`);
    if (catRes.status === 200) {
      const catJs = await catRes.text();
      assert(!catJs.includes(SUPERADMIN_PASS), 'catalog.js expone contraseña de superadmin');
    }
  });

  // ============================================================================
  // REPORTE FINAL Y DIAGNÓSTICO
  // ============================================================================
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  if (jsonOutput) {
    const summary = {
      targetUrl: TARGET_URL,
      timestamp: new Date().toISOString(),
      total,
      passed,
      failed,
      passRate: `${passRate}%`,
      results,
    };
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`\n==============================================================================`);
    console.log(`📊 RESUMEN EJECUTIVO DE EJECUCIÓN E2E`);
    console.log(`==============================================================================`);
    console.log(`Target:           ${TARGET_URL}`);
    console.log(`Total Pruebas:    ${total}`);
    console.log(`Aprobadas (PASS): \x1b[32m${passed}\x1b[0m`);
    console.log(`Fallidas (FAIL):  \x1b[31m${failed}\x1b[0m`);
    console.log(`Tasa de Éxito:    ${passRate}%`);

    const tiers = [1, 2, 3, 4];
    for (const t of tiers) {
      const tResults = results.filter((r) => r.tier === t);
      if (tResults.length > 0) {
        const tPass = tResults.filter((r) => r.status === 'PASS').length;
        const tFail = tResults.filter((r) => r.status === 'FAIL').length;
        const tRate = ((tPass / tResults.length) * 100).toFixed(1);
        console.log(`  • Tier ${t}: ${tPass}/${tResults.length} aprobadas (${tRate}%) - ${tFail} fallos`);
      }
    }
    console.log(`==============================================================================\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Error fatal durante ejecución de suite:', err);
  process.exit(1);
});
