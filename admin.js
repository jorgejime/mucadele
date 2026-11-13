function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  if (/^(https?:\/\/|\/)/i.test(u)) return escapeHTML(u);
  return '';
}

const formatCOP = (value) => `$${Number(value || 0).toLocaleString('es-CO')}`;

let products = [];
let suppliers = [];
let purchaseOrders = [];
let carriers = [];
let dbOrders = [];
let activeShipdayOrders = [];

const productsTbody = document.getElementById('admin-products-tbody');
const searchInput = document.getElementById('admin-search');
const catFilter = document.getElementById('admin-cat-filter');

const productDialog = document.getElementById('product-dialog');
const productForm = document.getElementById('product-form');
const toastEl = document.getElementById('admin-toast');

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2800);
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

// --- Navegación de Pestañas ---
document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab-btn').forEach((b) => b.setAttribute('aria-selected', 'false'));
    btn.setAttribute('aria-selected', 'true');
    const tab = btn.getAttribute('data-tab');
    document.getElementById('tab-inventory').hidden = tab !== 'inventory';
    document.getElementById('tab-suppliers').hidden = tab !== 'suppliers';
    document.getElementById('tab-carriers').hidden = tab !== 'carriers';
    document.getElementById('tab-orders').hidden = tab !== 'orders';
    const tabDian = document.getElementById('tab-dian');
    if (tabDian) {
      tabDian.hidden = tab !== 'dian';
      if (tab === 'dian') loadDianData();
    }
  });
});

// --- Carga de Inventario y Productos ---
async function loadProducts() {
  try {
    const resp = await fetch('/api/catalog?all=1');
    const data = await resp.json();
    if (data.ok && Array.isArray(data.products)) {
      products = data.products;
      updateInventoryKPIs();
      renderProductsTable();
      renderLowStockAlertsBox();
    }
  } catch (err) {
    console.error(err);
  }
}

function updateInventoryKPIs() {
  const totalRefs = products.length;
  const totalUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const totalVal = products.reduce((acc, p) => acc + Number(p.price || 0) * Number(p.stock || 0), 0);
  const lowCount = products.filter((p) => Number(p.stock ?? 0) <= Number(p.min_stock ?? 6)).length;

  document.getElementById('kpi-prod-count').textContent = String(totalRefs);
  document.getElementById('kpi-total-units').textContent = `${totalUnits} uds`;
  document.getElementById('kpi-inventory-value').textContent = formatCOP(totalVal);
  document.getElementById('kpi-low-stock').textContent = `${lowCount} por pedir`;
}

function getCategoryLabel(cat) {
  switch (cat) {
    case 'whisky':
      return 'Whisky';
    case 'aguardiente-ron':
      return 'Aguardiente y Ron';
    case 'cervezas':
      return 'Cervezas';
    default:
      return 'Tequila / Hielo / Otros';
  }
}

function renderSupplierSelectOptions() {
  const selectEl = document.getElementById('prod-supplier');
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML =
    `<option value="">-- Seleccionar proveedor --</option>` +
    suppliers
      .map((s) => `<option value="${escapeHTML(s.id)}">${escapeHTML(s.name)} (${escapeHTML(s.phone)})</option>`)
      .join('');
  if (currentVal) selectEl.value = currentVal;
}

