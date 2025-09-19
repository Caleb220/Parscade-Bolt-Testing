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

describe('HomePage Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home page without errors', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <HomePage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Transform Documents into/)).toBeInTheDocument();
  });

  it('shows auth modal when not authenticated', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <HomePage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Join Beta Program')).toBeInTheDocument();
  });

  it('shows dashboard link when authenticated', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider isAuthenticated={true}>
          <HomePage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
  });
});