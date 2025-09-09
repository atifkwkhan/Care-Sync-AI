import React from 'react';
import PageLayout from './PageLayout';

const Doctors = () => {
  return (
    <PageLayout 
      title="Doctors / Clinicians" 
      subtitle="Manage healthcare providers and assignments"
    >
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Provider Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage doctors, clinicians, assignments, and orders.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#147d6c] hover:bg-[#1effff] hover:text-gray-800 transition-all duration-200">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Provider
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Doctors;
