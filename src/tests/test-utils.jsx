import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { vi } from 'vitest';

// Mock the AuthContext
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

// Create a custom render function that includes providers
const customRender = (ui, { authProviderProps = {}, includeRouter = true, ...options } = {}) => {
  const AllTheProviders = ({ children }) => {
    if (includeRouter) {
      return (
        <BrowserRouter>
          {children}
        </BrowserRouter>
      );
    }
    return children;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 