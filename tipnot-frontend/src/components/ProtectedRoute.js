import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      setChecking(false);
    };
    
    if (!loading) {
      checkAuth();
    }
  }, [loading, isAuthenticated]);

  // Show loading state while authentication is being checked
  if (loading || checking) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!authenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 