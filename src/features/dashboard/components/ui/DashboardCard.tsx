/**
 * Dashboard Card Component
 * Reusable card component for dashboard content
 */

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

import { ParscadeButton, ParscadeCard } from '@/shared/components/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { ReactNode } from 'react';

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
    <ParscadeCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variant="elevated"
      className={className}
    >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-gray-900 tracking-tight">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1 font-bold text-purple-600/70">
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
                className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-purple-600 font-bold">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 px-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-parscade"
              >
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </motion.div>
              <p className="text-red-600 mb-4 font-bold">{error}</p>
              {onRetry && (
                <ParscadeButton 
                  variant="outline" 
                  onClick={onRetry}
                >
                  Retry
                </ParscadeButton>
              )}
            </div>
          ) : (
            children
          )}
        </CardContent>
    </ParscadeCard>
  );
};

export default DashboardCard;