function renderProductsTable() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const cat = catFilter.value;

  const filtered = products.filter((p) => {
    const matchCat = cat === 'todos' || p.category === cat;
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      String(p.supplier_name || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (filtered.length === 0) {
    productsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No se encontraron productos.</td></tr>`;
    return;
  }

  productsTbody.innerHTML = filtered
    .map((p) => {
      const stock = Number(p.stock ?? 0);
      const minStock = Number(p.min_stock ?? 6);
      const reorderQty = Number(p.reorder_qty ?? 12);
      const needsReorder = stock <= minStock;

      let statusBadge = `<span class="status-pill ok">En Stock (${stock})</span>`;
      if (!p.active) {
        statusBadge = `<span class="status-pill out">Oculto en Tienda</span>`;
      } else if (stock <= 0) {
        statusBadge = `<span class="status-pill out">AGOTADO (0 / Mín: ${minStock})</span>`;
      } else if (needsReorder) {
        statusBadge = `<span class="status-pill warn">⚠️ Stock Mínimo (${stock} ≤ ${minStock})</span>`;
      }

      return `
        <tr data-row-id="${escapeHTML(p.id)}">
          <td>
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <img src="${sanitizeUrl(p.imageUrl)}" alt="${escapeHTML(p.name)}" style="width:44px;height:44px;object-fit:contain;border-radius:8px;border:1px solid var(--border);background:#fff;padding:2px;">
              <div>
                <div style="font-weight:800;color:var(--text);">${escapeHTML(p.name)}</div>
                <div style="font-size:0.79rem;color:var(--muted);">
                  ${escapeHTML(p.presentation)} · <strong>${escapeHTML(getCategoryLabel(p.category))}</strong>
                </div>
                <div style="font-size:0.78rem;color:var(--action);font-weight:700;margin-top:0.1rem;">
                  🏭 ${escapeHTML(p.supplier_name || 'Sin proveedor')}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:0.35rem;">
              <input
                type="number"
                class="price-input"
                data-price-id="${escapeHTML(p.id)}"
                value="${escapeHTML(p.price)}"
                min="500"
                step="500"
                aria-label="Precio de ${escapeHTML(p.name)}"
              >
              <button type="button" class="stock-btn" data-save-price="${escapeHTML(p.id)}" title="Guardar nuevo precio">💾</button>
            </div>
          </td>
          <td>
            <div class="stock-control">
              <button type="button" class="stock-btn" data-stock-step="${escapeHTML(p.id)}" data-delta="-1" title="Restar 1">−1</button>
              <input
                type="number"
                class="stock-input"
                data-stock-input="${escapeHTML(p.id)}"
                value="${stock}"
                min="0"
                aria-label="Stock de ${escapeHTML(p.name)}"
              >
              <button type="button" class="stock-btn" data-stock-step="${escapeHTML(p.id)}" data-delta="1" title="Sumar 1">+1</button>
              <button type="button" class="stock-btn" data-stock-step="${escapeHTML(p.id)}" data-delta="6" title="Sumar Six-Pack (+6)">+6</button>
              <button type="button" class="stock-btn" data-stock-step="${escapeHTML(p.id)}" data-delta="12" title="Sumar Caja (+12)">+12</button>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap;">
              <label style="font-size:0.76rem;color:var(--muted);font-weight:700;">
                Mín:
                <input
                  type="number"
                  class="stock-input"
                  style="width:52px;"
                  data-min-stock-id="${escapeHTML(p.id)}"
                  value="${minStock}"
                  min="0"
                  title="Stock mínimo para disparar pedido al proveedor"
                >
              </label>
              <label style="font-size:0.76rem;color:var(--muted);font-weight:700;">
                Pedir:
                <input
                  type="number"
                  class="stock-input"
                  style="width:54px;"
                  data-reorder-qty-id="${escapeHTML(p.id)}"
                  value="${reorderQty}"
                  min="1"
                  title="Cantidad programada a pedir al proveedor"
                >
              </label>
            </div>
          </td>
          <td>
            <div style="display:grid;gap:0.35rem;justify-items:start;">
              ${statusBadge}
              ${
                needsReorder
                  ? `<button type="button" class="stock-btn" data-order-supplier="${escapeHTML(p.id)}" style="background:var(--action);color:#fff;border-color:var(--action);font-size:0.78rem;">📲 Pedir ${reorderQty} uds al Proveedor</button>`
                  : `<button type="button" class="stock-btn" data-order-supplier="${escapeHTML(p.id)}" style="font-size:0.75rem;color:var(--muted);">Pedir (${reorderQty} uds)</button>`
              }
            </div>
          </td>
          <td>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
              <button type="button" class="stock-btn" data-edit-prod="${escapeHTML(p.id)}">Editar</button>
              <button type="button" class="stock-btn" data-toggle-active="${escapeHTML(p.id)}">
                ${p.active ? 'Ocultar' : 'Activar'}
              </button>
              <button type="button" class="stock-btn" data-delete-prod="${escapeHTML(p.id)}" style="color:#D92D20;">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function patchProductQuick(id, patchFields) {
  try {
    const resp = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...patchFields }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      throw new Error(data.error || 'Error actualizando producto');
    }
    const idx = products.findIndex((x) => x.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data.product };
    }
    updateInventoryKPIs();
    renderProductsTable();

    if (Array.isArray(data.autoGeneratedPOs) && data.autoGeneratedPOs.length > 0) {
      const po = data.autoGeneratedPOs[0];
      showToast(`⚠️ Stock en mínimo: Orden automática #${po.poNumber} generada (${po.qty} uds a ${po.supplierName})`);
      await loadSuppliersAndPOs();
    } else {
      showToast('Inventario y regla actualizados');
    }
  } catch (err) {
    alert(err.message);
  }
}

async function createQuickPurchaseOrderForProduct(prod) {
  try {
    const qty = Math.max(1, Number(prod.reorder_qty ?? 12));
    const resp = await fetch('/api/admin/purchase-orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'create',
        supplier_id: prod.supplier_id,
        supplier_name: prod.supplier_name || 'Proveedor General',
        supplier_phone: prod.supplier_phone || '+573015153867',
        items: [
          {
            id: prod.id,
            name: prod.name,
            presentation: prod.presentation,
            current_stock: prod.stock,
            min_stock: prod.min_stock,
            qty,
          },
        ],
      }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error generando pedido al proveedor');
    await loadSuppliersAndPOs();
    showToast(`Orden #${data.poNumber} creada para ${data.supplierName}`);
    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    alert(err.message);
  }
}

productsTbody.addEventListener('click', async (event) => {
  const stepBtn = event.target.closest('[data-stock-step]');
  if (stepBtn) {
    const id = stepBtn.getAttribute('data-stock-step');
    const delta = Number(stepBtn.getAttribute('data-delta'));
    const prod = products.find((x) => x.id === id);
    if (!prod) return;
    const nextStock = Math.max(0, Number(prod.stock || 0) + delta);
    await patchProductQuick(id, { stock: nextStock });
    return;
  }

  const savePriceBtn = event.target.closest('[data-save-price]');
  if (savePriceBtn) {
    const id = savePriceBtn.getAttribute('data-save-price');
    const input = productsTbody.querySelector(`[data-price-id="${id}"]`);
    if (!input) return;
    await patchProductQuick(id, { price: Number(input.value) });
    return;
  }

  const orderSupBtn = event.target.closest('[data-order-supplier]');
  if (orderSupBtn) {
    const id = orderSupBtn.getAttribute('data-order-supplier');
    const prod = products.find((x) => x.id === id);
    if (!prod) return;
    await createQuickPurchaseOrderForProduct(prod);
    return;
  }

  const toggleBtn = event.target.closest('[data-toggle-active]');
  if (toggleBtn) {
    const id = toggleBtn.getAttribute('data-toggle-active');
    const prod = products.find((x) => x.id === id);
    if (!prod) return;
    await patchProductQuick(id, { active: !prod.active });
    return;
  }

  const editBtn = event.target.closest('[data-edit-prod]');
  if (editBtn) {
    const id = editBtn.getAttribute('data-edit-prod');
    const prod = products.find((x) => x.id === id);
    if (!prod) return;
    openProductModal(prod);
    return;
  }

  const delBtn = event.target.closest('[data-delete-prod]');
  if (delBtn) {
    const id = delBtn.getAttribute('data-delete-prod');
    const prod = products.find((x) => x.id === id);
    if (!prod) return;
    if (!confirm(`¿Seguro que desea eliminar "${prod.name}" del catálogo?`)) return;
    try {
      const resp = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo eliminar');
      products = products.filter((x) => x.id !== id);
      updateInventoryKPIs();
      renderProductsTable();
      showToast('Producto eliminado');
    } catch (err) {
      alert(err.message);
    }
  }
});

productsTbody.addEventListener('change', async (event) => {
  const stockInput = event.target.closest('[data-stock-input]');
  if (stockInput) {
    const id = stockInput.getAttribute('data-stock-input');
    const val = Math.max(0, Number(stockInput.value) || 0);
    await patchProductQuick(id, { stock: val });
    return;
  }

  const minStockInput = event.target.closest('[data-min-stock-id]');
  if (minStockInput) {
    const id = minStockInput.getAttribute('data-min-stock-id');
    const val = Math.max(0, Number(minStockInput.value) || 0);
    await patchProductQuick(id, { min_stock: val });
    return;
  }

  const reorderQtyInput = event.target.closest('[data-reorder-qty-id]');
  if (reorderQtyInput) {
    const id = reorderQtyInput.getAttribute('data-reorder-qty-id');
    const val = Math.max(1, Number(reorderQtyInput.value) || 12);
    await patchProductQuick(id, { reorder_qty: val });
  }
});

searchInput.addEventListener('input', renderProductsTable);
catFilter.addEventListener('change', renderProductsTable);

// --- Modal Crear / Editar Producto ---
function openProductModal(prod = null) {
  renderSupplierSelectOptions();
  document.getElementById('product-dialog-title').textContent = prod
    ? `Editar: ${prod.name}`
    : 'Crear Nuevo Producto';
  document.getElementById('prod-id').value = prod ? prod.id : '';
  document.getElementById('prod-name').value = prod ? prod.name : '';
  document.getElementById('prod-presentation').value = prod ? prod.presentation : '750 ml';
  document.getElementById('prod-category').value = prod ? prod.category : 'whisky';
  document.getElementById('prod-price').value = prod ? prod.price : '';
  document.getElementById('prod-stock').value = prod ? prod.stock : 24;
  document.getElementById('prod-supplier').value = prod && prod.supplier_id ? String(prod.supplier_id) : '';
  document.getElementById('prod-min-stock').value = prod ? Number(prod.min_stock ?? 6) : 6;
  document.getElementById('prod-reorder-qty').value = prod ? Number(prod.reorder_qty ?? 12) : 12;
  document.getElementById('prod-image').value = prod ? prod.imageUrl : '';
  document.getElementById('prod-active').checked = prod ? Boolean(prod.active) : true;
  productDialog.showModal();
}

document.getElementById('open-new-product-btn').addEventListener('click', () => openProductModal(null));
document.getElementById('close-product-dialog').addEventListener('click', () => productDialog.close());

document.querySelectorAll('.preset-img-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('prod-image').value = btn.getAttribute('data-img');
  });
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const saveBtn = document.getElementById('save-product-btn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Guardando...';

  try {
    const supplierVal = document.getElementById('prod-supplier').value;
    const payload = {
      id: document.getElementById('prod-id').value.trim(),
      name: document.getElementById('prod-name').value.trim(),
      presentation: document.getElementById('prod-presentation').value.trim(),
      category: document.getElementById('prod-category').value,
      price: Number(document.getElementById('prod-price').value),
      stock: Number(document.getElementById('prod-stock').value),
      supplier_id: supplierVal ? Number(supplierVal) : null,
      min_stock: Number(document.getElementById('prod-min-stock').value),
      reorder_qty: Number(document.getElementById('prod-reorder-qty').value),
      imageUrl: document.getElementById('prod-image').value.trim(),
      active: document.getElementById('prod-active').checked,
    };

    const resp = await fetch('/api/admin/products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error guardando producto');

    productDialog.close();
    await Promise.all([loadProducts(), loadSuppliersAndPOs()]);
    showToast('Producto y regla de reabastecimiento guardados');
  } catch (err) {
    alert(err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar Producto';
  }
});

// --- SECCIÓN 2: PROVEEDORES Y REABASTECIMIENTO PROGRAMADO ---
const suppliersListContainer = document.getElementById('suppliers-list-container');
const purchaseOrdersContainer = document.getElementById('purchase-orders-container');
const lowStockAlertsBox = document.getElementById('low-stock-alerts-box');
const newSupplierForm = document.getElementById('new-supplier-form');

