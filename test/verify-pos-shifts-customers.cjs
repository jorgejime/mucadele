const https = require('https');

const BASE_URL = process.argv[2] || 'https://mucadele.com.co';

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
  console.log('TEST: GESTIÓN DE TURNOS, ARQUEO CIEGO Y CLIENTES');
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

  if (cashierLogin.status !== 200 || !cookieHeader) {
    throw new Error('Fallo login de Cajero: ' + JSON.stringify(cashierLogin));
  }
  console.log('   ✓ Login exitoso de Cajero.');

  const authHeaders = { Cookie: cookieHeader };

  // 2. Consultar estado del turno
  console.log('\n2. Consultando turno de caja actual...');
  let shiftRes = await request('GET', '/api/pos/shift/current', null, authHeaders);
  if (shiftRes.status !== 200) {
    throw new Error('Fallo GET /api/pos/shift/current: ' + JSON.stringify(shiftRes));
  }
  console.log('   ✓ Consulta de turno respondió HTTP 200.');

  // Si había un turno abierto residual, cerrarlo para el test limpio
  if (shiftRes.data.active && shiftRes.data.shift) {
    console.log(`   ℹ Cerrando turno residual #${shiftRes.data.shift.id} para iniciar test limpio...`);
    await request('POST', '/api/pos/shift/close', {
      shift_id: shiftRes.data.shift.id,
      actual_cash: Number(shiftRes.data.shift.expected_cash) || 0,
      notes: 'Cierre automático previo al test',
    }, authHeaders);
  }

  // 3. Abrir nuevo turno con base inicial de $120.000 COP
  console.log('\n3. Abriendo nuevo turno con base inicial $120.000 COP...');
  const openRes = await request('POST', '/api/pos/shift/open', {
    initial_cash: 120000,
    notes: 'Base inicial test de integración',
  }, authHeaders);

  if (openRes.status !== 200 || !openRes.data.ok) {
    throw new Error('Fallo al abrir turno: ' + JSON.stringify(openRes));
  }
  const shiftId = openRes.data.shift_id;
  console.log(`   ✓ Turno #${shiftId} abierto exitosamente.`);

  // 4. Registrar movimiento de gasto menor (-$15.000)
  console.log('\n4. Registrando egreso / gasto menor de $15.000 COP...');
  const movRes = await request('POST', '/api/pos/shift/movement', {
    shift_id: shiftId,
    movement_type: 'retiro_gasto',
    amount: 15000,
    concept: 'Compra de bolsas y hielo extra',
  }, authHeaders);

  if (movRes.status !== 200 || !movRes.data.ok) {
    throw new Error('Fallo registrando movimiento: ' + JSON.stringify(movRes));
  }
  console.log('   ✓ Gasto menor registrado correctamente.');

  // 5. Verificar cálculo de efectivo esperado en el turno
  console.log('\n5. Verificando cálculo de efectivo esperado...');
  shiftRes = await request('GET', '/api/pos/shift/current', null, authHeaders);
  const s = shiftRes.data.shift;
  console.log(`   Base: $${s.initial_cash} | Gastos: $${s.total_expenses} | Efectivo Esperado: $${s.expected_cash}`);
  if (s.initial_cash !== 120000 || s.total_expenses !== 15000 || s.expected_cash !== 105000) {
    throw new Error(`Cálculo de turno inconsistente: ${JSON.stringify(s)}`);
  }
  console.log('   ✓ Cálculo matemático de turno en D1 verificado al 100%.');

  // 6. Probar Directorio y Autocompletado de Clientes
  console.log('\n6. Probando Directorio y Autocompletado de Clientes...');
  const custRes = await request('GET', '/api/customers', null, authHeaders);
  if (custRes.status !== 200 || !custRes.data.ok) {
    throw new Error('Fallo GET /api/customers: ' + JSON.stringify(custRes));
  }
  console.log(`   ✓ Directorio cargado con ${custRes.data.customers.length} cliente(s).`);

  // 7. Registrar / Actualizar Cliente Fiscal
  console.log('\n7. Creando cliente fiscal en D1...');
  const newCustRes = await request('POST', '/api/customers', {
    doc_type: 'CC',
    doc_number: '1082955443',
    name: 'Carlos Mendoza Garzón',
    phone: '3104567890',
    address: 'Calle 11 # 24-36, Santa Marta',
    credit_limit: 500000,
  }, authHeaders);

  if (newCustRes.status !== 200 || !newCustRes.data.ok) {
    throw new Error('Fallo POST /api/customers: ' + JSON.stringify(newCustRes));
  }
  console.log(`   ✓ Cliente registrado/actualizado exitosamente (ID: ${newCustRes.data.customer_id}).`);

  // Búsqueda por query
  const searchRes = await request('GET', '/api/customers?q=Carlos', null, authHeaders);
  const found = (searchRes.data.customers || []).find((c) => c.doc_number === '1082955443');
  if (!found) {
    throw new Error('Búsqueda de cliente no encontró el registro creado.');
  }
  console.log(`   ✓ Autocompletado instantáneo encontró a "${found.name}" (Doc: ${found.doc_number}).`);

  // 8. Cierre de Turno y Arqueo Ciego
  console.log('\n8. Ejecutando cierre de turno y arqueo ciego...');
  const closeRes = await request('POST', '/api/pos/shift/close', {
    shift_id: shiftId,
    actual_cash: 105000, // Conteo exacto igual al esperado
    notes: 'Arqueo de prueba verificado',
  }, authHeaders);

  if (closeRes.status !== 200 || !closeRes.data.ok) {
    throw new Error('Fallo cerrando turno: ' + JSON.stringify(closeRes));
  }
  const summary = closeRes.data.summary;
  console.log(`   Esperado: $${summary.expected_cash} | Contado: $${summary.actual_cash} | Diferencia: $${summary.difference} (${summary.difference_label})`);
  if (summary.difference !== 0 || summary.difference_label !== 'CUADRE EXACTO') {
    throw new Error('El arqueo no arrojó CUADRE EXACTO: ' + JSON.stringify(summary));
  }
  console.log('   ✓ Acta de Arqueo Ciego validada: CUADRE EXACTO.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE FASE 2 (TURNOS, ARQUEO CIEGO Y CLIENTES) PASARON AL 100%!');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN SUITE DE FASE 2:\n', err);
  process.exit(1);
});
