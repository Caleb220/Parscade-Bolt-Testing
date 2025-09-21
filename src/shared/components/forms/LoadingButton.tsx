/**
 * Loading Button Component
 * Button with integrated loading state
 */

import React from 'react';
import Button from './Button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      isLoading={isLoading}
      disabled={disabled || isLoading}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;