async function loadSuppliersAndPOs() {
  try {
    const resp = await fetch('/api/admin/suppliers', { headers: getAuthHeaders() });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error cargando proveedores');
    suppliers = data.suppliers || [];
    purchaseOrders = data.purchaseOrders || [];
    renderSupplierSelectOptions();
    renderSuppliersList();
    renderPurchaseOrders();
    renderLowStockAlertsBox();
  } catch (err) {
    console.error(err);
  }
}

function renderLowStockAlertsBox() {
  if (!lowStockAlertsBox) return;
  const lowItems = products.filter((p) => Number(p.stock ?? 0) <= Number(p.min_stock ?? 6));
  if (lowItems.length === 0) {
    lowStockAlertsBox.innerHTML = `
      <div style="background:#DCFCE7;border:1px solid #86EFAC;color:#166534;padding:0.85rem 1rem;border-radius:12px;font-size:0.9rem;font-weight:700;">
        ✅ Todo el inventario está por encima del stock mínimo programado. Cuando cualquier producto baje a su límite configurado, aparecerá aquí automáticamente listo para pedir al proveedor.
      </div>
    `;
    return;
  }

  // Agrupar por proveedor
  const bySupplier = new Map();
  for (const item of lowItems) {
    const key = item.supplier_id || 'none';
    if (!bySupplier.has(key)) {
      bySupplier.set(key, {
        supplier_id: item.supplier_id,
        supplier_name: item.supplier_name || 'Proveedor General',
        supplier_phone: item.supplier_phone || '+573015153867',
        items: [],
      });
    }
    bySupplier.get(key).items.push(item);
  }

  lowStockAlertsBox.innerHTML = Array.from(bySupplier.values())
    .map(
      (group) => `
      <div style="background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:12px;padding:1rem;margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
        <div>
          <strong style="color:#92400E;font-size:0.98rem;">⚠️ Alerta de Stock Mínimo · Proveedor: ${escapeHTML(group.supplier_name)}</strong>
          <div style="font-size:0.86rem;color:#78350F;margin-top:0.25rem;">
            ${group.items
              .map(
                (i) =>
                  `<strong>${escapeHTML(i.name)}</strong> (Quedan ${escapeHTML(i.stock)} uds / Mínimo programado: ${escapeHTML(i.min_stock)} → Pedir: <strong>${escapeHTML(i.reorder_qty)} uds</strong>)`
              )
              .join(' · ')}
          </div>
        </div>
        <button
          type="button"
          class="pos-charge-btn"
          style="height:42px;padding:0 1rem;font-size:0.86rem;"
          data-batch-order-supplier="${escapeHTML(group.supplier_id || '')}"
        >
          📲 Pedir Lote a ${escapeHTML(group.supplier_name)}
        </button>
      </div>
    `
    )
    .join('');
}

lowStockAlertsBox?.addEventListener('click', async (event) => {
  const btn = event.target.closest('[data-batch-order-supplier]');
  if (!btn) return;
  const supIdRaw = btn.getAttribute('data-batch-order-supplier');
  const supId = supIdRaw ? Number(supIdRaw) : null;
  const lowItems = products.filter(
    (p) => Number(p.stock ?? 0) <= Number(p.min_stock ?? 6) && (p.supplier_id || null) === supId
  );
  if (lowItems.length === 0) return;

  try {
    const first = lowItems[0];
    const resp = await fetch('/api/admin/purchase-orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'create',
        supplier_id: supId,
        supplier_name: first.supplier_name || 'Proveedor General',
        supplier_phone: first.supplier_phone || '+573015153867',
        items: lowItems.map((i) => ({
          id: i.id,
          name: i.name,
          presentation: i.presentation,
          current_stock: i.stock,
          min_stock: i.min_stock,
          qty: Number(i.reorder_qty ?? 12),
        })),
      }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo crear la orden');
    await loadSuppliersAndPOs();
    showToast(`Orden #${data.poNumber} generada con éxito`);
    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    alert(err.message);
  }
});

function renderPurchaseOrders() {
  if (!purchaseOrdersContainer) return;
  if (purchaseOrders.length === 0) {
    purchaseOrdersContainer.innerHTML = `<p style="color:var(--muted);margin:0;font-size:0.9rem;">No hay órdenes de compra registradas todavía.</p>`;
    return;
  }

  purchaseOrdersContainer.innerHTML = purchaseOrders
    .map((po) => {
      const isPending = po.status === 'enviada';
      const itemsSummary = (po.items || [])
        .map((i) => `<strong>${escapeHTML(i.qty)} uds</strong> de ${escapeHTML(i.name)}`)
        .join(', ');

      const lines = (po.items || [])
        .map((i) => `• *${i.qty} uds* de ${i.name} (${i.presentation || ''})`)
        .join('\n');
      const waText = `Hola *${po.supplier_name}*, te comparto la Orden de Reabastecimiento *#${po.po_number}* de *Mucadele Licores* (Calle 11 # 24-36, Santa Marta):\n\n${lines}\n\nTotal unidades: *${po.total_units}*.`;
      const cleanPhone = String(po.supplier_phone || '573015153867').replace(/\D/g, '');
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

      return `
        <div style="background:var(--bg);border:1.5px solid ${
          isPending ? 'var(--action)' : 'var(--border)'
        };border-radius:12px;padding:0.9rem 1rem;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
              <span class="status-pill ${isPending ? 'warn' : 'ok'}">
                ${isPending ? '⏳ PENDIENTE DE RECIBIR EN BODEGA' : '✅ MERCANCÍA RECIBIDA EN BODEGA'}
              </span>
              <strong>#${escapeHTML(po.po_number)}</strong> · 🏭 ${escapeHTML(po.supplier_name)} (${escapeHTML(po.supplier_phone)})
            </div>
            <div style="font-size:0.88rem;color:var(--text);margin-top:0.3rem;">
              Pedido: ${itemsSummary} (Total: <strong>${escapeHTML(po.total_units)} uds</strong>)
            </div>
            <div style="font-size:0.78rem;color:var(--muted);margin-top:0.15rem;">
              Generada: ${escapeHTML(po.created_at)} ${po.received_at ? `· Recibida: ${escapeHTML(po.received_at)}` : ''}
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <a
              href="${sanitizeUrl(waLink)}"
              target="_blank"
              rel="noopener noreferrer"
              class="stock-btn"
              style="text-decoration:none;display:inline-flex;align-items:center;color:var(--action);border-color:var(--action);"
            >
              📲 Enviar por WhatsApp al Proveedor
            </a>
            ${
              isPending
                ? `<button type="button" class="stock-btn" data-receive-po="${escapeHTML(po.id)}" style="background:var(--text);color:var(--bg);border-color:var(--text);">📥 Recibir Mercancía (+Sumar al Stock)</button>`
                : ''
            }
          </div>
        </div>
      `;
    })
    .join('');
}

purchaseOrdersContainer?.addEventListener('click', async (event) => {
  const receiveBtn = event.target.closest('[data-receive-po]');
  if (!receiveBtn) return;
  const poId = Number(receiveBtn.getAttribute('data-receive-po'));
  if (!confirm('¿Confirmas que llegó esta mercancía al local? Se sumarán las unidades automáticamente al inventario.')) {
    return;
  }
  try {
    const resp = await fetch('/api/admin/purchase-orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'receive', id: poId }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo recibir la orden');
    await Promise.all([loadProducts(), loadSuppliersAndPOs()]);
    showToast('✅ Mercancía sumada automáticamente al inventario');
  } catch (err) {
    alert(err.message);
  }
});

