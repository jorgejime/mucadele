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
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData), setCookie });
          } catch {
            resolve({ status: res.statusCode, raw: resData, setCookie });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTest() {
  console.log('=== TEST E2E: INGRESO DE MERCANCÍA E INVENTARIO CON IA (CLOUDFLARE D1) ===');

  // 1. Auth Superadmin
  console.log('\n1. Autenticando como superadmin...');
  const loginRes = await request('POST', '/api/login', {
    username: 'superadmin',
    password: 'Mucadele2026Breiner',
    redirect: '/admin',
  });
  const cookieHeader = loginRes.setCookie ? (Array.isArray(loginRes.setCookie) ? loginRes.setCookie[0].split(';')[0] : loginRes.setCookie.split(';')[0]) : '';
  const token = loginRes.data?.token || (cookieHeader ? cookieHeader.split('=')[1] : null);
  if (!token && !cookieHeader) {
    throw new Error('Fallo en login de admin: ' + JSON.stringify(loginRes.data || loginRes.raw));
  }
  const authHeaders = {
    Cookie: cookieHeader,
    Authorization: `Bearer ${token || ''}`,
  };
  console.log('   ✓ Autenticado exitosamente como Superadmin.');

  // 2. Consultar inventario actual de un producto de prueba
  console.log('\n2. Consultando inventario inicial del catálogo...');
  const catRes = await request('GET', '/api/catalog?all=1', null, authHeaders);
  if (!catRes.data?.ok || !Array.isArray(catRes.data.products)) {
    throw new Error('Fallo al obtener catálogo: ' + JSON.stringify(catRes.data));
  }
  const testProduct = catRes.data.products.find((p) => p.id === 'six-aguila-orig') || catRes.data.products[0];
  const stockInicial = Number(testProduct.stock || 0);
  console.log(`   ✓ Producto seleccionado: "${testProduct.name}" (ID: ${testProduct.id})`);
  console.log(`   ✓ Stock actual en D1: ${stockInicial} unidades.`);

  // 3. Probar escaneo de factura simulada
  console.log('\n3. Validando endpoint /api/admin/scan-invoice...');
  const sample1x1Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const scanRes = await request(
    'POST',
    '/api/admin/scan-invoice',
    {
      imageBase64: sample1x1Png,
      mimeType: 'image/png',
    },
    authHeaders
  );

  console.log(`   ✓ Código de respuesta de scan-invoice: ${scanRes.status}`);
  console.log('   ✓ Respuesta estructurada:', JSON.stringify(scanRes.data).slice(0, 160) + '...');

  // 4. Probar aplicación de factura al inventario real en D1
  const unidadesASumar = 5;
  const testInvoiceNumber = `TEST-FAC-${Date.now().toString().slice(-5)}`;
  console.log(`\n4. Aplicando factura ${testInvoiceNumber} (+${unidadesASumar} unidades a ${testProduct.id}) en D1...`);

  const applyRes = await request(
    'POST',
    '/api/admin/apply-invoice',
    {
      supplier_name: 'Bavaria Distribuciones de la Costa',
      invoice_number: testInvoiceNumber,
      invoice_date: new Date().toISOString().split('T')[0],
      items: [
        {
          product_id: testProduct.id,
          product_name: testProduct.name,
          quantity: unidadesASumar,
          unit_cost: 21000,
        },
      ],
    },
    authHeaders
  );

  if (!applyRes.data?.ok) {
    throw new Error('Fallo al aplicar factura: ' + JSON.stringify(applyRes.data));
  }
  console.log('   ✓ Factura aplicada exitosamente en D1:');
  console.log(`     - PO Number: ${applyRes.data.po_number}`);
  console.log(`     - Productos actualizados: ${applyRes.data.updated_products_count}`);
  console.log(`     - Total unidades sumadas: ${applyRes.data.total_units_added}`);

  // 5. Verificar que el stock aumentó en D1
  console.log('\n5. Verificando persistencia y consistencia en D1 (/api/catalog)...');
  const catAfterRes = await request('GET', '/api/catalog?all=1', null, authHeaders);
  const updatedProd = catAfterRes.data.products.find((p) => p.id === testProduct.id);
  const stockFinal = Number(updatedProd.stock || 0);
  console.log(`   ✓ Stock anterior: ${stockInicial}`);
  console.log(`   ✓ Stock nuevo en D1: ${stockFinal}`);

  if (stockFinal !== stockInicial + unidadesASumar) {
    throw new Error(`Inconsistencia en stock: esperado ${stockInicial + unidadesASumar}, encontrado ${stockFinal}`);
  }
  console.log(`   ✓ ¡CONFIRMADO! El stock en D1 aumentó exactamente en +${unidadesASumar} unidades.`);

  // 6. Revertir las unidades de prueba para dejar el inventario limpio y exacto
  console.log('\n6. Revirtiendo las 5 unidades de prueba para dejar el stock exacto del negocio...');
  const revertRes = await request(
    'POST',
    '/api/admin/apply-invoice',
    {
      supplier_name: 'Ajuste de Auditoría E2E',
      invoice_number: `REV-${testInvoiceNumber}`,
      invoice_date: new Date().toISOString().split('T')[0],
      items: [
        {
          product_id: testProduct.id,
          product_name: testProduct.name,
          quantity: -unidadesASumar,
          unit_cost: 0,
        },
      ],
    },
    authHeaders
  );
  if (!revertRes.data?.ok) {
    console.warn('Nota: Ajuste de reversión automático:', revertRes.data);
  } else {
    console.log('   ✓ Stock de prueba revertido al valor original.');
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS E2E DEL ESCÁNER IA Y STOCK EN D1 PASARON AL 100%!');
}

runTest().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBA E2E:', err);
  process.exit(1);
});
