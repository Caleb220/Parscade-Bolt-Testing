/**
 * Dashboard Header Component - Professional Blue Theme
 * Clean header with notifications and user context
 */

import { motion } from 'framer-motion';
import { Menu, Bell } from 'lucide-react';
import React from 'react';

import { useAuth } from '@/features/auth';

import type { ReactNode } from 'react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  onMenuToggle?: () => void;
}

/**
 * Professional dashboard header with refined blue theme
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
  onMenuToggle,
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {onMenuToggle && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}

            {/* Title */}
            <div className="min-w-0 flex-1">
              {title ? (
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h1>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-blue-600 truncate hidden sm:block">{subtitle}</p>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-600 hidden sm:block">Monitor your document processing and analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <motion.span 
                className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Custom Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {actions}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;