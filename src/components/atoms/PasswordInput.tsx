import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { ComponentWithRef } from '../../types/common';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly variant?: 'default' | 'filled';
  readonly showStrengthMeter?: boolean | undefined; // <-- add this
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      className = '',
      id,
      value = '',
      onChange,
      showStrengthMeter = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? `password-${Math.random().toString(36).slice(2, 11)}`;

    const baseClasses = 'block w-full pr-12 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<NonNullable<PasswordInputProps['variant']>, string> = {
      default: 'border border-gray-300 rounded-md px-3 py-2 bg-white',
      filled: 'border-0 rounded-md px-3 py-2 bg-gray-100 focus:bg-white',
    };

    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : '';

    const inputClasses = [
      baseClasses,
      variantClasses[variant],
      errorClasses,
      className,
    ].join(' ');

    const togglePasswordVisibility = (): void => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            className={inputClasses}
            value={value}
            onChange={onChange}
            {...props}
          />
          
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
) as ComponentWithRef<PasswordInputProps, HTMLInputElement>;

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;