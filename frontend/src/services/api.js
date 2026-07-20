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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id, params) => api.get(`/resources/${id}`, { params }),
  create: (resourceData) => api.post('/resources', resourceData),
  update: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  delete: (id) => api.delete(`/resources/${id}`),
  
  getCategories: () => api.get('/resources/categories'),
  createCategory: (categoryData) => api.post('/resources/categories', categoryData),
  deleteCategory: (id) => api.delete(`/resources/categories/${id}`),
};

export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;
