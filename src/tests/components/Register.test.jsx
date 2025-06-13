import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import Register from '../../components/auth/Register';

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

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      user: null,
      isAuthenticated: false
    })
  };
});

describe('Register Component', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(<Register />);
    expect(screen.getByText('Create New Account')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<Register />);
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const usernameInput = screen.getByLabelText('Username');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(usernameInput.value).toBe('johndoe');
  });

  it('handles successful registration', async () => {
    const mockUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe'
    };

    // Mock fetch to return a successful response
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      })
    );

    render(<Register />);
    
    // Fill in all required form fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Agency Employee ID'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Primary Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Discipline'), { target: { value: 'RN' } });
    fireEvent.change(screen.getByLabelText('Employee Type'), { target: { value: 'Staff' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    // Wait for the login and navigation to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Verify the API was called with the correct data
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        suffix: '',
        discipline: 'RN',
        username: 'johndoe',
        password: 'password123',
        agencyEmployeeId: '12345',
        email: 'john@example.com',
        phone1: '(123) 456-7890',
        phone2: '',
        employeeType: 'Staff'
      }),
    });
  });

  it('handles registration failure', async () => {
    // Mock fetch to return an error response
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already exists' })
      })
    );

    render(<Register />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Agency Employee ID'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Primary Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Discipline'), { target: { value: 'RN' } });
    fireEvent.change(screen.getByLabelText('Employee Type'), { target: { value: 'Staff' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });

    // Verify that login and navigation were not called
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('validates required fields', () => {
    render(<Register />);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.click(submitButton);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const usernameInput = screen.getByLabelText('Username');

    expect(firstNameInput).toBeRequired();
    expect(lastNameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(usernameInput).toBeRequired();
  });

  it('validates email format', () => {
    render(<Register />);
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    // Set an invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Trigger form validation by submitting the form
    fireEvent.click(submitButton);
    
    // Check if the input is invalid
    expect(emailInput.validity.valid).toBe(false);
  });
}); 