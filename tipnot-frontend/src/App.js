import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Content from './pages/Content';
import ContentDetail from './pages/ContentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import GlobalStyles from './styles/GlobalStyles';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ContentEditor from './pages/ContentEditor';

// Create a special route for admin-only access
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          
          {/* Protected Routes */}
          <Route 
            path="/content" 
            element={
              <ProtectedRoute>
                <Layout><Content /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/content/:id" 
            element={
              <ProtectedRoute>
                <Layout><ContentDetail /></Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/content/create" 
            element={
              <AdminRoute>
                <ContentEditor />
              </AdminRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </>
  );
}

export default App; 