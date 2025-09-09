import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../../routes/index';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('Navigation Routes', () => {
  let mockUser;
  let mockLogout;

  beforeEach(() => {
    mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    mockLogout = vi.fn();
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isAuthenticated: true,
      loading: false
    });
  });

  it('renders Dashboard when navigating to /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByText('Welcome Back, John!')).toBeInTheDocument();
  });

  it('renders Patients page when navigating to /patients', () => {
    render(
      <MemoryRouter initialEntries={['/patients']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Patients' })).toBeInTheDocument();
    expect(screen.getByText('Manage patient information, charts, and history')).toBeInTheDocument();
  });

  it('renders Appointments page when navigating to /appointments', () => {
    render(
      <MemoryRouter initialEntries={['/appointments']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
    expect(screen.getByText('Schedule and manage patient appointments')).toBeInTheDocument();
  });

  it('renders Doctors page when navigating to /doctors', () => {
    render(
      <MemoryRouter initialEntries={['/doctors']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Doctors / Clinicians' })).toBeInTheDocument();
    expect(screen.getByText('Manage healthcare providers and assignments')).toBeInTheDocument();
  });

  it('renders Messages page when navigating to /messages', () => {
    render(
      <MemoryRouter initialEntries={['/messages']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument();
    expect(screen.getByText('Secure messaging and notifications')).toBeInTheDocument();
  });

  it('renders Billing page when navigating to /billing', () => {
    render(
      <MemoryRouter initialEntries={['/billing']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Billing & Finance', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Billing, authorizations, and payments')).toBeInTheDocument();
  });

  it('renders Reports page when navigating to /reports', () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByText('Compliance, QA, audits, and analytics')).toBeInTheDocument();
  });

  it('renders Quality page when navigating to /quality', () => {
    render(
      <MemoryRouter initialEntries={['/quality']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Quality & Safety', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('QAPI, infection control, and fall tracker')).toBeInTheDocument();
  });

  it('renders Inventory page when navigating to /inventory', () => {
    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <AppRoutes />
      </MemoryRouter>,
      { includeRouter: false }
    );
    
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument();
    expect(screen.getByText('Supplies, DME, and medications')).toBeInTheDocument();
  });

  it('includes sidebar navigation on all protected routes', () => {
    const routes = ['/dashboard', '/patients', '/appointments', '/doctors', '/messages', '/billing', '/reports', '/quality', '/inventory'];
    
    routes.forEach(route => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>,
        { includeRouter: false }
      );
      
      expect(screen.getByText('CareSync AI')).toBeInTheDocument();
      unmount();
    });
  });
});