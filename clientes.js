// ============================================================================
// MUCADELE LICORES · GESTIÓN DE CLIENTES RECURRENTES Y CARTERA A CRÉDITO
// ============================================================================

let allCustomers = [];
let activeFilter = 'all';
let searchQuery = '';

const kpiTotalCustomers = document.getElementById('kpi-total-customers');
const kpiFrequentCustomers = document.getElementById('kpi-frequent-customers');
const kpiDebtorsCount = document.getElementById('kpi-debtors-count');
const kpiTotalDebt = document.getElementById('kpi-total-debt');

const countAllSpan = document.getElementById('count-all');
const countDebtorsSpan = document.getElementById('count-debtors');
const countFrequentSpan = document.getElementById('count-frequent');

const searchInput = document.getElementById('customer-search-input');
const customersContainer = document.getElementById('customers-list-container');
const refreshBtn = document.getElementById('refresh-customers-btn');

const settleDialog = document.getElementById('settle-credit-dialog');
const settleContent = document.getElementById('settle-dialog-content');
const closeSettleBtn = document.getElementById('close-settle-dialog-btn');

function formatCOP(val) {
  const num = Number(val) || 0;
  return '$' + Math.round(num).toLocaleString('es-CO');
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeWhatsAppPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('3')) {
    return '57' + digits;
  }
  if (digits.length === 12 && digits.startsWith('573')) {
    return digits;
  }
  if (digits.length >= 7) {
    return digits.startsWith('57') ? digits : '57' + digits;
  }
  return '';
}

function buildCreditCollectionMessage(customer) {
  const pendingOrders = customer.orders.filter(
    (o) => o.payment_method === 'credito' && o.payment_status === 'pending'
  );
  const facturasList = pendingOrders
    .map((o) => `• Factura #${o.order_number} (${formatCOP(o.total)}) - ${new Date(o.created_at).toLocaleDateString('es-CO')}`)
    .join('\n');

  return (
    `Hola *${customer.name}*, te saludamos cordialmente de *MUCADELE LICORES* 🍷\n\n` +
    `Te compartimos el estado de cuenta de tus compras a crédito a la fecha:\n\n` +
    `📌 *Saldo total pendiente por pagar:* *${formatCOP(customer.total_debt)}*\n` +
    `📋 *Facturas pendientes (${pendingOrders.length}):*\n` +
    `${facturasList || '• Facturas pendientes registradas'}\n\n` +
    `Medios de pago para transferencia:\n` +
    `• Nequi / Daviplata: 301 515 3867\n` +
    `• Bancolombia: Cta Ahorros 123-456789-00\n\n` +
    `Por favor envíanos el comprobante por este medio una vez realizado el pago. ¡Muchas gracias por tu preferencia!`
  );
}

function buildLoyaltyMessage(customer) {
  return (
    `Hola *${customer.name}*, te saludamos de *MUCADELE LICORES* 🍷\n\n` +
    `Queremos agradecerte por ser uno de nuestros clientes preferenciales con nosotros. ¿En qué podemos servirte hoy? ` +
    `Recuerda que tenemos licores nacionales e importados y domicilios rápidos en Santa Marta al WhatsApp +57 301 515 3867. 🛵💨`
  );
}

