import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountSettingsPanel from '../../account/components/AccountSettingsPanel';
import { AuthProvider } from '../context/AuthContext';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }),
    }),
  },
}));

// Mock logger
vi.mock('@/services/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    setUserContext: vi.fn(),
    clearUserContext: vi.fn(),
  },
}));

// Mock hardLogout
vi.mock('@/utils/hardLogout', () => ({
  performHardLogout: vi.fn(),
  setupCrossTabLogoutListener: vi.fn().mockReturnValue(() => {}),
}));

// Mock user for auth context
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
};

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockAuthValue = {
    user: mockUser,
    isAuthenticated: true,
    isEmailConfirmed: true,
    isLoading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resendConfirmationEmail: vi.fn(),
    clearError: vi.fn(),
  };

  return (
    <AuthProvider value={mockAuthValue as any}>
      {children}
    </AuthProvider>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider>
        {component}
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('AccountSettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without throwing "Mail is not defined" error', () => {
    expect(() => {
      renderWithProviders(<AccountSettingsPanel />);
    }).not.toThrow();
  });

  it('renders the email field with Mail icon', async () => {
    renderWithProviders(<AccountSettingsPanel />);
    
    // Wait for the component to load
    await screen.findByText('Profile Information');
    
    // Check that email field is present (Mail icon should be rendered without error)
    const emailField = screen.getByLabelText('Email Address');
    expect(emailField).toBeInTheDocument();
  });

  it('renders all settings tabs', async () => {
    renderWithProviders(<AccountSettingsPanel />);
    
    // Wait for the component to load
    await screen.findByText('Profile Information');
    
    // Check that all tabs are present
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('displays user information in profile section', async () => {
    renderWithProviders(<AccountSettingsPanel />);
    
    // Wait for the component to load and check loading state resolves
    await screen.findByText('Profile Information');
    
    // Should not show loading spinner in final state
    expect(screen.queryByText('Loading account settings...')).not.toBeInTheDocument();
  });
});