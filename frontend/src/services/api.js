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
  login: (credentials) => api.post('/api/auth/login', credentials),
  me: () => api.get('/api/auth/me'),
};

export const contentAPI = {
  getAll: (params) => api.get('/api/content', { params }),
  getById: (id, params) => api.get(`/api/content/${id}`, { params }),
  create: (contentData) => api.post('/api/content', contentData),
  update: (id, contentData) => api.put(`/api/content/${id}`, contentData),
  delete: (id) => api.delete(`/api/content/${id}`),
};

export const userAPI = {
  getAll: () => api.get('/api/users'),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export const resourceAPI = {
  getAll: (params) => api.get('/api/content', { params }),
  getById: (id, params) => api.get(`/api/content/${id}`, { params }),
  create: (resourceData) => api.post('/api/content', resourceData),
  update: (id, resourceData) => api.put(`/api/content/${id}`, resourceData),
  delete: (id) => api.delete(`/api/content/${id}`),
  
  getCategories: () => Promise.resolve({ success: true, data: [
    { _id: 'c1', name: 'Handbooks' },
    { _id: 'c2', name: 'Testimonials' },
    { _id: 'c3', name: 'Inspirations' },
    { _id: 'c4', name: 'Strategy' },
    { _id: 'c5', name: 'General' },
  ] }),
  createCategory: (catData) => Promise.resolve({ success: true, data: { _id: Date.now(), name: catData.name } }),
  deleteCategory: (id) => Promise.resolve({ success: true }),
};

export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;