function renderSuppliersList() {
  if (!suppliersListContainer) return;
  if (suppliers.length === 0) {
    suppliersListContainer.innerHTML = `<p style="color:var(--muted);">No hay proveedores registrados.</p>`;
    return;
  }

  suppliersListContainer.innerHTML = suppliers
    .map((s) => {
      const assignedProducts = products.filter((p) => Number(p.supplier_id) === Number(s.id));
      return `
        <div style="border:1px solid var(--border);border-radius:14px;padding:1rem;background:var(--bg);display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <div>
            <strong style="font-size:1.02rem;">🏭 ${escapeHTML(s.name)}</strong>
            <div style="font-size:0.86rem;color:var(--muted);margin-top:0.25rem;">
              Preventista: <strong>${escapeHTML(s.contact_name || 'N/A')}</strong> · WhatsApp: <strong>${escapeHTML(s.phone)}</strong>
            </div>
            <div style="font-size:0.8rem;color:var(--muted);margin-top:0.15rem;">
              Días de entrega: <strong>${escapeHTML(s.delivery_days || 'Lunes a Sábado')}</strong> · Productos asignados: <strong>${assignedProducts.length}</strong>
            </div>
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
            <button type="button" class="stock-btn" data-order-all-supplier="${escapeHTML(s.id)}" style="color:var(--action);border-color:var(--action);">
              📲 Generar Pedido Reposición
            </button>
            <button type="button" class="stock-btn" data-delete-supplier="${escapeHTML(s.id)}" data-name="${escapeHTML(s.name)}" style="color:#D92D20;">
              Eliminar
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

suppliersListContainer?.addEventListener('click', async (event) => {
  const orderAllBtn = event.target.closest('[data-order-all-supplier]');
  if (orderAllBtn) {
    const supId = Number(orderAllBtn.getAttribute('data-order-all-supplier'));
    const sup = suppliers.find((x) => Number(x.id) === supId);
    if (!sup) return;
    const supProds = products.filter((p) => Number(p.supplier_id) === supId);
    if (supProds.length === 0) {
      alert('Este proveedor aún no tiene productos asignados. Asígnaselos desde la pestaña 1 (Editar producto).');
      return;
    }
    // Priorizar los que estén en o bajo stock mínimo; si todos tienen buen stock, pedir la cantidad programada de los que tengan menor stock
    const lowOnes = supProds.filter((p) => Number(p.stock ?? 0) <= Number(p.min_stock ?? 6));
    const targetItems = lowOnes.length > 0 ? lowOnes : supProds.slice(0, 4);

    try {
      const resp = await fetch('/api/admin/purchase-orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'create',
          supplier_id: sup.id,
          supplier_name: sup.name,
          supplier_phone: sup.phone,
          items: targetItems.map((i) => ({
            id: i.id,
            name: i.name,
            presentation: i.presentation,
            current_stock: i.stock,
            min_stock: i.min_stock,
            qty: Number(i.reorder_qty ?? 12),
          })),
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || 'Error creando orden');
      await loadSuppliersAndPOs();
      showToast(`Orden #${data.poNumber} lista para ${sup.name}`);
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert(err.message);
    }
    return;
  }

  const delBtn = event.target.closest('[data-delete-supplier]');
  if (delBtn) {
    const id = delBtn.getAttribute('data-delete-supplier');
    const name = delBtn.getAttribute('data-name');
    if (!confirm(`¿Eliminar al proveedor "${name}"?`)) return;
    try {
      const resp = await fetch(`/api/admin/suppliers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo eliminar');
      await Promise.all([loadProducts(), loadSuppliersAndPOs()]);
      showToast('Proveedor eliminado');
    } catch (err) {
      alert(err.message);
    }
  }
});

newSupplierForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const btn = document.getElementById('save-supplier-btn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  try {
    const payload = {
      name: document.getElementById('supplier-name').value.trim(),
      contact_name: document.getElementById('supplier-contact').value.trim(),
      phone: document.getElementById('supplier-phone').value.trim(),
      delivery_days: document.getElementById('supplier-days').value.trim(),
    };
    const resp = await fetch('/api/admin/suppliers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error registrando proveedor');
    newSupplierForm.reset();
    await loadSuppliersAndPOs();
    showToast(`Proveedor ${payload.name} registrado`);
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar Proveedor';
  }
});

document.getElementById('refresh-suppliers-btn')?.addEventListener('click', () => {
  loadProducts();
  loadSuppliersAndPOs();
});

// --- SECCIÓN 3: DOMICILIARIOS (SHIPDAY) ---
const carriersListContainer = document.getElementById('carriers-list-container');
const newCarrierForm = document.getElementById('new-carrier-form');

async function loadCarriers() {
  carriersListContainer.innerHTML = `<p style="color:var(--muted);">Cargando flota de domiciliarios...</p>`;
  try {
    const resp = await fetch('/api/admin/carriers', { headers: getAuthHeaders() });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error al consultar domiciliarios');
    carriers = data.carriers || [];
    renderCarriersList();
  } catch (err) {
    carriersListContainer.innerHTML = `<p style="color:#D92D20;">${escapeHTML(err.message)}</p>`;
  }
}

function renderCarriersList() {
  if (carriers.length === 0) {
    carriersListContainer.innerHTML = `<p style="color:var(--muted);">No hay domiciliarios registrados.</p>`;
    return;
  }

  carriersListContainer.innerHTML = carriers
    .map(
      (c) => `
      <div style="border:1.5px solid ${
        c.isDefault ? 'var(--action)' : 'var(--border)'
      };border-radius:14px;padding:1rem;background:var(--bg);display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <strong style="font-size:1.05rem;">🏍️ ${escapeHTML(c.name)}</strong>
            ${
              c.isDefault
                ? `<span class="status-pill ok">PRINCIPAL (Auto-Asignación)</span>`
                : `<span class="status-pill" style="background:var(--surface);color:var(--muted);">ID: ${escapeHTML(c.id)}</span>`
            }
          </div>
          <div style="font-size:0.88rem;color:var(--muted);margin-top:0.3rem;">
            Tel: <strong>${escapeHTML(c.phone)}</strong> ${c.email ? `· ${escapeHTML(c.email)}` : ''}
          </div>
        </div>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          ${
            !c.isDefault
              ? `<button type="button" class="stock-btn" data-set-default-carrier="${escapeHTML(c.id)}" data-name="${escapeHTML(c.name)}" data-phone="${escapeHTML(c.phone)}" style="color:var(--action);border-color:var(--action);">Fijar como Principal</button>`
              : ''
          }
          <button type="button" class="stock-btn" data-delete-carrier="${escapeHTML(c.id)}" data-name="${escapeHTML(c.name)}" style="color:#D92D20;">Eliminar</button>
        </div>
      </div>
    `
    )
    .join('');
}

carriersListContainer.addEventListener('click', async (event) => {
  const defBtn = event.target.closest('[data-set-default-carrier]');
  if (defBtn) {
    const carrierId = Number(defBtn.getAttribute('data-set-default-carrier'));
    const name = defBtn.getAttribute('data-name');
    const phone = defBtn.getAttribute('data-phone');
    try {
      const resp = await fetch('/api/admin/carriers', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'set_default', carrierId, name, phone }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo actualizar');
      await loadCarriers();
      showToast(`${name} fijado como domiciliario principal`);
    } catch (err) {
      alert(err.message);
    }
    return;
  }

  const delBtn = event.target.closest('[data-delete-carrier]');
  if (delBtn) {
    const id = delBtn.getAttribute('data-delete-carrier');
    const name = delBtn.getAttribute('data-name');
    if (!confirm(`¿Eliminar al domiciliario "${name}"?`)) return;
    try {
      const resp = await fetch(`/api/admin/carriers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) throw new Error(data.error || 'No se pudo eliminar');
      await loadCarriers();
      showToast('Domiciliario eliminado');
    } catch (err) {
      alert(err.message);
    }
  }
});

newCarrierForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const btn = document.getElementById('create-carrier-btn');
  btn.disabled = true;
  btn.textContent = 'Registrando en Shipday...';

  try {
    const payload = {
      name: document.getElementById('carrier-name').value.trim(),
      phone: document.getElementById('carrier-phone').value.trim(),
      email: document.getElementById('carrier-email').value.trim(),
      isDefault: document.getElementById('carrier-is-default').checked,
    };

    const resp = await fetch('/api/admin/carriers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || 'Error registrando domiciliario');

    newCarrierForm.reset();
    await loadCarriers();
    showToast(`Domiciliario ${payload.name} creado correctamente`);
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar y Sincronizar con Shipday';
  }
});

document.getElementById('refresh-carriers-btn').addEventListener('click', loadCarriers);

// --- SECCIÓN 4: HISTORIAL DE PEDIDOS ---
const adminOrdersList = document.getElementById('admin-orders-list');

