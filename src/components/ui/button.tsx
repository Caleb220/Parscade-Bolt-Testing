/**
 * Unified Button Component - Parscade Design System
 * Combines features from CustomButton, ui/button, and ParscadeButton
 * Provides consistent styling across the application
 */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-parscade hover:shadow-parscade-lg focus:ring-blue-500",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 shadow-sm hover:shadow-md focus:ring-slate-500",
        accent: "bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-parscade hover:shadow-parscade-lg focus:ring-blue-500",
        outline: "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-parscade focus:ring-blue-500",
        ghost: "text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-500",
        link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
      },
      size: {
        sm: "px-3 py-2 text-sm rounded-lg min-h-[36px]",
        md: "px-4 py-2.5 text-sm rounded-lg min-h-[40px]",
        lg: "px-6 py-3 text-base rounded-xl min-h-[44px]",
        xl: "px-8 py-4 text-lg rounded-xl min-h-[52px]",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (uses Radix Slot) */
  asChild?: boolean;
  /** Show loading spinner and disable interaction */
  isLoading?: boolean;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Add glow effect (primary variant only) */
  glow?: boolean;
  /** Disable motion animations */
  noAnimation?: boolean;
  /** Custom element type to render as */
  as?: React.ElementType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    glow = false,
    noAnimation = false,
    as: Component,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;

    // Add glow effect for primary variant
    const glowClasses = glow && variant === 'primary' ? 'shadow-parscade-glow' : '';

    // Combine classes
    const classes = [
      buttonVariants({ variant, size }),
      fullWidth ? 'w-full' : '',
      glowClasses,
      className,
    ].filter(Boolean).join(' ');

    // Content with loading state and icons
    const content = (
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </div>
    );

    // Use Radix Slot for asChild pattern
    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // Use custom component if specified
    if (Component) {
      return (
        <Component
          ref={ref}
          className={classes}
          disabled={isDisabled}
          {...props}
        >
          {content}
        </Component>
      );
    }

    // Default button with motion animations
    if (noAnimation) {
      return (
        <button
          ref={ref}
          className={classes}
          disabled={isDisabled}
          {...props}
        >
          {content}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        whileHover={!isDisabled ? {
          scale: 1.02,
          y: -1,
          transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
        } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;