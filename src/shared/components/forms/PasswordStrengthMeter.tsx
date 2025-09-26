/**
 * Password Strength Meter Component
 * Visual indicator for password strength with real-time feedback
 */

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';

import {
  validatePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/shared/utils/passwordValidation';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
  showFeedback?: boolean;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
  showFeedback = true,
}) => {
  const validation = validatePassword(password);

  if (!password) {
    return null;
  }

  const strengthColor = getPasswordStrengthColor(validation.score);
  const strengthLabel = getPasswordStrengthLabel(validation.score);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">Password Strength</span>
          <span className={`text-xs font-medium ${strengthColor.replace('bg-', 'text-')}`}>
            {strengthLabel}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${(validation.score / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && validation.feedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          {validation.feedback.map((feedback, index) => (
            <div key={index} className="flex items-center text-xs text-red-600">
              <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Success State */}
      {validation.isValid && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-xs text-green-600"
        >
          <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>Password meets all security requirements</span>
        </motion.div>
      )}

      {/* Requirements Checklist */}
      {showFeedback && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 pt-2 border-t border-gray-100"
        >
          <div className="text-xs font-medium text-gray-600 mb-1">Requirements:</div>
          {[
            { test: password.length >= 8, label: 'At least 8 characters' },
            { test: /[A-Z]/.test(password), label: 'One uppercase letter' },
            { test: /[a-z]/.test(password), label: 'One lowercase letter' },
            { test: /\d/.test(password), label: 'One number' },
            {
              test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
              label: 'One special character',
            },
          ].map((requirement, index) => (
            <div key={index} className="flex items-center text-xs">
              {requirement.test ? (
                <CheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
              )}
              <span className={requirement.test ? 'text-green-600' : 'text-gray-500'}>
                {requirement.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
