import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Patients from '../../components/Patients';
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
const mockLocation = { pathname: '/patients' };

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

describe('Patients Component', () => {
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
    render(<Patients />);
    
    expect(screen.getByRole('heading', { name: 'Patients', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Manage patient information, charts, and history')).toBeInTheDocument();
  });

  it('renders placeholder content', () => {
    render(<Patients />);
    
    expect(screen.getByText('Patient Management')).toBeInTheDocument();
    expect(screen.getByText('Patient list, details, charting, and history will be available here.')).toBeInTheDocument();
  });

  it('renders add new patient button', () => {
    render(<Patients />);
    
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
  });

  it('includes sidebar navigation', () => {
    render(<Patients />);
    
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
  });

  it('has correct page layout structure', () => {
    render(<Patients />);
    
    // Check for main layout structure
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});

