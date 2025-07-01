import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { OrganizationFormData } from '../../types/Organization';

const OrganizationRegister = () => {
  const [formData, setFormData] = useState(OrganizationFormData);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    // Validate password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/organizations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Organization registration failed');
      }

      // Navigate to user registration with the organization ID
      navigate('/register', { state: { organizationId: data.organization.id } });
    } catch (err) {
      console.error('Organization registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1effff]/10 via-white to-white">
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

      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Register Your Organization
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

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.phone}
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
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.website}
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
                minLength="8"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Register Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister; 