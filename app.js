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
  if (/^(https?:\/\/|\/|data:image\/svg\+xml)/i.test(u)) return escapeHTML(u);
  return '';
}

export function getCategoryFallbackSvg(category) {
  const strokeColor = '%2371717A';
  let inner = '<path d="M8 2h8v4l-2 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9L6 6V2z"/>';
  if (category === 'cervezas') {
    inner = '<rect x="6" y="3" width="12" height="18" rx="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="16" x2="18" y2="16"/>';
  } else if (category === 'otros') {
    inner = '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>';
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export function getProductImageUrl(product) {
  const url = product.imageUrl || '';
  const isCondonItem = /today|condon|preservativo/i.test(product.name || '') || product.id === 'today-173';
  // Si no es Today/condón pero tiene asignado el código de barra 7702049000432 (error de ERP), usar fallback limpio
  if (url.includes('7702049000432') && !isCondonItem) {
    return getCategoryFallbackSvg(product.category);
  }
  return sanitizeUrl(url) || getCategoryFallbackSvg(product.category);
}

const DELIVERY_FEE = 6000;
let catalogData = INITIAL_CATALOG.map((item) => ({ ...item, stock: item.stock ?? 24, active: true }));

// JSON-LD de catálogo en <head> para motores SEO / GEO / AIO
const ldScript = document.createElement('script');
ldScript.type = 'application/ld+json';
function updateCatalogJsonLd() {
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo Mucadele Licores Santa Marta',
    itemListElement: catalogData.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        sku: item.id,
        name: item.name,
        image: item.imageUrl,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'COP',
          price: item.price,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  });
}
updateCatalogJsonLd();
document.head.appendChild(ldScript);

let cart = [];
let activeCategory = 'todos';
let searchQuery = '';
let showOutOfStock = false; // Por defecto solo mostrar productos disponibles (stock > 0)
let orderMode = 'delivery'; // 'delivery' | 'pickup'

const formatCOP = (value) => `$${Number(value || 0).toLocaleString('es-CO')}`;

const productGrid = document.getElementById('product-grid');
const primaryThumbDock = document.getElementById('primary-thumb-dock') || document.querySelector('.thumb-dock');
const primaryThumbCta = document.getElementById('primary-thumb-cta');
const ctaMainText = document.getElementById('cta-main-text');
const ctaPriceBadge = document.getElementById('cta-price-badge');

const toggleStockBtn = document.getElementById('toggle-stock-btn');
const stockFilterLabel = document.getElementById('stock-filter-label');

const cartDialog = document.getElementById('cart-dialog');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDelivery = document.getElementById('summary-delivery');
const deliveryLabel = document.getElementById('delivery-label');
const summaryTotal = document.getElementById('summary-total');
const payBtnAmount = document.getElementById('pay-btn-amount');
const submitOrderLabel = document.getElementById('submit-order-label');
const checkoutForm = document.getElementById('checkout-form');
const submitOrderBtn = document.getElementById('submit-order-btn');
const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
const deliveryAddressWrap = document.getElementById('delivery-address-wrap');
const pickupInfoWrap = document.getElementById('pickup-info-wrap');
const customerAddressInput = document.getElementById('customer-address');
const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');

const trackingDialog = document.getElementById('tracking-dialog');
const closeTrackingBtn = document.getElementById('close-tracking-btn');
const trackingDialogContent = document.getElementById('tracking-dialog-content');

const ageDialog = document.getElementById('age-dialog');
const ageConfirmBtn = document.getElementById('age-confirm-btn');

function registerDialogLightDismissFallback(dialogEl) {
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialogEl.addEventListener('click', (event) => {
      if (event.target !== dialogEl) return;
      const rect = dialogEl.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialogEl.close();
    });
  }
}

registerDialogLightDismissFallback(cartDialog);
registerDialogLightDismissFallback(trackingDialog);

// Verificación persistente en localStorage para no interrumpir clientes recurrentes
try {
  if (localStorage.getItem('mucadele_age_verified') !== 'true') {
    ageDialog.showModal();
  }
} catch {
  // Fallback si cookies/storage restringidas
}

ageConfirmBtn.addEventListener('click', () => {
  try {
    localStorage.setItem('mucadele_age_verified', 'true');
  } catch {}
  ageDialog.close();
});

