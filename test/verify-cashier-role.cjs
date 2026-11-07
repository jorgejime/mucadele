const https = require('https');

const BASE_URL = 'https://mucadele.com.co';

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          const setCookie = res.headers['set-cookie'];
          const location = res.headers['location'];
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData), setCookie, location });
          } catch {
            resolve({ status: res.statusCode, raw: resData, setCookie, location });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('======================================================');
  console.log('TEST: CONTROL DE ROLES - USUARIO CAJERO VS ADMIN');
  console.log('Target: ' + BASE_URL);
  console.log('======================================================\n');

  // 1. Iniciar sesión como Cajero
  console.log('1. Autenticando usuario "cajero"...');
  const cashierLogin = await request('POST', '/api/login', {
    username: 'cajero',
    password: 'Mucadele2026Caja',
    redirect: '/pos',
  });

  const cookieHeader = cashierLogin.setCookie
    ? Array.isArray(cashierLogin.setCookie)
      ? cashierLogin.setCookie[0].split(';')[0]
      : cashierLogin.setCookie.split(';')[0]
    : '';

  const cashierToken = cashierLogin.data?.token || (cookieHeader ? cookieHeader.split('=')[1] : null);

  if (!cashierToken) {
    throw new Error('Fallo al autenticar cajero: ' + JSON.stringify(cashierLogin.data || cashierLogin.raw));
  }

  const cashierHeaders = {
    Cookie: cookieHeader,
    Authorization: `Bearer ${cashierToken}`,
  };

  console.log('   ✓ Login exitoso de Cajero.');
  console.log(`   ✓ Rol recibido: "${cashierLogin.data?.role}" (Esperado: "cajero")`);

  if (cashierLogin.data?.role !== 'cajero') {
    throw new Error(`Rol incorrecto: se esperaba 'cajero', se obtuvo '${cashierLogin.data?.role}'`);
  }

  // 2. Verificar que cajero PUEDE consultar catálogo para vender
  console.log('\n2. Verificando que cajero puede ver catálogo para venta...');
  const catRes = await request('GET', '/api/catalog', null, cashierHeaders);
  if (!catRes.data?.ok || !Array.isArray(catRes.data.products)) {
    throw new Error('Cajero no pudo obtener catálogo: ' + JSON.stringify(catRes.data));
  }
  console.log(`   ✓ Catálogo cargado con ${catRes.data.products.length} productos.`);

  // 3. Verificar que cajero PUEDE vender (crear orden POS)
  console.log('\n3. Verificando que cajero puede registrar y cobrar una venta POS...');
  const testOrderNumber = `POS-CAJ-${Date.now().toString().slice(-4)}`;
  const orderRes = await request(
    'POST',
    '/api/order',
    {
      orderNumber: testOrderNumber,
      customerName: 'Cliente Turno Cajero',
      customerPhone: '3001234567',
      orderType: 'pos_counter',
      items: [{ id: 'six-aguila-orig', name: 'Six Pack Cerveza Águila', price: 28000, quantity: 1 }],
      paymentMethod: 'efectivo',
      paymentStatus: 'paid',
      paymentDetails: { tendered: 30000, change: 2000 },
      total: 28000,
    },
    cashierHeaders
  );

  if (!orderRes.data?.ok) {
    throw new Error('Cajero no pudo registrar venta: ' + JSON.stringify(orderRes.data));
  }
  console.log(`   ✓ Venta #${testOrderNumber} registrada exitosamente por el cajero.`);

  // 4. Verificar que cajero TIENE PROHIBIDO modificar precios o productos (PATCH /api/admin/products)
  console.log('\n4. Verificando que cajero NO PUEDE modificar precios ni inventario...');
  const patchRes = await request(
    'PATCH',
    '/api/admin/products',
    {
      id: 'six-aguila-orig',
      price: 999999, // intento malicioso de alterar precio
      stock: 500, // intento no autorizado de alterar stock
    },
    cashierHeaders
  );

  console.log(`   ✓ Código HTTP ante intento de modificar precios/stock: ${patchRes.status}`);
  console.log(`   ✓ Mensaje de seguridad: "${patchRes.data?.error}"`);
  if (patchRes.status !== 403) {
    throw new Error(`Seguridad violada: cajero modificó productos con código ${patchRes.status}`);
  }

  // 5. Verificar que cajero TIENE PROHIBIDO llenar inventario con facturas (POST /api/admin/apply-invoice)
  console.log('\n5. Verificando que cajero NO PUEDE aplicar facturas ni modificar inventario en lote...');
  const applyRes = await request(
    'POST',
    '/api/admin/apply-invoice',
    {
      supplier_name: 'Distribuidor Falso',
      invoice_number: 'FAC-ILLEGAL',
      items: [{ product_id: 'six-aguila-orig', quantity: 100 }],
    },
    cashierHeaders
  );

  console.log(`   ✓ Código HTTP ante intento de alterar inventario: ${applyRes.status}`);
  console.log(`   ✓ Mensaje de seguridad: "${applyRes.data?.error}"`);
  if (applyRes.status !== 403) {
    throw new Error(`Seguridad violada: cajero alteró inventario con código ${applyRes.status}`);
  }

  // 6. Verificar que cajero TIENE PROHIBIDO entrar al panel /admin.html (Redirección Edge a /pos)
  console.log('\n6. Verificando que cajero NO PUEDE acceder a /admin.html en navegador...');
  const adminPageRes = await request('GET', '/admin.html', null, cashierHeaders);
  console.log(`   ✓ Código de respuesta para /admin.html: ${adminPageRes.status}`);
  console.log(`   ✓ Redirección hacia: ${adminPageRes.location}`);
  if (adminPageRes.status !== 303 || !adminPageRes.location?.includes('/pos')) {
    throw new Error(`Seguridad violada: cajero no fue expulsado de /admin.html (status ${adminPageRes.status})`);
  }

  // 7. Verificar que Superadmin mantiene todos los permisos
  console.log('\n7. Verificando que Superadmin conserva todos los privilegios administrativos...');
  const adminLogin = await request('POST', '/api/login', {
    username: 'superadmin',
    password: 'Mucadele2026Breiner',
    redirect: '/admin',
  });
  if (adminLogin.data?.role !== 'admin') {
    throw new Error('Fallo de permisos para superadmin: ' + JSON.stringify(adminLogin.data));
  }
  console.log('   ✓ Superadmin verificado con rol "admin" y acceso irrestricto.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE SEGURIDAD Y RESTRICCIÓN DE ROL CAJERO PASARON AL 100%!');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS DE ROLES:', err);
  process.exit(1);
});
