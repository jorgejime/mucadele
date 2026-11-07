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
