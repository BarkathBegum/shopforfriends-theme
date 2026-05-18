/* ============================================================
   LUXE HOME — Theme JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Header ──
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hero parallax ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.35;
      heroBg.style.transform = `scale(1) translateY(${y}px)`;
    }, { passive: true });
  }

  // ── Fade-up on scroll ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Cart Drawer ──
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartDrawer  = document.querySelector('.cart-drawer');
  const openCartBtns = document.querySelectorAll('[data-open-cart]');
  const closeCartBtn = document.querySelector('[data-close-cart]');

  const openCart = () => { cartOverlay?.classList.add('open'); cartDrawer?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { cartOverlay?.classList.remove('open'); cartDrawer?.classList.remove('open'); document.body.style.overflow = ''; };

  openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // ── Mobile Nav ──
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  // ── Gallery Thumbs ──
  const thumbs   = document.querySelectorAll('.gallery-thumb');
  const mainImg  = document.querySelector('.gallery-main img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) mainImg.src = thumb.querySelector('img').src;
    });
  });

  // ── Quantity Selector ──
  document.querySelectorAll('.quantity-selector').forEach(sel => {
    const minus = sel.querySelector('[data-minus]');
    const plus  = sel.querySelector('[data-plus]');
    const input = sel.querySelector('.quantity-input');
    minus?.addEventListener('click', () => { const v = parseInt(input.value); if (v > 1) input.value = v - 1; });
    plus?.addEventListener('click',  () => { input.value = parseInt(input.value) + 1; });
  });

  // ── Variant Buttons ──
  document.querySelectorAll('.variant-options').forEach(group => {
    group.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // ── Animate stats counter ──
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start  = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(ease * target) : (ease * target).toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statObserver.observe(el));

  // ── Add to cart feedback ──
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const original = this.textContent;
      this.textContent = 'Added!';
      this.style.background = '#2a7a2a';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
      }, 1600);
      const count = document.querySelector('.cart-count');
      if (count) count.textContent = (parseInt(count.textContent) || 0) + 1;
    });
  });

  // ── Newsletter form ──
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Subscribed!'; btn.disabled = true; }
  });

});
