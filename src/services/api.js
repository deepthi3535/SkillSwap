import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillswap_token');
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// --- Users ---
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getMatches: () => api.get('/users/matches'),
};

// --- Swaps ---
export const swapAPI = {
  sendRequest: (data) => api.post('/swaps/request', data),
  getIncoming: () => api.get('/swaps/incoming'),
  getSent: () => api.get('/swaps/sent'),
  accept: (id) => api.put(`/swaps/${id}/accept`),
  reject: (id) => api.put(`/swaps/${id}/reject`),
  getActive: () => api.get('/swaps/active'),
  complete: (id) => api.put(`/swaps/${id}/complete`),
  submitReview: (data) => api.post('/swaps/review', data),
};

export default api;
