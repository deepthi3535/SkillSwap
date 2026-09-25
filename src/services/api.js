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
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors & session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillswap_token');
      localStorage.removeItem('skillswap_user');
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
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getMatches: (params) => api.get('/matches', { params }),
};

// --- Swaps ---
export const swapAPI = {
  sendRequest: (data) => api.post('/swaps', data),
  getSwaps: () => api.get('/swaps'),
  getIncoming: () => api.get('/swaps/incoming'),
  getSent: () => api.get('/swaps/sent'),
  getActive: () => api.get('/swaps/active'),
  accept: (id) => api.put(`/swaps/${id}/accept`),
  reject: (id) => api.put(`/swaps/${id}/reject`),
  complete: (id) => api.put(`/swaps/${id}/complete`),
  cancel: (id) => api.put(`/swaps/${id}/cancel`),
  submitReview: (data) => api.post('/swaps/review', data),
};

// --- Reviews ---
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

export default api;
