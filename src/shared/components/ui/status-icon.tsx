/**
 * Status Icon Component
 * Standardized status icons with consistent styling
 */

import React from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

interface StatusIconProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconProps = {
    className: `${sizeClasses[size]} ${className}`,
  };

  switch (status) {
    case 'completed':
      return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
    case 'failed':
    case 'cancelled':
      return <XCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
    case 'processing':
      return <RefreshCw {...iconProps} className={`${iconProps.className} text-blue-600 animate-spin`} />;
    case 'pending':
      return <Clock {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
    default:
      return <AlertTriangle {...iconProps} className={`${iconProps.className} text-gray-600`} />;
  }
};

export default StatusIcon;