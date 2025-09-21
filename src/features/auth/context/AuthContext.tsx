import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

import { userApi } from '@/lib/api/modules/user';
import { supabase } from '@/lib/supabase';
import { logger } from '@/shared/services/logger';
import type { TypedSupabaseUser } from '@/shared/types/supabase';
import { setupCrossTabLogoutListener } from '@/shared/utils/hardLogout';
import type { AuthState, AuthContextType, User, FormErrors } from '../types/authTypes';



const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { readonly user: User; readonly isEmailConfirmed: boolean } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_INFO'; payload: string }   // ⬅️ add
  | { type: 'AUTH_SIGNOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isEmailConfirmed: action.payload.isEmailConfirmed,
        isLoading: false,
        error: null,
      };
    case 'AUTH_INFO':
      return { ...state, isLoading: false, error: action.payload };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isEmailConfirmed: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_SIGNOUT':
      return {
        user: null,
        isAuthenticated: false,
        isEmailConfirmed: false,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_INITIALIZED':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};


async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
}



const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isEmailConfirmed: false,
  isLoading: true,
  error: null,
};

interface AuthProviderProps {
  readonly children: ReactNode;
}

type ApiSignInResponse = {
  user: { id: string; email: string };
  session: { access_token: string; refresh_token: string };
};

type ApiSignUpResponse = {
  user: { id: string; email: string } | null;
  session: { access_token: string; refresh_token: string } | null;
  message: string;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initializationRef = useRef(false);
  const authStateChangeRef = useRef<{ unsubscribe: () => void } | null>(null);
  const crossTabCleanupRef = useRef<(() => void) | null>(null);

  // Memoized auth state change handler to prevent recreation on every render
  const handleAuthStateChange = useCallback(
    async (event: string, session: any): Promise<void> => {
      // Prevent processing during initial load to avoid double-processing
      if (!initializationRef.current) {
        return;
      }

      logger.debug('Auth state change event', {
        context: { feature: 'auth', action: 'stateChange' },
        metadata: { event, hasSession: !!session },
      });

      if (event === 'SIGNED_IN' && session?.user) {
        const typedUser = session.user as TypedSupabaseUser;
        const isEmailConfirmed = Boolean(session.user.email_confirmed_at);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: typedUser,
            isEmailConfirmed,
          },
        });

        // Set user context for logging
        logger.setUserContext({
          id: typedUser.id,
          email: typedUser.email || undefined,
          username: typedUser.user_metadata?.full_name || undefined,
        });
        
        logger.debug('Normal sign-in completed - ready for dashboard redirect', {
          context: { feature: 'auth', action: 'signInComplete' },
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'AUTH_SIGNOUT' });
        logger.clearUserContext();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const typedUser = session.user as TypedSupabaseUser;
        const isEmailConfirmed = Boolean(session.user.email_confirmed_at);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: typedUser,
            isEmailConfirmed,
          },
        });
      }
    },
    []
  );

  // Initialize auth state once on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        logger.debug('Initializing auth state');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        // Check if component is still mounted
        if (!isMounted) return;

        if (error) {
          logger.warn('Failed to get initial auth session', {
            context: { feature: 'auth', action: 'getInitialSession' },
            error,
          });
          dispatch({ type: 'AUTH_ERROR', payload: error.message });
          return;
        }

        if (session?.user) {
          const typedUser = session.user as TypedSupabaseUser;
          const isEmailConfirmed = Boolean(session.user.email_confirmed_at);
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: typedUser,
              isEmailConfirmed,
            },
          });

          // Set user context for logging
          logger.setUserContext({
            id: typedUser.id,
            email: typedUser.email || undefined,
            username: typedUser.user_metadata?.full_name || undefined,
          });
        } else {
          dispatch({ type: 'SET_INITIALIZED' });
        }

        // Mark initialization as complete
        initializationRef.current = true;

        // Set up auth state change listener after initialization
        if (isMounted) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
          authStateChangeRef.current = subscription;
          
          // Set up cross-tab logout listener
          const crossTabCleanup = setupCrossTabLogoutListener(() => {
            logger.info('Processing cross-tab logout signal', {
              context: { feature: 'auth', action: 'crossTabLogout' }
            });
            dispatch({ type: 'AUTH_SIGNOUT' });
            logger.clearUserContext();
          });
          crossTabCleanupRef.current = crossTabCleanup;
        }
      } catch (initError) {
        if (!isMounted) return;
        
        logger.error('Critical error in auth initialization', {
          context: { feature: 'auth', action: 'initialization' },
          error: initError instanceof Error ? initError : new Error(String(initError)),
        });
        const errorMessage = initError instanceof Error ? initError.message : 'Failed to initialize authentication';
        dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      if (authStateChangeRef.current) {
        authStateChangeRef.current.unsubscribe();
        authStateChangeRef.current = null;
      }
      if (crossTabCleanupRef.current) {
        crossTabCleanupRef.current();
        crossTabCleanupRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const signIn = useCallback(async (identifier: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const body: Parameters<typeof userApi.signIn>[0] =
        identifier.includes('@')
          ? { email: identifier.trim().toLowerCase(), password }
          : { username: identifier.trim().toLowerCase(), password };

      const { user, session } = await userApi.signIn(body);

      const { error: setErr } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      if (setErr) throw setErr;

      // onAuthStateChange will dispatch AUTH_SUCCESS
    } catch (err: any) {
      const message = err?.message || 'Invalid email/username or password';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err;
    }
  }, [supabase]);

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    username: string
  ): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const body: Parameters<typeof userApi.signUp>[0] = {
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim() || null,
        username: username.trim().toLowerCase(),
      };

      const { session, message } = await userApi.signUp(body);

      if (session) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        if (setErr) throw setErr;
      } else {
        // email confirmations enabled
        dispatch({ type: 'AUTH_INFO', payload: message || 'Check your email to confirm your account.' });
      }
    } catch (err: any) {
      const message = err?.message || 'Unable to sign up';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err;
    }
  }, [supabase]);

  const signOut = useCallback(async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Call backend signout endpoint
      await userApi.signOut();

      // Then sign out from Supabase
      await supabase.auth.signOut();
    } catch (err: any) {
      await supabase.auth.signOut();
      const message = err?.message || 'Signed out';
      dispatch({ type: 'AUTH_ERROR', payload: message });
    }
  }, [supabase]);

  const resendConfirmationEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });

      if (error) {
        throw error;
      }
    } catch (resendError) {
      const message = (resendError as any)?.name === 'AuthError'
        ? getAuthErrorMessage(resendError)
        : 'Failed to resend confirmation email';
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    ...state,
    signIn,
    signUp,
    signOut,
    resendConfirmationEmail,
    clearError,
  }), [state, signIn, signUp, signOut, resendConfirmationEmail, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Converts Supabase auth errors to user-friendly messages.
 */
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Try signing in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Signup is disabled':
      return 'New account registration is currently disabled. Please contact support.';
    case 'Email rate limit exceeded':
      return 'Too many requests. Please wait a moment before trying again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Custom hook to access the auth context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};