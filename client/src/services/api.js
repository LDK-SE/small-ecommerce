import { resolveApiBaseUrl } from './apiBase.js';

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS) || 10000;

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // All protected backend routes accept JWT through the Authorization header.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network and try again.');
    }
    throw new Error('Network error. Please check your connection.');
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  getProducts(params = {}) {
    // Keep query construction centralized so pages can pass only the filters they need.
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct(id) {
    return request(`/products/${id}`);
  },
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getMe() {
    return request('/users/me');
  },
  updateMe(payload) {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  getAddresses() {
    return request('/users/addresses');
  },
  addAddress(payload) {
    return request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  updateAddress(id, payload) {
    return request(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  deleteAddress(id) {
    return request(`/users/addresses/${id}`, {
      method: 'DELETE'
    });
  },
  createOrder(items, shippingAddress) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress })
    });
  },
  getAllOrders() {
    return request('/orders');
  },
  getUserOrders(userId) {
    return request(`/orders/user/${userId}`);
  },
  payOrder(orderId, paymentMethod = 'mock') {
    return request(`/orders/${orderId}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ paymentMethod })
    });
  },
  updateOrder(orderId, payload) {
    return request(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  createProduct(payload) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  updateProduct(id, payload) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  deleteProduct(id) {
    return request(`/products/${id}`, {
      method: 'DELETE'
    });
  },
  createReview(productId, payload) {
    return request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getAdminStats() {
    return request('/admin/stats');
  }
};
