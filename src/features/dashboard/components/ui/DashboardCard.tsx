/**
 * Dashboard Card Component
 * Reusable card component for dashboard content
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

import CustomButton from '@/shared/components/forms/CustomButton';
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
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className={`h-full shadow-premium hover:shadow-premium-lg transition-all duration-300 border-gray-200/60 bg-white/95 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1 font-medium">
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
              <motion.div 
                className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 px-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </motion.div>
              <p className="text-red-600 mb-4 font-medium">{error}</p>
              {onRetry && (
                <CustomButton 
                  variant="outline" 
                  onClick={onRetry}
                  className="hover:shadow-sm transition-all duration-200"
                >
                  Retry
                </CustomButton>
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