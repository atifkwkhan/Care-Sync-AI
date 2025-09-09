import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import PageLayout from '../../components/PageLayout';
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
const mockLocation = { pathname: '/test' };

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

describe('PageLayout Component', () => {
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

  it('renders with title and subtitle', () => {
    render(
      <PageLayout title="Test Page" subtitle="Test subtitle">
        <div>Test content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders with title only when no subtitle provided', () => {
    render(
      <PageLayout title="Test Page">
        <div>Test content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <PageLayout title="Test Page">
        <div data-testid="test-content">Test content</div>
      </PageLayout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('includes sidebar navigation', () => {
    render(
      <PageLayout title="Test Page">
        <div>Test content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    render(
      <PageLayout title="Test Page">
        <div>Test content</div>
      </PageLayout>
    );
    
    // Check for main layout structure
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1', 'overflow-x-hidden', 'overflow-y-auto', 'bg-white', 'p-6');
  });
});