async function syncLiveCatalog() {
  try {
    const resp = await fetch('/api/catalog');
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.ok && Array.isArray(data.products)) {
      catalogData = data.products;
      updateCatalogJsonLd();
      // Sincronizar precios y stock de productos que ya estén en el carrito
      cart = cart
        .map((cItem) => {
          const fresh = catalogData.find((p) => p.id === cItem.id);
          if (!fresh || fresh.stock <= 0) return null;
          return {
            ...fresh,
            quantity: Math.min(cItem.quantity, fresh.stock),
          };
        })
        .filter(Boolean);
      renderCatalog();
      updateCartUI();
    }
  } catch {
    // Mantiene el catálogo inicial si está sin conexión
  }
}

function getCartQty(productId) {
  const found = cart.find((item) => item.id === productId);
  return found ? found.quantity : 0;
}

function changeQuantity(productId, delta) {
  const product = catalogData.find((p) => p.id === productId);
  if (!product) return;
  const maxStock = Number(product.stock ?? 99);
  if (maxStock <= 0 && delta > 0) return;

  const idx = cart.findIndex((item) => item.id === productId);
  if (idx === -1 && delta > 0) {
    cart.push({ ...product, quantity: 1 });
  } else if (idx !== -1) {
    const nextQty = cart[idx].quantity + delta;
    if (delta > 0 && nextQty > maxStock) {
      return;
    }
    cart[idx].quantity = nextQty;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
  }
  renderCatalog();
  updateCartUI();
}

function renderCatalog() {
  const q = searchQuery.trim().toLowerCase();
  const filtered = catalogData.filter((item) => {
    const matchesCat = activeCategory === 'todos' || item.category === activeCategory;
    const matchesSearch = !q || item.name.toLowerCase().includes(q);
    const stock = Number(item.stock ?? 24);
    // Prioridad UX: en exploración por categoría, solo mostrar disponibles para no abrumar con 218 agotados.
    // Si hay búsqueda explícita por texto o el usuario activó "ver todos", se muestran también los agotados.
    const matchesStock = showOutOfStock || q.length > 0 || stock > 0;
    return matchesCat && matchesSearch && matchesStock;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--muted);text-align:center;padding:2rem 0;font-size:1.05rem;">${
      catalogData.length === 0
        ? 'Catálogo en actualización. Próximamente nuevos productos disponibles.'
        : 'Sin resultados para la selección actual.'
    }</p>`;
    return;
  }

  productGrid.innerHTML = filtered
    .map((product) => {
      const qty = getCartQty(product.id);
      const stock = Number(product.stock ?? 24);
      const isOut = stock <= 0;

      let control = '';
      if (isOut) {
        control = `<button type="button" class="btn-add" disabled style="opacity:0.45;cursor:not-allowed;">Agotado</button>`;
      } else if (qty === 0) {
        control = `<button type="button" class="btn-add" data-step-id="${escapeHTML(product.id)}" data-delta="1">Agregar</button>`;
      } else {
        control = `
          <div class="stepper">
            <button type="button" class="step-btn" data-step-id="${escapeHTML(product.id)}" data-delta="-1" aria-label="Quitar">−</button>
            <span class="step-qty">${qty}</span>
            <button type="button" class="step-btn" data-step-id="${escapeHTML(product.id)}" data-delta="1" aria-label="Sumar" ${qty >= stock ? 'disabled style="opacity:0.35"' : ''}>+</button>
          </div>
        `;
      }

      const stockTag =
        stock > 0 && stock <= 5
          ? `<span style="font-size:0.74rem;font-weight:700;color:#D97706;display:block;margin-top:0.15rem;">¡Últimas ${stock} uds!</span>`
          : '';

      const cleanImgUrl = getProductImageUrl(product);

      return `
        <article class="card" style="${isOut ? 'opacity:0.65;' : ''}">
          <div>
            <div class="card-img-wrap">
              <img class="card-img" src="${cleanImgUrl}" alt="${escapeHTML(product.name)}" loading="lazy">
            </div>
            <p class="card-price">${formatCOP(product.price)}</p>
            <h2 class="card-title">${escapeHTML(product.name)}</h2>
            <p class="card-meta">${escapeHTML(product.presentation)}${stockTag}</p>
          </div>
          ${control}
        </article>
      `;
    })
    .join('');
}

function updateWhatsAppCheckoutLink(subtotal, effectiveDelivery, total) {
  if (!whatsappOrderBtn) return;
  if (cart.length === 0) {
    whatsappOrderBtn.href = 'https://wa.me/573015153867?text=Hola%20Mucadele%2C%20quiero%20hacer%20un%20pedido';
    return;
  }
  const custName = customerNameInput?.value.trim() || '';
  const custAddress = customerAddressInput?.value.trim() || '';
  
  const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCOP(i.price * i.quantity)})`).join('\n');
  let msg = `Hola Mucadele 👋, quiero confirmar este pedido:\n\n${itemsText}\n\n`;
  msg += `• Subtotal: ${formatCOP(subtotal)}\n`;
  msg += `• Modalidad: ${orderMode === 'pickup' ? 'Retiro en Local (Calle 11 # 24-36)' : `Domicilio (${formatCOP(effectiveDelivery)})`}\n`;
  msg += `• *TOTAL A PAGAR: ${formatCOP(total)}*\n`;
  if (custName) msg += `• Nombre: ${custName}\n`;
  if (orderMode === 'delivery' && custAddress) msg += `• Dirección: ${custAddress}\n`;
  
  whatsappOrderBtn.href = `https://wa.me/573015153867?text=${encodeURIComponent(msg)}`;
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const effectiveDelivery = count > 0 && orderMode === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + effectiveDelivery;

  // UX Móvil: ocultar el dock si el carrito está vacío para liberar 104px de pantalla
  if (count === 0) {
    if (primaryThumbDock) primaryThumbDock.classList.add('dock-hidden');
    ctaMainText.textContent = 'Ver pedido (0)';
    ctaPriceBadge.textContent = '$0';
  } else {
    if (primaryThumbDock) primaryThumbDock.classList.remove('dock-hidden');
    ctaMainText.textContent = `Ver pedido (${count})`;
    ctaPriceBadge.textContent = formatCOP(subtotal);
  }

  if (orderMode === 'pickup') {
    deliveryAddressWrap.hidden = true;
    customerAddressInput.required = false;
    pickupInfoWrap.hidden = false;
    deliveryLabel.textContent = 'Retiro en local';
    summaryDelivery.textContent = 'Gratis ($0)';
    submitOrderLabel.textContent = 'Confirmar retiro en local';
  } else {
    deliveryAddressWrap.hidden = false;
    customerAddressInput.required = true;
    pickupInfoWrap.hidden = true;
    deliveryLabel.textContent = 'Domicilio';
    summaryDelivery.textContent = formatCOP(effectiveDelivery);
    submitOrderLabel.textContent = 'Pedir a domicilio';
  }

  summarySubtotal.textContent = formatCOP(subtotal);
  summaryTotal.textContent = formatCOP(total);
  payBtnAmount.textContent = formatCOP(total);

  updateWhatsAppCheckoutLink(subtotal, effectiveDelivery, total);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="margin:0;color:var(--muted);font-size:0.98rem;">No hay productos en tu pedido.</p>`;
    submitOrderBtn.disabled = true;
    return;
  }

  submitOrderBtn.disabled = false;
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-row">
        <div style="min-width:0;">
          <div style="font-weight:700;font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(item.name)}</div>
          <div style="color:var(--muted);font-size:0.9rem;font-weight:600;">${formatCOP(item.price * item.quantity)}</div>
        </div>
        <div class="stepper" style="width:110px;height:40px;flex-shrink:0;">
          <button type="button" class="step-btn" data-modal-step="${escapeHTML(item.id)}" data-delta="-1">−</button>
          <span class="step-qty">${item.quantity}</span>
          <button type="button" class="step-btn" data-modal-step="${escapeHTML(item.id)}" data-delta="1">+</button>
        </div>
      </div>
    `
    )
    .join('');
}

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    orderMode = btn.getAttribute('data-order-mode');
    updateCartUI();
  });
});

productGrid.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-step-id]');
  if (!btn) return;
  changeQuantity(btn.getAttribute('data-step-id'), Number(btn.getAttribute('data-delta')));
});

cartItemsContainer.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-modal-step]');
  if (!btn) return;
  changeQuantity(btn.getAttribute('data-modal-step'), Number(btn.getAttribute('data-delta')));
});

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    activeCategory = btn.getAttribute('data-category');
    renderCatalog();
  });
});

document.getElementById('search-input').addEventListener('input', (event) => {
  searchQuery = event.target.value;
  renderCatalog();
});

