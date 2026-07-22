/* =====================================================
   PAWSTIQ - script.js
   ===================================================== */

/* ---------- Navbar: shadow on scroll + active link ---------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    toggleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Hamburger / Mobile Menu ---------- */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ---------- Smooth Scrolling ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---------- Scroll Reveal ---------- */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger children inside grids
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    observer.observe(el);
  });
})();

/* ---------- FAQ Accordion ---------- */
(function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

/* ---------- Testimonials Slider ---------- */
(function initSlider() {
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  let current = 0;
  let autoplay;

  function visibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

  prevBtn.addEventListener('click', () => { clearInterval(autoplay); prev(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { clearInterval(autoplay); next(); startAutoplay(); });

  function startAutoplay() {
    autoplay = setInterval(next, 4500);
  }

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  buildDots();
  startAutoplay();

  window.addEventListener('resize', () => {
    buildDots();
    goTo(current);
  });
})();

/* ---------- Back to Top ---------- */
function toggleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- Lazy Loading (native fallback polyfill) ---------- */
(function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return; // browser handles it natively
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) img.src = img.dataset.src;
      io.unobserve(img);
    });
  });
  imgs.forEach(img => io.observe(img));
})();

/* ---------- Cart ---------- */
(function initCart() {
  const PRODUCTS = {
    chicken: { name: 'Chicken Jerky',   price: 299, weight: '70g',  img: 'images/chicken.png' },
    pumpkin: { name: 'Pumpkin & Oats',  price: 249, weight: '200g', img: 'images/pumpkin.png' },
    banana:  { name: 'Banana & Oats',   price: 249, weight: '200g', img: 'images/banana.png'  }
  };

  // Resolve image path relative to current page
  function imgPath(src) {
    if (window.location.pathname.includes('/products/')) return '../' + src;
    return src;
  }

  let cart = JSON.parse(localStorage.getItem('pawstiq_cart') || '{}');

  function saveCart() { localStorage.setItem('pawstiq_cart', JSON.stringify(cart)); }

  function totalCount() { return Object.values(cart).reduce((s, q) => s + q, 0); }

  function totalPrice() {
    return Object.entries(cart).reduce((s, [id, q]) => s + PRODUCTS[id].price * q, 0);
  }

  function updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(b => {
      const count = totalCount();
      b.textContent = count;
      b.classList.toggle('visible', count > 0);
    });
  }

  function renderCartItems() {
    const itemsEl  = document.getElementById('cartItems');
    const emptyEl  = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    const totalEl  = document.getElementById('cartTotal');
    if (!itemsEl) return;

    const count = totalCount();
    emptyEl.style.display  = count === 0 ? 'flex' : 'none';
    itemsEl.style.display  = count === 0 ? 'none' : 'flex';
    footerEl.style.display = count === 0 ? 'none' : 'flex';

    itemsEl.innerHTML = '';
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty === 0) return;
      const p = PRODUCTS[id];
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${imgPath(p.img)}" alt="${p.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₹${p.price} · ${p.weight}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
          <span class="qty-count">${qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
        </div>`;
      itemsEl.appendChild(el);
    });

    // Shipping calculation
    const subtotal = totalPrice();
    const shipping = subtotal > 0 && subtotal < 500 ? 50 : 0;
    const grandTotal = subtotal + shipping;

    const subtotalEl      = document.getElementById('cartSubtotal');
    const shippingRowEl   = document.getElementById('cartShippingRow');
    const shippingEl      = document.getElementById('cartShipping');
    const freeShippingEl  = document.getElementById('cartFreeShipping');

    if (subtotalEl)     subtotalEl.textContent     = '₹' + subtotal;
    if (shippingRowEl)  shippingRowEl.style.display = shipping > 0 ? 'flex' : 'none';
    if (shippingEl)     shippingEl.textContent      = '₹' + shipping;
    if (freeShippingEl) freeShippingEl.style.display = subtotal >= 500 && subtotal > 0 ? 'block' : 'none';
    if (totalEl)        totalEl.textContent          = '₹' + grandTotal;
  }

  function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }

  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateCardBtn(id, qty) {
    const p = PRODUCTS[id];
    document.querySelectorAll(`.cart-action-wrap[data-id="${id}"]`).forEach(wrap => {
      const fullWidth = wrap.querySelector('[style*="width:100%"]') !== null || wrap.closest('.product-hero-info') !== null;
      if (qty === 0) {
        wrap.innerHTML = `<button class="btn btn-primary add-to-cart-btn" data-id="${id}" data-name="${p.name}" data-price="${p.price}" data-weight="${p.weight}"${fullWidth ? ' style="width:100%;justify-content:center;"' : ''}>+ Add to Cart</button>`;
      } else {
        wrap.innerHTML = `<div class="card-qty-control" data-id="${id}"${fullWidth ? ' style="width:100%"' : ''}>
          <button class="card-qty-btn" data-action="dec" data-id="${id}">−</button>
          <span class="card-qty-num">${qty}</span>
          <button class="card-qty-btn" data-action="inc" data-id="${id}">+</button>
        </div>`;
      }
    });
  }

  function syncCardBtns() {
    Object.keys(PRODUCTS).forEach(id => {
      updateCardBtn(id, cart[id] || 0);
    });
  }

  // Event delegation for all cart interactions
  document.addEventListener('click', function(e) {
    // Add to cart
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      const id = addBtn.dataset.id;
      cart[id] = (cart[id] || 0) + 1;
      saveCart(); updateBadge(); updateCardBtn(id, cart[id]);
      return;
    }
    // Card qty buttons
    const cardQtyBtn = e.target.closest('.card-qty-btn');
    if (cardQtyBtn) {
      const id  = cardQtyBtn.dataset.id;
      const act = cardQtyBtn.dataset.action;
      if (act === 'inc') cart[id] = (cart[id] || 0) + 1;
      if (act === 'dec') {
        cart[id] = (cart[id] || 1) - 1;
        if (cart[id] === 0) delete cart[id];
      }
      saveCart(); updateBadge(); updateCardBtn(id, cart[id] || 0);
      renderCartItems(); return;
    }
    // Open cart
    if (e.target.closest('#cartBtn') || e.target.closest('#viewCartBtn') ||
        e.target.closest('#heroCartBtn') || e.target.closest('#reviewsCartBtn')) {
      openCart(); return;
    }
    // Close cart
    if (e.target.closest('#cartClose') || e.target.closest('#cartOverlay')) {
      closeCart(); return;
    }
    // Browse Treats (empty cart) or Add More Items
    if (e.target.closest('#cartShopLink') || e.target.closest('#cartAddMore')) {
      closeCart();
      const productsEl = document.getElementById('products');
      if (productsEl) {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        window.scrollTo({ top: productsEl.offsetTop - navH, behavior: 'smooth' });
      } else {
        window.location.href = window.location.pathname.includes('/products/') ? '../index.html#products' : '#products';
      }
      return;
    }
    // Qty buttons
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      const id  = qtyBtn.dataset.id;
      const act = qtyBtn.dataset.action;
      if (act === 'inc') cart[id] = (cart[id] || 0) + 1;
      if (act === 'dec') {
        cart[id] = (cart[id] || 1) - 1;
        if (cart[id] === 0) delete cart[id];
      }
      saveCart(); updateBadge(); renderCartItems(); updateCardBtn(id, cart[id] || 0); return;
    }
    // Checkout
    if (e.target.closest('#cartCheckoutBtn')) {
      closeCart();
      openCheckout(); return;
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  updateBadge();
  syncCardBtns();
  window.getCart = () => cart;
  window.openCart = openCart;
  window.updateBadgeAfterOrder = function() {
    cart = {};
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = '0';
      b.classList.remove('visible');
    });
    syncCardBtns();
  };
})();

/* ---------- Checkout Modal ---------- */
(function initCheckout() {
  const SCRIPT_URL = '__SCRIPT_URL__';
  const PRICES = { chicken: 299, pumpkin: 249, banana: 249 };

  const REFERRAL_CODES = {
    'POSTO': { owner: 'Posto', discount: 0 },
  };

  const overlay       = document.getElementById('orderModal');
  const closeBtn      = document.getElementById('orderModalClose');
  const form          = document.getElementById('orderForm');
  const submitBtn     = document.getElementById('formSubmit');
  const errorEl       = document.getElementById('formError');
  const confirmEl     = document.getElementById('orderConfirm');
  const confirmSummary= document.getElementById('confirmSummary');
  const confirmBack   = document.getElementById('confirmBack');
  const confirmSubmit = document.getElementById('confirmSubmit');
  const confirmError  = document.getElementById('confirmError');
  const successEl     = document.getElementById('orderSuccess');
  const successClose  = document.getElementById('orderSuccessClose');
  const successPhone  = document.getElementById('successPhone');
  const totalEl       = document.getElementById('orderTotalAmount');
  if (!overlay) return;

  let orderData = {};
  let appliedReferral = null;

  function calcTotal() {
    const cart = window.getCart ? window.getCart() : {};
    let subtotal = 0;
    Object.entries(cart).forEach(([id, qty]) => { subtotal += (PRICES[id] || 0) * qty; });
    const discountAmt = appliedReferral ? Math.round(subtotal * appliedReferral.discount / 100) : 0;
    const discountedSubtotal = subtotal - discountAmt;
    const shipping = discountedSubtotal > 0 && discountedSubtotal < 500 ? 50 : 0;
    if (totalEl) totalEl.textContent = '₹' + (discountedSubtotal + shipping);
  }

  window.openCheckout = function() {
    if (!overlay) return;
    calcTotal();
    errorEl.textContent = '';
    showStep('form');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    appliedReferral = null;
    const refInput = document.getElementById('of-referral');
    const refFeedback = document.getElementById('referralFeedback');
    if (refInput) refInput.value = '';
    if (refFeedback) { refFeedback.textContent = ''; refFeedback.className = 'referral-feedback'; }
    calcTotal();
  }

  const modalHeader = overlay.querySelectorAll('.order-modal > .section-tag, .order-modal > .order-modal-title, .order-modal > .order-modal-subtitle');

  function showStep(step) {
    form.style.display = step === 'form' ? '' : 'none';
    confirmEl.classList.toggle('show', step === 'confirm');
    successEl.classList.toggle('show', step === 'success');
    modalHeader.forEach(el => el.style.display = step === 'success' ? 'none' : '');
  }

  closeBtn.addEventListener('click', closeModal);
  if (successClose) successClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.qty-select').forEach(sel => {
    sel.addEventListener('change', calcTotal);
  });

  const applyBtn = document.getElementById('applyReferral');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      const refInput = document.getElementById('of-referral');
      const refFeedback = document.getElementById('referralFeedback');
      const code = refInput.value.trim().toUpperCase();
      if (!code) {
        refFeedback.textContent = 'Please enter a referral code.';
        refFeedback.className = 'referral-feedback error';
        return;
      }
      const match = REFERRAL_CODES[code];
      if (match && match.discount > 0) {
        appliedReferral = { code, ...match };
        refFeedback.textContent = `${match.discount}% off applied!`;
        refFeedback.className = 'referral-feedback success';
      } else {
        appliedReferral = null;
        refFeedback.textContent = 'Invalid referral code.';
        refFeedback.className = 'referral-feedback error';
      }
      calcTotal();
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorEl.textContent = '';

    const name    = document.getElementById('of-name').value.trim();
    const phone   = document.getElementById('of-phone').value.trim();
    const email   = document.getElementById('of-email') ? document.getElementById('of-email').value.trim() : '';
    const address = document.getElementById('of-address').value.trim();
    const city    = document.getElementById('of-city').value.trim();
    const state   = document.getElementById('of-state').value.trim();
    const pincode = document.getElementById('of-pincode').value.trim();
    const notes   = document.getElementById('of-notes').value.trim();

    const cart    = window.getCart ? window.getCart() : {};
    const chicken = String(cart.chicken || 0);
    const pumpkin = String(cart.pumpkin || 0);
    const banana  = String(cart.banana  || 0);
    const subtotal = 299 * parseInt(chicken) + 249 * parseInt(pumpkin) + 249 * parseInt(banana);
    const discountAmt = appliedReferral ? Math.round(subtotal * appliedReferral.discount / 100) : 0;
    const discountedSubtotal = subtotal - discountAmt;
    const shipping = discountedSubtotal > 0 && discountedSubtotal < 500 ? 50 : 0;
    const finalTotal = discountedSubtotal + shipping;

    if (!name || !phone || !address || !city || !state || !pincode) {
      errorEl.textContent = 'Please fill in all required fields.'; return;
    }
    if (chicken === '0' && pumpkin === '0' && banana === '0') {
      errorEl.textContent = 'Your cart is empty - please add at least one product.'; return;
    }

    orderData = {
      name, phone, email, address, city, state, pincode, chicken, pumpkin, banana, notes,
      subtotal: '₹' + subtotal,
      referralCode: appliedReferral ? appliedReferral.code : '',
      referralOwner: appliedReferral ? appliedReferral.owner : '',
      discountPercent: appliedReferral ? appliedReferral.discount : 0,
      discountAmount: discountAmt,
      shipping: shipping > 0 ? '₹' + shipping : 'Free',
      total: '₹' + finalTotal,
    };

    let items = [];
    if (chicken !== '0') items.push(`Chicken Jerky × ${chicken} = ₹${299 * parseInt(chicken)}`);
    if (pumpkin !== '0') items.push(`Pumpkin & Oats × ${pumpkin} = ₹${249 * parseInt(pumpkin)}`);
    if (banana  !== '0') items.push(`Banana & Oats × ${banana} = ₹${249 * parseInt(banana)}`);

    confirmSummary.innerHTML =
      `<div>👤 <strong>${name}</strong></div>` +
      `<div>📞 ${phone}</div>` +
      (email ? `<div>📧 ${email}</div>` : '') +
      `<div>📦 ${address}, ${city}, ${state} – ${pincode}</div>` +
      `<hr style="border:none;border-top:1px solid var(--border);margin:8px 0"/>` +
      items.map(i => `<div>🛒 ${i}</div>`).join('') +
      (discountAmt > 0 ? `<div class="confirm-discount">🏷️ Referral discount (${appliedReferral.discount}%): −₹${discountAmt}</div>` : '') +
      (shipping > 0 ? `<div class="confirm-shipping">🚚 Shipping: +₹${shipping} <span class="confirm-shipping-note">(order below ₹500 after discount)</span></div>` : `<div class="confirm-shipping free">🚚 Free shipping</div>`) +
      `<div style="margin-top:8px;font-size:1rem">💰 <strong>₹${finalTotal}</strong></div>` +
      (notes ? `<div>📝 ${notes}</div>` : '');

    showStep('confirm');
  });

  confirmBack.addEventListener('click', () => showStep('form'));

  confirmSubmit.addEventListener('click', async function() {
    confirmError.textContent = '';
    confirmSubmit.disabled = true;
    confirmSubmit.textContent = 'Placing...';

    try {
      const orderId = 'PQ-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random() * 900000));
      orderData.orderId = orderId;

      await fetch(SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(orderData)
      });

      localStorage.removeItem('pawstiq_cart');
      updateBadgeAfterOrder();
      successPhone.textContent = orderData.phone;
      const successOrderIdEl = document.getElementById('successOrderId');
      if (successOrderIdEl) successOrderIdEl.textContent = orderId;
      showStep('success');
    } catch (err) {
      confirmError.textContent = 'Something went wrong. Please try again or contact us on Instagram.';
    } finally {
      confirmSubmit.disabled = false;
      confirmSubmit.textContent = 'Yes, Place Order';
    }
  });
})();

/* ---------- Ingredient flip cards (mobile tap) ---------- */
/* ---------- Parallax hero ---------- */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();

/* ---------- 3D card tilt ---------- */
(function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.product-card, .promise-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,.30);
        width:${size}px;
        height:${size}px;
        top:${e.clientY - rect.top  - size/2}px;
        left:${e.clientX - rect.left - size/2}px;
        pointer-events:none;
        transform:scale(0);
        animation:ripple .5s ease-out forwards;
      `;
      btn.style.position = 'relative';
      btn.style.overflow  = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(style);
  }
})();
