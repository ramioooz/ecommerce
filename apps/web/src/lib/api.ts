import axios from 'axios';
import { clearClientAuth } from './store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:20000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        clearClientAuth();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  refresh: (data: { userId: string; refreshToken: string }) =>
    api.post('/auth/refresh', data),
};

export const products = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const categories = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
};

export const cart = {
  get: () => api.get('/cart'),
  addItem: (data: {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }) =>
    api.post('/cart/items', data),
  updateItem: (productId: string, data: { quantity: number }) =>
    api.put(`/cart/items/${productId}`, data),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clear: () => api.delete('/cart'),
};

export const orders = {
  create: (data: { items: any[]; shippingAddressId: string; couponCode?: string }) =>
    api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data: any) => api.post('/users/addresses', data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};

export const payments = {
  checkout: (data: { orderId: string; paymentMethod: string }) =>
    api.post('/payments/checkout', data),
  getStatus: (orderId: string) => api.get(`/payments/${orderId}`),
};
