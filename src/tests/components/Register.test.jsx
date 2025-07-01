import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import Register from '../../components/auth/Register';
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

describe('Register Component', () => {
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

  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Agency Employee ID'), {
      target: { value: 'EMP123' }
    });
    fireEvent.change(screen.getByLabelText('Primary Phone'), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByLabelText('Employee Type'), {
      target: { value: 'Staff' }
    });
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'johndoe' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
  };

  it('renders registration form', () => {
    render(<Register />);
    
    expect(screen.getByText('Create New Account')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Agency Employee ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Primary Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Employee Type')).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    const mockUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: 'test-token' })
    });
    global.fetch = mockFetch;

    render(<Register />);
    fillRequiredFields();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          suffix: '',
          discipline: '',
          username: 'johndoe',
          password: 'password123',
          email: 'john@example.com',
          phone1: '(123) 456-7890',
          phone2: '',
          agencyEmployeeId: 'EMP123',
          employeeType: 'Staff',
          organizationId: '',
          role: 'user'
        }),
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles registration error', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email already exists' })
    });
    global.fetch = mockFetch;

    render(<Register />);
    fillRequiredFields();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<Register />);
    
    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email');

    // Fill in all required fields except email
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Agency Employee ID'), {
      target: { value: 'EMP123' }
    });
    fireEvent.change(screen.getByLabelText('Primary Phone'), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByLabelText('Employee Type'), {
      target: { value: 'Staff' }
    });
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'johndoe' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    // Test invalid email
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' }
    });
    fireEvent.submit(form);

    // Wait for the validation error to appear
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    // Test valid email
    fireEvent.change(emailInput, {
      target: { value: 'valid@email.com' }
    });
    fireEvent.submit(form);

    // Wait for the validation error to disappear
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  it('navigates to login page', () => {
    render(<Register />);
    
    const loginLink = screen.getByText('Sign in here');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 