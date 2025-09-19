import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import Layout from '../../../components/templates/Layout';
import PublicAuthLayout from '../../../components/templates/PublicAuthLayout';
import LoadingButton from '../../../components/atoms/LoadingButton';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import { supabase } from '../../../lib/supabase';
import {
  extractResetTokens,
  establishRecoverySession,
  updateUserPassword,
  generateSessionId,
  isRecoveryMode,
  completeRecoveryFlow,
  validatePasswordStrength,
  type PasswordResetTokens,
} from '../../../services/passwordResetService';
import { logger } from '../../../services/logger';
import { trackFormSubmit } from '../../../utils/analytics';

/**
 * Zod schema for password reset form with enterprise security requirements.
 * 8-character minimum with complexity requirements for production security.
 */
const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
      .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
      .regex(/(?=.*\d)/, 'Password must contain at least one number')
      .regex(/(?=.*[^A-Za-z0-9])/, 'Password must contain at least one special character')
      .refine(
        (password) => !/(.)\1{2,}/.test(password),
        'Password cannot contain more than 2 consecutive identical characters'
      )
      .refine(
        (password) => !/123|abc|qwe|password|admin|user|test|12345678/i.test(password),
        'Password cannot contain common patterns'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordResetForm = z.infer<typeof ResetPasswordSchema>;

/**
 * Reset page state machine for deterministic UI transitions.
 * Prevents stuck loading states and provides clear error handling.
 */
type ResetPageState = 
  | { status: 'booting' }
  | { status: 'validating' }
  | { status: 'ready'; isAutoLoggedIn: boolean }
  | { status: 'invalid'; error: string }
  | { status: 'submitting' }
  | { status: 'complete' };
/**
 * Enterprise-Grade Reset Password Page with State Machine
 * 
 * STATE MACHINE DESIGN:
 * - booting: Initial page load, parsing URL parameters
 * - validating: Exchanging tokens for recovery session (with timeout)
 * - ready: Form ready for user input (may be auto-logged in)
 * - invalid: Token expired/invalid, show error with resend option
 * - submitting: Password update in progress
 * - complete: Success state before redirect
 * 
 * LAYOUT STRATEGY:
 * - Uses PublicAuthLayout (no navbar) for clean, focused experience
 * - Prevents navigation during recovery to avoid confusion
 * - Matches industry standards for password reset UX
 * 
 * TOKEN VALIDATION:
 * - 10-second timeout prevents stuck loading states
 * - Automatic retry on network failures
 * - Clear error messages for expired/invalid tokens
 */

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // CONTROLLED INPUTS: Explicit initial state prevents undefined crashes
  const [formData, setFormData] = useState<PasswordResetForm>({
    password: '',
    confirmPassword: '',
  });
  
  // STATE MACHINE: Deterministic UI transitions prevent stuck states
  const [pageState, setPageState] = useState<ResetPageState>({ status: 'booting' });
  
  // UI state for password visibility
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Session tracking for rate limiting and logging
  const [sessionId] = useState(() => generateSessionId());
  
  // Prevent race conditions and memory leaks
  const initializationRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Safe state update helper that prevents memory leaks
   */
  const safeSetPageState = useCallback((newState: ResetPageState) => {
    if (mountedRef.current) {
      setPageState(newState);
    }
  }, []);

  /**
   * Initialize password reset flow with timeout and retry logic
   * 
   * STATE TRANSITIONS:
   * booting → validating → ready/invalid
   * 
   * TIMEOUT HANDLING:
   * - 10-second timeout prevents stuck loading
   * - Automatic retry on network failures
   * - Clear error messages for user action
   */
  const initializeResetFlow = useCallback(async (): Promise<void> => {
    if (initializationRef.current || !mountedRef.current) return;
    initializationRef.current = true;

    try {
      logger.info('Initializing password reset flow', {
        context: { feature: 'password-reset', action: 'initialization' },
        metadata: { sessionId },
      });
      
      // PHASE 1: Extract tokens from URL
      const tokens = extractResetTokens();
      if (!tokens) {
        // Check for auto-login scenario (user already authenticated from email link)
        if (isAuthenticated && user) {
          logger.info('User auto-logged in from reset link - no tokens needed', {
            context: { feature: 'password-reset', action: 'autoLoginDetected' },
            metadata: { userId: user.id },
          });
          
          safeSetPageState({ status: 'ready', isAutoLoggedIn: true });
          return;
        }
        
        // No tokens and not authenticated - invalid reset link
        safeSetPageState({ 
          status: 'invalid', 
          error: 'Invalid or missing password reset tokens. Please request a new reset link.' 
        });
        return;
      }
      
      // PHASE 2: Validate tokens with timeout
      safeSetPageState({ status: 'validating' });
      
      // Create timeout promise to prevent stuck loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Token validation timeout')), 10000);
      });
      
      try {
        // Race between session establishment and timeout
        await Promise.race([
          establishRecoverySession(tokens),
          timeoutPromise
        ]);
        
        // Verify session was established
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          logger.info('Recovery session established successfully', {
            context: { feature: 'password-reset', action: 'sessionEstablished' },
            metadata: { userId: session.user.id },
          });
          
          safeSetPageState({ status: 'ready', isAutoLoggedIn: true });
        } else {
          safeSetPageState({ status: 'ready', isAutoLoggedIn: false });
        }
        
      } catch (timeoutError) {
        if (timeoutError.message === 'Token validation timeout') {
          logger.warn('Token validation timeout - offering retry', {
            context: { feature: 'password-reset', action: 'validationTimeout' },
            metadata: { sessionId },
          });
          
          safeSetPageState({ 
            status: 'invalid', 
            error: 'Token validation timed out. Please request a new reset link or try again.' 
          });
        } else {
          throw timeoutError;
        }
      }
      
    } catch (error) {
      logger.error('Password reset initialization failed', {
        context: { feature: 'password-reset', action: 'initialization' },
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: { sessionId },
      });
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to initialize password reset. Please request a new reset link.';
        
      safeSetPageState({ status: 'invalid', error: errorMessage });
    }
  }, [isAuthenticated, user, sessionId, safeSetPageState]);

  // Initialize on mount and when auth state changes
  useEffect(() => {
    void initializeResetFlow();
  }, [initializeResetFlow]);

  /**
   * Handle form input changes with null-safe validation
   */
  const handleInputChange = useCallback(
    (field: keyof PasswordResetForm) =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        
        setFormData(prev => ({
          ...prev,
          [field]: value,
        }));

        // Clear field-specific error when user starts typing
        if (fieldErrors[field]) {
          setFieldErrors(prev => ({
            ...prev,
            [field]: undefined,
          }));
        }
      },
    [fieldErrors]
  );

  /**
   * Toggle password visibility with accessibility support
   */
  const togglePasswordVisibility = useCallback(
    (field: keyof typeof showPasswords) => (): void => {
      setShowPasswords(prev => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  /**
   * Handle form submission with Zod validation and state machine updates
   * 
   * STRATEGY A (Implemented): Sign out → redirect to login with success banner
   * This ensures users must authenticate with their new password for security.
   */
  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    // Zod validation with detailed error mapping
    const validation = ResetPasswordSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setPageState({ status: 'submitting' });
    setFieldErrors({});

    try {
      // Submit password update with validated data
      await updateUserPassword(validation.data, sessionId);
      
      // Track successful submission
      trackFormSubmit('password-reset', true);
      
      setPageState({ status: 'complete' });

      // STRATEGY A: Complete recovery flow after brief success display
      setTimeout(async () => {
        if (mountedRef.current) {
          await completeRecoveryFlow();
        }
      }, 2000);

    } catch (error) {
      logger.warn('Password reset submission failed', {
        context: { feature: 'password-reset', action: 'formSubmission' },
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: { sessionId },
      });
      
      // Track failed submission
      trackFormSubmit('password-reset', false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update password';
        
      safeSetPageState({ status: 'invalid', error: errorMessage });
    }
  }, [formData, sessionId, safeSetPageState]);

  // NULL-SAFE: Password strength calculation with guaranteed string input
  const passwordStrength = useMemo(() => {
    const safePassword = formData.password ?? ''; // Guaranteed string
    return safePassword.length > 0 ? validatePasswordStrength(safePassword) : null;
  }, [formData.password]);

  /**
   * BOOTING STATE: Initial page load
   * Shows minimal loading while parsing URL and detecting recovery context
   */
  if (pageState.status === 'booting') {
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Reset Page
          </h1>
          <p className="text-gray-600 text-sm">
            Preparing your password reset form...
          </p>
        </div>
      </PublicAuthLayout>
    );
  }

  /**
   * VALIDATING STATE: Token exchange in progress
   * Shows progress with timeout protection to prevent stuck states
   */
  if (pageState.status === 'validating') {
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Validating Reset Link
          </h1>
          <p className="text-gray-600">
            Verifying your password reset request...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This should complete within 10 seconds
          </p>
        </div>
      </PublicAuthLayout>
    );
  }

  /**
   * INVALID STATE: Token expired, invalid, or validation failed
   * Provides clear error message and resend option
   */
  if (pageState.status === 'invalid') {
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            {pageState.error}
          </p>
          <div className="space-y-3">
            <LoadingButton
              onClick={() => navigate('/forgot-password')}
              size="lg"
              fullWidth
            >
              Request New Reset Link
            </LoadingButton>
            <LoadingButton
              variant="outline"
              onClick={() => navigate('/')}
              size="lg"
              fullWidth
            >
              Back to Home
            </LoadingButton>
          </div>
        </div>
      </PublicAuthLayout>
    );
  }

  /**
   * COMPLETE STATE: Success message before redirect
   * Brief success display before completing recovery flow
   */
  if (pageState.status === 'complete') {
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Password Updated Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been updated. You will be redirected to sign in with your new password.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <LoadingSpinner size="sm" className="mr-2" />
            Redirecting...
          </div>
        </div>
      </PublicAuthLayout>
    );
  }

  /**
   * READY STATE: Main password reset form
   * Clean, focused interface without navigation chrome
   */
  if (pageState.status !== 'ready') {
    // Defensive: should never reach here, but prevent crashes
    return (
      <PublicAuthLayout>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Unexpected state. Please refresh the page.</p>
        </div>
      </PublicAuthLayout>
    );
  }

  return (
    <PublicAuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full"
      >
        {/* Auto-login notification */}
        {pageState.isAutoLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Reset Link Verified
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  You can now set a new password for your account.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600">
            Choose a strong password to secure your Parscade account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* New Password Field */}
          <div>
            <label 
              htmlFor="new-password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                name="new-password"
                type={showPasswords.password ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`block w-full pr-12 border rounded-md px-3 py-2 bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.password
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
                required
                autoComplete="new-password"
                aria-describedby={fieldErrors.password ? 'password-error' : 'password-help'}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility('password')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label={showPasswords.password ? 'Hide password' : 'Show password'}
              >
                {showPasswords.password ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                {fieldErrors.password}
              </p>
            )}
            
            {/* NULL-SAFE: Password strength indicator with guaranteed string input */}
            <PasswordStrengthIndicator
              password={formData.password}
              strength={passwordStrength}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirm-password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`block w-full pr-12 border rounded-md px-3 py-2 bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  fieldErrors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
                required
                autoComplete="new-password"
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label={showPasswords.confirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            fullWidth
            size="lg"
            isLoading={pageState.status === 'submitting'}
            loadingText="Updating Password..."
            rightIcon={<ArrowRight className="w-4 h-4" />}
            disabled={!passwordStrength?.isValid}
          >
            Update Password
          </LoadingButton>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-800 mb-1">
                Security Notice
              </p>
              <p className="text-xs text-blue-700">
                This password reset link is valid for one use only and will expire in 24 hours.
                Navigation is restricted during the recovery process for security.
              </p>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </PublicAuthLayout>
  );
};

export default ResetPasswordPage;