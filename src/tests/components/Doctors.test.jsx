import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Doctors from '../../components/Doctors';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

// Mock useNavigate and useLocation
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/doctors' };

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

describe('Doctors Component', () => {
  let mockUser;
  let mockLogout;

  beforeEach(() => {
    mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    mockLogout = vi.fn();
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      loading: false
    });
    vi.clearAllMocks();
  });

  it('renders the page title and subtitle', () => {
    render(<Doctors />);
    
    expect(screen.getByText('Doctors / Clinicians')).toBeInTheDocument();
    expect(screen.getByText('Manage healthcare providers and assignments')).toBeInTheDocument();
  });

  it('renders placeholder content', () => {
    render(<Doctors />);
    
    expect(screen.getByText('Provider Management')).toBeInTheDocument();
    expect(screen.getByText('Manage doctors, clinicians, assignments, and orders.')).toBeInTheDocument();
  });

  it('renders add provider button', () => {
    render(<Doctors />);
    
    expect(screen.getByText('Add Provider')).toBeInTheDocument();
  });

  it('includes sidebar navigation', () => {
    render(<Doctors />);
    
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
  });
});

