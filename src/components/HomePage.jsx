import React from 'react';
import logo from '../assets/logo.svg';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1effff]/10 via-white to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#147d6c' }}>CareSync AI</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#" className="text-gray-700 hover:text-[#1effff] px-3 py-2 rounded-md font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-[#1effff] px-3 py-2 rounded-md font-medium transition-colors">Services</a>
              <a href="#" className="text-gray-700 hover:text-[#1effff] px-3 py-2 rounded-md font-medium transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-[#1effff] px-3 py-2 rounded-md font-medium transition-colors">Contact</a>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <a
                href="#"
                style={{ backgroundColor: '#147d6c' }}
                className="inline-flex items-center px-4 py-2 text-base font-medium rounded-md text-white hover:bg-[#1effff] hover:text-gray-800 transition-all duration-200 shadow-sm"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-16">
            <img 
              src={logo} 
              alt="CareSync AI" 
              className="w-full max-w-xl mx-auto h-auto" 
              style={{ maxWidth: '500px' }}
            />
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Transform Healthcare with</span>
            <span className="block text-[#147d6c] hover:text-[#1effff] transition-colors">AI-Powered Care</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Revolutionizing home healthcare with intelligent monitoring, predictive analytics, and personalized care solutions.
          </p>
          <div className="mt-10 flex justify-center items-center space-x-4">
            <a
              href="#"
              style={{ backgroundColor: '#147d6c' }}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover:bg-[#1effff] hover:text-gray-800 transition-all duration-200 shadow-sm"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="inline-flex items-center px-8 py-3 border-2 border-[#147d6c] text-base font-medium rounded-md text-[#147d6c] bg-white hover:border-[#1effff] hover:text-[#1effff] transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#147d6c] to-[#1effff]/30 rounded-lg flex items-center justify-center mb-4 group-hover:to-[#1effff]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#147d6c]">Smart Monitoring</h3>
            <p className="text-gray-600">24/7 intelligent monitoring system that tracks vital signs and daily activities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#147d6c] to-[#1effff]/30 rounded-lg flex items-center justify-center mb-4 group-hover:to-[#1effff]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#147d6c]">Predictive Analytics</h3>
            <p className="text-gray-600">AI-powered insights to predict and prevent potential health issues.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#147d6c] to-[#1effff]/30 rounded-lg flex items-center justify-center mb-4 group-hover:to-[#1effff]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#147d6c]">Personalized Care</h3>
            <p className="text-gray-600">Customized care plans that adapt to individual needs and preferences.</p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="text-center py-8 bg-gradient-to-r from-[#147d6c]/10 to-[#1effff]/10">
        <p className="text-sm text-gray-700">
          Created with ❤️ by{' '}
          <span className="font-medium text-[#147d6c] hover:text-[#1effff] transition-colors">Homaira</span>
          {' & '}
          <span className="font-medium text-[#147d6c] hover:text-[#1effff] transition-colors">Hossai</span>
        </p>
      </div>
    </div>
  );
};

export default HomePage; 