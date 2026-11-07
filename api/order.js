const SHIPDAY_API_URL = 'https://api.shipday.com';
const DEFAULT_CARRIER_ID = Number(process.env.DEFAULT_CARRIER_ID) || 565174;

const STORE_CONFIG = {
  name: 'mucadele licores',
  address: 'Calle 11 # 24-36, Comuna 3, Santa Marta, Magdalena, Colombia',
  phoneNumber: '+573015153867',
  latitude: 11.24383,
  longitude: -74.186437,
};

function formatBogotaDateAndTime(offsetMinutes = 35) {
  const now = new Date(Date.now() + offsetMinutes * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function normalizeColombianPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D+/g, '');
  if (!digits) return '+573015153867';
  if (digits.startsWith('57') && digits.length >= 12) {
    return `+${digits}`;
  }
  return `+57${digits.slice(-10)}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.SHIPDAY_API_KEY || '';
  const headers = {
    Authorization: `Basic ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const { orderNumber, list } = req.query || {};

    if (list === 'active') {
      try {
        const ordersResp = await fetch(`${SHIPDAY_API_URL}/orders`, { headers });
        const orders = ordersResp.ok ? await ordersResp.json() : [];
        return res.status(200).json({
          ok: true,
          orders: Array.isArray(orders) ? orders.slice(0, 30) : [],
        });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    if (!orderNumber) {
      try {
        const carriersResp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers });
        const carriers = carriersResp.ok ? await carriersResp.json() : [];
        return res.status(200).json({
          ok: true,
          store: STORE_CONFIG,
          carriersCount: Array.isArray(carriers) ? carriers.length : 0,
          carriers: Array.isArray(carriers)
            ? carriers.map((c) => ({
                id: c.id,
                name: c.name,
                phone: c.phoneNumber,
                isActive: c.isActive,
                isOnShift: c.isOnShift,
              }))
            : [],
        });
      } catch (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    try {
      const detailResp = await fetch(
        `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
        { headers }
      );
      const details = detailResp.ok ? await detailResp.json() : [];
      return res.status(200).json({
        ok: true,
        order: Array.isArray(details) && details.length > 0 ? details[0] : null,
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      orderType = 'delivery', // 'delivery' | 'pickup' | 'pos_counter'
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      neighborhood,
      deliveryInstruction,
      paymentMethod = 'cash',
      items = [],
      deliveryFee = 6000,
      tips = 0,
      autoAssignDriver = true,
      skipShipday = false,
    } = body;

    const isNoDelivery = orderType === 'pickup' || orderType === 'pos_counter';
    const resolvedName = (customerName || (orderType === 'pos_counter' ? 'Cliente Mostrador' : '')).trim();
    const resolvedPhone = (customerPhone || (orderType === 'pos_counter' ? '3015153867' : '')).trim();
    const resolvedAddress = isNoDelivery
      ? STORE_CONFIG.address
      : (customerAddress || '').trim();

    if (!resolvedName || !resolvedPhone || !resolvedAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Faltan datos obligatorios del cliente o el carrito está vacío.',
      });
    }

    const prefix = orderType === 'pos_counter' ? 'POS' : orderType === 'pickup' ? 'RET' : 'MUC';
    const orderNumber = `${prefix}-${Date.now().toString().slice(-6)}`;
    const { date: expectedDeliveryDate, time: expectedDeliveryTime } = formatBogotaDateAndTime(
      isNoDelivery ? 5 : 35
    );

    const fullAddress = isNoDelivery
      ? `MOSTRADOR LOCAL · ${STORE_CONFIG.address}`
      : neighborhood
      ? `${resolvedAddress}, Barrio ${neighborhood.trim()}, Santa Marta, Magdalena, Colombia`
      : `${resolvedAddress}, Santa Marta, Magdalena, Colombia`;

    const orderItems = items.map((item) => ({
      name: item.name,
      unitPrice: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      detail: item.presentation || '',
    }));

    const itemsSubtotal = orderItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    const effectiveDeliveryFee = isNoDelivery ? 0 : Number(deliveryFee || 0);
    const totalOrderCost = itemsSubtotal + effectiveDeliveryFee + Number(tips || 0);

    const paymentLabel =
      paymentMethod === 'nequi'
        ? 'Transferencia Nequi / Daviplata'
        : paymentMethod === 'card'
        ? 'Datáfono / Tarjeta'
        : 'Efectivo';

    // Si es una venta de mostrador en el POS local y no requiere despacho en Shipday
    if (skipShipday) {
      return res.status(200).json({
        ok: true,
        orderId: null,
        orderNumber,
        orderType,
        assigned: false,
        assignedCarrierId: null,
        assignedCarrierName: null,
        orderState: 'COMPLETED_AT_COUNTER',
        trackingLink: null,
        totalOrderCost,
        deliveryFee: 0,
        expectedDeliveryDate,
        expectedDeliveryTime,
        customerAddress: fullAddress,
      });
    }

    const modeTag =
      orderType === 'pickup'
        ? '[RECOGER EN LOCAL - SIN DOMICILIO]'
        : orderType === 'pos_counter'
        ? '[VENTA EN MOSTRADOR POS - SIN DOMICILIO]'
        : '[DOMICILIO EXPRESS]';

    const combinedInstructions = [
      modeTag,
      `Pago: ${paymentLabel} | Total COP $${totalOrderCost.toLocaleString('es-CO')}`,
      deliveryInstruction ? `Nota: ${deliveryInstruction.trim()}` : '',
      'Verificar mayoría de edad (+18).',
    ]
      .filter(Boolean)
      .join(' · ');

    const shipdayPayload = {
      orderNumber,
      customerName: resolvedName,
      customerAddress: fullAddress,
      customerEmail: (customerEmail || 'cliente@mucadele.com').trim(),
      customerPhoneNumber: normalizeColombianPhone(resolvedPhone),
      restaurantName: STORE_CONFIG.name,
      restaurantAddress: STORE_CONFIG.address,
      restaurantPhoneNumber: STORE_CONFIG.phoneNumber,
      pickupLatitude: STORE_CONFIG.latitude,
      pickupLongitude: STORE_CONFIG.longitude,
      expectedDeliveryDate,
      expectedDeliveryTime,
      deliveryInstruction: combinedInstructions,
      orderItem: orderItems.map((it) => ({
        name: it.name,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
      totalOrderCost,
      deliveryFee: effectiveDeliveryFee,
      tips: Number(tips || 0),
      tax: 0,
      discountAmount: 0,
      paymentMethod: paymentMethod === 'cash' ? 'cash' : 'credit_card',
    };

    const insertResp = await fetch(`${SHIPDAY_API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(shipdayPayload),
    });

    const insertData = await insertResp.json().catch(() => ({}));
    if (!insertResp.ok || insertData.success === false) {
      return res.status(502).json({
        ok: false,
        error: insertData.response || 'No fue posible registrar la orden en Shipday.',
        details: insertData,
      });
    }

    const orderId = insertData.orderId;
    let assigned = false;
    let assignedCarrierName = null;

    // Solo asignamos al motorizado si la venta REQUIERE domicilio
    const shouldAssignDriver = !isNoDelivery && autoAssignDriver && orderId;
    if (shouldAssignDriver) {
      const assignResp = await fetch(
        `${SHIPDAY_API_URL}/orders/assign/${orderId}/${DEFAULT_CARRIER_ID}`,
        {
          method: 'PUT',
          headers,
        }
      );
      if (assignResp.ok) {
        assigned = true;
        assignedCarrierName = process.env.DEFAULT_CARRIER_NAME || 'Domiciliario Mucadele';
      }
    }

    let trackingLink = null;
    let orderState = isNoDelivery
      ? 'PICKUP_AT_STORE'
      : assigned
      ? 'ASSIGNED'
      : 'NOT_ASSIGNED';

    if (!isNoDelivery) {
      try {
        const detailResp = await fetch(
          `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
          { headers }
        );
        if (detailResp.ok) {
          const detailJson = await detailResp.json();
          if (Array.isArray(detailJson) && detailJson.length > 0) {
            trackingLink = detailJson[0].trackingLink || null;
            orderState = detailJson[0]?.orderStatus?.orderState || orderState;
          }
        }
      } catch {
        // Ignorar si tarda en indexar
      }
    }

    return res.status(200).json({
      ok: true,
      orderId,
      orderNumber,
      orderType,
      assigned,
      assignedCarrierId: assigned ? DEFAULT_CARRIER_ID : null,
      assignedCarrierName,
      orderState,
      trackingLink,
      totalOrderCost,
      deliveryFee: effectiveDeliveryFee,
      expectedDeliveryDate,
      expectedDeliveryTime,
      customerAddress: fullAddress,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Error interno procesando el pedido.',
    });
  }
}
