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
  console.log('TEST: LOGÍSTICA SHIPDAY (COTIZADOR, ACCIONES Y WEBHOOK)');
  console.log('Target: ' + BASE_URL);
  console.log('======================================================\n');

  // 1. Probar Cotizador Geodésico sin parámetros (Tarifa estándar)
  console.log('1. Probando cotizador geodésico sin parámetros...');
  const defaultEst = await request('GET', '/api/shipping/estimate');
  if (defaultEst.status !== 200 || !defaultEst.data.ok) {
    throw new Error('Fallo cotizador estándar: ' + JSON.stringify(defaultEst));
  }
  console.log(`   ✓ Tarifa por defecto: $${defaultEst.data.estimate.total_fare} COP.`);
  if (defaultEst.data.estimate.total_fare !== 6000) {
    throw new Error('Tarifa por defecto debería ser 6000.');
  }

  // 2. Probar Cotizador Geodésico con coordenadas reales en Santa Marta (El Rodadero)
  console.log('\n2. Probando cotizador con destino en El Rodadero (lat: 11.2050, lng: -74.2250)...');
  const rodaderoEst = await request('GET', '/api/shipping/estimate?lat=11.2050&lng=-74.2250');
  if (rodaderoEst.status !== 200 || !rodaderoEst.data.ok) {
    throw new Error('Fallo cotizador Rodadero: ' + JSON.stringify(rodaderoEst));
  }
  const e = rodaderoEst.data.estimate;
  console.log(`   Distancia recta: ${e.straight_distance_km} km | Distancia vial: ${e.road_distance_km} km`);
  console.log(`   Base: $${e.base_fare} | Recargo km: $${e.extra_km_fare} | Cuota tech: $${e.tech_fee} | TOTAL: $${e.total_fare} COP`);
  if (!e.road_distance_km || e.total_fare < 6000 || e.total_fare % 500 !== 0) {
    throw new Error('Cálculo geodésico inválido o no redondeado a múltiplos de $500.');
  }
  console.log('   ✓ Cotizador geodésico y vial calibrado y validado.');

  // 3. Autenticar Cajero para probar acciones de despacho
  console.log('\n3. Autenticando usuario cajero...');
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

  if (!cookieHeader) throw new Error('No se pudo autenticar cajero');
  const authHeaders = { Cookie: cookieHeader };
  console.log('   ✓ Sesión activa.');

  // 4. Validar validación de parámetros en ready-to-pickup
  console.log('\n4. Probando endpoint de marcado listo (/api/admin/orders/ready-to-pickup)...');
  const rtpValidation = await request('POST', '/api/admin/orders/ready-to-pickup', {}, authHeaders);
  if (rtpValidation.status !== 400) {
    throw new Error('Debería retornar 400 sin order_id: ' + JSON.stringify(rtpValidation));
  }
  console.log('   ✓ Validación de orden obligatoria correcta (HTTP 400).');

  // 5. Validar validación de parámetros en assign
  console.log('\n5. Probando endpoint de asignación (/api/admin/orders/assign)...');
  const assignValidation = await request('POST', '/api/admin/orders/assign', {}, authHeaders);
  if (assignValidation.status !== 400) {
    throw new Error('Debería retornar 400 sin parámetros: ' + JSON.stringify(assignValidation));
  }
  console.log('   ✓ Validación de order_id y carrier_id correcta (HTTP 400).');

  // 6. Probar Webhook Receptor de Shipday
  console.log('\n6. Probando receptor de Webhook Shipday (/api/webhooks/shipday)...');
  const webhookRes = await request('POST', '/api/webhooks/shipday', {
    orderId: 99999999,
    orderNumber: 'POS-TEST-WEBHOOK',
    orderStatus: 'ORDER_DELIVERED',
    carrier: {
      id: 554212,
      name: 'jorge jimenez',
      phoneNumber: '+573184131391',
    },
    deliveredTime: new Date().toISOString(),
  });

  if (webhookRes.status !== 200 || !webhookRes.data.ok) {
    throw new Error('Fallo receptor webhook Shipday: ' + JSON.stringify(webhookRes));
  }
  console.log(`   ✓ Webhook procesado exitosamente: Estado "${webhookRes.data.status}".`);

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE FASE 3 (LOGÍSTICA SHIPDAY) PASARON AL 100%!');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN SUITE DE FASE 3:\n', err);
  process.exit(1);
});
