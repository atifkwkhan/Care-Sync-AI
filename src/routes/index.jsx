import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import OrganizationLogin from '../components/auth/OrganizationLogin';
import Register from '../components/auth/Register';
import OrganizationRegister from '../components/auth/OrganizationRegister';
import Dashboard from '../components/Dashboard';
import PrivateRoute from './PrivateRoute';
import HomePage from '../components/HomePage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/organization/login" element={<OrganizationLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/organization" element={<OrganizationRegister />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 