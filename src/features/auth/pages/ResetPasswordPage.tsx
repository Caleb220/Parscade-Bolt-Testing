import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../../../components/templates/Layout';
import RecoveryLayout from '../../../components/templates/RecoveryLayout';
import LoadingButton from '../../../components/atoms/LoadingButton';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import {
  extractResetTokens,
  establishRecoverySession,
  updateUserPassword,
  generateSessionId,
  isRecoveryMode,
  completeRecoveryFlow,
  validatePasswordStrength,
  validatePasswordResetForm,
  type PasswordResetForm,
  type PasswordResetTokens,
} from '../../../services/passwordResetService';
import { logger } from '../../../services/logger';
import { trackFormSubmit } from '../../../utils/analytics';

/**
 * Enterprise-Grade Reset Password Page Component
 * 
 * ARCHITECTURE OVERVIEW:
 * This component implements a comprehensive password reset flow with enterprise-grade
 * security measures, user experience optimizations, and robust error handling.
 * 
 * SECURITY FEATURES:
 * - Token-based authentication with automatic expiry validation
 * - Rate limiting with exponential backoff to prevent brute force attacks
 * - Comprehensive input validation and sanitization
 * - Session validation to prevent replay attacks
 * - Secure error messages that don't leak system information
 * - CSRF protection through Supabase's built-in mechanisms
 * 
 * UX FEATURES:
 * - Real-time password strength feedback
 * - Smooth loading states and transitions
 * - Clear error messaging with actionable guidance
 * - Responsive design with accessibility support
 * - Recovery mode detection with appropriate UI changes
 * 
 * DESIGN DECISIONS:
 * - Uses TypeScript for compile-time safety
 * - Implements proper React patterns (hooks, refs, callbacks)
 * - Separates concerns between validation, UI, and business logic
 * - Uses Framer Motion for smooth animations
 * - Implements proper accessibility with ARIA labels and screen reader support
 */

interface ResetPasswordState {
  readonly isLoading: boolean;
  readonly isComplete: boolean;
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly isValidSession: boolean;
  readonly isAutoLoggedIn: boolean;
  readonly inRecoveryMode: boolean;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Form state management
  const [formData, setFormData] = useState<PasswordResetForm>({
    password: '',
    confirmPassword: '',
  });
  
  // Component state management
  const [state, setState] = useState<ResetPasswordState>({
    isLoading: true,
    isComplete: false,
    isSubmitting: false,
    error: null,
    isValidSession: false,
    isAutoLoggedIn: false,
    inRecoveryMode: false,
  });
  