if (toggleStockBtn) {
  toggleStockBtn.addEventListener('click', () => {
    showOutOfStock = !showOutOfStock;
    toggleStockBtn.setAttribute('aria-pressed', showOutOfStock ? 'true' : 'false');
    if (stockFilterLabel) {
      stockFilterLabel.textContent = showOutOfStock ? 'Ver todos (inc. agotados)' : 'Solo disponibles';
    }
    renderCatalog();
  });
}

function refreshWhatsAppOnInput() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const effectiveDelivery = count > 0 && orderMode === 'delivery' ? DELIVERY_FEE : 0;
  updateWhatsAppCheckoutLink(subtotal, effectiveDelivery, subtotal + effectiveDelivery);
}

customerNameInput?.addEventListener('input', refreshWhatsAppOnInput);
customerAddressInput?.addEventListener('input', refreshWhatsAppOnInput);

primaryThumbCta.addEventListener('click', () => {
  if (cart.length === 0) return;
  updateCartUI();
  cartDialog.showModal();
});

closeCartBtn.addEventListener('click', () => cartDialog.close());
closeTrackingBtn.addEventListener('click', () => trackingDialog.close());

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (cart.length === 0) return;

  const customerName = document.getElementById('customer-name').value.trim();
  const customerPhone = document.getElementById('customer-phone').value.trim();
  const customerAddress =
    orderMode === 'pickup'
      ? 'Retiro en Local · Calle 11 # 24-36'
      : document.getElementById('customer-address').value.trim();
  const paymentMethod = document.getElementById('payment-method').value;

  submitOrderBtn.disabled = true;
  const prevHTML = submitOrderBtn.innerHTML;
  submitOrderBtn.innerHTML = '<span>Enviando pedido...</span>';

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderType: orderMode,
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        autoAssignDriver: orderMode === 'delivery',
        deliveryFee: orderMode === 'delivery' ? DELIVERY_FEE : 0,
        tips: 0,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          presentation: item.presentation,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Error registrando el pedido.');
    }

    cartDialog.close();

    if (orderMode === 'pickup') {
      trackingDialogContent.innerHTML = `
        <div style="display:grid;gap:1.1rem;">
          <div>
            <div style="font-size:0.9rem;color:var(--muted);font-weight:700;">CÓDIGO DE RETIRO EN LOCAL</div>
            <div style="font-size:1.65rem;font-weight:800;margin-top:0.2rem;color:var(--action);">${escapeHTML(data.orderNumber)}</div>
            <div style="font-size:1rem;color:var(--text);font-weight:700;margin-top:0.4rem;">
              Sin domicilio · Retiro en mostrador
            </div>
            <div style="font-size:0.95rem;color:var(--muted);margin-top:0.3rem;line-height:1.45;">
              Dirección: Calle 11 # 24-36, Comuna 3, Santa Marta<br>
              Total a pagar en caja: <strong style="color:var(--text);">${formatCOP(data.totalOrderCost)}</strong>
            </div>
          </div>
        </div>
      `;
    } else {
      const trackingUrl = sanitizeUrl(data.trackingLink);
      trackingDialogContent.innerHTML = `
        <div style="display:grid;gap:1.1rem;">
          <div>
            <div style="font-size:0.9rem;color:var(--muted);font-weight:600;">Orden #${escapeHTML(data.orderNumber)}</div>
            <div style="font-size:1.25rem;font-weight:800;margin-top:0.25rem;">
              ${data.assigned ? `Asignado a ${escapeHTML(data.assignedCarrierName || 'Motorizado')}` : 'Pedido recibido en Mucadele'}
            </div>
            <div style="font-size:0.98rem;color:var(--muted);margin-top:0.35rem;line-height:1.45;">
              Destino: ${escapeHTML(data.customerAddress)}<br>Total a pagar: <strong style="color:var(--text);">${formatCOP(data.totalOrderCost)}</strong>
            </div>
          </div>
          ${
            trackingUrl
              ? `<a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="cta-primary" style="max-width:100%;text-decoration:none;justify-content:center;"><span>Ver ubicación del motorizado</span></a>`
              : ''
          }
        </div>
      `;
    }

    trackingDialog.showModal();
    cart = [];
    await syncLiveCatalog();
    renderCatalog();
    updateCartUI();
    checkoutForm.reset();
  } catch (err) {
    alert(err.message);
  } finally {
    submitOrderBtn.disabled = false;
    submitOrderBtn.innerHTML = prevHTML;
  }
});

renderCatalog();
updateCartUI();
syncLiveCatalog();
