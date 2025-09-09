import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import SidebarNavigation from '../../components/SidebarNavigation';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn()
  };
});

describe('SidebarNavigation Component', () => {
  let mockUser;
  let mockLogout;
  let mockNavigate;

  beforeEach(() => {
    mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    mockLogout = vi.fn();
    mockNavigate = vi.fn();
    
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      loading: false
    });
    useLocation.mockReturnValue({ pathname: '/dashboard' });
    useNavigate.mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  it('renders the CareSync AI logo and title', () => {
    render(<SidebarNavigation />);
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<SidebarNavigation />);
    
    const expectedItems = [
      'Dashboard',
      'Patients', 
      'Appointments',
      'Doctors & Clinicians',
      'Reports',
      'Quality & Safety',
      'Billing & Finance',
      'Inventory',
      'Messages'
    ];

    expectedItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('shows messages badge with correct count', () => {
    render(<SidebarNavigation />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays user information in sidebar', () => {
    render(<SidebarNavigation />);
    expect(screen.getByText(mockUser.firstName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', () => {
    render(<SidebarNavigation />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to correct path when navigation item is clicked', () => {
    render(<SidebarNavigation />);
    const patientsButton = screen.getByText('Patients');
    fireEvent.click(patientsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/patients');
  });

  it('highlights active navigation item', () => {
    // Mock location to show dashboard as active
    useLocation.mockReturnValue({ pathname: '/dashboard' });
    
    render(<SidebarNavigation />);
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toHaveClass('bg-[#147d6c]', 'text-white');
  });

  it('renders sidebar toggle button', () => {
    render(<SidebarNavigation />);
    const toggleButton = screen.getByRole('button', { name: /toggle/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('renders with fallback values when user is not available', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: mockLogout
    });

    render(<SidebarNavigation />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });
});

