/* ShopForFriends Theme JS v2 */
document.addEventListener('DOMContentLoaded', () => {

  // Header scroll effect
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero parallax
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight)
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  // Fade up on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Cart drawer
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartDrawer  = document.querySelector('.cart-drawer');
  const openCart  = (e) => { e?.preventDefault(); cartOverlay?.classList.add('open'); cartDrawer?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { cartOverlay?.classList.remove('open'); cartDrawer?.classList.remove('open'); document.body.style.overflow = ''; };
  document.querySelectorAll('[data-open-cart]').forEach(el => el.addEventListener('click', openCart));
  document.querySelector('[data-close-cart]')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  // Hamburger
  document.querySelector('.hamburger')?.addEventListener('click', function() {
    const isOpen = this.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // AJAX Add to Cart
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = productForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Adding...';
      btn.disabled = true;
      try {
        const res = await fetch('/cart/add.js', { method: 'POST', body: new FormData(productForm) });
        if (!res.ok) throw new Error();
        const cart = await (await fetch('/cart.js')).json();
        const el = document.querySelector('.cart-count');
        if (el) { el.textContent = cart.item_count; el.style.display = 'flex'; }
        btn.textContent = 'Added \u2713';
        btn.style.background = '#2d6a2d';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; openCart(); }, 1000);
      } catch { btn.textContent = 'Try again'; btn.disabled = false; }
    });
  }

  // Cart qty / remove
  document.addEventListener('click', async (e) => {
    if (e.target.matches('.qty-btn')) {
      const key = e.target.dataset.key;
      const qtyEl = e.target.closest('.cart-item-qty')?.querySelector('.qty-val');
      if (!qtyEl) return;
      let qty = parseInt(qtyEl.textContent);
      qty = e.target.dataset.action === 'increase' ? qty + 1 : Math.max(0, qty - 1);
      await changeCart(key, qty);
    }
    if (e.target.matches('.cart-item-remove')) await changeCart(e.target.dataset.key, 0);
  });

  async function changeCart(key, qty) {
    try {
      const cart = await (await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      })).json();
      const el = document.querySelector('.cart-count');
      if (el) { el.textContent = cart.item_count; el.style.display = cart.item_count > 0 ? 'flex' : 'none'; }
      window.location.reload();
    } catch(err) { console.error(err); }
  }

  // Newsletter
  document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribing...'; btn.disabled = true;
    try {
      await fetch('/', { method: 'POST', body: new FormData(e.target) });
      btn.textContent = 'Subscribed \u2713'; btn.style.background = '#2d6a2d';
    } catch { btn.textContent = 'Subscribe'; btn.disabled = false; }
  });

});
