/* Admin dashboard — JWT auth, product CRUD via API, order management */

let editingId = null;

/* Admin always works in CHF — never apply the country conversion rate */
function formatCHF(amount) { return `CHF ${Number(amount).toFixed(2)}`; }

const CATEGORY_BG = {
  baked:  'linear-gradient(135deg,#f6d365,#fda085)',
  fried:  'linear-gradient(135deg,#d4a96a,#c8860a)',
  savory: 'linear-gradient(135deg,#d4a96a,#7d4e2d)',
  snacks: 'linear-gradient(135deg,#c8a97e,#6b4226)',
  chips:  'linear-gradient(135deg,#f9ca24,#f0932b)',
};

/* ---- Auth ---- */

function checkAuth() {
  const authed = api.isLoggedIn();
  document.getElementById('admin-login').style.display    = authed ? 'none' : 'flex';
  document.getElementById('admin-content').style.display = authed ? 'grid' : 'none';
  if (authed) loadDashboard();
}

async function login() {
  const pw    = document.getElementById('admin-pw').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  try {
    await api.login(pw);
    checkAuth();
  } catch (err) {
    errEl.textContent = err.message || 'Login failed';
  }
}

function logout() {
  api.logout();
  checkAuth();
}

/* ---- Dashboard ---- */

async function loadDashboard() {
  let products = [];
  let orders   = [];
  try { products = await api.getProducts(); } catch { products = getProducts(); }
  try { orders   = await api.getOrders();   } catch { /* offline */ }

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  document.getElementById('stat-products').textContent   = products.length;
  document.getElementById('stat-orders').textContent     = orders.length;
  document.getElementById('stat-revenue').textContent    = formatCHF(revenue);
  document.getElementById('stat-categories').textContent = new Set(products.map(p => p.category)).size;

  renderProductsTable(products);
}

function renderProductsTable(products) {
  const tbody = document.getElementById('products-tbody');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:2rem">No products yet. Add one!</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="product-thumb" style="background:${p.bg}">
          ${p.image_url
            ? `<img src="${p.image_url}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)"
                    onerror="this.style.display='none'">`
            : p.emoji}
        </div>
      </td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-${p.category}">${p.category}</span></td>
      <td><strong>${formatCHF(p.price)}</strong></td>
      <td style="color:var(--text-light)">${p.unit === 'litre' ? 'per L' : p.unit === 'kg' ? 'per kg' : 'per pc'}<br><small>${p.weight ?? 250} g</small></td>
      <td style="max-width:200px;color:var(--text-light)">${p.description.substring(0, 55)}…</td>
      <td>
        <button class="btn-edit"   onclick="openEditModal(${p.id})">Edit</button>
        <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>`).join('');
}

/* ---- Product Modal ---- */

function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  document.getElementById('img-preview').style.display = 'none';
  document.getElementById('product-modal').classList.add('open');
}

async function openEditModal(id) {
  let product;
  try { product = await api.getProduct(id); }
  catch { product = getProducts().find(p => p.id === id); }
  if (!product) return;

  editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('p-name').value        = product.name;
  document.getElementById('p-price').value       = product.price;
  document.getElementById('p-weight').value      = product.weight ?? 250;
  document.getElementById('p-unit').value        = product.unit || 'piece';
  document.getElementById('p-category').value    = product.category;
  document.getElementById('p-emoji').value       = product.emoji;
  document.getElementById('p-description').value = product.description;

  const preview = document.getElementById('img-preview');
  if (product.image_url) {
    preview.src   = product.image_url;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  document.getElementById('product-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('open');
  editingId = null;
}

async function saveProduct() {
  const name        = document.getElementById('p-name').value.trim();
  const price       = parseFloat(document.getElementById('p-price').value);
  const weight      = parseInt(document.getElementById('p-weight').value) || 250;
  const unit        = document.getElementById('p-unit').value;
  const category    = document.getElementById('p-category').value;
  const emoji       = document.getElementById('p-emoji').value.trim() || '🍞';
  const description = document.getElementById('p-description').value.trim();
  const imageFile   = document.getElementById('p-image').files[0];

  if (!name || isNaN(price) || price <= 0 || !description) {
    alert('Please fill in all required fields with valid values.');
    return;
  }

  const formData = new FormData();
  formData.append('name',        name);
  formData.append('price',       price);
  formData.append('weight',      weight);
  formData.append('unit',        unit);
  formData.append('category',    category);
  formData.append('emoji',       emoji);
  formData.append('description', description);
  formData.append('bg',          CATEGORY_BG[category] || CATEGORY_BG.baked);
  if (imageFile) formData.append('image', imageFile);

  try {
    if (editingId !== null) {
      await api.updateProduct(editingId, formData);
    } else {
      await api.createProduct(formData);
    }
    closeModal();
    await loadDashboard();
    showAdminToast(editingId !== null ? '✓ Product updated!' : '✓ Product added!');
  } catch (err) {
    alert(`Save failed: ${err.message}`);
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    await api.deleteProduct(id);
    await loadDashboard();
    showAdminToast('Product deleted.');
  } catch (err) {
    alert(`Delete failed: ${err.message}`);
  }
}

/* ---- Orders ---- */

async function viewOrders() {
  const panel = document.getElementById('orders-panel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });

  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-light)">Loading…</td></tr>';

  try {
    const orders = await api.getOrders();
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-light)">No orders yet.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.ref}</strong></td>
        <td>${o.first_name} ${o.last_name}<br><small style="color:var(--text-light)">${o.email}</small></td>
        <td style="max-width:200px;font-size:0.85rem">${o.items_summary || '—'}</td>
        <td><strong>R${Number(o.total).toFixed(2)}</strong></td>
        <td style="text-transform:capitalize">${o.payment_method}</td>
        <td>
          <select onchange="updateStatus(${o.id}, this.value)" style="border:2px solid var(--border);border-radius:6px;padding:4px 8px;font-family:inherit;font-size:0.82rem">
            ${['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'].map(s =>
              `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s.replace(/_/g,' ')}</option>`
            ).join('')}
          </select>
        </td>
        <td style="font-size:0.82rem;color:var(--text-light)">${new Date(o.created_at).toLocaleDateString()}</td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--danger)">${err.message}</td></tr>`;
  }
}

async function updateStatus(id, status) {
  try {
    await api.updateOrderStatus(id, status);
    showAdminToast('✓ Status updated');
  } catch (err) {
    alert(`Update failed: ${err.message}`);
  }
}

/* ---- Utilities ---- */

function showAdminToast(msg) {
  const toast = document.getElementById('admin-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function previewImage(input) {
  const preview = document.getElementById('img-preview');
  const file = input.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

/* ---- Init ---- */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  document.getElementById('product-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('admin-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
});
