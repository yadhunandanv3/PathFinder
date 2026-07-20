import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified Response Error Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).catch(() => api.post('/api/auth/login', credentials)),
  me: () => api.get('/auth/me').catch(() => api.get('/api/auth/me')),
};

export const contentAPI = {
  getAll: (params) => api.get('/content', { params }).catch(() => api.get('/resources', { params })),
  getById: (id, params) => api.get(`/content/${id}`, { params }).catch(() => api.get(`/resources/${id}`, { params })),
  create: (contentData) => api.post('/content', contentData).catch(() => api.post('/resources', contentData)),
  update: (id, contentData) => api.put(`/content/${id}`, contentData).catch(() => api.put(`/resources/${id}`, contentData)),
  delete: (id) => api.delete(`/content/${id}`).catch(() => api.delete(`/resources/${id}`)),
};

export const userAPI = {
  getAll: () => api.get('/users').catch(() => api.get('/api/users')),
  create: (userData) => api.post('/users', userData).catch(() => api.post('/api/users', userData)),
  update: (id, userData) => api.put(`/users/${id}`, userData).catch(() => api.put(`/api/users/${id}`, userData)),
  delete: (id) => api.delete(`/users/${id}`).catch(() => api.delete(`/api/users/${id}`)),
};

export const resourceAPI = contentAPI;

export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch(() => api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })),
};

export default api;
