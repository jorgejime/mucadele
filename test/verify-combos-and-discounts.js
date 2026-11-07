// test/verify-combos-and-discounts.js
// Validación de Combos Promocionales y Sistema de Descuentos en POS y Tienda Web

const BASE_URL = 'https://mucadele.com.co';

async function run() {
  console.log('======================================================');
  console.log('TEST: COMBOS PROMOCIONALES Y SISTEMA DE DESCUENTOS POS');
  console.log('Target:', BASE_URL);
  console.log('======================================================\n');

  console.log('--- 1. Verificar existencia de combos en /api/catalog ---');
  const catRes = await fetch(`${BASE_URL}/api/catalog`);
  const catData = await catRes.json();
  if (!catData.ok) throw new Error('Fallo al obtener catálogo: ' + JSON.stringify(catData));

  const combos = (catData.products || []).filter((p) => p.category === 'combos');
  console.log(`Combos encontrados en catálogo: ${combos.length}`);
  combos.forEach((c) => {
    console.log(`  ✓ [${c.id}] ${c.name} - $${c.price.toLocaleString('es-CO')} (Stock: ${c.stock})`);
  });

  const requiredCombos = ['combo-guaro-agua', 'combo-mami-cerveza', 'combo-hielo-vaper', 'combo-oldparr-hielo'];
  for (const rc of requiredCombos) {
    const found = combos.find((c) => c.id === rc);
    if (!found) throw new Error(`Combo requerido no encontrado: ${rc}`);
  }
  console.log('✅ Todos los combos promocionales requeridos están activos en catálogo.\n');

  console.log('--- 2. Autenticación de Superadmin ---');
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'superadmin',
      password: process.env.ADMIN_PASSWORD || 'Mucadele2026Breiner',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.ok) throw new Error('Fallo de login: ' + JSON.stringify(loginData));
  const cookieHeader = loginRes.headers.get('set-cookie')?.split(';')[0] || '';
  console.log('✅ Autenticado con éxito.\n');

  console.log('--- 3. Probar Venta POS con Descuento Porcentual (10%) ---');
  // Producto: buchanans-12-750 ($165.000). Descuento 10% = $16.500. Total = $148.500
  const discountSale1 = await fetch(`${BASE_URL}/api/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      orderType: 'pos_counter',
      customerName: 'Cliente VIP Test',
      customerPhone: '3015153867',
      paymentMethod: 'efectivo',
      paymentStatus: 'paid',
      paymentDetails: {
        tendered: 150000,
        change: 1500,
      },
      discountAmount: 16500,
      discountDetails: {
        type: 'percent',
        value: 10,
        amount: 16500,
        reason: 'Cliente VIP Frecuente',
      },
      items: [
        {
          id: 'buchanans-12-750',
          name: "Whisky Buchanan's Deluxe 12 Años",
          price: 165000,
          quantity: 1,
        },
      ],
    }),
  });

  const sale1Data = await discountSale1.json();
  if (!sale1Data.ok) throw new Error('Error en venta con descuento porcentual: ' + JSON.stringify(sale1Data));

  console.log('  ✓ Orden con descuento generada:', sale1Data.orderNumber);
  console.log('  ✓ Total calculado por servidor:', sale1Data.totalOrderCost);
  if (sale1Data.totalOrderCost !== 148500) {
    throw new Error(`Total esperado $148.500 pero se recibió $${sale1Data.totalOrderCost}`);
  }
  console.log('✅ Descuento porcentual validado correctamente ($165.000 - $16.500 = $148.500).\n');

  console.log('--- 4. Probar Venta POS con Descuento de Valor Fijo ($10.000) en Combo ---');
  // Producto: combo-mami-cerveza ($82.000). Descuento fijo: $10.000. Total = $72.000
  const discountSale2 = await fetch(`${BASE_URL}/api/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      orderType: 'pos_counter',
      customerName: 'Cliente Promo Especial',
      customerPhone: '3001234567',
      paymentMethod: 'transferencia',
      paymentStatus: 'paid',
      paymentDetails: {
        reference: 'TRF-NEQUI-PROMO99',
      },
      discountAmount: 10000,
      discountDetails: {
        type: 'amount',
        value: 10000,
        amount: 10000,
        reason: 'Bono fidelidad semana',
      },
      items: [
        {
          id: 'combo-mami-cerveza',
          name: "Combo 'Mami': Ron Medellín + Six Pack Águila",
          price: 82000,
          quantity: 1,
        },
      ],
    }),
  });

  const sale2Data = await discountSale2.json();
  if (!sale2Data.ok) throw new Error('Error en venta combo con descuento fijo: ' + JSON.stringify(sale2Data));

  console.log('  ✓ Orden de Combo generada:', sale2Data.orderNumber);
  console.log('  ✓ Total calculado por servidor:', sale2Data.totalOrderCost);
  if (sale2Data.totalOrderCost !== 72000) {
    throw new Error(`Total esperado $72.000 pero se recibió $${sale2Data.totalOrderCost}`);
  }
  console.log('✅ Descuento de valor fijo sobre combo validado correctamente ($82.000 - $10.000 = $72.000).\n');

  console.log('--- 5. Verificar banner de promociones en index.html ---');
  const indexRes = await fetch(`${BASE_URL}/`);
  const indexHtml = await indexRes.text();
  if (indexHtml.includes('promos-banner-section') && indexHtml.includes('Combos y Promos')) {
    console.log('✅ Banner de promociones y selector de combos verificados en el HTML público.');
  } else {
    throw new Error('No se encontró la sección de banner o filtro de combos en index.html');
  }

  console.log('\n🎉 TODAS LAS PRUEBAS DE COMBOS Y DESCUENTOS PASARON AL 100%.');
}

run().catch((err) => {
  console.error('\n❌ ERROR EN PRUEBAS:', err);
  process.exit(1);
});
