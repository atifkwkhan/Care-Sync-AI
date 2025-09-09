


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import OrganizationLogin from '../components/auth/OrganizationLogin';
import Register from '../components/auth/Register';
import OrganizationRegister from '../components/auth/OrganizationRegister';
import Dashboard from '../components/Dashboard';
import Patients from '../components/Patients';
import Appointments from '../components/Appointments';
import Doctors from '../components/Doctors';
import PageLayout from '../components/PageLayout';
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
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <PrivateRoute>
            <Doctors />
          </PrivateRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <PageLayout title="Messages" subtitle="Secure messaging and notifications">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Secure Messaging</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Inbox, secure chat, and notifications will be available here.
                  </p>
                </div>
              </div>
            </PageLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <PrivateRoute>
            <PageLayout title="Billing & Finance" subtitle="Billing, authorizations, and payments">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Billing & Finance</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Billing, authorizations, and payments will be available here.
                  </p>
                </div>
              </div>
            </PageLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <PageLayout title="Reports" subtitle="Compliance, QA, audits, and analytics">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Reports & Analytics</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Compliance, QA, audits, and analytics will be available here.
                  </p>
                </div>
              </div>
            </PageLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/quality"
        element={
          <PrivateRoute>
            <PageLayout title="Quality & Safety" subtitle="QAPI, infection control, and fall tracker">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Quality & Safety</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    QAPI, infection control, and fall tracker will be available here.
                  </p>
                </div>
              </div>
            </PageLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <PageLayout title="Inventory" subtitle="Supplies, DME, and medications">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Inventory Management</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Supplies, DME, and medications will be available here.
                  </p>
                </div>
              </div>
            </PageLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 