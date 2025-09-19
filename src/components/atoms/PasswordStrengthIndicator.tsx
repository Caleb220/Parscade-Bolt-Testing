import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Password Strength Indicator Component
 * 
 * DESIGN PRINCIPLES:
 * - Real-time visual feedback for password strength
 * - Accessible design with proper ARIA labels
 * - Smooth animations for better UX
 * - Color-coded strength levels with icons
 * - Detailed feedback messages for improvement
 */

interface PasswordStrength {
  readonly score: number;
  readonly feedback: readonly string[];
  readonly isValid: boolean;
}

interface PasswordStrengthIndicatorProps {
  readonly password: string | null | undefined;
  readonly strength: PasswordStrength | null;
  readonly className?: string;
}

/**
 * Maps strength scores to user-friendly labels and colors
 * NULL-SAFE: Handles undefined/null password inputs gracefully
 */
const getStrengthConfig = (score: number, isValid: boolean) => {
  if (isValid && score >= 5) {
    return {
      label: 'Strong',
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      icon: CheckCircle,
    };
  }
  
  if (score >= 4) {
    return {
      label: 'Good',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      icon: CheckCircle,
    };
  }
  
  if (score >= 3) {
    return {
      label: 'Fair',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
      icon: AlertCircle,
    };
  }
  
  if (score >= 2) {
    return {
      label: 'Weak',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      icon: XCircle,
    };
  }
  
  return {
    label: 'Very Weak',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    icon: XCircle,
  };
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  strength,
  className = '',
}) => {
  // NULL-SAFE: Handle undefined/null password and ensure we have actual content
  const safePassword = password ?? '';
  if (safePassword.length === 0 || !strength) {
    return null;
  }

  const config = getStrengthConfig(strength.score, strength.isValid);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`mt-3 ${className}`}
        role="region"
        aria-label="Password strength indicator"
      >
        {/* Strength Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Password Strength
          </span>
          <div className="flex items-center space-x-1">
            <Icon className={`w-4 h-4 ${config.color}`} aria-hidden="true" />
            <span className={`text-sm font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-3">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, index) => (
              <motion.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  ease: 'easeOut' 
                }}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  index < strength.score
                    ? config.bgColor
                    : 'bg-gray-200'
                }`}
                style={{ transformOrigin: 'left' }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Feedback Messages */}
        {strength.feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-1"
          >
            <p className="text-xs font-medium text-gray-600 mb-1">
              Suggestions:
            </p>
            <ul className="space-y-1" role="list">
              {strength.feedback.slice(0, 3).map((feedback, index) => (
                <motion.li
                  key={feedback}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start text-xs text-gray-600"
                >
                  <span 
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0" 
                    aria-hidden="true"
                  />
                  <span>{feedback}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Success Message */}
        {strength.isValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-2 flex items-center text-xs text-green-700 bg-green-50 rounded-md px-2 py-1"
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Password meets security requirements</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordStrengthIndicator;