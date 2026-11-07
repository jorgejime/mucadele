import assert from 'node:assert';

const BASE_URL = 'https://mucadele.com.co';
const SUPERADMIN_USER = 'superadmin';
const SUPERADMIN_PASS = 'Mucadele2026Breiner';

async function main() {
  console.log(`\n======================================================`);
  console.log(`TEST E2E DE PRODUCCIÓN: MUCADELE LICORES POS & DB`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  // 1. Obtener catálogo para tomar un producto existente
  const catResp = await fetch(`${BASE_URL}/api/catalog`);
  const catData = await catResp.json();
  assert(catData.ok && catData.products.length > 0, 'No se pudo obtener el catálogo');
  const prod = catData.products.find(p => p.stock > 5) || catData.products[0];
  console.log(`[OK] Catálogo cargado. Producto de prueba: "${prod.name}" (ID: ${prod.id}, Precio: $${prod.price})`);

  // 2. Login superadmin para obtener cookie de sesión o token
  const loginResp = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: SUPERADMIN_USER, password: SUPERADMIN_PASS, redirect: '/pos' }),
  });
  const loginData = await loginResp.json().catch(() => ({}));
  const setCookie = loginResp.headers.get('set-cookie');
  const token = loginData.token || (setCookie ? setCookie.split(';')[0].split('=')[1] : null);
  assert(token || setCookie, 'No se recibió autenticación exitosa');
  const authHeaders = {
    Cookie: setCookie ? setCookie.split(';')[0] : `mucadele_session=${token}`,
    Authorization: `Bearer ${token || ''}`,
  };
  console.log(`[OK] Autenticado como Superadmin en producción.`);

  const testOrders = [];

  // Helper para crear órdenes POS
  async function submitPosSale(title, payload) {
    console.log(`\n--- Ejecutando: ${title} ---`);
    const resp = await fetch(`${BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({
        orderType: 'pos_counter',
        customerName: payload.customerName || 'Cliente Mostrador',
        customerPhone: payload.customerPhone || '3015153867',
        customerAddress: 'Calle 11 # 24-36, Mostrador',
        customerDoc: payload.customerDoc || '',
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentStatus,
        paymentDetails: payload.paymentDetails || {},
        skipShipday: true, // POS venta en mostrador sin despacho externo
        items: [{ id: prod.id, name: prod.name, price: prod.price, quantity: payload.qty || 1 }],
      }),
    });

    const data = await resp.json();
    assert(resp.ok && data.ok, `Error en ${title}: ${data.error || resp.statusText}`);
    console.log(`  ✓ Factura generada: #${data.orderNumber} | Método: "${data.paymentMethod}" | Estado: "${data.paymentStatus}" | Total: $${data.totalOrderCost}`);
    testOrders.push({ title, orderNumber: data.orderNumber, expectedMethod: payload.paymentMethod, expectedStatus: payload.paymentStatus || 'paid' });
    return data;
  }

  // PRUEBA 1: Efectivo
  await submitPosSale('1. Venta en Efectivo', {
    paymentMethod: 'efectivo',
    paymentDetails: { tendered: prod.price + 10000, change: 10000 },
  });

  // PRUEBA 2: Tarjeta de crédito
  await submitPosSale('2. Venta con Tarjeta de Crédito', {
    paymentMethod: 'tarjeta_credito',
    paymentDetails: { terminal: 'Datáfono Redeban 01' },
  });

  // PRUEBA 3: Transferencia (con comprobante/referencia opcional)
  await submitPosSale('3. Venta por Transferencia (Nequi)', {
    paymentMethod: 'transferencia',
    paymentDetails: { reference: 'NEQUI-COL-889922' },
  });

  // PRUEBA 4: Tarjeta débito
  await submitPosSale('4. Venta con Tarjeta Débito', {
    paymentMethod: 'tarjeta_debito',
    paymentDetails: { terminal: 'Datáfono Credibanco 02' },
  });

  // PRUEBA 5: A CRÉDITO (cuenta por cobrar pendiente a cliente identificado)
  const creditSale = await submitPosSale('5. Venta A CRÉDITO (Pendiente por cobrar)', {
    paymentMethod: 'credito',
    paymentStatus: 'pending',
    customerName: 'Carlos Mendoza Garzón',
    customerDoc: 'CC 1082955443',
    customerPhone: '3104567890',
    paymentDetails: {
      customerName: 'Carlos Mendoza Garzón',
      customerDoc: 'CC 1082955443',
      dueDate: '2026-11-15',
      notes: 'Crédito autorizado a 8 días',
    },
  });

  // PRUEBA 6: Otros métodos de pago
  await submitPosSale('6. Venta con Otros Métodos (Bono Empresarial)', {
    paymentMethod: 'otros',
    paymentDetails: { concept: 'Bono Sodexo Pass Navidad', notes: 'Aprobado RRHH' },
  });

  // PRUEBA 7: Venta Combinada con dos métodos (50% Efectivo, 50% Transferencia)
  const halfPrice = Math.floor(prod.price / 2);
  const remainingHalf = prod.price - halfPrice;
  await submitPosSale('7. Venta Combinada (Efectivo + Transferencia)', {
    paymentMethod: 'combinado',
    paymentDetails: {
      split: [
        { method: 'efectivo', amount: halfPrice },
        { method: 'transferencia', amount: remainingHalf, reference: 'TRF-BANCOL-7711' },
      ],
    },
  });

  // PRUEBA 8: Dos hojas de venta abiertas cobradas por separado
  console.log(`\n--- Simulación: Dos hojas abiertas cobradas por separado ---`);
  // Hoja A: Venta cliente "Mesa 1 - Andrés"
  const hojaA = await submitPosSale('8A. Hoja Abierta 1 (Cliente Andrés)', {
    customerName: 'Andrés Gómez (Mesa 1)',
    customerPhone: '3001112233',
    paymentMethod: 'efectivo',
    qty: 1,
  });

  // Hoja B: Venta cliente "Mesa 2 - Beatriz"
  const hojaB = await submitPosSale('8B. Hoja Abierta 2 (Cliente Beatriz)', {
    customerName: 'Beatriz Silva (Mesa 2)',
    customerPhone: '3009998877',
    paymentMethod: 'tarjeta_debito',
    qty: 2,
  });

  // 3. Consultar la base de datos Cloudflare D1 vía API de auditoría
  console.log(`\n======================================================`);
  console.log(`AUDITORÍA EN BASE DE DATOS D1 EN TIEMPO REAL`);
  console.log(`======================================================\n`);

  const auditResp = await fetch(`${BASE_URL}/api/order?list=active`, { headers: authHeaders });
  const auditData = await auditResp.json();
  assert(auditData.ok, 'Error consultando auditoría de órdenes');

  console.log(`Resumen de Arqueo por Método reportado por el servidor:`);
  console.log(JSON.stringify(auditData.summaryByMethod, null, 2));

  console.log(`\nVerificando cada orden en la lista de D1:`);
  const dbOrders = auditData.dbOrders || [];

  for (const t of testOrders) {
    const found = dbOrders.find(o => o.order_number === t.orderNumber);
    assert(found, `La orden #${t.orderNumber} no fue encontrada en D1`);
    console.log(`  ✓ Factura #${found.order_number}:`);
    console.log(`     - Cliente: "${found.customer_name}"`);
    console.log(`     - Método en DB: "${found.payment_method}" (Esperado: "${t.expectedMethod}")`);
    console.log(`     - Estado de pago: "${found.payment_status}" (Esperado: "${t.expectedStatus}")`);
    console.log(`     - Total: $${found.total}`);
    if (found.payment_details && Object.keys(found.payment_details).length > 0) {
      console.log(`     - Detalle en DB: ${JSON.stringify(found.payment_details)}`);
    }
    assert(found.payment_method === t.expectedMethod, `Método incorrecto en #${found.order_number}: ${found.payment_method} !== ${t.expectedMethod}`);
  }

  // 4. Verificar que el crédito de Carlos Mendoza aparece en Cartera
  console.log(`\nVerificando Cuentas por Cobrar (Créditos Pendientes):`);
  const credits = auditData.creditsSummary || [];
  const creditEntry = credits.find(c => c.customer_name === 'Carlos Mendoza Garzón');
  assert(creditEntry, 'El crédito de Carlos Mendoza Garzón no apareció en creditsSummary');
  console.log(`  ✓ Cliente Deudor: "${creditEntry.customer_name}"`);
  console.log(`  ✓ Documento/Tel: "${creditEntry.customer_doc}"`);
  console.log(`  ✓ Deuda total pendiente: $${creditEntry.total_debt}`);
  console.log(`  ✓ Órdenes adeudadas: ${creditEntry.orders.map(o => '#' + o.order_number).join(', ')}`);

  console.log(`\n🎉 TODAS LAS PRUEBAS DE PRODUCCIÓN Y BASE DE DATOS PASARON CON ÉXITO.`);
}

main().catch((err) => {
  console.error('\n❌ ERROR EN LA VERIFICACIÓN:', err);
  process.exit(1);
});