let summaryByMethod = {};

async function loadAdminOrders() {
  adminOrdersList.innerHTML = `<p style="color:var(--muted);">Consultando órdenes en Cloudflare D1...</p>`;
  try {
    const resp = await fetch('/api/order?list=active');
    const data = await resp.json();
    activeShipdayOrders = data.orders || [];
    dbOrders = data.dbOrders || [];
    summaryByMethod = data.summaryByMethod || {};
    renderAdminKPIs();
    renderAdminOrders();
  } catch (err) {
    adminOrdersList.innerHTML = `<p style="color:#D92D20;">Error: ${escapeHTML(err.message)}</p>`;
  }
}

function renderAdminKPIs() {
  const tot = summaryByMethod.total_facturado || dbOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const cash = summaryByMethod.efectivo || 0;
  const cards = (summaryByMethod.tarjeta_credito || 0) + (summaryByMethod.tarjeta_debito || 0);
  const transfers = summaryByMethod.transferencia || 0;
  const credits = summaryByMethod.credito_pendiente || 0;

  const elTot = document.getElementById('admin-kpi-total');
  const elCash = document.getElementById('admin-kpi-cash');
  const elCard = document.getElementById('admin-kpi-card');
  const elTransfer = document.getElementById('admin-kpi-transfer');
  const elCredit = document.getElementById('admin-kpi-credit');

  if (elTot) elTot.textContent = formatCOP(tot);
  if (elCash) elCash.textContent = formatCOP(cash);
  if (elCard) elCard.textContent = formatCOP(cards);
  if (elTransfer) elTransfer.textContent = formatCOP(transfers);
  if (elCredit) elCredit.textContent = formatCOP(credits);
}

function getPaymentBadgeHtml(order) {
  const m = (order.payment_method || 'efectivo').toLowerCase();
  const status = (order.payment_status || 'paid').toLowerCase();
  const details = order.payment_details || {};

  if (m === 'efectivo') {
    return `<span class="status-pill ok" style="background:#E6F6ED;color:#00702E;">💵 EFECTIVO</span>`;
  }
  if (m === 'tarjeta_credito') {
    return `<span class="status-pill" style="background:#EFF6FF;color:#1D4ED8;">💳 TARJETA CRÉDITO</span>`;
  }
  if (m === 'tarjeta_debito') {
    return `<span class="status-pill" style="background:#ECFEFF;color:#0E7490;">💳 TARJETA DÉBITO</span>`;
  }
  if (m === 'transferencia') {
    const ref = details.reference ? ` [Ref: ${escapeHTML(details.reference)}]` : '';
    return `<span class="status-pill" style="background:#FAF5FF;color:#6B21A8;">🏛️ TRANSFERENCIA${ref}</span>`;
  }
  if (m === 'combinado') {
    const splitText = (details.split || [])
      .map((p) => `${p.method.replace('_', ' ')}: ${formatCOP(p.amount)}`)
      .join(', ');
    return `<span class="status-pill" style="background:#FEF3C7;color:#92400E;" title="${escapeHTML(splitText)}">🔀 COMBINADO (${escapeHTML(splitText)})</span>`;
  }
  if (m === 'credito') {
    const isPending = status === 'pending';
    return `
      <span class="status-pill" style="background:${isPending ? '#FFF7ED' : '#E6F6ED'};color:${isPending ? '#C2410C' : '#00702E'};">
        📋 A CRÉDITO ${isPending ? '· 🔴 PENDIENTE POR COBRAR' : '· 🟢 PAGADO'}
      </span>
      ${order.customer_doc ? `<span style="font-size:0.75rem;color:var(--muted);margin-left:0.3rem;">Doc: ${escapeHTML(order.customer_doc)}</span>` : ''}
    `;
  }
  return `<span class="status-pill" style="background:#F4F4F5;color:#3F3F46;">⚙️ OTROS: ${escapeHTML(details.concept || m)}</span>`;
}

function renderAdminOrders() {
  if (dbOrders.length === 0 && activeShipdayOrders.length === 0) {
    adminOrdersList.innerHTML = `<p style="color:var(--muted);">No hay pedidos registrados aún.</p>`;
    return;
  }

  const payFilter = document.getElementById('admin-orders-filter-payment')?.value || 'all';
  const statusFilter = document.getElementById('admin-orders-filter-status')?.value || 'all';

  const filtered = dbOrders.filter((o) => {
    const m = (o.payment_method || 'efectivo').toLowerCase();
    const st = (o.payment_status || 'paid').toLowerCase();
    const matchPay = payFilter === 'all' || m === payFilter;
    const matchStatus = statusFilter === 'all' || st === statusFilter;
    return matchPay && matchStatus;
  });

  if (filtered.length === 0) {
    adminOrdersList.innerHTML = `<p style="color:var(--muted);padding:1rem 0;">No hay ventas que coincidan con los filtros seleccionados.</p>`;
    return;
  }

  const rowsHtml = filtered.map((o) => {
    const isLocal = o.order_type === 'pos_counter' || o.order_type === 'pickup';
    const itemsText = (o.items || []).map((i) => `${escapeHTML(i.quantity)}x ${escapeHTML(i.name)}`).join(', ');
    const trackingUrl = sanitizeUrl(o.tracking_link);
    const isPendingCredit = (o.payment_method || '').toLowerCase() === 'credito' && (o.payment_status || '').toLowerCase() === 'pending';

    return `
      <div style="border:1px solid var(--border);border-radius:12px;padding:0.9rem;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;background:${isPendingCredit ? '#FFFDFB' : 'var(--bg)'};">
        <div style="flex:1;min-width:280px;">
          <div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;margin-bottom:0.35rem;">
            <span class="status-pill ${isLocal ? '' : 'ok'}" style="${
              isLocal ? 'background:#E5E5EA;color:#111;' : ''
            }">
              ${o.order_type === 'pos_counter' ? 'MOSTRADOR POS' : o.order_type === 'pickup' ? 'RETIRO LOCAL' : 'DOMICILIO'}
            </span>
            ${getPaymentBadgeHtml(o)}
            <strong style="margin-left:0.3rem;">#${escapeHTML(o.order_number)}</strong>
          </div>

          <div style="font-size:0.92rem;font-weight:700;">
            ${escapeHTML(o.customer_name)} · <span style="font-weight:600;color:var(--muted);">${escapeHTML(o.customer_phone)}</span>
          </div>

          <div style="font-size:0.85rem;color:var(--muted);margin-top:0.25rem;">
            ${itemsText} · Destino: ${escapeHTML(o.customer_address)}
          </div>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:0.15rem;">
            Fecha: ${escapeHTML(o.created_at)} ${o.carrier_name ? `· Motorizado: <strong>${escapeHTML(o.carrier_name)}</strong>` : ''}
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-weight:800;font-size:1.2rem;${isPendingCredit ? 'color:var(--danger);' : ''}">${formatCOP(o.total)}</div>
          ${
            isPendingCredit
              ? `<button type="button" class="btn-outline settle-admin-order-btn" data-order-number="${escapeHTML(o.order_number)}" style="margin-top:0.4rem;height:34px;font-size:0.8rem;color:var(--action);border-color:var(--action);">Marcar Cobrado ✓</button>`
              : ''
          }
          ${
            trackingUrl
              ? `<div style="margin-top:0.25rem;"><a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="font-size:0.8rem;color:var(--action);font-weight:700;">Ver GPS Shipday →</a></div>`
              : ''
          }
        </div>
      </div>
    `;
  });

  adminOrdersList.innerHTML = rowsHtml.join('');
}

// Acción de cobro desde Admin
adminOrdersList?.addEventListener('click', async (event) => {
  const btn = event.target.closest('.settle-admin-order-btn');
  if (!btn) return;
  const num = btn.getAttribute('data-order-number');
  if (!num) return;

  const ok = confirm(`¿Marcar la factura #${num} como pagada?`);
  if (!ok) return;

  btn.disabled = true;
  btn.textContent = 'Actualizando...';

  try {
    const resp = await fetch('/api/order', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: num,
        paymentStatus: 'paid',
        paidMethod: 'efectivo',
        notes: `Cobrado desde panel administrativo el ${new Date().toLocaleDateString('es-CO')}`,
      }),
    });
    if (!resp.ok) throw new Error('Error al actualizar');
    await loadAdminOrders();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('admin-orders-filter-payment')?.addEventListener('change', renderAdminOrders);
