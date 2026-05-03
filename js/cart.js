/* Cart state management — persisted to localStorage */
const Cart = (() => {
  const KEY = 'jcd_cart';
  let items = JSON.parse(localStorage.getItem(KEY)) || [];

  function save() {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateBadge();
  }

  function updateBadge() {
    const count = items.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function add(product, qty = 1) {
    qty = Math.max(1, parseInt(qty) || 1);
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: product.id, name: product.name, price: product.price, weight: product.weight || 250, category: product.category, emoji: product.emoji, bg: product.bg, qty });
    }
    save();
    showToast(`${qty > 1 ? qty + '× ' : ''}${product.name} added to cart! 🛒`);
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    save();
  }

  function updateQty(id, qty) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty < 1) {
      remove(id);
    } else {
      item.qty = qty;
      save();
    }
  }

  function getItems()    { return [...items]; }
  function getCount()    { return items.reduce((s, i) => s + i.qty, 0); }
  function getSubtotal() { return items.reduce((s, i) => s + i.price * i.qty, 0); }
  function getWeightKg() { return items.reduce((s, i) => s + (i.weight || 250) * i.qty, 0) / 1000; }
  function getDelivery() {
    if (!getSubtotal()) return 0;
    if (typeof I18N !== 'undefined') return I18N.getDeliveryFee(getWeightKg());
    /* Fallback flat rates if i18n not loaded */
    const FEES = { ch: 8.50, de: 5.28, fr: 4.86 };
    const c = localStorage.getItem('jcd_country') || 'ch';
    return FEES[c] ?? 8.50;
  }
  function getTotal() { return getSubtotal() + getDelivery(); }
  function clear()        { items = []; save(); }

  function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🍞</span> ${message}`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  return { add, remove, updateQty, getItems, getCount, getSubtotal, getWeightKg, getDelivery, getTotal, clear, updateBadge };
})();

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
