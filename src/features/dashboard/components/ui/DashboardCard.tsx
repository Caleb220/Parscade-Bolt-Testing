/**
 * Dashboard Card Component
 * Reusable card component for dashboard content
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

/**
 * Standardized dashboard card with consistent styling and behavior
 */
const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  actions,
  className = '',
  loading = false,
  error,
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              {onRetry && (
                <Button variant="outline" onClick={onRetry}>
                  Retry
                </Button>
              )}
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCard;