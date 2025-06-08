import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DISCIPLINE_OPTIONS, EMPLOYEE_TYPE_OPTIONS } from '../../types/User';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    suffix: '',
    discipline: '',
    username: '',
    password: '',
    agencyEmployeeId: '',
    email: '',
    phone1: '',
    phone2: '',
    employeeType: 'Staff'
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Format phone number as (XXX) XXX-XXXX
    const phoneNumber = value.replace(/\D/g, '');
    const formattedNumber = phoneNumber.length > 0 
      ? `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`
      : '';
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedNumber
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Login the user after successful registration
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
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

      {/* Registration Form */}
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create New Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#147d6c] hover:text-[#1effff] transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="suffix" className="block text-sm font-medium text-gray-700">
                Suffix
              </label>
              <input
                type="text"
                name="suffix"
                id="suffix"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.suffix}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="discipline" className="block text-sm font-medium text-gray-700">
                Discipline
              </label>
              <select
                name="discipline"
                id="discipline"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                value={formData.discipline}
                onChange={handleChange}
              >
                <option value="">Select a discipline</option>
                {DISCIPLINE_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700">
                Employee Type
              </label>
              <select
                name="employeeType"
                id="employeeType"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                value={formData.employeeType}
                onChange={handleChange}
              >
                <option value="">Select employee type</option>
                {EMPLOYEE_TYPE_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="agencyEmployeeId" className="block text-sm font-medium text-gray-700">
                Agency Employee ID
              </label>
              <input
                type="text"
                name="agencyEmployeeId"
                id="agencyEmployeeId"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.agencyEmployeeId}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">
                Primary Phone
              </label>
              <input
                type="tel"
                name="phone1"
                id="phone1"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.phone1}
                onChange={handlePhoneChange}
              />
            </div>

            <div>
              <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">
                Secondary Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone2"
                id="phone2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.phone2}
                onChange={handlePhoneChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 