document.getElementById('admin-orders-filter-status')?.addEventListener('change', renderAdminOrders);
document.getElementById('refresh-admin-orders-btn')?.addEventListener('click', loadAdminOrders);

document.getElementById('export-admin-orders-btn')?.addEventListener('click', () => {
  if (dbOrders.length === 0) {
    alert('No hay pedidos en el historial para exportar.');
    return;
  }
  const headers = ['Orden', 'Fecha', 'Tipo', 'Cliente', 'Telefono', 'Documento_NIT', 'Metodo_Pago', 'Estado_Pago', 'Detalle_Pago', 'Total', 'Motorizado'];
  const rows = dbOrders.map((o) => [
    o.order_number,
    `"${o.created_at}"`,
    o.order_type,
    `"${o.customer_name}"`,
    `"${o.customer_phone}"`,
    `"${o.customer_doc || ''}"`,
    `"${o.payment_method || 'efectivo'}"`,
    `"${o.payment_status || 'paid'}"`,
    `"${typeof o.payment_details === 'object' ? JSON.stringify(o.payment_details).replace(/"/g, '""') : (o.payment_details || '')}"`,
    o.total,
    `"${o.carrier_name || 'N/A'}"`,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte-ventas-mucadele-${Date.now()}.csv`;
  a.click();
});

async function loadAllAdminData() {
  await Promise.all([loadSuppliersAndPOs(), loadProducts(), loadCarriers(), loadAdminOrders()]);
}

loadAllAdminData();

/* ==========================================================================
   ESCÁNER INTELIGENTE DE FACTURAS CON IA (PDF Y FOTO) -> INVENTARIO D1
   ========================================================================== */

let currentScannedData = null;
let currentInvoiceBase64 = null;
let currentInvoiceMime = null;

function initInvoiceScanner() {
  const toggleBtn = document.getElementById('toggle-invoice-scanner-btn');
  const closeBtn = document.getElementById('close-invoice-scanner-btn');
  const scannerSection = document.getElementById('invoice-scanner-section');
  const fileInput = document.getElementById('invoice-file-input');
  const dropzone = document.getElementById('invoice-dropzone');
  const cameraBtn = document.getElementById('scan-camera-btn');
  const pdfBtn = document.getElementById('scan-pdf-btn');
  const processBtn = document.getElementById('btn-process-invoice-ai');
  const applyBtn = document.getElementById('btn-apply-invoice-stock');
  const cancelBtn = document.getElementById('btn-cancel-invoice-results');

  if (!scannerSection) return;

  toggleBtn?.addEventListener('click', () => {
    scannerSection.classList.toggle('hidden');
    if (!scannerSection.classList.contains('hidden')) {
      scannerSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  closeBtn?.addEventListener('click', () => {
    scannerSection.classList.add('hidden');
  });

  cameraBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (fileInput) {
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment';
      fileInput.click();
    }
  });

  pdfBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (fileInput) {
      fileInput.accept = '.pdf,application/pdf';
      fileInput.removeAttribute('capture');
      fileInput.click();
    }
  });

  dropzone?.addEventListener('click', () => {
    if (fileInput) {
      fileInput.accept = '.pdf,image/png,image/jpeg,image/webp';
      fileInput.removeAttribute('capture');
      fileInput.click();
    }
  });

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-brand-primary', 'bg-brand-primary/5');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-brand-primary', 'bg-brand-primary/5');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-brand-primary', 'bg-brand-primary/5');
    if (e.dataTransfer?.files?.length) {
      handleInvoiceFile(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files?.length) {
      handleInvoiceFile(fileInput.files[0]);
    }
  });

  processBtn?.addEventListener('click', processInvoiceWithAI);
  applyBtn?.addEventListener('click', applyScannedInvoiceToDatabase);
  cancelBtn?.addEventListener('click', resetInvoiceScanner);
}

async function handleInvoiceFile(file) {
  if (!file) return;

  const previewContainer = document.getElementById('invoice-preview-container');
  const previewImg = document.getElementById('invoice-preview-img');
  const fileInfo = document.getElementById('invoice-file-info');
  const processBtn = document.getElementById('btn-process-invoice-ai');
  const resultsContainer = document.getElementById('invoice-results-container');

  resultsContainer?.classList.add('hidden');
  if (processBtn) processBtn.disabled = true;

  fileInfo.textContent = `Cargando archivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`;

  try {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      fileInfo.textContent = `Renderizando PDF: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`;
      const base64Data = await convertPdfToImageBase64(file);
      currentInvoiceBase64 = base64Data;
      currentInvoiceMime = 'image/jpeg';
      previewImg.src = `data:image/jpeg;base64,${base64Data}`;
      previewContainer.classList.remove('hidden');
      fileInfo.textContent = `✓ PDF listo: ${file.name} (Página digitalizada en alta resolución)`;
      if (processBtn) processBtn.disabled = false;
    } else if (file.type.startsWith('image/')) {
      fileInfo.textContent = `Optimizando imagen: ${file.name}...`;
      const base64Data = await optimizeImageFile(file);
      currentInvoiceBase64 = base64Data;
      currentInvoiceMime = 'image/jpeg';
      previewImg.src = `data:image/jpeg;base64,${base64Data}`;
      previewContainer.classList.remove('hidden');
      fileInfo.textContent = `✓ Imagen lista: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      if (processBtn) processBtn.disabled = false;
    } else {
      alert('Formato de archivo no compatible. Por favor suba una foto (.jpg, .png) o un PDF de la factura.');
      fileInfo.textContent = 'Formato no soportado.';
    }
  } catch (err) {
    console.error('Error procesando archivo:', err);
    alert('Error al procesar el archivo: ' + err.message);
    fileInfo.textContent = 'Error al cargar el archivo.';
  }
}

async function convertPdfToImageBase64(file) {
  if (!window.pdfjsLib) {
    throw new Error('La librería PDF.js no está disponible en este momento.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport: viewport }).promise;

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  return dataUrl.split(',')[1];
}

async function optimizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl.split(',')[1]);
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

async function processInvoiceWithAI() {
  if (!currentInvoiceBase64) {
    alert('Primero seleccione o capture una factura en foto o PDF.');
    return;
  }

  const processBtn = document.getElementById('btn-process-invoice-ai');
  const loading = document.getElementById('invoice-scanner-loading');
  const resultsContainer = document.getElementById('invoice-results-container');

  if (processBtn) processBtn.disabled = true;
  loading?.classList.remove('hidden');
  resultsContainer?.classList.add('hidden');

  try {
    const token = localStorage.getItem('mucadele_admin_token') || sessionStorage.getItem('mucadele_admin_token');
    const resp = await fetch('/api/admin/scan-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageBase64: currentInvoiceBase64,
        mimeType: currentInvoiceMime || 'image/jpeg',
      }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      throw new Error(data.error || 'Error al procesar la factura con IA.');
    }

    currentScannedData = data.data;
    renderScannedResults(data.data);
    resultsContainer?.classList.remove('hidden');
    resultsContainer?.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Error en escaneo con IA:', err);
    alert('Error al leer la factura con IA: ' + err.message);
  } finally {
    loading?.classList.add('hidden');
    if (processBtn) processBtn.disabled = false;
  }
}

function renderScannedResults(data) {
  const suppInput = document.getElementById('scanned-supplier-name');
  const invNumberInput = document.getElementById('scanned-invoice-number');
  const invDateInput = document.getElementById('scanned-invoice-date');
  const invTotalInput = document.getElementById('scanned-invoice-total');

  if (suppInput) suppInput.value = data.supplier_name || '';
  if (invNumberInput) invNumberInput.value = data.invoice_number || '';
  if (invDateInput) invDateInput.value = data.invoice_date || new Date().toISOString().split('T')[0];
  if (invTotalInput) invTotalInput.value = data.invoice_total ? Number(data.invoice_total).toLocaleString('es-CO') : '0';

  const tbody = document.getElementById('scanned-items-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-500">No se detectaron ítems en la factura. Puede agregarlos manualmente o intentar con una foto más nítida.</td></tr>`;
    return;
  }

  items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-border/50 hover:bg-surface-elevated/40 text-xs transition-colors';
    tr.dataset.index = index;

    const matchedProd = products.find((p) => p.id === item.product_id);
    const currentStock = matchedProd ? Number(matchedProd.stock || 0) : Number(item.current_stock || 0);
    const addedQty = Number(item.quantity || 0);
    const newStock = currentStock + addedQty;

    tr.innerHTML = `
      <td class="p-2.5 font-medium text-text-primary">
        <div class="font-semibold text-white">${escapeHtml(item.raw_name || 'Ítem')}</div>
        <div class="text-[10px] text-gray-400">Extraído de factura</div>
      </td>
      <td class="p-2.5">
        <select class="item-product-select w-full bg-surface-elevated border border-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-primary" data-index="${index}">
          <option value="">-- No vincular a catálogo --</option>
          ${products
            .map(
              (p) => `
            <option value="${p.id}" ${p.id === item.product_id ? 'selected' : ''}>
              ${p.name} (Stock: ${p.stock || 0})
            </option>
          `
            )
            .join('')}
        </select>
      </td>
      <td class="p-2.5">
        <input type="number" min="0" step="1" class="item-qty-input w-20 bg-surface-elevated border border-border rounded px-2 py-1 text-xs text-center font-bold text-brand-primary focus:outline-none focus:border-brand-primary" value="${addedQty}" data-index="${index}">
      </td>
      <td class="p-2.5">
        <input type="number" min="0" step="100" class="item-cost-input w-24 bg-surface-elevated border border-border rounded px-2 py-1 text-xs text-right text-white focus:outline-none focus:border-brand-primary" value="${item.unit_cost || 0}" data-index="${index}">
      </td>
      <td class="p-2.5 text-center font-mono font-medium text-gray-300 item-current-stock">${currentStock}</td>
      <td class="p-2.5 text-center font-mono font-bold text-green-400 bg-green-500/10 rounded item-new-stock">${newStock}</td>
      <td class="p-2.5 text-center">
        <button type="button" class="btn-remove-scanned-item text-red-400 hover:text-red-300 p-1" data-index="${index}" title="Quitar ítem">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachScannedTableEvents();
}

function attachScannedTableEvents() {
  const tbody = document.getElementById('scanned-items-tbody');
  if (!tbody) return;

  tbody.querySelectorAll('.item-product-select').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const prodId = e.target.value;
      const prod = products.find((p) => p.id === prodId);
      if (currentScannedData && currentScannedData.items[idx]) {
        currentScannedData.items[idx].product_id = prodId || null;
        currentScannedData.items[idx].product_name = prod ? prod.name : null;
      }
      updateRowStockCalculation(idx);
    });
  });

  tbody.querySelectorAll('.item-qty-input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const qty = parseInt(e.target.value, 10) || 0;
      if (currentScannedData && currentScannedData.items[idx]) {
        currentScannedData.items[idx].quantity = qty;
      }
      updateRowStockCalculation(idx);
    });
  });

  tbody.querySelectorAll('.item-cost-input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const cost = parseFloat(e.target.value) || 0;
      if (currentScannedData && currentScannedData.items[idx]) {
        currentScannedData.items[idx].unit_cost = cost;
      }
    });
  });

  tbody.querySelectorAll('.btn-remove-scanned-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index, 10);
      if (currentScannedData && Array.isArray(currentScannedData.items)) {
        currentScannedData.items.splice(idx, 1);
        renderScannedResults(currentScannedData);
      }
    });
  });
}

function updateRowStockCalculation(idx) {
  const tr = document.querySelector(`#scanned-items-tbody tr[data-index="${idx}"]`);
  if (!tr) return;

  const sel = tr.querySelector('.item-product-select');
  const qtyInput = tr.querySelector('.item-qty-input');
  const currentStockEl = tr.querySelector('.item-current-stock');
  const newStockEl = tr.querySelector('.item-new-stock');

  const prodId = sel.value;
  const prod = products.find((p) => p.id === prodId);
  const currentStock = prod ? Number(prod.stock || 0) : 0;
  const qty = parseInt(qtyInput.value, 10) || 0;
  const newStock = currentStock + qty;

  currentStockEl.textContent = currentStock;
  newStockEl.textContent = newStock;
}

async function applyScannedInvoiceToDatabase() {
  if (!currentScannedData || !Array.isArray(currentScannedData.items)) {
    alert('No hay datos de factura para aplicar.');
    return;
  }

  const supplierName = document.getElementById('scanned-supplier-name')?.value.trim() || 'Distribuidor';
  const invoiceNumber = document.getElementById('scanned-invoice-number')?.value.trim() || `FAC-${Date.now().toString().slice(-6)}`;
  const invoiceDate = document.getElementById('scanned-invoice-date')?.value || new Date().toISOString().split('T')[0];

  const validItems = currentScannedData.items.filter((item) => item.product_id && Number(item.quantity) > 0);

  if (validItems.length === 0) {
    alert('No hay ítems vinculados a productos del catálogo con cantidad mayor a 0. Asocie al menos un producto.');
    return;
  }

  const confirmed = confirm(
    `¿Confirmar ingreso de mercancía?\n\n` +
      `Proveedor: ${supplierName}\n` +
      `Factura: ${invoiceNumber}\n` +
      `Ítems a ingresar: ${validItems.length}\n` +
      `Total unidades: ${validItems.reduce((acc, it) => acc + Number(it.quantity), 0)}\n\n` +
      `El inventario en Cloudflare D1 se actualizará de inmediato.`
  );

  if (!confirmed) return;

  const applyBtn = document.getElementById('btn-apply-invoice-stock');
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.textContent = 'Actualizando D1 en vivo...';
  }

  try {
    const token = localStorage.getItem('mucadele_admin_token') || sessionStorage.getItem('mucadele_admin_token');
    const resp = await fetch('/api/admin/apply-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        supplier_name: supplierName,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        items: validItems,
      }),
    });

    const res = await resp.json();
    if (!resp.ok || !res.ok) {
      throw new Error(res.error || 'Error al aplicar el inventario.');
    }

    alert(`✓ Inventario actualizado exitosamente en Cloudflare D1.\n` +
          `Factura registrada: ${res.po_number || invoiceNumber}\n` +
          `Productos actualizados: ${res.updated_products_count}\n` +
          `Total unidades sumadas: ${res.total_units_added}`);

    resetInvoiceScanner();
    document.getElementById('invoice-scanner-section')?.classList.add('hidden');
    await loadProducts();
    await loadSuppliersAndPOs();
  } catch (err) {
    console.error('Error aplicando factura:', err);
    alert('Error al aplicar factura al inventario: ' + err.message);
  } finally {
    if (applyBtn) {
      applyBtn.disabled = false;
      applyBtn.textContent = '✓ Confirmar e Ingresar al Inventario Real';
    }
  }
}

