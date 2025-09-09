import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Appointments from '../../components/Appointments';
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
const mockLocation = { pathname: '/appointments' };

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

describe('Appointments Component', () => {
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
    render(<Appointments />);
    
    expect(screen.getByRole('heading', { name: 'Appointments', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Schedule and manage patient appointments')).toBeInTheDocument();
  });

  it('renders placeholder content', () => {
    render(<Appointments />);
    
    expect(screen.getByText('Appointment Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Schedule appointments, view visit history, and manage calendar.')).toBeInTheDocument();
  });

  it('renders schedule appointment button', () => {
    render(<Appointments />);
    
    expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
  });

  it('includes sidebar navigation', () => {
    render(<Appointments />);
    
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
  });
});

