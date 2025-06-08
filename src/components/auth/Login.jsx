import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1effff]/10 via-white to-white">
      {/* Header with Home Link */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-[#147d6c] hover:text-[#1effff] transition-colors"
            >
              <span>CareSync AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {(error || authError) && (
              <div className="text-red-500 text-sm text-center">
                {error || authError}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                style={{ backgroundColor: '#147d6c' }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-[#1effff] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#147d6c] transition-all duration-200"
              >
                Sign in
              </button>
              <div className="text-sm text-center">
                <span className="text-gray-500">Don't have an account? </span>
                <Link
                  to="/register"
                  className="font-medium text-[#147d6c] hover:text-[#1effff] transition-colors"
                >
                  Register here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 