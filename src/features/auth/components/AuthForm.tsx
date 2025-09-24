import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import PasswordInput from '@/shared/components/forms/atoms/PasswordInput';
import CustomButton from '@/shared/components/forms/CustomButton';
import FormFieldInput from '@/shared/components/forms/FormFieldInput';
import { validatePassword } from '@/shared/utils/passwordValidation';

import { useAuth } from '../context/AuthContext';

import type { FormErrors } from '../types/authTypes';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onSuccess?: () => void;
}

/**
 * Authentication form component with validation and rate limiting
 */
const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange, onSuccess }) => {
  const { signIn, signUp, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [attemptCount, setAttemptCount] = useState(0);

  const MAX_ATTEMPTS = 5;
  const RATE_LIMIT_DURATION = 5 * 60 * 1000;
  const isRateLimited = attemptCount >= MAX_ATTEMPTS;

  useEffect(() => {
    setFormErrors({});
    clearError();
  }, [mode, clearError]);

  useEffect(() => {
    if (isRateLimited) {
      const timer = setTimeout(() => {
        setAttemptCount(0);
      }, RATE_LIMIT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isRateLimited, RATE_LIMIT_DURATION]);

  /**
   * Validate form fields based on current mode
   */
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (mode === 'signup') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.feedback[0] || 'Password does not meet security requirements';
      }
    }

    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      }
      
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
      } else if (formData.username.trim().length < 2) {
        errors.username = 'Username must be at least 2 characters';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, mode]);

  /**
   * Handle form submission with error handling
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRateLimited) {
      setFormErrors({ general: 'Too many failed attempts. Please wait 5 minutes before trying again.' });
      return;
    }

    if (!validateForm()) return;

    setFormErrors({});
    clearError();

    try {
      if (mode === 'signin') {
        await signIn(formData.email.trim(), formData.password);
      } else {
        await signUp(formData.email.trim(), formData.password, formData.fullName.trim(), formData.username.trim());
      }

      setAttemptCount(0);
      onSuccess?.();
    } catch (authError) {
      setAttemptCount((prev) => prev + 1);

      const errorMessage = (authError as Error)?.message || error || 'Authentication failed. Please review your details and try again.';
      setFormErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    }
  }, [formData, mode, isRateLimited, validateForm, clearError, signIn, signUp, error, onSuccess]);

  /**
   * Create input change handler for specific field
   */
  const handleInputChange = useCallback((field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (formErrors.general) {
      setFormErrors((prev) => ({ ...prev, general: undefined }));
    }

    clearError();
  }, [formErrors, clearError]);

  const handleEmailChange = useCallback(handleInputChange('email'), [handleInputChange]);
  const handlePasswordChange = useCallback(handleInputChange('password'), [handleInputChange]);
  const handleFullNameChange = useCallback(handleInputChange('fullName'), [handleInputChange]);
  const handleUsernameChange = useCallback(handleInputChange('username'), [handleInputChange]);

  const handleModeToggle = useCallback(() => {
    onModeChange(mode === 'signin' ? 'signup' : 'signin');
  }, [mode, onModeChange]);

  const formContent = useMemo(() => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin'
              ? 'Sign in to your Parscade account'
              : 'Start transforming your documents today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <FormFieldInput
              type="text"
              label="Full Name"
              value={formData.fullName}
              onChange={handleFullNameChange}
              error={formErrors.fullName}
              leftIcon={<User className="w-5 h-5" />}
              placeholder="Enter your full name"
              required
            />
          )}

          {mode === 'signup' && (
            <FormFieldInput
              type="text"
              label="Username"
              value={formData.username}
              onChange={handleUsernameChange}
              error={formErrors.username}
              leftIcon={<User className="w-5 h-5" />}
              placeholder="Enter a username"
              required
            />
          )}

          <FormFieldInput
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleEmailChange}
            error={formErrors.email}
            leftIcon={<Mail className="w-5 h-5" />}
            placeholder="Enter your email"
            required
          />

          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={handlePasswordChange}
            error={formErrors.password}
            placeholder={mode === 'signin' ? 'Enter your password' : 'Create a strong password'}
            showStrengthMeter={mode === 'signup' && formData.password.length > 0}
            required
          />

          {mode === 'signin' && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Locked out?{' '}
                <a 
                  href="mailto:admin@parscade.com?subject=Account Access Help"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Contact support
                </a>
              </p>
            </div>
          )}

          <AnimatePresence>
            {(error || formErrors.general) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">
                  {formErrors.general || error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {isRateLimited && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-yellow-700">
                Too many failed attempts. Please wait 5 minutes before trying again.
              </span>
            </motion.div>
          )}

          <CustomButton
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isRateLimited}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </CustomButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={handleModeToggle}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    );
  }, [
    formErrors,
    mode,
    formData,
    error,
    isLoading,
    isRateLimited,
    handleSubmit,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleUsernameChange,
    handleModeToggle,
  ]);

  return formContent;
};

export default AuthForm;