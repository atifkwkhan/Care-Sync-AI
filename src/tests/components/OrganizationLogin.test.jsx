import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import OrganizationLogin from '../../components/auth/OrganizationLogin';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

describe('OrganizationLogin Component', () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = vi.fn();
    useAuth.mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false
    });
    vi.clearAllMocks();
  });

  it('renders organization login form', () => {
    render(<OrganizationLogin />);
    
    expect(screen.getByText('Organization Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Organization Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockOrganization = {
      id: 1,
      name: 'Test Organization',
      email: 'test@org.com'
    };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ organization: mockOrganization, token: 'test-token' })
    });
    global.fetch = mockFetch;

    render(<OrganizationLogin />);

    fireEvent.change(screen.getByPlaceholderText('Organization Email'), {
      target: { value: 'test@org.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/organization/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@org.com',
          password: 'password123'
        }),
      });
      expect(mockLogin).toHaveBeenCalledWith(mockOrganization);
      expect(mockNavigate).toHaveBeenCalledWith('/organization/dashboard');
    });
  });

  it('handles login error', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' })
    });
    global.fetch = mockFetch;

    render(<OrganizationLogin />);

    fireEvent.change(screen.getByPlaceholderText('Organization Email'), {
      target: { value: 'test@org.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    global.fetch = mockFetch;

    render(<OrganizationLogin />);

    fireEvent.change(screen.getByPlaceholderText('Organization Email'), {
      target: { value: 'test@org.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('navigates to organization registration', () => {
    render(<OrganizationLogin />);
    
    const registerLink = screen.getByText('register your organization');
    expect(registerLink).toHaveAttribute('href', '/register/organization');
  });

  it('navigates to user login', () => {
    render(<OrganizationLogin />);
    
    const userLoginLink = screen.getByText('User Login');
    expect(userLoginLink).toHaveAttribute('href', '/login');
  });
}); 