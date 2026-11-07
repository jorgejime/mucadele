import { CATALOG as INITIAL_CATALOG } from '/catalog.js';

export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  if (/^(https?:\/\/|\/)/i.test(u)) return escapeHTML(u);
  return '';
}

const DELIVERY_FEE = 6000;
const formatCOP = (value) => `$${Number(value || 0).toLocaleString('es-CO')}`;

let catalogData = INITIAL_CATALOG.map((item) => ({ ...item, stock: item.stock ?? 24, active: true }));
let activeCat = 'todos';
let searchText = '';

// --- 1. MÚLTIPLES HOJAS DE VENTA EN EL POS (PERSISTENCIA LOCAL) ---
const STORAGE_TABS_KEY = 'mucadele_pos_multi_tabs';
const STORAGE_ACTIVE_TAB_KEY = 'mucadele_pos_active_tab_id';
const STORAGE_SHIFT_KEY = 'mucadele_pos_shift_sales';

let shiftSales = JSON.parse(localStorage.getItem(STORAGE_SHIFT_KEY) || '[]');

function getInitialTabs() {
  try {
    const saved = localStorage.getItem(STORAGE_TABS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [createTabObject(1)];
}

function createTabObject(num) {
  return {
    id: `tab-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    number: num,
    name: `Venta ${num}`,
    saleMode: 'pos_counter',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    carrierId: '',
    ticket: [],
    discountType: 'none', // 'none' | 'percent' | 'amount'
    discountValue: 0,
    discountReason: '',
  };
}

let tabs = getInitialTabs();
let activeTabId = localStorage.getItem(STORAGE_ACTIVE_TAB_KEY) || (tabs[0] ? tabs[0].id : null);
if (!tabs.find((t) => t.id === activeTabId)) {
  activeTabId = tabs[0]?.id || null;
}

function saveTabsState() {
  try {
    localStorage.setItem(STORAGE_TABS_KEY, JSON.stringify(tabs));
    localStorage.setItem(STORAGE_ACTIVE_TAB_KEY, activeTabId || '');
  } catch {}
}

function getActiveTab() {
  let tab = tabs.find((t) => t.id === activeTabId);
  if (!tab) {
    if (tabs.length === 0) {
      tab = createTabObject(1);
      tabs.push(tab);
    } else {
      tab = tabs[0];
    }
    activeTabId = tab.id;
    saveTabsState();
  }
  return tab;
}

// Elementos del DOM
const posTabsList = document.getElementById('pos-tabs-list');
const posNewTabBtn = document.getElementById('pos-new-tab-btn');

const posGrid = document.getElementById('pos-grid');
const posTicketList = document.getElementById('pos-ticket-list');
const posSubtotal = document.getElementById('pos-subtotal');
const posDeliveryLabel = document.getElementById('pos-delivery-label');
const posDeliveryFee = document.getElementById('pos-delivery-fee');
const posTotal = document.getElementById('pos-total');
const posSubmitBtn = document.getElementById('pos-submit-btn');
const posSubmitLabel = document.getElementById('pos-submit-label');
const posSubmitAmount = document.getElementById('pos-submit-amount');

const posCustomerName = document.getElementById('pos-customer-name');
const posCustomerPhone = document.getElementById('pos-customer-phone');
const posCustomerAddress = document.getElementById('pos-customer-address');
const posCarrierSelect = document.getElementById('pos-carrier-select');
const posDeliveryFields = document.getElementById('pos-delivery-fields');

// Modal Pagar Factura
const paymentModal = document.getElementById('payment-modal');
const payModalTotalDisplay = document.getElementById('pay-modal-total-display');
const paymentMethodDetails = document.getElementById('payment-method-details');
const closePaymentModalBtn = document.getElementById('close-payment-modal-btn');
const cancelPaymentModalBtn = document.getElementById('cancel-payment-modal-btn');

// Diálogos auxiliares
const receiptDialog = document.getElementById('receipt-dialog');
const receiptContent = document.getElementById('receipt-content');
const ordersDialog = document.getElementById('orders-dialog');
const liveOrdersContainer = document.getElementById('live-orders-container');
const shiftCountBadge = document.getElementById('shift-count-badge');

// Sub-pestañas de Arqueo
const diagTabArqueoBtn = document.getElementById('diag-tab-arqueo-btn');
const diagTabCreditosBtn = document.getElementById('diag-tab-creditos-btn');
const diagTabShipdayBtn = document.getElementById('diag-tab-shipday-btn');
const diagViewArqueo = document.getElementById('diag-view-arqueo');
const diagViewCreditos = document.getElementById('diag-view-creditos');
const diagViewShipday = document.getElementById('diag-view-shipday');
const creditsListContainer = document.getElementById('credits-list-container');
const diagCreditosBadge = document.getElementById('diag-creditos-badge');
const totalCarteraBadge = document.getElementById('total-cartera-badge');
const arqueoBreakdownTbody = document.getElementById('arqueo-breakdown-tbody');

// Estado interno del modal de pago activo
let activePaymentMethod = 'efectivo';
let activeTendered = 0;
let activeSplitState = {
  efectivo: 0,
  transferencia: 0,
  transferencia_ref: '',
  tarjeta_credito: 0,
  tarjeta_debito: 0,
  otros: 0,
  otros_concept: '',
};
let activeCreditState = {
  customerName: '',
  customerDoc: '',
  dueDate: '',
  notes: '',
};
let activeTransferRef = '';
let activeOtherState = {
  concept: '',
  notes: '',
};

// --- RENDER DE PESTAÑAS (HOJAS SIMULTÁNEAS) ---
function renderTabs() {
  if (!posTabsList) return;
  posTabsList.innerHTML = tabs
    .map((tab) => {
      const isActive = tab.id === activeTabId;
      const tabSubtotal = (tab.ticket || []).reduce((acc, i) => acc + i.price * i.quantity, 0);
      const tabFee = tab.ticket.length > 0 && tab.saleMode === 'delivery' ? DELIVERY_FEE : 0;
      const tabTotal = tabSubtotal + tabFee;
      const label = (tab.customerName || '').trim() || tab.name;

      return `
        <button type="button" class="pos-sale-tab ${isActive ? 'active' : ''}" data-tab-id="${escapeHTML(tab.id)}">
          <span class="tab-indicator"></span>
          <span class="tab-label">${escapeHTML(label)}</span>
          <span class="tab-total">${formatCOP(tabTotal)}</span>
          <span class="tab-close-btn" title="Cancelar esta venta" data-close-tab="${escapeHTML(tab.id)}">&times;</span>
        </button>
      `;
    })
    .join('');
}

function switchTab(targetId) {
  if (!targetId || targetId === activeTabId) return;
  const target = tabs.find((t) => t.id === targetId);
  if (!target) return;

  activeTabId = targetId;
  saveTabsState();
  syncActiveTabToForm();
  renderTabs();
  renderPOSCatalog();
  renderPOSTicket();
}

function addNewTab() {
  const maxNum = tabs.reduce((max, t) => Math.max(max, t.number || 1), 0);
  const newTab = createTabObject(maxNum + 1);
  tabs.push(newTab);
  activeTabId = newTab.id;
  saveTabsState();
  syncActiveTabToForm();
  renderTabs();
  renderPOSCatalog();
  renderPOSTicket();
}

function closeTab(tabId) {
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) return;

  const hasItems = (tab.ticket || []).length > 0 || (tab.customerName || '').trim();
  if (hasItems) {
    const ok = confirm(`¿Deseas cancelar "${tab.customerName || tab.name}"? Se perderán los productos agregados a esta venta.`);
    if (!ok) return;
  }

  const idx = tabs.findIndex((t) => t.id === tabId);
  tabs.splice(idx, 1);

  if (tabs.length === 0) {
    const clean = createTabObject(1);
    tabs.push(clean);
    activeTabId = clean.id;
  } else if (activeTabId === tabId) {
    const nextIdx = Math.max(0, idx - 1);
    activeTabId = tabs[nextIdx].id;
  }

  saveTabsState();
  syncActiveTabToForm();
  renderTabs();
  renderPOSCatalog();
  renderPOSTicket();
}

function syncActiveTabToForm() {
  const tab = getActiveTab();
  if (posCustomerName) posCustomerName.value = tab.customerName || '';
  if (posCustomerPhone) posCustomerPhone.value = tab.customerPhone || '';
  if (posCustomerAddress) posCustomerAddress.value = tab.customerAddress || '';
  if (posCarrierSelect && tab.carrierId) posCarrierSelect.value = tab.carrierId;

  document.querySelectorAll('.pos-mode-tab').forEach((b) => {
    const m = b.getAttribute('data-sale-mode');
    b.setAttribute('aria-pressed', String(m === tab.saleMode));
  });
}

// --- TOTALES Y CÁLCULOS ---
function getTicketTotal() {
  const tab = getActiveTab();
  const subtotal = (tab.ticket || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = tab.ticket.length > 0 && tab.saleMode === 'delivery' ? DELIVERY_FEE : 0;

  let discountAmount = 0;
  const dType = tab.discountType || 'none';
  const dVal = Number(tab.discountValue) || 0;
  if (dType === 'percent' && dVal > 0) {
    discountAmount = Math.round((subtotal * Math.min(100, dVal)) / 100);
  } else if (dType === 'amount' && dVal > 0) {
    discountAmount = Math.min(subtotal, dVal);
  }

  const total = Math.max(0, subtotal - discountAmount + fee);
  return {
    subtotal,
    fee,
    discountAmount,
    discountType: dType,
    discountValue: dVal,
    discountReason: tab.discountReason || '',
    total,
  };
}

function getTicketQty(id) {
  const tab = getActiveTab();
  const found = (tab.ticket || []).find((i) => i.id === id);
  return found ? found.quantity : 0;
}

function updateTicketItem(productId, delta) {
  const tab = getActiveTab();
  const product = catalogData.find((p) => p.id === productId);
  if (!product) return;
  const maxStock = Number(product.stock ?? 99);
  if (maxStock <= 0 && delta > 0) {
    alert(`El producto "${product.name}" está agotado en inventario (Stock: 0).`);
    return;
  }

  const idx = tab.ticket.findIndex((i) => i.id === productId);
  if (idx === -1 && delta > 0) {
    tab.ticket.push({ ...product, quantity: 1 });
  } else if (idx !== -1) {
    const nextQty = tab.ticket[idx].quantity + delta;
    if (delta > 0 && nextQty > maxStock) {
      alert(`Solo quedan ${maxStock} unidades de "${product.name}" en inventario.`);
      return;
    }
    tab.ticket[idx].quantity = nextQty;
    if (tab.ticket[idx].quantity <= 0) {
      tab.ticket.splice(idx, 1);
    }
  }

  saveTabsState();
  renderTabs();
  renderPOSCatalog();
  renderPOSTicket();
}

// --- RENDER DE CATÁLOGO ---
function renderPOSCatalog() {
  const filtered = catalogData.filter((item) => {
    const matchCat = activeCat === 'todos' || item.category === activeCat;
    const q = searchText.trim().toLowerCase();
    const matchQ = !q || item.name.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  posGrid.innerHTML = filtered
    .map((item) => {
      const qty = getTicketQty(item.id);
      const stock = Number(item.stock ?? 24);
      const isOut = stock <= 0;
      const stockColor = isOut ? '#D92D20' : stock <= 5 ? '#D97706' : 'var(--muted)';

      return `
        <button type="button" class="pos-item-btn" data-add-id="${escapeHTML(item.id)}" style="${
          isOut ? 'opacity:0.5;cursor:not-allowed;' : ''
        }">
          ${qty > 0 ? `<span class="pos-item-qty-badge">${qty}</span>` : ''}
          <img class="pos-item-img" src="${sanitizeUrl(item.imageUrl)}" alt="${escapeHTML(item.name)}" loading="lazy">
          <div>
            <p class="pos-item-price">${formatCOP(item.price)}</p>
            <p class="pos-item-name">${escapeHTML(item.name)}</p>
            <p class="pos-item-pres">${escapeHTML(item.presentation)} · <strong style="color:${stockColor};">${
              isOut ? 'AGOTADO' : `Stock: ${stock}`
            }</strong></p>
          </div>
        </button>
      `;
    })
    .join('');
}

// --- RENDER DE TICKET Y CUENTA ---
function renderPOSTicket() {
  const tab = getActiveTab();
  const { subtotal, fee, discountAmount, discountType, discountValue, discountReason, total } = getTicketTotal();

  if (tab.saleMode === 'pos_counter') {
    if (posDeliveryFields) posDeliveryFields.hidden = true;
    if (posCustomerPhone) posCustomerPhone.required = false;
    if (posCustomerAddress) posCustomerAddress.required = false;
    if (posCustomerName) posCustomerName.placeholder = 'Cliente Mostrador (Opcional)';
    if (posDeliveryLabel) posDeliveryLabel.textContent = 'Entrega en mostrador';
    if (posDeliveryFee) posDeliveryFee.textContent = '$0 (Sin domicilio)';
    if (posSubmitLabel) posSubmitLabel.textContent = 'Cobrar en mostrador';
  } else {
    if (posDeliveryFields) posDeliveryFields.hidden = false;
    if (posCustomerPhone) posCustomerPhone.required = true;
    if (posCustomerAddress) posCustomerAddress.required = true;
    if (posCustomerName) posCustomerName.placeholder = 'Nombre del cliente (Domicilio)';
    if (posDeliveryLabel) posDeliveryLabel.textContent = 'Domicilio Shipday';
    if (posDeliveryFee) posDeliveryFee.textContent = formatCOP(fee);
    if (posSubmitLabel) posSubmitLabel.textContent = 'Despachar motorizado';
  }

  if (posSubtotal) posSubtotal.textContent = formatCOP(subtotal);
  if (posTotal) posTotal.textContent = formatCOP(total);
  if (posSubmitAmount) posSubmitAmount.textContent = formatCOP(total);
  if (shiftCountBadge) shiftCountBadge.textContent = String(shiftSales.length);

  // Fila de Descuento
  const posDiscountRow = document.getElementById('pos-discount-row');
  const posDiscountLabel = document.getElementById('pos-discount-label');
  const posDiscountAmount = document.getElementById('pos-discount-amount');
  const removeDiscountBtn = document.getElementById('remove-discount-btn');

  if (discountAmount > 0) {
    if (posDiscountRow) posDiscountRow.hidden = false;
    if (posDiscountLabel) {
      const desc = discountType === 'percent' ? `${discountValue}%` : formatCOP(discountValue);
      const reason = discountReason ? ` · ${discountReason}` : '';
      posDiscountLabel.textContent = `Descuento (${desc}${reason})`;
    }
    if (posDiscountAmount) posDiscountAmount.textContent = `-${formatCOP(discountAmount)}`;
    if (removeDiscountBtn) removeDiscountBtn.hidden = false;
  } else {
    if (posDiscountRow) posDiscountRow.hidden = true;
    if (removeDiscountBtn) removeDiscountBtn.hidden = true;
  }

  if (tab.ticket.length === 0) {
    posTicketList.innerHTML = `<p style="margin:0.5rem 0;color:var(--muted);font-size:0.92rem;text-align:center;">Toque cualquier producto a la izquierda para agregarlo a esta venta.</p>`;
    if (posSubmitBtn) posSubmitBtn.disabled = true;
    return;
  }

  if (posSubmitBtn) posSubmitBtn.disabled = false;
  posTicketList.innerHTML = tab.ticket
    .map(
      (item) => `
      <div class="pos-ticket-row">
        <div style="min-width:0;flex:1;">
          <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(item.name)}</div>
          <div style="color:var(--muted);font-size:0.84rem;font-weight:600;">${formatCOP(item.price * item.quantity)}</div>
        </div>
        <div class="pos-step">
          <button type="button" data-ticket-step="${escapeHTML(item.id)}" data-delta="-1">−</button>
          <span style="min-width:22px;text-align:center;font-weight:800;">${item.quantity}</span>
          <button type="button" data-ticket-step="${escapeHTML(item.id)}" data-delta="1">+</button>
        </div>
      </div>
    `
    )
    .join('');
}

// --- 2. MODAL PAGAR FACTURA (OPCIONES DE PAGO) ---
function openPaymentModal() {
  const { total } = getTicketTotal();
  const tab = getActiveTab();
  if (tab.ticket.length === 0 || total <= 0) return;

  payModalTotalDisplay.textContent = formatCOP(total);
  activePaymentMethod = 'efectivo';
  activeTendered = total;
  activeTransferRef = '';
  activeSplitState = {
    efectivo: total,
    transferencia: 0,
    transferencia_ref: '',
    tarjeta_credito: 0,
    tarjeta_debito: 0,
    otros: 0,
    otros_concept: '',
  };
  activeCreditState = {
    customerName: tab.customerName || '',
    customerDoc: '',
    dueDate: '',
    notes: '',
  };
  activeOtherState = {
    concept: '',
    notes: '',
  };

  updateActiveMethodCard();
  renderPaymentMethodDetails();
  paymentModal.showModal();
}

function updateActiveMethodCard() {
  document.querySelectorAll('.pay-method-card').forEach((card) => {
    const m = card.getAttribute('data-method');
    card.classList.toggle('active', m === activePaymentMethod);
  });
}

function renderPaymentMethodDetails() {
  const { total } = getTicketTotal();
  const method = activePaymentMethod;

  if (method === 'efectivo') {
    const change = activeTendered > total ? activeTendered - total : 0;
    paymentMethodDetails.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 class="pay-sub-title">💵 Pago en Efectivo</h4>
        <span class="pay-desc-note">Calculadora de cambio rápido</span>
      </div>
      <div class="cash-bills">
        <button type="button" class="bill-btn" data-pay-bill="exact">Exacto</button>
        <button type="button" class="bill-btn" data-pay-bill="50000">$50k</button>
        <button type="button" class="bill-btn" data-pay-bill="100000">$100k</button>
        <button type="button" class="bill-btn" data-pay-bill="200000">$200k</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;align-items:center;">
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--muted);display:block;margin-bottom:0.25rem;">Efectivo recibido ($):</label>
          <input type="number" id="modal-cash-tendered" class="split-input" style="width:100%;" value="${activeTendered}" min="${total}" step="500">
        </div>
        <div style="background:var(--bg);padding:0.6rem 0.8rem;border-radius:10px;border:1px solid var(--border);">
          <span style="font-size:0.8rem;color:var(--muted);display:block;">Cambio a devolver:</span>
          <strong id="modal-cash-change" style="font-size:1.25rem;color:var(--action);">${formatCOP(change)}</strong>
        </div>
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn">
        Cobrar ${formatCOP(total)} en Efectivo
      </button>
    `;
    bindEfectivoEvents(total);
  } else if (method === 'tarjeta_credito') {
    paymentMethodDetails.innerHTML = `
      <h4 class="pay-sub-title">💳 Pago con Tarjeta de Crédito</h4>
      <p class="pay-desc-note">Procesar el cobro en el datáfono físico por el valor total de la factura.</p>
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:0.85rem;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;">Total a debitar en datáfono:</span>
        <strong style="font-size:1.3rem;">${formatCOP(total)}</strong>
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn">
        Confirmar Pago con Tarjeta de Crédito
      </button>
    `;
    bindDirectConfirm();
  } else if (method === 'tarjeta_debito') {
    paymentMethodDetails.innerHTML = `
      <h4 class="pay-sub-title">💳 Pago con Tarjeta Débito</h4>
      <p class="pay-desc-note">Procesar en el datáfono con tarjeta débito (chip o contactless).</p>
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:0.85rem;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;">Total a debitar en datáfono:</span>
        <strong style="font-size:1.3rem;">${formatCOP(total)}</strong>
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn">
        Confirmar Pago con Tarjeta Débito
      </button>
    `;
    bindDirectConfirm();
  } else if (method === 'transferencia') {
    paymentMethodDetails.innerHTML = `
      <h4 class="pay-sub-title">🏛️ Transferencia Bancaria / Nequi / Daviplata</h4>
      <p class="pay-desc-note">Verifique la recepción del dinero en la app del negocio antes de entregar los productos.</p>
      <div>
        <label style="font-size:0.8rem;font-weight:700;color:var(--muted);display:block;margin-bottom:0.25rem;">
          Número de comprobante / Referencia (Opcional):
        </label>
        <input type="text" id="modal-transfer-ref" class="split-input" style="width:100%;" placeholder="Ej: M123456 o últimos 4 dígitos" value="${escapeHTML(activeTransferRef)}">
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn">
        Confirmar Transferencia (${formatCOP(total)})
      </button>
    `;
    const refInput = document.getElementById('modal-transfer-ref');
    refInput?.addEventListener('input', (e) => {
      activeTransferRef = e.target.value.trim();
    });
    bindDirectConfirm();
  } else if (method === 'combinado') {
    renderCombinadoBuilder(total);
  } else if (method === 'credito') {
    const tab = getActiveTab();
    paymentMethodDetails.innerHTML = `
      <h4 class="pay-sub-title">📋 Venta A CRÉDITO (Cuenta por Cobrar)</h4>
      <div class="credit-notice">
        <strong>⚠️ Atención:</strong> Esta venta quedará registrada como cuenta por cobrar pendiente a nombre del cliente. <strong>No ingresará como dinero recaudado en la caja</strong> de este turno.
      </div>
      <div style="display:grid;gap:0.65rem;">
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--text);display:block;margin-bottom:0.25rem;">
            Nombre completo del cliente <span style="color:var(--danger);">*</span>:
          </label>
          <input type="text" id="modal-credit-name" class="split-input" style="width:100%;" placeholder="Nombre de quien asume la deuda" value="${escapeHTML(activeCreditState.customerName || tab.customerName || '')}" required>
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--text);display:block;margin-bottom:0.25rem;">
            Cédula / NIT o Celular del cliente <span style="color:var(--danger);">*</span>:
          </label>
          <input type="text" id="modal-credit-doc" class="split-input" style="width:100%;" placeholder="Documento o teléfono para identificar su cuenta" value="${escapeHTML(activeCreditState.customerDoc || tab.customerPhone || '')}" required>
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--muted);display:block;margin-bottom:0.25rem;">
            Fecha pactada de pago / Observación (Opcional):
          </label>
          <input type="text" id="modal-credit-notes" class="split-input" style="width:100%;" placeholder="Ej: Paga el viernes / Quincena" value="${escapeHTML(activeCreditState.notes || '')}">
        </div>
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn" style="background-color:#C2410C;">
        Registrar Venta A CRÉDITO (${formatCOP(total)})
      </button>
    `;
    bindCreditEvents();
  } else if (method === 'otros') {
    paymentMethodDetails.innerHTML = `
      <h4 class="pay-sub-title">⚙️ Otros Métodos de Pago</h4>
      <p class="pay-desc-note">Bonos de consumo, vales corporativos, cortesías o intercambios.</p>
      <div style="display:grid;gap:0.65rem;">
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--text);display:block;margin-bottom:0.25rem;">
            Concepto o Nombre del método <span style="color:var(--danger);">*</span>:
          </label>
          <input type="text" id="modal-other-concept" class="split-input" style="width:100%;" placeholder="Ej: Bono Sodexo, Vale VIP, Consumo Socios..." value="${escapeHTML(activeOtherState.concept)}" required>
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:700;color:var(--muted);display:block;margin-bottom:0.25rem;">
            Observación adicional (Opcional):
          </label>
          <input type="text" id="modal-other-notes" class="split-input" style="width:100%;" placeholder="Detalle o autorización" value="${escapeHTML(activeOtherState.notes)}">
        </div>
      </div>
      <button type="button" id="confirm-pay-btn" class="pay-confirm-btn">
        Confirmar Pago con Otro Método (${formatCOP(total)})
      </button>
    `;
    bindOtherEvents();
  }

  // Desplazamiento suave para garantizar que el panel de acción esté 100% visible en pantallas móviles
  setTimeout(() => {
    paymentMethodDetails?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 40);
}

// Binders de eventos en panel de pago
function bindEfectivoEvents(total) {
  const input = document.getElementById('modal-cash-tendered');
  const changeEl = document.getElementById('modal-cash-change');
  const confirmBtn = document.getElementById('confirm-pay-btn');

  function update() {
    const val = Number(input.value || 0);
    activeTendered = val;
    const diff = val >= total ? val - total : 0;
    if (changeEl) changeEl.textContent = formatCOP(diff);
  }

  input?.addEventListener('input', update);

  document.querySelectorAll('[data-pay-bill]').forEach((b) => {
    b.addEventListener('click', () => {
      const bill = b.getAttribute('data-pay-bill');
      input.value = bill === 'exact' ? total : Number(bill);
      update();
    });
  });

  confirmBtn?.addEventListener('click', executeOrderSubmission);
}

function bindDirectConfirm() {
  document.getElementById('confirm-pay-btn')?.addEventListener('click', executeOrderSubmission);
}

function bindCreditEvents() {
  const nameInput = document.getElementById('modal-credit-name');
  const docInput = document.getElementById('modal-credit-doc');
  const notesInput = document.getElementById('modal-credit-notes');

  nameInput?.addEventListener('input', (e) => (activeCreditState.customerName = e.target.value));
  docInput?.addEventListener('input', (e) => (activeCreditState.customerDoc = e.target.value));
  notesInput?.addEventListener('input', (e) => (activeCreditState.notes = e.target.value));

  document.getElementById('confirm-pay-btn')?.addEventListener('click', () => {
    const name = (nameInput?.value || '').trim();
    const doc = (docInput?.value || '').trim();
    if (!name || !doc) {
      alert('Para registrar una venta A CRÉDITO es obligatorio ingresar el Nombre y el Documento/Teléfono del cliente.');
      return;
    }
    activeCreditState.customerName = name;
    activeCreditState.customerDoc = doc;
    activeCreditState.notes = (notesInput?.value || '').trim();
    executeOrderSubmission();
  });
}

function bindOtherEvents() {
  const conceptInput = document.getElementById('modal-other-concept');
  const notesInput = document.getElementById('modal-other-notes');

  conceptInput?.addEventListener('input', (e) => (activeOtherState.concept = e.target.value));
  notesInput?.addEventListener('input', (e) => (activeOtherState.notes = e.target.value));

  document.getElementById('confirm-pay-btn')?.addEventListener('click', () => {
    const concept = (conceptInput?.value || '').trim();
    if (!concept) {
      alert('Por favor especifique el concepto del método de pago.');
      return;
    }
    activeOtherState.concept = concept;
    activeOtherState.notes = (notesInput?.value || '').trim();
    executeOrderSubmission();
  });
}

// Constructor y Validador de Pago Combinado
function renderCombinadoBuilder(total) {
  const s = activeSplitState;
  const currentSum =
    (Number(s.efectivo) || 0) +
    (Number(s.transferencia) || 0) +
    (Number(s.tarjeta_credito) || 0) +
    (Number(s.tarjeta_debito) || 0) +
    (Number(s.otros) || 0);

  const diff = total - currentSum;
  const isExact = diff === 0;

  paymentMethodDetails.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h4 class="pay-sub-title">🔀 Desglose de Pago Combinado</h4>
      <span class="pay-desc-note">Asigne el valor exacto para cada método</span>
    </div>

    <div class="split-builder">
      <div class="split-row">
        <span class="split-label">💵 Efectivo:</span>
        <input type="number" id="split-efectivo" class="split-input" placeholder="0" min="0" step="500" value="${s.efectivo || ''}">
      </div>

      <div class="split-row">
        <span class="split-label">🏛️ Transferencia:</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
          <input type="number" id="split-transferencia" class="split-input" placeholder="Monto ($)" min="0" step="500" value="${s.transferencia || ''}">
          <input type="text" id="split-transferencia-ref" class="split-input" placeholder="Ref/Comprobante" value="${escapeHTML(s.transferencia_ref || '')}">
        </div>
      </div>

      <div class="split-row">
        <span class="split-label">💳 Tarjeta Crédito:</span>
        <input type="number" id="split-tarjeta-credito" class="split-input" placeholder="0" min="0" step="500" value="${s.tarjeta_credito || ''}">
      </div>

      <div class="split-row">
        <span class="split-label">💳 Tarjeta Débito:</span>
        <input type="number" id="split-tarjeta-debito" class="split-input" placeholder="0" min="0" step="500" value="${s.tarjeta_debito || ''}">
      </div>

      <div class="split-row">
        <span class="split-label">⚙️ Otro medio:</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
          <input type="number" id="split-otros" class="split-input" placeholder="Monto ($)" min="0" step="500" value="${s.otros || ''}">
          <input type="text" id="split-otros-concept" class="split-input" placeholder="Concepto (ej. Bono)" value="${escapeHTML(s.otros_concept || '')}">
        </div>
      </div>
    </div>

    <div class="split-summary-box">
      <div>
        <span style="color:var(--muted);font-size:0.8rem;display:block;">Total Asignado:</span>
        <strong>${formatCOP(currentSum)}</strong> de <strong>${formatCOP(total)}</strong>
      </div>
      <div>
        <span class="split-alert ${isExact ? 'ok' : 'warn'}">
          ${isExact ? '✓ Montos cuadrados exactamente' : diff > 0 ? `⚠️ Faltan ${formatCOP(diff)}` : `⚠️ Sobran ${formatCOP(Math.abs(diff))}`}
        </span>
      </div>
    </div>

    <button type="button" id="confirm-pay-btn" class="pay-confirm-btn" ${!isExact ? 'disabled' : ''}>
      Confirmar Pago Combinado (${formatCOP(total)})
    </button>
  `;

  // Bind inputs de combinado
  const fields = [
    { id: 'split-efectivo', key: 'efectivo', isNum: true },
    { id: 'split-transferencia', key: 'transferencia', isNum: true },
    { id: 'split-transferencia-ref', key: 'transferencia_ref', isNum: false },
    { id: 'split-tarjeta-credito', key: 'tarjeta_credito', isNum: true },
    { id: 'split-tarjeta-debito', key: 'tarjeta_debito', isNum: true },
    { id: 'split-otros', key: 'otros', isNum: true },
    { id: 'split-otros-concept', key: 'otros_concept', isNum: false },
  ];

  fields.forEach(({ id, key, isNum }) => {
    const el = document.getElementById(id);
    el?.addEventListener('input', (e) => {
      s[key] = isNum ? Number(e.target.value || 0) : e.target.value.trim();
      renderCombinadoBuilder(total);
    });
  });

  document.getElementById('confirm-pay-btn')?.addEventListener('click', () => {
    if (!isExact) return;
    executeOrderSubmission();
  });
}

// Click en selector de método en el grid
document.querySelectorAll('.pay-method-card').forEach((card) => {
  card.addEventListener('click', () => {
    activePaymentMethod = card.getAttribute('data-method');
    updateActiveMethodCard();
    renderPaymentMethodDetails();
  });
});

// Botones de cancelar / cerrar modal
closePaymentModalBtn?.addEventListener('click', () => paymentModal.close());
cancelPaymentModalBtn?.addEventListener('click', () => paymentModal.close());

// --- 3. EJECUCIÓN Y ENVÍO DE LA VENTA A PRODUCCIÓN (D1) ---
async function executeOrderSubmission() {
  const tab = getActiveTab();
  if (tab.ticket.length === 0) return;

  const { subtotal, fee, discountAmount, discountType, discountValue, discountReason, total } = getTicketTotal();
  const customerName =
    activePaymentMethod === 'credito'
      ? activeCreditState.customerName
      : posCustomerName.value.trim() || tab.customerName.trim() || 'Cliente Mostrador';
  const customerPhone =
    activePaymentMethod === 'credito'
      ? activeCreditState.customerDoc
      : posCustomerPhone.value.trim() || tab.customerPhone.trim() || '3015153867';
  const customerAddress =
    tab.saleMode === 'pos_counter'
      ? 'Venta en Mostrador · Calle 11 # 24-36'
      : posCustomerAddress.value.trim() || tab.customerAddress.trim() || 'Santa Marta';

  const selectedCarrierId = posCarrierSelect?.value ? Number(posCarrierSelect.value) : null;

  // Construir detalles de pago enriquecidos
  let paymentDetails = {};
  let customerDoc = '';

  if (activePaymentMethod === 'efectivo') {
    paymentDetails = {
      tendered: activeTendered,
      change: activeTendered > total ? activeTendered - total : 0,
    };
  } else if (activePaymentMethod === 'transferencia') {
    paymentDetails = {
      reference: activeTransferRef || 'Sin referencia',
    };
  } else if (activePaymentMethod === 'credito') {
    customerDoc = activeCreditState.customerDoc;
    paymentDetails = {
      customerDoc: activeCreditState.customerDoc,
      customerName: activeCreditState.customerName,
      dueDate: activeCreditState.dueDate || null,
      notes: activeCreditState.notes || '',
    };
  } else if (activePaymentMethod === 'combinado') {
    const s = activeSplitState;
    const splitArr = [];
    if (s.efectivo > 0) splitArr.push({ method: 'efectivo', amount: s.efectivo });
    if (s.transferencia > 0) splitArr.push({ method: 'transferencia', amount: s.transferencia, reference: s.transferencia_ref || '' });
    if (s.tarjeta_credito > 0) splitArr.push({ method: 'tarjeta_credito', amount: s.tarjeta_credito });
    if (s.tarjeta_debito > 0) splitArr.push({ method: 'tarjeta_debito', amount: s.tarjeta_debito });
    if (s.otros > 0) splitArr.push({ method: 'otros', amount: s.otros, concept: s.otros_concept || 'Varios' });

    paymentDetails = {
      split: splitArr,
    };
  } else if (activePaymentMethod === 'otros') {
    paymentDetails = {
      concept: activeOtherState.concept,
      notes: activeOtherState.notes,
    };
  }

  // Integrar Descuento Autorizado en Payment Details
  if (discountAmount > 0) {
    paymentDetails.discount = {
      type: discountType,
      value: discountValue,
      amount: discountAmount,
      reason: discountReason || 'Descuento autorizado',
    };
  }

  const confirmBtn = document.getElementById('confirm-pay-btn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span>Procesando venta en base de datos...</span>';
  }

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: tab.saleMode, // 'pos_counter' o 'delivery'
        customerName,
        customerPhone,
        customerAddress,
        customerDoc,
        paymentMethod: activePaymentMethod,
        paymentStatus: activePaymentMethod === 'credito' ? 'pending' : 'paid',
        paymentDetails,
        autoAssignDriver: tab.saleMode === 'delivery',
        carrierId: selectedCarrierId,
        deliveryFee: fee,
        discountAmount,
        discountDetails: paymentDetails.discount || null,
        skipShipday: false,
        items: tab.ticket.map((i) => ({
          id: i.id,
          name: i.name,
          presentation: i.presentation,
          price: i.price,
          quantity: i.quantity,
        })),
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Error al registrar la venta en Cloudflare D1.');
    }

    const saleRecord = {
      orderNumber: data.orderNumber,
      timestamp: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      saleMode: tab.saleMode,
      customerName,
      customerPhone,
      customerAddress,
      customerDoc,
      paymentMethod: data.paymentMethod || activePaymentMethod,
      paymentStatus: data.paymentStatus || (activePaymentMethod === 'credito' ? 'pending' : 'paid'),
      paymentDetails,
      subtotal,
      fee,
      discountAmount,
      discountDetails: paymentDetails.discount || null,
      total,
      assignedCarrierName: data.assignedCarrierName || null,
      trackingLink: data.trackingLink || null,
      items: [...tab.ticket],
    };

    shiftSales.unshift(saleRecord);
    localStorage.setItem(STORAGE_SHIFT_KEY, JSON.stringify(shiftSales));

    // Cerrar modal de pago
    paymentModal.close();

    // Mostrar tirilla térmica
    showReceiptModal(saleRecord);

    // Cerrar esta hoja de venta y pasar a la siguiente hoja o resetear a hoja 1
    const currentTabId = tab.id;
    const tabIdx = tabs.findIndex((t) => t.id === currentTabId);
    tabs.splice(tabIdx, 1);

    if (tabs.length === 0) {
      const freshTab = createTabObject(1);
      tabs.push(freshTab);
      activeTabId = freshTab.id;
    } else {
      const nextIdx = Math.max(0, tabIdx - 1);
      activeTabId = tabs[nextIdx].id;
    }

    saveTabsState();
    syncActiveTabToForm();
    await syncPOSCatalogAndCarriers();
    renderTabs();
    renderPOSCatalog();
    renderPOSTicket();
  } catch (err) {
    alert(err.message);
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
    }
  }
}

// Botón de Cobro principal en el POS (Abre el Modal Pagar Factura)
posSubmitBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openPaymentModal();
});

// Mobile Dock botón de cobrar
document.getElementById('pos-jump-to-register')?.addEventListener('click', () => {
  const { total } = getTicketTotal();
  if (total > 0 && window.innerWidth >= 960) {
    openPaymentModal();
  }
});

// --- HELPERS DE WHATSAPP PARA CRÉDITOS Y COBRANZA ---
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

function buildCreditWhatsAppText(order) {
  const itemsText = (order.items || [])
    .map((i) => `• ${i.quantity}x ${i.name} - ${formatCOP(i.price * i.quantity)}`)
    .join('\n');

  return (
    `🧾 *MUCADELE LICORES - COMPROBANTE DE CRÉDITO*\n` +
    `📍 Calle 11 # 24-36, Santa Marta\n` +
    `📞 WhatsApp: +57 301 515 3867\n\n` +
    `Estimado(a) *${order.customerName || 'Cliente'}*, confirmamos el registro de su compra a crédito:\n\n` +
    `📋 *Factura:* #${order.orderNumber}\n` +
    `📅 *Fecha:* ${order.timestamp || new Date().toLocaleString('es-CO')}\n` +
    (order.customerDoc ? `🪪 *Doc / Identificación:* ${order.customerDoc}\n` : '') +
    `💳 *Método:* A CRÉDITO (Cuenta por cobrar)\n` +
    `⏳ *Estado:* PENDIENTE DE PAGO\n\n` +
    `🛍️ *Detalle de productos:*\n` +
    `${itemsText || '• Productos registrados en el punto de venta'}\n\n` +
    (order.discountAmount ? `🏷️ *Descuento:* -${formatCOP(order.discountAmount)}${order.discountDetails?.reason ? ` (${order.discountDetails.reason})` : ''}\n` : '') +
    (order.fee ? `🛵 *Domicilio:* ${formatCOP(order.fee)}\n` : '') +
    `💰 *TOTAL POR COBRAR:* *${formatCOP(order.total)}*\n\n` +
    `📌 *Cuentas disponibles para transferencia:*\n` +
    `• Nequi / Daviplata: 301 515 3867\n` +
    `• Bancolombia: Cta Ahorros 123-456789-00\n\n` +
    `Por favor envíanos soporte de pago por este chat una vez realizado. ¡Muchas gracias por tu preferencia!`
  );
}

