import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DISCIPLINE_OPTIONS, EMPLOYEE_TYPE_OPTIONS } from '../../types/User';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
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

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name Fields */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Suffix and Discipline */}
              <div>
                <label htmlFor="suffix" className="block text-sm font-medium text-gray-700">
                  Suffix (optional)
                </label>
                <input
                  type="text"
                  name="suffix"
                  id="suffix"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
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

              {/* Username and Employee ID */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Preferred Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.agencyEmployeeId}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Information */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">
                  Primary Phone
                </label>
                <input
                  type="text"
                  name="phone1"
                  id="phone1"
                  required
                  placeholder="(XXX) XXX-XXXX"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.phone1}
                  onChange={handlePhoneChange}
                />
              </div>

              <div>
                <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">
                  Secondary Phone (optional)
                </label>
                <input
                  type="text"
                  name="phone2"
                  id="phone2"
                  placeholder="(XXX) XXX-XXXX"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.phone2}
                  onChange={handlePhoneChange}
                />
              </div>

              {/* Employee Type */}
              <div>
                <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700">
                  Employee Type
                </label>
                <select
                  name="employeeType"
                  id="employeeType"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#147d6c] focus:border-[#147d6c] sm:text-sm"
                  value={formData.employeeType}
                  onChange={handleChange}
                >
                  {EMPLOYEE_TYPE_OPTIONS.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#147d6c]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                style={{ backgroundColor: '#147d6c' }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#1effff] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#147d6c] transition-all duration-200"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 