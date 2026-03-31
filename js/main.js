/* ============================================================
   MAIN.JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ── 1. ESTADO ─────────────────────────────────────────── */
  var cart = [];

  /* ── 2. DOM ────────────────────────────────────────────── */
  var cartPanel       = document.getElementById('cart-panel');
  var cartOverlay     = document.getElementById('cart-overlay');
  var cartCloseBtn    = document.getElementById('cart-close-btn');
  var cartList        = document.getElementById('cart-list');
  var cartTotal       = document.getElementById('cart-total');
  var cartBadgeHeader = document.getElementById('cart-badge');
  var cartToggleBtn   = document.getElementById('cart-toggle-btn');

  var modal            = document.getElementById('customize-modal');
  var modalOverlay     = document.getElementById('modal-overlay');
  var modalCloseBtn    = document.getElementById('modal-close-btn');
  var modalConfirm     = document.getElementById('modal-confirm-btn');
  var modalChips       = document.querySelectorAll('.modal__side-chip');
  var modalQtyValue    = document.getElementById('modal-qty-value');
  var modalQtyIncrease = document.getElementById('modal-qty-increase');
  var modalQtyDecrease = document.getElementById('modal-qty-decrease');
  var modalNotes       = document.getElementById('modal-notes');
  var modalPriceDisplay = document.getElementById('modal-price-display');

  var navItems  = document.querySelectorAll('.bottom-nav__item');
  var sideChips = document.querySelectorAll('.sides__chip');

  /* ── 3. CARRITO — ABRIR / CERRAR ──────────────────────── */
  function openCart() {
    cartPanel.classList.add('cart--open');
    cartPanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartPanel.classList.remove('cart--open');
    cartPanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cartToggleBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  /* ── 4. CARRITO — AGREGAR ÍTEM ─────────────────────────── */
  function addToCart(name, price, note, qty) {
    if (note === undefined) note = '';
    if (qty  === undefined) qty  = 1;

    var id = note ? (name + ' — ' + note) : name;
    var existing = null;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { existing = cart[i]; break; }
    }

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: id, name: name, price: price, qty: qty, note: note });
    }

    renderCart();
    updateBadges();
  }

  /* ── HELPER: desmarcar chip por nombre de producto ─────── */
  function deselectChip(name) {
    sideChips.forEach(function(chip) {
      if (chip.dataset.product === name) {
        chip.classList.remove('sides__chip--active');
      }
    });
  }

  /* ── 5. CARRITO — RENDERIZAR ───────────────────────────── */
  function renderCart() {
    cartList.innerHTML = '';

    if (cart.length === 0) {
      cartPanel.classList.add('cart--empty');
      return;
    }

    cartPanel.classList.remove('cart--empty');

    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].price * cart[i].qty;
    cartTotal.textContent = '$' + total;

    for (var j = 0; j < cart.length; j++) {
      var item = cart[j];
      var li   = document.createElement('li');
      li.className = 'cart__item';

      var noteHTML = item.note ? '<p class="cart__item-note">' + item.note + '</p>' : '';

      li.innerHTML =
        '<div class="cart__item-info">' +
          '<p class="cart__item-name">' + item.name + '</p>' + noteHTML +
        '</div>' +
        '<div class="cart__item-controls">' +
          '<button class="cart__qty-btn cart__qty-btn--remove" data-action="decrease" data-id="' + item.id + '" type="button">&#8722;</button>' +
          '<span class="cart__qty-value">' + item.qty + '</span>' +
          '<button class="cart__qty-btn" data-action="increase" data-id="' + item.id + '" type="button">+</button>' +
        '</div>' +
        '<span class="cart__item-price">$' + (item.price * item.qty) + '</span>' +
        '<button class="cart__delete-btn" data-action="delete" data-id="' + item.id + '" type="button" aria-label="Eliminar">' +
          '<span class="material-symbols-outlined" aria-hidden="true">delete</span>' +
        '</button>';

      cartList.appendChild(li);
    }
  }

  /* ── 6. CARRITO — CANTIDAD / ELIMINAR (delegación) ─────── */
  cartList.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;

    var id   = btn.dataset.id;
    var action = btn.dataset.action;
    var item = null;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { item = cart[i]; break; }
    }
    if (!item) return;

    if (action === 'increase') {
      item.qty += 1;
    } else if (action === 'decrease') {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart = cart.filter(function(i) { return i.id !== id; });
        deselectChip(id);
      }
    } else if (action === 'delete') {
      cart = cart.filter(function(i) { return i.id !== id; });
      deselectChip(id);
    }

    renderCart();
    updateBadges();
  });

  /* ── 7. BADGES ─────────────────────────────────────────── */
  function updateBadges() {
    var totalQty = 0;
    for (var i = 0; i < cart.length; i++) totalQty += cart[i].qty;

    cartBadgeHeader.textContent = totalQty;

    if (totalQty > 0) {
      cartBadgeHeader.classList.add('top-bar__cart-badge--visible');
    } else {
      cartBadgeHeader.classList.remove('top-bar__cart-badge--visible');
    }
  }

  /* ── 8. BOTONES DE PRODUCTOS ───────────────────────────── */
  var addButtons = document.querySelectorAll('[data-product][data-price]:not(.sides__chip)');

  addButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var name  = btn.dataset.product;
      var price = parseInt(btn.dataset.price, 10);
      addToCart(name, price);

      // Feedback visual temporal en el botón
      var originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true" style="font-variation-settings:\'FILL\' 1;font-size:1rem;">check</span> Agregado';
      btn.disabled = true;
      setTimeout(function() {
        btn.innerHTML = originalHTML;
        btn.disabled  = false;
      }, 1200);
    });
  });

  /* ── 9. CHIPS DE GUARNICIONES ──────────────────────────── */
  /*
     Cada clic agrega la guarnición al carrito como ítem
     independiente. Sin estado activo, sin toggle.
     La cantidad se controla desde el carrito.
  */
  sideChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      var name  = chip.dataset.product;
      var price = parseInt(chip.dataset.price, 10);
      chip.classList.add('sides__chip--active');
      addToCart(name, price);
    });
  });

  /* ── 10. MODAL (se mantiene aunque el botón no lo abre) ── */
  /*
     El modal queda en el HTML por si se reactiva en el futuro.
     Por ahora solo manejamos cierre en caso de que quede abierto.
  */
  if (modal && modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function() {
      modal.classList.remove('modal--open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }
  if (modal && modalOverlay) {
    modalOverlay.addEventListener('click', function() {
      modal.classList.remove('modal--open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  /* ── 11. NAV INFERIOR — ítem activo ────────────────────── */
  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      navItems.forEach(function(i) {
        i.classList.remove('bottom-nav__item--active');
        i.removeAttribute('aria-current');
      });
      item.classList.add('bottom-nav__item--active');
      item.setAttribute('aria-current', 'page');
    });
  });

  /* ── 12. INICIALIZACIÓN ────────────────────────────────── */
  renderCart();
  updateBadges();

});