function resetInvoiceScanner() {
  currentScannedData = null;
  currentInvoiceBase64 = null;
  currentInvoiceMime = null;

  const fileInput = document.getElementById('invoice-file-input');
  if (fileInput) fileInput.value = '';

  const previewContainer = document.getElementById('invoice-preview-container');
  if (previewContainer) previewContainer.classList.add('hidden');

  const fileInfo = document.getElementById('invoice-file-info');
  if (fileInfo) fileInfo.textContent = '';

  const resultsContainer = document.getElementById('invoice-results-container');
  if (resultsContainer) resultsContainer.classList.add('hidden');

  const processBtn = document.getElementById('btn-process-invoice-ai');
  if (processBtn) processBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
  initInvoiceScanner();
  initDianModule();
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initInvoiceScanner();
  initDianModule();
}

// ============================================================================
// MÓDULO ADMINISTRATIVO DE FACTURACIÓN ELECTRÓNICA DIAN UBL 2.1
// ============================================================================

async function loadDianData() {
  await Promise.all([loadDianConfig(), loadDianInvoices()]);
}

async function loadDianConfig() {
  try {
    const res = await fetch('/api/admin/dian/config', { credentials: 'same-origin' });
    const data = await res.json();
    if (data.ok && data.config) {
      const c = data.config;
      const envSelect = document.getElementById('dian-env');
      if (envSelect) envSelect.value = c.environment || '2';
      
      const badge = document.getElementById('dian-env-badge');
      if (badge) {
        if (c.environment === '1') {
          badge.textContent = 'Ambiente: Producción Oficial (1)';
          badge.style.background = '#DCFCE7';
          badge.style.color = '#166534';
        } else {
          badge.textContent = 'Ambiente: Habilitación / Pruebas (2)';
          badge.style.background = '#FEF3C7';
          badge.style.color = '#92400E';
        }
      }

      const swInput = document.getElementById('dian-software-id');
      if (swInput) swInput.value = c.software_id || '';

      const pinInput = document.getElementById('dian-pin');
      if (pinInput) pinInput.value = c.software_pin || '';

      const testInput = document.getElementById('dian-test-set-id');
      if (testInput) testInput.value = c.test_set_id || '';

      const keyInput = document.getElementById('dian-tech-key');
      if (keyInput) keyInput.value = c.technical_key || '';

      const prefixInput = document.getElementById('dian-prefix');
      if (prefixInput) prefixInput.value = c.prefix || 'SETP';

      const consInput = document.getElementById('dian-consecutive');
      if (consInput) consInput.value = c.current_consecutive || 1;

      const resNumInput = document.getElementById('dian-res-num');
      if (resNumInput) resNumInput.value = c.resolution_number || '';

      const resDateInput = document.getElementById('dian-res-date');
      if (resDateInput) resDateInput.value = c.resolution_date || '';
    }
  } catch (err) {
    console.error('Error cargando configuración DIAN:', err);
  }
}

