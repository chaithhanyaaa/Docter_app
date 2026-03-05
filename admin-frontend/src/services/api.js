import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/admin-auth/login', { email, password }),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => api.get('/admin/doctors'),
  approve: (id) => api.put(`/admin/doctors/${id}/approve`),
  disapprove: (id) => api.put(`/admin/doctors/${id}/disapprove`),
  delete: (id) => api.delete(`/admin/doctors/${id}`),
};

// Banners API
export const bannersAPI = {
  getAll: () => api.get('/banners'),          // ✅ public endpoint
  create: (title, imageData) =>
    api.post('/admin/banners', { title, imageData }), // ✅ admin endpoint
  delete: (id) => api.delete(`/admin/banners/${id}`), // ✅ admin endpoint
};

export default api;