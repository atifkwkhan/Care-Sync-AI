import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import HomePage from '../../components/HomePage';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('HomePage Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      logout: vi.fn(),
      isAuthenticated: false
    });
    vi.clearAllMocks();
  });

  it('renders the homepage with all sections', () => {
    render(<HomePage />);
    
    // Check for main sections
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
    expect(screen.getByText('Revolutionizing home healthcare with intelligent monitoring, predictive analytics, and personalized care solutions.')).toBeInTheDocument();
    expect(screen.getByText('Transform Healthcare with')).toBeInTheDocument();
  });

  it('renders both login buttons in the navigation', () => {
    render(<HomePage />);
    
    const userLoginButton = screen.getByRole('button', { name: 'User Login' });
    const orgLoginButton = screen.getByRole('button', { name: 'Organization Login' });
    
    expect(userLoginButton).toBeInTheDocument();
    expect(orgLoginButton).toBeInTheDocument();
  });

  it('renders both login buttons in the hero section', () => {
    render(<HomePage />);
    
    const heroUserLogin = screen.getByRole('link', { name: 'User Login' });
    const heroOrgLogin = screen.getByRole('link', { name: 'Organization Login' });
    
    expect(heroUserLogin).toBeInTheDocument();
    expect(heroOrgLogin).toBeInTheDocument();
    
    expect(heroUserLogin).toHaveAttribute('href', '/login');
    expect(heroOrgLogin).toHaveAttribute('href', '/organization/login');
  });

  it('renders all feature sections', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Smart Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Predictive Analytics')).toBeInTheDocument();
    expect(screen.getByText('Personalized Care')).toBeInTheDocument();
  });

  it('renders the signature section', () => {
    render(<HomePage />);
    
    expect(screen.getByText('CareSync AI')).toBeInTheDocument();
    expect(screen.getByText('Homaira Momen')).toBeInTheDocument();
    expect(screen.getByText('Hossai Momen')).toBeInTheDocument();
  });
}); 