async function fetchCustomers() {
  customersContainer.innerHTML = `<p style="text-align:center;color:var(--muted);padding:2rem 0;">Cargando clientes y cartera en vivo...</p>`;
  try {
    const res = await fetch('/api/admin/customers');
    if (!res.ok) {
      if (res.status === 401) {
        window.location.href = '/login?next=/clientes';
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error al obtener clientes');

    allCustomers = data.customers || [];
    const kpis = data.kpis || {};

    // Actualizar KPIs
    kpiTotalCustomers.textContent = kpis.total_customers || 0;
    kpiFrequentCustomers.textContent = kpis.frequent_customers || 0;
    kpiDebtorsCount.textContent = kpis.debtors_count || 0;
    kpiTotalDebt.textContent = formatCOP(kpis.total_debt || 0);

    // Contadores en filtros
    countAllSpan.textContent = allCustomers.length;
    countDebtorsSpan.textContent = allCustomers.filter((c) => c.total_debt > 0).length;
    countFrequentSpan.textContent = allCustomers.filter((c) => c.total_orders >= 2).length;

    renderCustomersList();
  } catch (err) {
    customersContainer.innerHTML = `
      <div style="background:#FEE2E2;border:1px solid #FCA5A5;color:#991B1B;padding:1rem;border-radius:10px;text-align:center;">
        Error al cargar la información: ${escapeHTML(err.message)}
      </div>
    `;
  }
}

function renderCustomersList() {
  let filtered = [...allCustomers];

  // Aplicar filtro de tab
  if (activeFilter === 'debtors') {
    filtered = filtered.filter((c) => c.total_debt > 0);
  } else if (activeFilter === 'frequent') {
    filtered = filtered.filter((c) => c.total_orders >= 2);
  }

  // Aplicar buscador
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const doc = (c.doc || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || doc.includes(q);
    });
  }

  if (filtered.length === 0) {
    customersContainer.innerHTML = `
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:3rem 1rem;text-align:center;color:var(--muted);">
        <span style="font-size:2rem;display:block;margin-bottom:0.5rem;">🔍</span>
        No se encontraron clientes con los filtros aplicados.
      </div>
    `;
    return;
  }

  customersContainer.innerHTML = filtered
    .map((c) => {
      const hasDebt = c.total_debt > 0;
      const waNumber = normalizeWhatsAppPhone(c.cleanPhone || c.phone || (String(c.doc || '').length >= 10 ? c.doc : ''));
      const waText = hasDebt ? buildCreditCollectionMessage(c) : buildLoyaltyMessage(c);
      const waUrl = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
        : `https://wa.me/?text=${encodeURIComponent(waText)}`;

      const pendingOrders = c.orders.filter((o) => o.payment_method === 'credito' && o.payment_status === 'pending');

      return `
      <article class="customer-card ${hasDebt ? 'has-debt' : ''}" data-customer-id="${escapeHTML(c.id)}">
        <div class="customer-card-header">
          <div class="customer-meta">
            <h3>
              ${escapeHTML(c.name)}
              <span class="badge ${escapeHTML(c.tierBadge)}">${escapeHTML(c.tier)}</span>
              ${hasDebt ? '<span class="badge" style="background:#FEE2E2;color:#991B1B;border:1px solid #FCA5A5;">DEUDOR</span>' : ''}
            </h3>
            <div class="customer-subtext">
              <span>📞 ${escapeHTML(c.phone || 'Sin teléfono')}</span>
              ${c.doc ? `<span>🪪 Doc: ${escapeHTML(c.doc)}</span>` : ''}
              ${c.address ? `<span>📍 ${escapeHTML(c.address)}</span>` : ''}
            </div>
          </div>

          <div class="customer-actions">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa" title="${hasDebt ? 'Enviar cobro formal por WhatsApp' : 'Contactar por WhatsApp'}">
              📲 ${hasDebt ? 'Cobrar WhatsApp' : 'WhatsApp'}
            </a>
            ${
              hasDebt
                ? `
              <button type="button" class="btn-settle open-settle-btn" data-customer-id="${escapeHTML(c.id)}">
                💵 Liquidar Deuda
              </button>
            `
                : ''
            }
            <button type="button" class="btn-details toggle-orders-btn" data-customer-id="${escapeHTML(c.id)}">
              📜 Historial (${c.total_orders})
            </button>
          </div>
        </div>

        <div class="customer-stats-grid">
          <div class="stat-item">
            <span class="stat-label">Total Facturado</span>
            <span class="stat-val">${formatCOP(c.total_spent)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Compras Realizadas</span>
            <span class="stat-val">${c.total_orders} pedido(s)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Saldo a Crédito Pendiente</span>
            <span class="stat-val ${hasDebt ? 'stat-val-debt' : ''}">
              ${hasDebt ? formatCOP(c.total_debt) : '$0 (Al día)'}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Última Compra</span>
            <span class="stat-val" style="font-size:0.92rem;">
              ${c.last_order_date ? new Date(c.last_order_date).toLocaleDateString('es-CO') : 'N/A'}
            </span>
          </div>
        </div>

        <!-- Acordeón de órdenes (inicialmente oculto) -->
        <div class="orders-accordion" id="orders-acc-${escapeHTML(c.id)}" hidden>
          <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.35rem;">
            Historial de Facturas y Compras:
          </div>
          ${c.orders
            .map(
              (o) => `
            <div class="order-row">
              <div>
                <strong>#${escapeHTML(o.order_number)}</strong> · 
                <span>${new Date(o.created_at).toLocaleString('es-CO')}</span> · 
                <span style="color:var(--muted);">${escapeHTML(o.payment_method)}</span>
                ${
                  o.items_summary
                    ? `<div style="font-size:0.8rem;color:var(--muted);margin-top:0.2rem;">${escapeHTML(o.items_summary)}</div>`
                    : ''
                }
              </div>
              <div style="display:flex;align-items:center;gap:0.6rem;">
                <span class="${o.payment_status === 'pending' ? 'order-pending-badge' : 'order-paid-badge'}">
                  ${o.payment_status === 'pending' ? 'PENDIENTE' : 'PAGADO'}
                </span>
                <strong style="font-size:1rem;">${formatCOP(o.total)}</strong>
                ${
                  o.payment_method === 'credito' && o.payment_status === 'pending'
                    ? `<button type="button" class="btn-outline single-settle-btn" data-order-number="${escapeHTML(o.order_number)}" data-total="${o.total}" style="height:32px;font-size:0.78rem;border-color:var(--action);color:var(--action);padding:0 0.6rem;">Saldar ✓</button>`
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </article>
    `;
    })
    .join('');
}

// Búsqueda en vivo
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderCustomersList();
});

// Pestañas de filtro
document.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-filter]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter');
    renderCustomersList();
  });
});

refreshBtn.addEventListener('click', () => {
  fetchCustomers();
});

// Interacciones dentro de las tarjetas
customersContainer.addEventListener('click', async (e) => {
  // Toggle Historial
  const toggleBtn = e.target.closest('.toggle-orders-btn');
  if (toggleBtn) {
    const custId = toggleBtn.getAttribute('data-customer-id');
    const acc = document.getElementById(`orders-acc-${custId}`);
    if (acc) {
      acc.hidden = !acc.hidden;
      toggleBtn.textContent = acc.hidden
        ? `📜 Historial (${allCustomers.find((c) => c.id === custId)?.total_orders || 0})`
        : `▲ Ocultar Historial`;
    }
    return;
  }

  // Abrir Modal de Liquidación de Cliente
  const settleBtn = e.target.closest('.open-settle-btn');
  if (settleBtn) {
    const custId = settleBtn.getAttribute('data-customer-id');
    const cust = allCustomers.find((c) => c.id === custId);
    if (!cust) return;
    openSettleModal(cust);
    return;
  }

  // Liquidar factura individual directa
  const singleBtn = e.target.closest('.single-settle-btn');
  if (singleBtn) {
    const orderNum = singleBtn.getAttribute('data-order-number');
    const tot = singleBtn.getAttribute('data-total');
    if (!confirm(`¿Confirmar recepción del pago por ${formatCOP(tot)} para la factura #${orderNum}?`)) {
      return;
    }
    await settleOrder(orderNum, 'efectivo', 'Pago individual registrado en Clientes');
  }
});

