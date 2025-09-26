/**
 * Unified Input Component - Parscade Design System
 * Combines basic input with form field features
 * Provides consistent styling across the application
 */

import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        error: 'border-red-300 focus-visible:ring-red-500',
        success: 'border-green-300 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /** Label text to display above input */
  label?: string;
  /** Error message to display below input */
  error?: string;
  /** Success message to display below input */
  success?: string;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Helper text to display below input */
  helperText?: string;
  /** Make input full width of container */
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type,
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      helperText,
      fullWidth = false,
      required,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error/success state
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Calculate padding for icons
    const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    // Combine classes
    const inputClasses = [
      inputVariants({ variant: effectiveVariant, size }),
      iconPadding,
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400">{leftIcon}</span>
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${props.id}-error`
                : success
                  ? `${props.id}-success`
                  : helperText
                    ? `${props.id}-helper`
                    : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {success && !error && (
          <p id={`${props.id}-success`} className="mt-1 text-sm text-green-600">
            {success}
          </p>
        )}

        {helperText && !error && !success && (
          <p id={`${props.id}-helper`} className="mt-1 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
export default Input;
