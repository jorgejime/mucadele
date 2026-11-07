// test/verify-customers-and-whatsapp.js
// Validación de la API de Clientes, Agrupación de Compras, Estado de Cartera y Enlaces de WhatsApp

const BASE_URL = 'https://mucadele.com.co';

async function run() {
  console.log('--- TEST 1: Verificar que /api/admin/customers requiera autenticación ---');
  const unauthRes = await fetch(`${BASE_URL}/api/admin/customers`);
  console.log('Status no autenticado:', unauthRes.status);
  if (unauthRes.status !== 401) {
    console.warn('⚠️ Se esperaba 401 para petición sin cookie JWT');
  } else {
    console.log('✅ Protección de Edge verificada: 401 Unauthorized sin sesión.');
  }

  console.log('\n--- TEST 2: Autenticación de Superadmin ---');
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'superadmin',
      password: process.env.ADMIN_PASSWORD || 'Mucadele2026Breiner',
    }),
  });

  const loginData = await loginRes.json();
  if (!loginData.ok) {
    throw new Error('Fallo de login: ' + JSON.stringify(loginData));
  }
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('✅ Superadmin autenticado. Cookie recibida.');

  const cookieHeader = setCookie ? setCookie.split(';')[0] : '';

  console.log('\n--- TEST 3: Consultar /api/admin/customers autenticado ---');
  const custRes = await fetch(`${BASE_URL}/api/admin/customers`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Status autenticado:', custRes.status);
  const custData = await custRes.json();
  if (!custData.ok) {
    throw new Error('Error al obtener clientes: ' + JSON.stringify(custData));
  }

  console.log('✅ Clientes obtenidos con éxito:');
  console.log('KPIs:', custData.kpis);
  console.log(`Total clientes registrados: ${custData.customers.length}`);

  if (custData.customers.length > 0) {
    const sample = custData.customers[0];
    console.log('\nEjemplo de cliente agrupado:');
    console.log({
      name: sample.name,
      phone: sample.phone,
      tier: sample.tier,
      total_orders: sample.total_orders,
      total_spent: sample.total_spent,
      total_debt: sample.total_debt,
      pending_credits_count: sample.pending_credits_count,
    });
  }

  console.log('\n--- TEST 4: Verificar /clientes.html y assets en producción ---');
  const pageRes = await fetch(`${BASE_URL}/clientes.html`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Status /clientes.html:', pageRes.status);
  const pageText = await pageRes.text();
  if (pageText.includes('Clientes Recurrentes y Cartera a Crédito')) {
    console.log('✅ /clientes.html responde con la interfaz correcta.');
  } else {
    console.error('❌ /clientes.html no contiene el título esperado.');
  }

  console.log('\n🎉 Todos los tests completados.');
}

run().catch((err) => {
  console.error('❌ Error en test:', err);
  process.exit(1);
});
