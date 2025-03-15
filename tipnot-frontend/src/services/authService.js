import api from './api';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';

export const AuthService = {
  // Register new user
  register: async (userData) => {
    console.log('Sending registration data:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // If response includes user data, store it
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // If no user data in response, try to get user profile
          try {
            const userResponse = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${response.data.token}` }
            });
            if (userResponse.data) {
              localStorage.setItem('user', JSON.stringify(userResponse.data));
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default AuthService; 