import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { accountApi } from '@/lib/api/modules/account';
import { userApi } from '@/lib/api/modules/user';
import { supabase } from '@/lib/supabase';
import { logger } from '@/shared/services/logger';
import type { TypedSupabaseUser } from '@/shared/types/supabase';
import { setupCrossTabLogoutListener } from '@/shared/utils/hardLogout';

import type { AuthState, AuthContextType, User } from '../types/authTypes';
import type { AuthError, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { ReactNode } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { readonly user: User; readonly isEmailConfirmed: boolean } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_INFO'; payload: string }
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initializationRef = useRef(false);
  const authStateChangeRef = useRef<{ unsubscribe: () => void } | null>(null);
  const crossTabCleanupRef = useRef<(() => void) | null>(null);

  /**
   * Fetches full user profile and merges with Supabase user data
   */
  const fetchEnhancedUser = useCallback(async (supabaseUser: TypedSupabaseUser): Promise<User> => {
    try {
      const profile = await accountApi.getProfile();

      // Merge Supabase user with profile data to create enhanced User
      const enhancedUser: User = {
        // Supabase user fields
        id: supabaseUser.id,
        email: supabaseUser.email,
        user_metadata: supabaseUser.user_metadata,
        email_verified: Boolean(supabaseUser.email_confirmed_at),
        created_at: supabaseUser.created_at,
        updated_at: supabaseUser.updated_at,

        // Profile fields
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        user_role: 'user', // Default role, admin users would be handled separately
        subscription_tier: profile.subscription_tier,
        plan: profile.subscription_tier, // Legacy compatibility
      };

      return enhancedUser;
    } catch (error) {
      logger.warn('Failed to fetch user profile, using basic auth user', {
        context: { feature: 'auth', action: 'fetchProfile' },
        error,
      });

      // Fallback to basic user data if profile fetch fails
      const basicUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        user_metadata: supabaseUser.user_metadata,
        email_verified: Boolean(supabaseUser.email_confirmed_at),
        created_at: supabaseUser.created_at,
        updated_at: supabaseUser.updated_at,
        full_name: supabaseUser.user_metadata?.full_name || null,
        username: null,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        user_role: 'user',
        subscription_tier: 'free',
        plan: 'free',
      };

      return basicUser;
    }
  }, []);

  /**
   * Handles Supabase auth state changes
   */
  const handleAuthStateChange = useCallback(async (event: AuthChangeEvent, session: Session | null): Promise<void> => {
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

      // Fetch enhanced user data with profile information
      const enhancedUser = await fetchEnhancedUser(typedUser);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: enhancedUser,
          isEmailConfirmed,
        },
      });

      logger.setUserContext({
        id: enhancedUser.id,
        email: enhancedUser.email || undefined,
        username: enhancedUser.username || enhancedUser.full_name || undefined,
      });
    } else if (event === 'SIGNED_OUT') {
      dispatch({ type: 'AUTH_SIGNOUT' });
      logger.clearUserContext();
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      const typedUser = session.user as TypedSupabaseUser;
      const isEmailConfirmed = Boolean(session.user.email_confirmed_at);

      // Fetch enhanced user data on token refresh too
      const enhancedUser = await fetchEnhancedUser(typedUser);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: enhancedUser,
          isEmailConfirmed,
        },
      });
    }
  }, [fetchEnhancedUser]);

  /**
   * Initialize authentication state and listeners
   */
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

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

          // Fetch enhanced user data during initialization
          const enhancedUser = await fetchEnhancedUser(typedUser);

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: enhancedUser,
              isEmailConfirmed,
            },
          });

          logger.setUserContext({
            id: enhancedUser.id,
            email: enhancedUser.email || undefined,
            username: enhancedUser.username || enhancedUser.full_name || undefined,
          });
        } else {
          dispatch({ type: 'SET_INITIALIZED' });
        }

        initializationRef.current = true;

        if (isMounted) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(handleAuthStateChange);
          authStateChangeRef.current = subscription;

          const crossTabCleanup = setupCrossTabLogoutListener(() => {
            logger.info('Processing cross-tab logout signal', {
              context: { feature: 'auth', action: 'crossTabLogout' },
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
        const errorMessage =
          initError instanceof Error ? initError.message : 'Failed to initialize authentication';
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
  }, []);

  /**
   * Sign in with email/username and password
   */
  const signIn = useCallback(async (identifier: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const body: Parameters<typeof userApi.signIn>[0] = identifier.includes('@')
        ? { email: identifier.trim().toLowerCase(), password }
        : { username: identifier.trim().toLowerCase(), password };

      const { session } = await userApi.signIn(body);

      const { error: setErr } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      if (setErr) throw setErr;
    } catch (err) {
      const message = err?.message || 'Invalid email/username or password';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw err;
    }
  }, []);

  /**
   * Sign up with email, password, and profile information
   */
  const signUp = useCallback(
    async (email: string, password: string, fullName: string, username: string): Promise<void> => {
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
          // Auto-login: Set the session immediately after successful signup
          const { error: setErr } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          if (setErr) {
            logger.warn('Failed to set session after signup', {
              context: { feature: 'auth', action: 'signUp' },
              error: setErr,
            });
            throw setErr;
          }

          logger.info('User successfully signed up and auto-logged in', {
            context: { feature: 'auth', action: 'signUp' },
            metadata: { hasSession: true },
          });
        } else {
          // If no session returned, user needs email confirmation
          dispatch({
            type: 'AUTH_INFO',
            payload:
              message || 'Please check your email to confirm your account before signing in.',
          });

          logger.info('User signed up, email confirmation required', {
            context: { feature: 'auth', action: 'signUp' },
            metadata: { hasSession: false, message },
          });
        }
      } catch (err) {
        const message = err?.message || 'Unable to sign up';
        dispatch({ type: 'AUTH_ERROR', payload: message });
        throw err;
      }
    },
    []
  );

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      await userApi.signOut();
      await supabase.auth.signOut();
    } catch (err) {
      await supabase.auth.signOut();
      const message = err?.message || 'Signed out';
      dispatch({ type: 'AUTH_ERROR', payload: message });
    }
  }, []);

  /**
   * Resend email confirmation
   */
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
      const message =
        (resendError as AuthError)?.name === 'AuthError'
          ? getAuthErrorMessage(resendError)
          : 'Failed to resend confirmation email';
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      resendConfirmationEmail,
      clearError,
    }),
    [state, signIn, signUp, signOut, resendConfirmationEmail, clearError]
  );

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
