import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(credentials);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    // First check if we have a current user in state
    if (currentUser) return true;
    
    // Then check localStorage as a fallback
    return AuthService.isAuthenticated();
  };

  // Value provided to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 