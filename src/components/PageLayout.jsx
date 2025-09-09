import React from 'react';
import SidebarNavigation from './SidebarNavigation';

const PageLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
