import { storage } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = await storage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Protected backend routes use the same JWT header as the Web frontend.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Set up request timeout (10 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // On 401, clear stored credentials so user is logged out
    if (response.status === 401) {
      await storage.removeItem('token');
      await storage.removeItem('user');
    }
    throw new Error(data.message || '请求失败，请稍后重试。');
  }

  return data;
}

export const api = {
  getProducts(params = {}) {
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
  createOrder(items, shippingAddress) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress })
    });
  },
  getUserOrders(userId) {
    return request(`/orders/user/${userId}`);
  }
};
