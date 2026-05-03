/* Shared product data, rendering utilities, and page scaffolding */

/* Built-in product data — used when the server is offline */
const PRODUCTS_DEFAULT = [
  { id: 1, name: 'Banana Bread',   price: 7.50, weight: 500, category: 'baked',  description: 'Moist, golden banana bread made with ripe bananas, butter and a hint of cinnamon.',          emoji: '🍌', bg: 'linear-gradient(135deg,#f6d365,#fda085)', featured: true,  badge: 'Bestseller'     },
  { id: 2, name: 'Puff Puff',      price: 4.50, weight: 300, category: 'fried',  description: 'Light, fluffy deep-fried dough balls dusted with sugar — a West African classic.',           emoji: '🟡', bg: 'linear-gradient(135deg,#d4a96a,#c8860a)', featured: true,  badge: 'Fan Favourite' },
  { id: 3, name: 'Chin Chin',      price: 5.50, weight: 250, category: 'fried',  description: 'Crunchy, lightly sweetened fried dough snack. Addictive and perfect for snacking.',         emoji: '✨', bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)', featured: false, badge: null            },
  { id: 4, name: 'Peanut Burger',  price: 5.00, weight: 200, category: 'snacks', description: 'Crispy peanut-coated patties with a satisfying crunch in every bite.',                      emoji: '🥜', bg: 'linear-gradient(135deg,#c8a97e,#6b4226)', featured: true,  badge: null            },
  { id: 5, name: 'Meat Pie',       price: 6.50, weight: 200, category: 'savory', description: 'Golden pastry filled with seasoned minced meat, potatoes and carrots.',                     emoji: '🥧', bg: 'linear-gradient(135deg,#d4a96a,#7d4e2d)', featured: true,  badge: 'Popular'        },
  { id: 6, name: 'Fish Roll',      price: 6.00, weight: 150, category: 'savory', description: 'Flaky pastry rolled with seasoned fish filling — a perfect snack any time.',                emoji: '🐟', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', featured: false, badge: null            },
  { id: 7, name: 'Scotch Egg',     price: 7.00, weight: 200, category: 'savory', description: 'Hard-boiled egg wrapped in seasoned meat, breaded and fried to golden perfection.',         emoji: '🥚', bg: 'linear-gradient(135deg,#ffeaa7,#dfe6e9)', featured: true,  badge: null            },
  { id: 8, name: 'Plantain Chips', price: 4.00, weight: 100, category: 'chips',  description: 'Crispy sliced plantain chips, lightly salted — great for snacking anytime.',                emoji: '🍃', bg: 'linear-gradient(135deg,#f9ca24,#f0932b)', featured: false, badge: null            },
  { id: 9, name: 'Potato Chips',   price: 3.50, weight: 100, category: 'chips',  description: 'House-made potato chips, thinly sliced and perfectly seasoned.',                           emoji: '🥔', bg: 'linear-gradient(135deg,#f8b500,#e17055)', featured: false, badge: null            },
];

/* In-memory cache populated by loadProducts() */
let _cache = null;

/* Fetch products from the API; falls back to localStorage or built-in defaults */
async function loadProducts() {
  try {
    _cache = await api.getProducts();
    return _cache;
  } catch {
    const stored = localStorage.getItem('jcd_products');
    _cache = stored ? JSON.parse(stored) : [...PRODUCTS_DEFAULT];
    return _cache;
  }
}

/* Synchronous access to cached products (e.g. for cart page rendering) */
function getProducts() {
  if (_cache) return _cache;
  const stored = localStorage.getItem('jcd_products');
  return stored ? JSON.parse(stored) : [...PRODUCTS_DEFAULT];
}

function productImageHTML(product) {
  if (product.image_url) {
    return `<img src="${product.image_url}" alt="${product.name}"
                 style="width:100%;height:100%;object-fit:cover;"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
            <span style="display:none;font-size:4rem">${product.emoji}</span>`;
  }
  return `<span style="font-size:4rem">${product.emoji}</span>`;
}

function createProductCard(product) {
  const descs = (typeof I18N !== 'undefined') ? I18N.t().productDescs : null;
  const desc  = (descs && descs[product.name]) ? descs[product.name] : product.description;
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image" style="background:${product.bg}">
        ${productImageHTML(product)}
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${desc}</div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="card-actions">
            <div class="card-qty-stepper">
              <button type="button" onclick="let i=this.nextElementSibling; if(+i.value>1) i.stepDown()">−</button>
              <input type="number" class="qty-input" value="1" min="1" max="99" aria-label="Quantity" />
              <button type="button" onclick="this.previousElementSibling.stepUp()">+</button>
            </div>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id}, this)">
              ${(typeof I18N !== 'undefined') ? I18N.t().product.addToCart : '+ Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function handleAddToCart(productId, btn) {
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;
  const qtyInput = btn.closest('.product-footer').querySelector('.qty-input');
  const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
  Cart.add(product, qty);
  if (qtyInput) qtyInput.value = 1;
  const tr = (typeof I18N !== 'undefined') ? I18N.t().product : null;
  btn.textContent = tr ? tr.added : '✓ Added!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = tr ? tr.addToCart : '+ Add to Cart';
    btn.classList.remove('added');
  }, 1500);
}

/* Hamburger menu + active nav link */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
});
