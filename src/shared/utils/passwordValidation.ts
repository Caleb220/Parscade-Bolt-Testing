/**
 * Password Validation Utilities
 * Provides comprehensive password strength validation
 */

export interface PasswordValidation {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

/**
 * Validate password strength and provide feedback
 */
export const validatePassword = (password: string): PasswordValidation => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      isValid: false,
      score: 0,
      feedback: ['Password is required'],
    };
  }

  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common patterns to avoid
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating characters');
    score = Math.max(0, score - 1);
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    feedback.push('Avoid common patterns and words');
    score = Math.max(0, score - 1);
  }

  const isValid = feedback.length === 0 && score >= 4;

  return {
    isValid,
    score: Math.min(score, 4),
    feedback,
  };
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Unknown';
  }
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-blue-500';
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};