function openSettleModal(cust) {
  const pendingOrders = cust.orders.filter(
    (o) => o.payment_method === 'credito' && o.payment_status === 'pending'
  );

  settleContent.innerHTML = `
    <div style="background:var(--surface);padding:0.85rem;border-radius:10px;">
      <strong style="font-size:1.1rem;display:block;">${escapeHTML(cust.name)}</strong>
      <span style="font-size:0.85rem;color:var(--muted);">Deuda total pendiente:</span>
      <span style="font-size:1.35rem;font-weight:800;color:var(--danger);display:block;">${formatCOP(cust.total_debt)}</span>
    </div>

    <div>
      <label style="font-size:0.85rem;font-weight:700;display:block;margin-bottom:0.4rem;">
        Facturas por liquidar (${pendingOrders.length}):
      </label>
      <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:180px;overflow-y:auto;">
        ${pendingOrders
          .map(
            (o) => `
          <label style="display:flex;justify-content:space-between;align-items:center;background:#FFF;border:1px solid var(--border);border-radius:8px;padding:0.6rem;cursor:pointer;">
            <span>
              <input type="checkbox" class="settle-check" value="${escapeHTML(o.order_number)}" checked>
              <strong>#${escapeHTML(o.order_number)}</strong>
              <span style="font-size:0.8rem;color:var(--muted);">(${new Date(o.created_at).toLocaleDateString('es-CO')})</span>
            </span>
            <strong>${formatCOP(o.total)}</strong>
          </label>
        `
          )
          .join('')}
      </div>
    </div>

    <div>
      <label for="settle-method-select" style="font-size:0.85rem;font-weight:700;display:block;margin-bottom:0.4rem;">
        Método de pago recibido:
      </label>
      <select id="settle-method-select" style="width:100%;height:44px;border:1px solid var(--border);border-radius:8px;padding:0 0.75rem;font-family:inherit;font-size:0.95rem;">
        <option value="efectivo">💵 Efectivo (Recibido en caja)</option>
        <option value="transferencia">🏛️ Transferencia Bancaria / Nequi / Daviplata</option>
        <option value="tarjeta_debito">💳 Tarjeta Débito (Datáfono)</option>
        <option value="tarjeta_credito">💳 Tarjeta de Crédito (Datáfono)</option>
        <option value="otros">⚙️ Otro método</option>
      </select>
    </div>

    <div>
      <label for="settle-notes-input" style="font-size:0.85rem;font-weight:700;display:block;margin-bottom:0.4rem;">
        Notas o comprobante (Opcional):
      </label>
      <input type="text" id="settle-notes-input" placeholder="Ej: Transferencia Nequi M123456" style="width:100%;height:40px;border:1px solid var(--border);border-radius:8px;padding:0 0.75rem;font-family:inherit;font-size:0.9rem;">
    </div>

    <div style="display:flex;gap:0.75rem;margin-top:0.5rem;">
      <button type="button" id="confirm-settle-all-btn" class="btn-settle" style="flex:1;justify-content:center;height:46px;">
        Confirmar y Registrar Pago ✓
      </button>
    </div>
  `;

  settleDialog.showModal();

  document.getElementById('confirm-settle-all-btn').onclick = async () => {
    const checkedBoxes = Array.from(settleContent.querySelectorAll('.settle-check:checked'));
    if (checkedBoxes.length === 0) {
      alert('Seleccione al menos una factura para liquidar.');
      return;
    }
    const method = document.getElementById('settle-method-select').value;
    const notes = document.getElementById('settle-notes-input').value.trim();

    const orderNumbers = checkedBoxes.map((cb) => cb.value);

    settleContent.innerHTML = `<p style="text-align:center;padding:2rem 0;color:var(--muted);">Procesando pagos en la base de datos D1...</p>`;

    for (const ordNum of orderNumbers) {
      await settleOrder(ordNum, method, notes, false);
    }

    settleDialog.close();
    await fetchCustomers();
  };
}

closeSettleBtn.addEventListener('click', () => settleDialog.close());

async function settleOrder(orderNumber, paidMethod, notes = '', autoReload = true) {
  try {
    const res = await fetch('/api/order', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber,
        paymentStatus: 'paid',
        paidMethod,
        notes,
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error al actualizar orden');

    if (autoReload) {
      await fetchCustomers();
    }
  } catch (err) {
    alert(`Error al saldar factura #${orderNumber}: ${err.message}`);
  }
}

// Iniciar al cargar
fetchCustomers();
