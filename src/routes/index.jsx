import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import HomePage from '../components/HomePage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Dashboard (Protected Route)</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 