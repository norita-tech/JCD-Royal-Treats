/* HTTP client for the JCD Royal Treats backend API.
   Falls back gracefully when the server is not running. */

const API_BASE = '/api';

const api = {
  /* Token helpers */
  getToken()    { return sessionStorage.getItem('jcd_admin_token'); },
  setToken(t)   { sessionStorage.setItem('jcd_admin_token', t); },
  clearToken()  { sessionStorage.removeItem('jcd_admin_token'); },
  isLoggedIn()  { return !!this.getToken(); },

  async request(method, path, body = null, isFormData = false) {
    const headers = {};
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body && !isFormData) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  /* Products */
  getProducts()               { return this.request('GET',    '/products'); },
  getProduct(id)              { return this.request('GET',    `/products/${id}`); },
  createProduct(formData)     { return this.request('POST',   '/products',    formData, true); },
  updateProduct(id, formData) { return this.request('PUT',    `/products/${id}`, formData, true); },
  deleteProduct(id)           { return this.request('DELETE', `/products/${id}`); },

  /* Orders */
  createOrder(order)          { return this.request('POST',   '/orders', order); },
  getOrders()                 { return this.request('GET',    '/orders'); },
  getOrder(ref)               { return this.request('GET',    `/orders/${ref}`); },
  updateOrderStatus(id, status) { return this.request('PATCH', `/orders/${id}/status`, { status }); },

  /* Auth */
  async login(password) {
    const data = await this.request('POST', '/auth/login', { password });
    this.setToken(data.token);
    return data;
  },
  logout() { this.clearToken(); },

  /* Paystack */
  initPayment(email, amount, orderRef, callbackUrl) {
    return this.request('POST', '/paystack/initialize', { email, amount, orderRef, callbackUrl });
  },
  verifyPayment(reference) { return this.request('GET', `/paystack/verify/${reference}`); },

  /* Stripe */
  createStripeSession(orderData)           { return this.request('POST', '/stripe/create-checkout-session', orderData); },
  verifyStripePayment(sessionId, orderRef) { return this.request('POST', '/stripe/verify', { sessionId, orderRef }); },
};
