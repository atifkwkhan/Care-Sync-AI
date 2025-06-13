import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { vi } from 'vitest';

// Mock the AuthContext values
const mockAuthContext = {
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
};

// Create a custom render function that includes providers
const customRender = (ui, { authProviderProps = {}, ...options } = {}) => {
  const AllTheProviders = ({ children }) => {
    const authContextValue = { ...mockAuthContext, ...authProviderProps };
    
    return (
      <BrowserRouter>
        <AuthProvider value={authContextValue}>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 