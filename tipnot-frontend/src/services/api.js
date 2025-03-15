import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create an instance of axios with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if implemented
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Content APIs
export const contentAPI = {
  getAllContent: (filters) => api.get('/content', { params: filters }),
  getContentById: (id) => api.get(`/content/${id}`),
  getContentCategories: () => api.get('/content/categories'),
  getContentTypes: () => api.get('/content/types'),
  searchContent: (query) => api.get(`/content/search?q=${query}`),
};

// User APIs
export const userAPI = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadProfilePicture: (formData) => api.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getEnrollments: () => api.get('/users/enrollments'),
  enrollInCourse: (courseId) => api.post(`/users/enrollments/${courseId}`),
};

// Progress tracking APIs
export const progressAPI = {
  getProgress: (contentId) => api.get(`/progress/${contentId}`),
  updateProgress: (contentId, progress) => api.post(`/progress/${contentId}`, { progress }),
  completeContent: (contentId) => api.post(`/progress/${contentId}/complete`),
};

export default api; 