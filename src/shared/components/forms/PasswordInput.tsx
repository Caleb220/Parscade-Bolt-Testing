/**
 * Password Input Component
 * Enhanced password input with strength meter and visibility toggle
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { validatePassword, getPasswordStrengthLabel, getPasswordStrengthColor } from '@/shared/utils/passwordValidation';

import Input from './Input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showStrengthMeter?: boolean;
  fullWidth?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  error,
  showStrengthMeter = false,
  value = '',
  onChange,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordValidation = showStrengthMeter ? validatePassword(String(value)) : null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <Input
        {...props}
        type={showPassword ? 'text' : 'password'}
        label={label}
        error={error}
        value={value}
        onChange={onChange}
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        fullWidth={fullWidth}
        className={className}
      />
      
      {showStrengthMeter && value && passwordValidation && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Password strength</span>
            <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordValidation.score)}`}>
              {getPasswordStrengthLabel(passwordValidation.score)}
            </span>
          </div>
          
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                  level <= passwordValidation.score
                    ? level <= 1 ? 'bg-red-500'
                      : level <= 2 ? 'bg-yellow-500'
                      : level <= 3 ? 'bg-blue-500'
                      : 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {passwordValidation.feedback.length > 0 && (
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              {passwordValidation.feedback.map((feedback, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                  {feedback}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;