function buildReminderWhatsAppText(customerName, totalDebt, orders) {
  const ordList = (orders || [])
    .map((o) => `• Factura #${o.order_number} (${formatCOP(o.total)})`)
    .join('\n');

  return (
    `Hola *${customerName || 'Cliente'}*, te saludamos de *MUCADELE LICORES* 🍷\n\n` +
    `Te compartimos un resumen de tu estado de cuenta a crédito a la fecha:\n\n` +
    `📌 *Saldo total pendiente:* *${formatCOP(totalDebt)}*\n` +
    `📋 *Facturas adeudadas (${orders ? orders.length : 1}):*\n` +
    `${ordList || '• Facturas pendientes registradas'}\n\n` +
    `Medios de pago para transferencia:\n` +
    `• Nequi / Daviplata: 301 515 3867\n` +
    `• Bancolombia: Cta Ahorros 123-456789-00\n\n` +
    `Por favor confírmanos el comprobante por este medio al realizar tu pago. ¡Muchas gracias por tu confianza! 🙏`
  );
}

// --- 4. MODAL DE RECIBO / TIRILLA TÉRMICA 80MM ---
function showReceiptModal(sale) {
  let payLabel = 'Efectivo';
  if (sale.paymentMethod === 'tarjeta_credito') payLabel = 'Tarjeta de Crédito';
  else if (sale.paymentMethod === 'tarjeta_debito') payLabel = 'Tarjeta Débito';
  else if (sale.paymentMethod === 'transferencia') {
    payLabel = `Transferencia ${sale.paymentDetails?.reference ? `[Ref: ${sale.paymentDetails.reference}]` : ''}`;
  } else if (sale.paymentMethod === 'combinado') {
    const parts = (sale.paymentDetails?.split || [])
      .map((p) => `${p.method.replace('_', ' ')}: ${formatCOP(p.amount)}`)
      .join(', ');
    payLabel = `Combinado (${parts})`;
  } else if (sale.paymentMethod === 'credito') {
    payLabel = `A CRÉDITO [PENDIENTE] · Doc: ${sale.customerDoc || sale.customerPhone}`;
  } else if (sale.paymentMethod === 'otros') {
    payLabel = `Otros: ${sale.paymentDetails?.concept || ''}`;
  }

  const rawPhone = sale.customerPhone || (String(sale.customerDoc || '').replace(/\D/g, '').length >= 10 ? sale.customerDoc : '');
  const waTarget = normalizeWhatsAppPhone(rawPhone);
  const waMessage = buildCreditWhatsAppText(sale);
  const waHref = waTarget
    ? `https://wa.me/${waTarget}?text=${encodeURIComponent(waMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  const trackingUrl = sanitizeUrl(sale.trackingLink);
  receiptContent.innerHTML = `
    <div style="font-family:monospace;font-size:0.92rem;line-height:1.45;border:1px dashed var(--border);padding:1rem;border-radius:12px;">
      <div style="text-align:center;margin-bottom:0.75rem;">
        <img src="/assets/logo-mucadele.png" alt="Mucadele Licores" style="height:44px;width:auto;object-fit:contain;margin-bottom:6px;display:inline-block;">
        <br>
        <strong style="font-size:1.1rem;">MUCADELE LICORES</strong><br>
        Calle 11 # 24-36, Santa Marta<br>
        Tel: +57 301 515 3867<br>
        <strong>${escapeHTML(sale.orderNumber)}</strong> · ${escapeHTML(sale.timestamp)}
      </div>
      <hr style="border:none;border-top:1px dashed #999;margin:0.5rem 0;">
      <div>
        <strong>Modalidad:</strong> ${sale.saleMode === 'pos_counter' ? 'VENTA EN LOCAL (SIN DOMICILIO)' : 'DOMICILIO SHIPDAY'}<br>
        <strong>Cliente:</strong> ${escapeHTML(sale.customerName)}<br>
        ${sale.customerDoc ? `<strong>Doc/NIT:</strong> ${escapeHTML(sale.customerDoc)}<br>` : ''}
        ${sale.customerPhone ? `<strong>Tel:</strong> ${escapeHTML(sale.customerPhone)}<br>` : ''}
        ${sale.saleMode === 'delivery' ? `<strong>Destino:</strong> ${escapeHTML(sale.customerAddress)}<br>` : ''}
        ${sale.assignedCarrierName ? `<strong>Motorizado:</strong> ${escapeHTML(sale.assignedCarrierName)}<br>` : ''}
        <strong>Método de Pago:</strong> ${escapeHTML(payLabel)}<br>
        <strong>Estado:</strong> ${sale.paymentStatus === 'pending' ? '<span style="color:#DC2626;font-weight:800;">PENDIENTE POR COBRAR</span>' : 'PAGADO'}
      </div>
      <hr style="border:none;border-top:1px dashed #999;margin:0.5rem 0;">
      <div style="display:grid;gap:0.25rem;">
        ${sale.items
          .map(
            (i) => `
          <div style="display:flex;justify-content:space-between;">
            <span>${escapeHTML(i.quantity)}x ${escapeHTML(i.name)}</span>
            <span>${formatCOP(i.price * i.quantity)}</span>
          </div>
        `
          )
          .join('')}
      </div>
      <hr style="border:none;border-top:1px dashed #999;margin:0.5rem 0;">
      <div style="display:flex;justify-content:space-between;">
        <span>Subtotal:</span><span>${formatCOP(sale.subtotal)}</span>
      </div>
      ${
        sale.discountAmount > 0
          ? `
        <div style="display:flex;justify-content:space-between;color:#DC2626;font-weight:700;">
          <span>Descuento${sale.discountDetails?.reason ? ` (${escapeHTML(sale.discountDetails.reason)})` : ''}:</span>
          <span>-${formatCOP(sale.discountAmount)}</span>
        </div>
      `
          : ''
      }
      <div style="display:flex;justify-content:space-between;">
        <span>Domicilio:</span><span>${formatCOP(sale.fee)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.15rem;margin-top:0.25rem;">
        <span>TOTAL FACTURADO:</span><span>${formatCOP(sale.total)}</span>
      </div>
      ${
        sale.paymentMethod === 'efectivo' && sale.paymentDetails?.tendered
          ? `
        <div style="display:flex;justify-content:space-between;margin-top:0.25rem;">
          <span>Efectivo recibido:</span><span>${formatCOP(sale.paymentDetails.tendered)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;">
          <span>Cambio devuelto:</span><span>${formatCOP(sale.paymentDetails.change)}</span>
        </div>
      `
          : ''
      }
      <div style="text-align:center;margin-top:0.75rem;font-size:0.78rem;">
        +18 Ley 124 de 1994 · Gracias por su compra
      </div>
    </div>

    <div class="no-print" style="display:flex;gap:0.65rem;margin-top:1rem;flex-wrap:wrap;">
      <button type="button" id="print-receipt-btn" class="pos-charge-btn" style="flex:1;justify-content:center;height:48px;">
        🖨️ Imprimir Recibo (80mm)
      </button>
      <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="pos-charge-btn" style="background:#25D366;border-color:#25D366;color:#FFF;flex:1.2;justify-content:center;height:48px;text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;font-weight:700;">
        📲 Enviar Comprobante WhatsApp
      </a>
      ${
        trackingUrl
          ? `<a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="height:48px;display:inline-flex;align-items:center;">Abrir Tracking GPS</a>`
          : ''
      }
    </div>
  `;

  receiptDialog.showModal();
  document.getElementById('print-receipt-btn')?.addEventListener('click', () => {
    window.print();
  });
}

document.getElementById('close-receipt-btn')?.addEventListener('click', () => receiptDialog.close());
document.getElementById('close-orders-btn')?.addEventListener('click', () => ordersDialog.close());

// --- 5. GESTIÓN DE SUB-PESTAÑAS EN EL MODAL DE ARQUEO ---
function switchOrdersDialogView(viewName) {
  [diagTabArqueoBtn, diagTabCreditosBtn, diagTabShipdayBtn].forEach((btn) => {
    const isTarget = btn?.getAttribute('data-diag-view') === viewName;
    btn?.classList.toggle('active', isTarget);
  });

  if (diagViewArqueo) diagViewArqueo.hidden = viewName !== 'arqueo';
  if (diagViewCreditos) diagViewCreditos.hidden = viewName !== 'creditos';
  if (diagViewShipday) diagViewShipday.hidden = viewName !== 'shipday';
}

diagTabArqueoBtn?.addEventListener('click', () => switchOrdersDialogView('arqueo'));
diagTabCreditosBtn?.addEventListener('click', () => switchOrdersDialogView('creditos'));
diagTabShipdayBtn?.addEventListener('click', () => switchOrdersDialogView('shipday'));

// --- 6. CARGA DE ARQUEO EN TIEMPO REAL Y CUENTAS POR COBRAR ---
async function loadOrdersAndKPIs() {
  switchOrdersDialogView('arqueo');
  arqueoBreakdownTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--muted);">Cargando arqueo en vivo desde Cloudflare D1...</td></tr>`;

  try {
    const resp = await fetch('/api/order?list=active');
    const data = await resp.json();
    const dbOrders = data.dbOrders || [];
    const summary = data.summaryByMethod || {};
    const creditsSummary = data.creditsSummary || [];

    // Actualizar KPIs de Arqueo
    const totalFacturado = summary.total_facturado || 0;
    const efectivoCaja = summary.efectivo || 0;
    const tarjetas = (summary.tarjeta_credito || 0) + (summary.tarjeta_debito || 0);
    const transferencias = summary.transferencia || 0;
    const creditoPendiente = summary.credito_pendiente || 0;

    document.getElementById('kpi-total-sales').textContent = formatCOP(totalFacturado);
    document.getElementById('kpi-cash-sales').textContent = formatCOP(efectivoCaja);
    document.getElementById('kpi-card-sales').textContent = formatCOP(tarjetas);
    document.getElementById('kpi-transfer-sales').textContent = formatCOP(transferencias);
    document.getElementById('kpi-credit-sales').textContent = formatCOP(creditoPendiente);

    // Tabla de Desglose
    const rows = [
      { label: '💵 Efectivo (Recaudado en Caja)', count: dbOrders.filter((o) => o.payment_method === 'efectivo').length, total: efectivoCaja },
      { label: '💳 Tarjetas de Crédito', count: dbOrders.filter((o) => o.payment_method === 'tarjeta_credito').length, total: summary.tarjeta_credito || 0 },
      { label: '💳 Tarjetas Débito', count: dbOrders.filter((o) => o.payment_method === 'tarjeta_debito').length, total: summary.tarjeta_debito || 0 },
      { label: '🏛️ Transferencias (Nequi/Daviplata/Banco)', count: dbOrders.filter((o) => o.payment_method === 'transferencia').length, total: transferencias },
      { label: '🔀 Pagos Combinados (Aportes integrados)', count: dbOrders.filter((o) => o.payment_method === 'combinado').length, total: summary.combinado || 0 },
      { label: '⚙️ Otros Métodos', count: dbOrders.filter((o) => o.payment_method === 'otros').length, total: summary.otros || 0 },
      { label: '📋 A CRÉDITO (Cuentas por Cobrar Pendientes)', count: dbOrders.filter((o) => o.payment_method === 'credito' && o.payment_status === 'pending').length, total: creditoPendiente, isCredit: true },
    ];

    arqueoBreakdownTbody.innerHTML = rows
      .map(
        (r) => `
        <tr style="${r.isCredit ? 'background:#FFF7ED;' : ''}">
          <td><strong>${escapeHTML(r.label)}</strong></td>
          <td>${r.count} órdenes</td>
          <td class="amount" style="${r.isCredit ? 'color:var(--danger);' : ''}">${formatCOP(r.total)}</td>
        </tr>
      `
      )
      .join('');

    // Actualizar Pestaña de Cuentas por Cobrar
    if (diagCreditosBadge) diagCreditosBadge.textContent = String(creditsSummary.length);
    if (totalCarteraBadge) totalCarteraBadge.textContent = `Total Cartera: ${formatCOP(creditoPendiente)}`;

    if (creditsSummary.length === 0) {
      creditsListContainer.innerHTML = `<p style="color:var(--muted);text-align:center;padding:1.5rem 0;">🎉 No hay créditos pendientes de cobro.</p>`;
    } else {
      creditsListContainer.innerHTML = creditsSummary
        .map((c) => {
          const rawPhone = c.customer_phone || (String(c.customer_doc || '').replace(/\D/g, '').length >= 10 ? c.customer_doc : '');
          const waPhone = normalizeWhatsAppPhone(rawPhone);
          const reminderMsg = buildReminderWhatsAppText(c.customer_name, c.total_debt, c.orders);
          const waHref = waPhone
            ? `https://wa.me/${waPhone}?text=${encodeURIComponent(reminderMsg)}`
            : `https://wa.me/?text=${encodeURIComponent(reminderMsg)}`;

          return `
          <div class="credit-customer-card">
            <div class="credit-customer-info">
              <h4>${escapeHTML(c.customer_name)}</h4>
              <div style="font-size:0.85rem;color:var(--muted);">
                Doc/Tel: <strong>${escapeHTML(c.customer_doc || c.customer_phone || 'N/A')}</strong> · ${c.orders.length} factura(s) adeudada(s)
              </div>
              <div style="font-size:0.8rem;margin-top:0.25rem;">
                ${c.orders.map((o) => `<span>#${escapeHTML(o.order_number)} (${formatCOP(o.total)})</span>`).join(' · ')}
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.25rem;font-weight:800;color:var(--danger);margin-bottom:0.4rem;">
                ${formatCOP(c.total_debt)}
              </div>
              <div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:flex-end;">
                <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="height:36px;font-size:0.82rem;border-color:#25D366;color:#128C7E;display:inline-flex;align-items:center;gap:0.3rem;text-decoration:none;font-weight:700;">
                  📲 Cobrar WhatsApp
                </a>
                <button type="button" class="btn-outline settle-credit-btn" data-customer="${escapeHTML(c.customer_name)}" data-order-nums="${escapeHTML(c.orders.map((o) => o.order_number).join(','))}" style="height:36px;font-size:0.82rem;border-color:var(--action);color:var(--action);">
                  Cobrar / Marcar Pagado ✓
                </button>
              </div>
            </div>
          </div>
        `;
        })
        .join('');
    }

    // Actualizar Pedidos Shipday
    const shipdayOrders = data.orders || [];
    if (shipdayOrders.length === 0) {
      liveOrdersContainer.innerHTML = `<p style="color:var(--muted);margin:0;">No hay órdenes activas en Shipday en este momento.</p>`;
    } else {
      liveOrdersContainer.innerHTML = shipdayOrders
        .slice(0, 15)
        .map((o) => {
          const isPickupOrCounter =
            String(o.deliveryInstruction || '').includes('SIN DOMICILIO') ||
            String(o.orderNumber || '').startsWith('POS-') ||
            String(o.orderNumber || '').startsWith('RET-');

          return `
            <div style="border:1px solid var(--border);border-radius:12px;padding:0.85rem;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <div>
                <span style="font-size:0.78rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;background:${
                  isPickupOrCounter ? '#E5E5EA' : '#00A844'
                };color:${isPickupOrCounter ? '#111' : '#FFF'};">
                  ${isPickupOrCounter ? 'MOSTRADOR / LOCAL' : 'DOMICILIO'}
                </span>
                <strong style="margin-left:0.4rem;">#${escapeHTML(o.orderNumber)}</strong> · ${escapeHTML(o.customer?.name || 'Cliente')}
                <div style="font-size:0.86rem;color:var(--muted);margin-top:0.25rem;">
                  ${escapeHTML(o.deliveryInstruction || '')}
                </div>
              </div>
              <div style="font-weight:800;font-size:1.05rem;">
                ${formatCOP(o.costing?.totalCost || 0)}
              </div>
            </div>
          `;
        })
        .join('');
    }
  } catch (err) {
    arqueoBreakdownTbody.innerHTML = `<tr><td colspan="3" style="color:var(--danger);">Error cargando arqueo: ${escapeHTML(err.message)}</td></tr>`;
  }
}

// Acción de Cobrar Deuda de Crédito
creditsListContainer?.addEventListener('click', async (event) => {
  const btn = event.target.closest('.settle-credit-btn');
  if (!btn) return;
  const cust = btn.getAttribute('data-customer');
  const orderNums = (btn.getAttribute('data-order-nums') || '').split(',').filter(Boolean);
  if (orderNums.length === 0) return;

  const ok = confirm(`¿Confirmar cobro de las facturas (${orderNums.join(', ')}) del cliente "${cust}"?`);
  if (!ok) return;

  btn.disabled = true;
  btn.textContent = 'Actualizando...';

  try {
    for (const num of orderNums) {
      const resp = await fetch('/api/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: num,
          paymentStatus: 'paid',
          paidMethod: 'efectivo',
          notes: `Cobrado en mostrador el ${new Date().toLocaleDateString('es-CO')}`,
        }),
      });
      if (!resp.ok) {
        throw new Error(`Error actualizando orden #${num}`);
      }
    }
    alert(`Crédito de ${cust} cancelado con éxito.`);
    await loadOrdersAndKPIs();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('open-orders-btn')?.addEventListener('click', () => {
  ordersDialog.showModal();
  loadOrdersAndKPIs();
});

document.getElementById('refresh-shipday-btn')?.addEventListener('click', loadOrdersAndKPIs);

// Exportar CSV
document.getElementById('export-csv-btn')?.addEventListener('click', () => {
  if (shiftSales.length === 0) {
    alert('Aún no hay ventas registradas en el turno local para exportar.');
    return;
  }
  const headers = ['Orden', 'Fecha', 'Modalidad', 'Cliente', 'Doc/NIT', 'Metodo_Pago', 'Estado', 'Subtotal', 'Domicilio', 'Total'];
  const rows = shiftSales.map((s) => [
    s.orderNumber,
    `"${s.timestamp}"`,
    s.saleMode === 'pos_counter' ? 'Mostrador' : 'Domicilio',
    `"${s.customerName}"`,
    `"${s.customerDoc || ''}"`,
    `"${s.paymentMethod}"`,
    `"${s.paymentStatus}"`,
    s.subtotal,
    s.fee,
    s.total,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cierre-caja-mucadele-${Date.now()}.csv`;
  a.click();
});

// --- 7. EVENTOS GENERALES DEL POS ---
posTabsList?.addEventListener('click', (event) => {
  const closeBtn = event.target.closest('[data-close-tab]');
  if (closeBtn) {
    event.stopPropagation();
    closeTab(closeBtn.getAttribute('data-close-tab'));
    return;
  }
  const tabBtn = event.target.closest('[data-tab-id]');
  if (tabBtn) {
    switchTab(tabBtn.getAttribute('data-tab-id'));
  }
});

posNewTabBtn?.addEventListener('click', addNewTab);

posGrid?.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-add-id]');
  if (!btn) return;
  updateTicketItem(btn.getAttribute('data-add-id'), 1);
});

posTicketList?.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-ticket-step]');
  if (!btn) return;
  updateTicketItem(btn.getAttribute('data-ticket-step'), Number(btn.getAttribute('data-delta')));
});

document.getElementById('clear-ticket-btn')?.addEventListener('click', () => {
  const tab = getActiveTab();
  tab.ticket = [];
  saveTabsState();
  renderTabs();
  renderPOSCatalog();
  renderPOSTicket();
});

document.querySelectorAll('.pos-filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pos-filter-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    activeCat = btn.getAttribute('data-cat');
    renderPOSCatalog();
  });
});

document.getElementById('pos-search')?.addEventListener('input', (event) => {
  searchText = event.target.value;
  renderPOSCatalog();
});

document.querySelectorAll('.pos-mode-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = getActiveTab();
    tab.saleMode = btn.getAttribute('data-sale-mode');
    document.querySelectorAll('.pos-mode-tab').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    saveTabsState();
    renderTabs();
    renderPOSTicket();
  });
});

// Sincronización en vivo de campos del cliente hacia la pestaña activa
posCustomerName?.addEventListener('input', (e) => {
  const tab = getActiveTab();
  tab.customerName = e.target.value;
  saveTabsState();
  renderTabs();
});

posCustomerPhone?.addEventListener('input', (e) => {
  const tab = getActiveTab();
  tab.customerPhone = e.target.value;
  saveTabsState();
});

posCustomerAddress?.addEventListener('input', (e) => {
  const tab = getActiveTab();
  tab.customerAddress = e.target.value;
  saveTabsState();
});

posCarrierSelect?.addEventListener('change', (e) => {
  const tab = getActiveTab();
  tab.carrierId = e.target.value;
  saveTabsState();
});

// Sincronización de catálogo y domiciliarios con el servidor
async function syncPOSCatalogAndCarriers() {
  try {
    const resp = await fetch('/api/catalog');
    if (resp.ok) {
      const data = await resp.json();
      if (data.ok && Array.isArray(data.products) && data.products.length > 0) {
        catalogData = data.products;
        renderPOSCatalog();
        renderPOSTicket();
      }
    }
  } catch {}

  try {
    const respC = await fetch('/api/order');
    if (respC.ok) {
      const dataC = await respC.json();
      if (dataC.ok && Array.isArray(dataC.carriers) && posCarrierSelect) {
        const activeCarrierId = getActiveTab().carrierId;
        const opts = dataC.carriers.map(
          (c) =>
            `<option value="${escapeHTML(c.id)}" ${
              activeCarrierId ? String(c.id) === String(activeCarrierId) ? 'selected' : '' : c.isDefault ? 'selected' : ''
            }>Motorizado: ${escapeHTML(c.name)} (${escapeHTML(c.phone)})${
              c.isDefault ? ' · Principal' : ''
            }</option>`
        );
        posCarrierSelect.innerHTML =
          opts.join('') || `<option value="">Motorizado: Asignación Automática</option>`;
      }
    }
  } catch {}
}

// Inicialización de la aplicación
syncActiveTabToForm();
renderTabs();
renderPOSCatalog();
renderPOSTicket();
syncPOSCatalogAndCarriers();

// --- 8. GESTIÓN DE DESCUENTOS EN EL POS ---
const discountDialog = document.getElementById('pos-discount-dialog');
const openDiscountBtn = document.getElementById('open-discount-modal-btn');
const closeDiscountBtn = document.getElementById('close-discount-dialog-btn');
const removeDiscountBtn = document.getElementById('remove-discount-btn');

const discountTabPercent = document.getElementById('discount-tab-percent');
const discountTabAmount = document.getElementById('discount-tab-amount');
const discountPercentSec = document.getElementById('discount-percent-section');
const discountAmountSec = document.getElementById('discount-amount-section');

const discountPercentInput = document.getElementById('discount-percent-input');
const discountAmountInput = document.getElementById('discount-amount-input');
const discountReasonInput = document.getElementById('discount-reason-input');

const discountPreviewAmount = document.getElementById('discount-preview-amount');
const discountPreviewTotal = document.getElementById('discount-preview-total');
const confirmApplyDiscountBtn = document.getElementById('confirm-apply-discount-btn');

let activeDiscountModalMode = 'percent'; // 'percent' | 'amount'

function updateDiscountModalPreview() {
  const tab = getActiveTab();
  const subtotal = (tab.ticket || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = tab.ticket.length > 0 && tab.saleMode === 'delivery' ? DELIVERY_FEE : 0;

  let calculatedDiscount = 0;
  if (activeDiscountModalMode === 'percent') {
    const pVal = Number(discountPercentInput?.value) || 0;
    if (pVal > 0) {
      calculatedDiscount = Math.round((subtotal * Math.min(100, pVal)) / 100);
    }
  } else {
    const aVal = Number(discountAmountInput?.value) || 0;
    if (aVal > 0) {
      calculatedDiscount = Math.min(subtotal, aVal);
    }
  }

  const newTotal = Math.max(0, subtotal - calculatedDiscount + fee);
  if (discountPreviewAmount) discountPreviewAmount.textContent = `-${formatCOP(calculatedDiscount)}`;
  if (discountPreviewTotal) discountPreviewTotal.textContent = formatCOP(newTotal);
}

function openDiscountModal() {
  const tab = getActiveTab();
  if ((tab.ticket || []).length === 0) {
    alert('Agregue productos a la venta antes de aplicar un descuento.');
    return;
  }

  // Pre-llenar con el descuento actual si existe
  if (tab.discountType === 'amount') {
    activeDiscountModalMode = 'amount';
    discountTabAmount?.click();
    if (discountAmountInput) discountAmountInput.value = tab.discountValue || '';
    if (discountPercentInput) discountPercentInput.value = '';
  } else {
    activeDiscountModalMode = 'percent';
    discountTabPercent?.click();
    if (discountPercentInput) discountPercentInput.value = tab.discountValue || '';
    if (discountAmountInput) discountAmountInput.value = '';
  }
  if (discountReasonInput) discountReasonInput.value = tab.discountReason || '';

  updateDiscountModalPreview();
  discountDialog?.showModal();
}

openDiscountBtn?.addEventListener('click', openDiscountModal);
closeDiscountBtn?.addEventListener('click', () => discountDialog?.close());

discountTabPercent?.addEventListener('click', () => {
  activeDiscountModalMode = 'percent';
  discountTabPercent.style.background = 'var(--text)';
  discountTabPercent.style.color = '#FFF';
  discountTabAmount.style.background = 'transparent';
  discountTabAmount.style.color = 'var(--text)';
  if (discountPercentSec) discountPercentSec.hidden = false;
  if (discountAmountSec) discountAmountSec.hidden = true;
  updateDiscountModalPreview();
});

discountTabAmount?.addEventListener('click', () => {
  activeDiscountModalMode = 'amount';
  discountTabAmount.style.background = 'var(--text)';
  discountTabAmount.style.color = '#FFF';
  discountTabPercent.style.background = 'transparent';
  discountTabPercent.style.color = 'var(--text)';
  if (discountPercentSec) discountPercentSec.hidden = true;
  if (discountAmountSec) discountAmountSec.hidden = false;
  updateDiscountModalPreview();
});

// Botones rápidos de porcentaje
document.querySelectorAll('.quick-percent-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (discountPercentInput) {
      discountPercentInput.value = btn.getAttribute('data-val');
      updateDiscountModalPreview();
    }
  });
});

// Botones rápidos de valor
document.querySelectorAll('.quick-amount-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (discountAmountInput) {
      discountAmountInput.value = btn.getAttribute('data-val');
      updateDiscountModalPreview();
    }
  });
});

discountPercentInput?.addEventListener('input', updateDiscountModalPreview);
discountAmountInput?.addEventListener('input', updateDiscountModalPreview);

confirmApplyDiscountBtn?.addEventListener('click', () => {
  const tab = getActiveTab();
  const subtotal = (tab.ticket || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  let val = 0;
  if (activeDiscountModalMode === 'percent') {
    val = Number(discountPercentInput?.value) || 0;
    if (val <= 0 || val > 100) {
      alert('Ingrese un porcentaje de descuento válido (entre 1% y 100%).');
      return;
    }
    tab.discountType = 'percent';
    tab.discountValue = val;
  } else {
    val = Number(discountAmountInput?.value) || 0;
    if (val <= 0) {
      alert('Ingrese un monto de descuento válido en pesos COP.');
      return;
    }
    if (val > subtotal) {
      alert(`El descuento (${formatCOP(val)}) no puede ser mayor al subtotal de la cuenta (${formatCOP(subtotal)}).`);
      return;
    }
    tab.discountType = 'amount';
    tab.discountValue = val;
  }

  tab.discountReason = discountReasonInput?.value.trim() || '';

  saveTabsState();
  renderTabs();
  renderPOSTicket();
  discountDialog?.close();
});

removeDiscountBtn?.addEventListener('click', () => {
  const tab = getActiveTab();
  tab.discountType = 'none';
  tab.discountValue = 0;
  tab.discountReason = '';
  saveTabsState();
  renderTabs();
  renderPOSTicket();
});
