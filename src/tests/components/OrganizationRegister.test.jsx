import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import OrganizationRegister from '../../components/auth/OrganizationRegister';

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

describe('OrganizationRegister Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders organization registration form', () => {
    render(<OrganizationRegister />);
    
    expect(screen.getByText('Register Your Organization')).toBeInTheDocument();
    expect(screen.getByLabelText('Organization Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register Organization' })).toBeInTheDocument();
  });

  it('handles successful organization registration', async () => {
    const mockOrganization = {
      id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
      name: 'Test Hospital',
      email: 'test@hospital.com'
    };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ organization: mockOrganization })
    });
    global.fetch = mockFetch;

    render(<OrganizationRegister />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Hospital' }
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' }
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '12345' }
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-1234' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@hospital.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'testpassword123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'testpassword123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/organizations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Hospital',
          address: '123 Main St',
          city: 'Test City',
          state: 'CA',
          zipCode: '12345',
          phone: '555-1234',
          email: 'test@hospital.com',
          website: '',
          password: 'testpassword123',
          confirmPassword: 'testpassword123'
        }),
      });
      expect(mockNavigate).toHaveBeenCalledWith('/register', { 
        state: { organizationId: mockOrganization.id } 
      });
    });
  });

  it('validates password length', async () => {
    render(<OrganizationRegister />);

    // Fill out the form with short password
    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Hospital' }
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' }
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '12345' }
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-1234' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@hospital.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: '123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters long');
    });
  });

  it('validates password confirmation', async () => {
    render(<OrganizationRegister />);

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Hospital' }
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' }
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '12345' }
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-1234' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@hospital.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'testpassword123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'differentpassword' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('handles registration error', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Organization with this email already exists' })
    });
    global.fetch = mockFetch;

    render(<OrganizationRegister />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Hospital' }
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' }
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '12345' }
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-1234' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@hospital.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'testpassword123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'testpassword123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Organization with this email already exists')).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    global.fetch = mockFetch;

    render(<OrganizationRegister />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Organization Name'), {
      target: { value: 'Test Hospital' }
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' }
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '12345' }
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '555-1234' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@hospital.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'testpassword123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'testpassword123' }
    });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('navigates to login page', () => {
    render(<OrganizationRegister />);
    
    const loginLink = screen.getByText('Sign in here');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 