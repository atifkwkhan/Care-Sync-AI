import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import Dashboard from '../../components/Dashboard';
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

describe('Dashboard Component', () => {
  let mockUser;
  let mockLogout;

  beforeEach(() => {
    mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      discipline: 'Physical Therapy',
      employeeType: 'Staff'
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

  it('renders welcome message with user name', () => {
    render(<Dashboard />);
    expect(screen.getByText(`Welcome Back, ${mockUser.firstName}!`)).toBeInTheDocument();
  });

  it('displays user profile information correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
    expect(screen.getAllByText(mockUser.email)).toHaveLength(2); // One in sidebar, one in profile
    expect(screen.getByText(mockUser.discipline)).toBeInTheDocument();
    expect(screen.getByText(mockUser.employeeType)).toBeInTheDocument();
  });

  it('shows all quick action buttons', () => {
    render(<Dashboard />);
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    expect(screen.getByText('Create Note')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('displays all stat cards', () => {
    render(<Dashboard />);
    expect(screen.getByText("Today's Appointments")).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Unread Messages')).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    render(<Dashboard />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders with fallback values when user is not available', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: mockLogout
    });

    render(<Dashboard />);
    expect(screen.getByText('Welcome Back, User!')).toBeInTheDocument();
  });
}); 