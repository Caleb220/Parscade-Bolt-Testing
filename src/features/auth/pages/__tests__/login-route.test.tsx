import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../LoginPage';
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
      signInWithPassword: vi.fn(),
    },
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

const MockAuthProvider: React.FC<{ 
  children: React.ReactNode;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}> = ({ children, isAuthenticated = false, isLoading = false }) => {
  const mockAuthValue = {
    user: null,
    isAuthenticated,
    isEmailConfirmed: false,
    isLoading,
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form without errors', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <LoginPage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows logout success message when logged_out=1 in URL', () => {
    render(
      <MemoryRouter initialEntries={['/login?logged_out=1']}>
        <MockAuthProvider>
          <LoginPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("You've been signed out successfully")).toBeInTheDocument();
  });

  it('does not show logout message without logged_out parameter', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <MockAuthProvider>
          <LoginPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText("You've been signed out successfully")).not.toBeInTheDocument();
  });

  it('shows loading state when auth is loading', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider isLoading={true}>
          <LoginPage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('provides link to join beta program for new users', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <LoginPage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Join our beta program')).toBeInTheDocument();
  });
});