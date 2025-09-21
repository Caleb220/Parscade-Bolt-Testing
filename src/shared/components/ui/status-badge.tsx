/**
 * Status Badge Component
 * Standardized status indicators with consistent styling
 */

import React from 'react';
import { Badge } from './badge';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'active' | 'inactive' | 'error';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getVariant = () => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'default';
      case 'failed':
      case 'cancelled':
      case 'error':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {getStatusText()}
    </Badge>
  );
};

export default StatusBadge;