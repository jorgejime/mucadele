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
let orderMode = 'delivery'; // 'delivery' | 'pickup'

const formatCOP = (value) => `$${Number(value || 0).toLocaleString('es-CO')}`;

const promosBannerGrid = document.getElementById('promos-banner-grid');
const productGrid = document.getElementById('product-grid');
const primaryThumbCta = document.getElementById('primary-thumb-cta');
const ctaMainText = document.getElementById('cta-main-text');
const ctaPriceBadge = document.getElementById('cta-price-badge');

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
const deliveryAddressWrap = document.getElementById('delivery-address-wrap');
const pickupInfoWrap = document.getElementById('pickup-info-wrap');
const customerAddressInput = document.getElementById('customer-address');

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

if (sessionStorage.getItem('mucadele_age_verified') !== 'true') {
  ageDialog.showModal();
}
ageConfirmBtn.addEventListener('click', () => {
  sessionStorage.setItem('mucadele_age_verified', 'true');
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

function renderPromosBanner() {
  if (!promosBannerGrid) return;
  const combos = catalogData.filter((item) => item.category === 'combos' && (item.stock ?? 1) > 0);
  const parentSection = promosBannerGrid.closest('.promos-banner-section');
  if (combos.length === 0) {
    if (parentSection) parentSection.hidden = true;
    return;
  }
  if (parentSection) parentSection.hidden = false;

  promosBannerGrid.innerHTML = combos
    .map((c) => {
      const orig = c.originalPrice || Math.round(c.price * 1.15);
      const savings = c.discountSavings || (orig - c.price);
      const qty = getCartQty(c.id);

      return `
        <article class="promo-card">
          <span class="promo-savings-pill">AHORRA ${formatCOP(savings)}</span>
          <div class="promo-card-top">
            <img class="promo-img" src="${sanitizeUrl(c.imageUrl)}" alt="${escapeHTML(c.name)}" loading="lazy">
            <div class="promo-info">
              <h3>${escapeHTML(c.name)}</h3>
              <span>${escapeHTML(c.presentation)}</span>
            </div>
          </div>
          <div class="promo-card-bottom">
            <div class="promo-prices">
              <span class="promo-price-current">${formatCOP(c.price)}</span>
              <span class="promo-price-original">${formatCOP(orig)}</span>
            </div>
            <button type="button" class="promo-add-btn ${qty > 0 ? 'in-cart' : ''}" data-step-id="${escapeHTML(c.id)}" data-delta="1">
              ${qty > 0 ? `+ Sumar (${qty})` : '+ Agregar'}
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCatalog() {
  renderPromosBanner();

  const filtered = catalogData.filter((item) => {
    const matchesCat = activeCategory === 'todos' || item.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || item.name.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--muted);text-align:center;padding:2rem 0;font-size:1.05rem;">${catalogData.length === 0 ? 'Catálogo en actualización. Próximamente nuevos productos disponibles.' : 'Sin resultados.'}</p>`;
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

      return `
        <article class="card" style="${isOut ? 'opacity:0.65;' : ''}">
          <div>
            <div class="card-img-wrap">
              <img class="card-img" src="${sanitizeUrl(product.imageUrl)}" alt="${escapeHTML(product.name)}" loading="lazy">
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

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const effectiveDelivery = count > 0 && orderMode === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + effectiveDelivery;

  if (count === 0) {
    ctaMainText.textContent = 'Selecciona un producto';
    ctaPriceBadge.textContent = '$0';
  } else {
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

promosBannerGrid?.addEventListener('click', (event) => {
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
