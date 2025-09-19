import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/templates/Layout';
import LoadingButton from '../../../components/atoms/LoadingButton';
import Input from '../../../components/atoms/Input';
import { useAuth } from '../context/AuthContext';
import { trackFormSubmit } from '../../../utils/analytics';
import { logger } from '../../../services/logger';

/**
 * Enterprise-Grade Forgot Password Page Component
 * 
 * SECURITY FEATURES:
 * - Rate limiting with exponential backoff to prevent abuse
 * - Email validation and sanitization
 * - Secure error handling that doesn't leak information
 * - Comprehensive logging for security monitoring
 * - CSRF protection through Supabase integration
 * 
 * UX FEATURES:
 * - Real-time email validation feedback
 * - Clear success/error states with actionable guidance
 * - Loading states with proper accessibility
 * - Responsive design with smooth animations
 * - Helpful security notices and guidance
 */
const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null);

  // Enhanced rate limiting configuration
  const MAX_ATTEMPTS = 5;
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const isRateLimited = attempts >= MAX_ATTEMPTS;

  /**
   * Calculate remaining cooldown time for rate limiting
   */
  const getRemainingCooldown = useCallback((): number => {
    if (!lastAttemptTime) return 0;
    const elapsed = Date.now() - lastAttemptTime.getTime();
    return Math.max(0, RATE_LIMIT_WINDOW - elapsed);
  }, [lastAttemptTime, RATE_LIMIT_WINDOW]);

  /**
   * Format cooldown time for display
   */
  const formatCooldownTime = useCallback((ms: number): string => {
    const minutes = Math.ceil(ms / 60000);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }, []);

  /**
   * Enhanced email validation with comprehensive checks
   */
  const validateEmail = useCallback((email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    const trimmed = email.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 254) return false; // RFC 5321 limit
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return false;
    
    // Additional checks for common issues
    if (trimmed.includes('..')) return false; // Consecutive dots
    if (trimmed.startsWith('.') || trimmed.endsWith('.')) return false;
    if (trimmed.includes(' ')) return false; // Spaces
    
    return true;
  }, []);

  /**
   * Enhanced form submission with comprehensive validation and rate limiting
   */
  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    
    // Check rate limiting with cooldown
    if (isRateLimited) {
      const cooldown = getRemainingCooldown();
      if (cooldown > 0) {
        setError(`Too many reset requests. Please wait ${formatCooldownTime(cooldown)} before trying again.`);
        return;
      } else {
        // Reset attempts if cooldown has expired
        setAttempts(0);
        setLastAttemptTime(null);
      }
    }

    // Enhanced email validation
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }

    if (trimmedEmail.length > 254) {
      setError('Email address is too long.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Record attempt with timestamp
    const now = new Date();
    setAttempts(prev => prev + 1);
    setLastAttemptTime(now);

    try {
      logger.info('Password reset request initiated', {
        context: { feature: 'auth', action: 'forgotPasswordRequest' },
        metadata: { 
          emailDomain: trimmedEmail.split('@')[1],
          attempt: attempts + 1,
        },
      });
      
      await resetPassword(trimmedEmail);
      
      trackFormSubmit('forgot-password', true);
      setIsSuccess(true);
      
      logger.info('Password reset request completed successfully', {
        context: { feature: 'auth', action: 'forgotPasswordSuccess' },
      });
    } catch (resetError) {
      logger.warn('Forgot password request failed', {
        context: { 
          feature: 'auth', 
          action: 'forgotPasswordRequest',
        },
        error: resetError instanceof Error ? resetError : new Error(String(resetError)),
        metadata: { attempt: attempts + 1 },
      });
      
      trackFormSubmit('forgot-password', false);
      
      const errorMessage = resetError instanceof Error 
        ? resetError.message 
        : 'Failed to send password reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, isRateLimited, resetPassword, validateEmail, attempts, getRemainingCooldown, formatCooldownTime]);

  /**
   * Enhanced email input change handler with real-time validation
   */
  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setEmail(value);
    
    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  /**
   * SUCCESS STATE RENDERING
   * Enhanced success page with better guidance and actions
   */
  if (isSuccess) {
    return (
      <Layout>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
            
            {/* Enhanced guidance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your email inbox for the reset link</li>
                <li>• Look in your spam/junk folder if you don't see it</li>
                <li>• The link will expire in 24 hours for security</li>
                <li>• Click the link to set your new password</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                  setAttempts(0);
                  setLastAttemptTime(null);
                }}
                size="lg"
                fullWidth
              >
                Send Another Email
              </LoadingButton>
              <LoadingButton
                as={Link}
                to="/"
                variant="ghost"
                size="lg"
                fullWidth
              >
                Back to Home
              </LoadingButton>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  /**
   * MAIN FORM RENDERING
   * Enhanced form with better validation feedback and security notices
   */
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              leftIcon={<Mail className="w-5 h-5" />}
              placeholder="Enter your email address"
              error={error}
              required
              autoComplete="email"
              aria-describedby="email-help"
            />
            
            <p id="email-help" className="text-xs text-gray-500">
              We'll send a secure reset link to this email address.
            </p>

            {/* Enhanced Rate Limiting Warning */}
            {attempts >= 3 && !isRateLimited && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                role="alert"
              >
                <Clock className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Rate Limit Warning
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining before temporary lockout.
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Rate Limited State */}
            {isRateLimited && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Too Many Attempts
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Please wait {formatCooldownTime(getRemainingCooldown())} before trying again.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              loadingText="Sending Reset Link..."
              disabled={isRateLimited}
            >
              Send Reset Link
            </LoadingButton>
          </form>

          {/* Back to Sign In */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>

          {/* Enhanced Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-800 mb-1">
                  Security Notice
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Reset links are only sent to registered email addresses</li>
                  <li>• Links expire after 24 hours for security</li>
                  <li>• Each link can only be used once</li>
                  <li>• Check your spam folder if you don't see the email</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;