  // UI state
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resetTokens, setResetTokens] = useState<PasswordResetTokens | null>(null);
  
  // Session management
  const [sessionId] = useState(() => generateSessionId());
  
  // Refs for preventing race conditions and memory leaks
  const recoveryModeRef = useRef<boolean | null>(null);
  const initializationRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Safe state update helper that checks if component is still mounted
   */
  const safeSetState = useCallback((updater: (prev: ResetPasswordState) => ResetPasswordState) => {
    if (mountedRef.current) {
      setState(updater);
    }
  }, []);

  /**
   * Initialize password reset flow with comprehensive error handling
   * 
   * INITIALIZATION PROCESS:
   * 1. Check if already initialized to prevent duplicate runs
   * 2. Detect recovery mode from URL parameters
   * 3. Handle auto-login scenario (user already authenticated via reset link)
   * 4. Extract and validate reset tokens from URL
   * 5. Establish secure recovery session
   * 6. Update component state based on results
   */
  const initializeResetFlow = useCallback(async (): Promise<void> => {
    if (initializationRef.current || !mountedRef.current) return;
    initializationRef.current = true;

    try {
      logger.info('Initializing password reset flow', {
        context: { feature: 'password-reset', action: 'initialization' },
        metadata: { sessionId },
      });
      
      // Wait for auth loading to complete to get accurate authentication state
      if (authLoading) {
        return;
      }
      
      // Detect recovery mode from URL
      if (recoveryModeRef.current === null) {
        const recoveryMode = isRecoveryMode();
        recoveryModeRef.current = recoveryMode;
        
        safeSetState(prev => ({
          ...prev,
          inRecoveryMode: recoveryMode,
        }));
      }
      
      // Handle auto-login scenario (Supabase automatically logs in user via reset link)
      if (isAuthenticated && user) {
        logger.info('User auto-logged in from reset link', {
          context: { feature: 'password-reset', action: 'autoLoginDetected' },
          metadata: { userId: user.id },
        });
        
        safeSetState(prev => ({
          ...prev,
          isAutoLoggedIn: true,
          isValidSession: true,
          isLoading: false,
        }));
        return;
      }
      
      // Extract and validate reset tokens from URL
      const tokens = extractResetTokens();
      if (!tokens) {
        safeSetState(prev => ({
          ...prev,
          error: 'Invalid or missing password reset tokens. Please request a new reset link.',
          isLoading: false,
        }));
        return;
      }
      
      setResetTokens(tokens);
      
      // Establish secure recovery session
      await establishRecoverySession(tokens);
      
      safeSetState(prev => ({
        ...prev,
        isValidSession: true,
        isLoading: false,
        error: null,
      }));
      
      logger.info('Password reset flow initialized successfully', {
        context: { feature: 'password-reset', action: 'initializationComplete' },
        metadata: { sessionId },
      });
      
    } catch (error) {
      logger.error('Password reset initialization failed', {
        context: { feature: 'password-reset', action: 'initialization' },
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: { sessionId },
      });
      
      safeSetState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize password reset. Please request a new reset link.',
      }));
    }
  }, [isAuthenticated, user, authLoading, sessionId, safeSetState]);

  // Initialize on mount and when auth state changes
  useEffect(() => {
    void initializeResetFlow();
  }, [initializeResetFlow]);

  /**
   * Handle form input changes with real-time validation feedback
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

        // Clear general error
        if (state.error) {
          safeSetState(prev => ({
            ...prev,
            error: null,
          }));
        }
      },
    [fieldErrors, state.error, safeSetState]
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
   * Handle form submission with comprehensive validation and error handling
   * 
   * SUBMISSION PROCESS:
   * 1. Validate form data client-side
   * 2. Update UI to show loading state
   * 3. Submit password update to backend
   * 4. Handle success/error responses
   * 5. Track analytics for monitoring
   * 6. Complete recovery flow on success
   */
  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    // Client-side validation
    const validation = validatePasswordResetForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    safeSetState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));
    setFieldErrors({});

    try {
      // Submit password update
      await updateUserPassword(formData, sessionId);
      
      // Track successful submission
      trackFormSubmit('password-reset', true);
      
      safeSetState(prev => ({
        ...prev,
        isComplete: true,
        isSubmitting: false,
      }));

      // Complete recovery flow after brief delay for user feedback
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
      
      safeSetState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update password',
        isSubmitting: false,
      }));
    }
  }, [formData, sessionId, safeSetState]);

  // Calculate password strength for real-time feedback
  const passwordStrength = formData.password ? validatePasswordStrength(formData.password) : null;

  // Choose appropriate layout based on recovery mode
  const LayoutComponent = state.inRecoveryMode ? RecoveryLayout : Layout;

  /**
   * LOADING STATE RENDERING
   * Shows loading spinner while initializing the reset flow
   */
  if (state.isLoading || authLoading) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center"
          >
            <LoadingSpinner size="lg" className="mx-auto mb-6" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Validating Reset Link
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your password reset request.
            </p>
          </motion.div>
        </div>
      </LayoutComponent>
    );
  }

  /**
   * ERROR STATE RENDERING
   * Shows error message for invalid or expired tokens
   */
  if (!state.isValidSession && !state.isAutoLoggedIn && state.error) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              {state.error}
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
          </motion.div>
        </div>
      </LayoutComponent>
    );
  }

  /**
   * SUCCESS STATE RENDERING
   * Shows success message after password reset completion
   */
  if (state.isComplete) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center"
          >
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
          </motion.div>
        </div>
      </LayoutComponent>
    );
  }

  /**
   * MAIN FORM RENDERING
   * The primary password reset form interface
   */
  return (
    <LayoutComponent>
      <div className={`${state.inRecoveryMode ? '' : 'min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full ${state.inRecoveryMode ? '' : 'max-w-md'}`}
        >
          {/* Auto-login notification */}
          {state.isAutoLoggedIn && (
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
              
              {/* Password Strength Indicator */}
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

            {/* Error Display */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{state.error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              fullWidth
              size="lg"
              isLoading={state.isSubmitting}
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
                  {state.inRecoveryMode && ' You cannot navigate away during the recovery process.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </LayoutComponent>
  );
};

export default ResetPasswordPage;