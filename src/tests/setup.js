import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
  toBeValid: (received) => {
    const pass = !received.validity.valid;
    return {
      pass,
      message: () => `expected ${received} to be valid`,
    };
  },
  toBeInvalid: (received) => {
    const pass = received.validity.valid;
    return {
      pass,
      message: () => `expected ${received} to be invalid`,
    };
  },
  toBeRequired: (received) => {
    const pass = received.required === true;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be required`,
    };
  },
});

// Mock fetch globally
global.fetch = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 