async function loadDianInvoices() {
  const tbody = document.getElementById('dian-invoices-tbody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/admin/dian/invoices?limit=50', { credentials: 'same-origin' });
    const data = await res.json();
    if (!data.ok || !data.invoices || data.invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-sub,#6B7280);">No hay facturas electrónicas registradas aún. Ejecute el Set de Pruebas o emita ventas desde el POS.</td></tr>';
      return;
    }

    tbody.innerHTML = data.invoices.map((inv) => {
      const cufeShort = inv.cufe ? `${inv.cufe.slice(0, 10)}...${inv.cufe.slice(-8)}` : '-';
      const statusClass = inv.status === 'test_generated' ? 'badge-info' : 'badge-success';
      const statusLabel = inv.status === 'test_generated' ? 'Prueba DIAN' : 'Generada UBL';

      return `<tr>
        <td style="font-weight:700;">${escapeHTML(inv.invoice_number)}</td>
        <td>${escapeHTML(inv.issue_date)} ${escapeHTML(inv.issue_time || '')}</td>
        <td>
          <div style="font-weight:600;">${escapeHTML(inv.customer_name || 'Consumidor Final')}</div>
          <small style="color:var(--text-sub,#6B7280);">${escapeHTML(inv.customer_doc || '')}</small>
        </td>
        <td style="font-weight:700;">${formatCOP(inv.total)}</td>
        <td>
          <div style="display:inline-flex;align-items:center;gap:0.35rem;font-family:monospace;font-size:0.8rem;background:#F3F4F6;padding:2px 6px;border-radius:4px;">
            <span title="${escapeHTML(inv.cufe)}">${escapeHTML(cufeShort)}</span>
            <button type="button" onclick="navigator.clipboard.writeText('${escapeHTML(inv.cufe)}');showToast('CUFE copiado');" style="background:none;border:none;cursor:pointer;padding:0;font-size:0.9rem;" title="Copiar CUFE completo">📋</button>
          </div>
        </td>
        <td><span class="badge ${statusClass}" style="padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">${statusLabel}</span></td>
        <td>
          <a href="/api/admin/dian/invoices/${encodeURIComponent(inv.invoice_number)}/xml" target="_blank" download="${escapeHTML(inv.invoice_number)}.xml" class="btn-outline" style="padding:4px 8px;font-size:0.8rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.25rem;">
            📥 XML
          </a>
        </td>
      </tr>`;
    }).join('');
  } catch (err) {
    console.error('Error cargando facturas DIAN:', err);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#DC2626;">Error al cargar las facturas electrónicas.</td></tr>';
  }
}

function initDianModule() {
  const form = document.getElementById('dian-config-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        environment: document.getElementById('dian-env')?.value || '2',
        software_id: document.getElementById('dian-software-id')?.value.trim() || '',
        software_pin: document.getElementById('dian-pin')?.value.trim() || '',
        test_set_id: document.getElementById('dian-test-set-id')?.value.trim() || '',
        technical_key: document.getElementById('dian-tech-key')?.value.trim() || '',
        prefix: document.getElementById('dian-prefix')?.value.trim() || 'SETP',
        current_consecutive: Number(document.getElementById('dian-consecutive')?.value) || 1,
        resolution_number: document.getElementById('dian-res-num')?.value.trim() || '',
        resolution_date: document.getElementById('dian-res-date')?.value || '',
      };

      try {
        const res = await fetch('/api/admin/dian/config', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          showToast('Configuración DIAN actualizada correctamente');
          loadDianConfig();
        } else {
          alert('Error: ' + (data.error || 'No se pudo guardar la configuración'));
        }
      } catch (err) {
        alert('Error de conexión al guardar configuración DIAN');
      }
    });
  }

  const btnRunTestSet = document.getElementById('btn-run-dian-testset');
  if (btnRunTestSet) {
    btnRunTestSet.addEventListener('click', async () => {
      const confirmRun = confirm('¿Desea ejecutar la generación del Set de Pruebas oficial de 8 facturas reglamentarias DIAN con CUFE y UBL 2.1?');
      if (!confirmRun) return;

      btnRunTestSet.disabled = true;
      btnRunTestSet.textContent = '⏳ Generando Set de Pruebas...';

      try {
        const res = await fetch('/api/admin/dian/run-test-set', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.ok) {
          showToast(`¡Set de Pruebas completado! ${data.total_invoices_generated} facturas generadas`);
          
          const resultsBox = document.getElementById('dian-testset-results');
          const itemsBox = document.getElementById('dian-testset-items');
          if (resultsBox && itemsBox) {
            resultsBox.style.display = 'block';
            itemsBox.innerHTML = (data.results || []).map((r) => `
              <div style="background:#FFFFFF;border:1px solid #BAE6FD;border-radius:8px;padding:0.75rem;display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <strong>#${r.test_case}: ${escapeHTML(r.name)}</strong>
                  <div style="font-family:monospace;font-size:0.8rem;color:#0369A1;">Factura: ${escapeHTML(r.invoice_number)} · Total: ${formatCOP(r.total)}</div>
                  <div style="font-family:monospace;font-size:0.75rem;color:#64748B;">CUFE: ${escapeHTML(r.cufe.slice(0, 32))}...</div>
                </div>
                <div>
                  <a href="${escapeHTML(r.xml_url)}" target="_blank" download="${escapeHTML(r.invoice_number)}.xml" class="btn-outline" style="padding:5px 12px;font-size:0.85rem;text-decoration:none;">
                    📥 Descargar UBL 2.1
                  </a>
                </div>
              </div>
            `).join('');
          }

          await loadDianConfig();
          await loadDianInvoices();
        } else {
          alert('Error al ejecutar set de pruebas: ' + (data.error || 'Error desconocido'));
        }
      } catch (err) {
        alert('Error de conexión al ejecutar el set de pruebas DIAN');
      } finally {
        btnRunTestSet.disabled = false;
        btnRunTestSet.textContent = '🚀 Ejecutar Set de Pruebas (8 Facturas)';
      }
    });
  }

  const btnRefresh = document.getElementById('btn-refresh-dian-invoices');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      loadDianInvoices();
      showToast('Facturas DIAN actualizadas');
    });
  }
}

