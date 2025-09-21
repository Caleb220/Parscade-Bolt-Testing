/**
 * Dashboard Header Component - Professional Blue Theme
 * Clean header with search, notifications, and user context
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { ParscadeButton } from '@/shared/components/brand';
import { Input } from '@/shared/components/ui/input';
import UserMenu from '@/shared/components/layout/molecules/UserMenu';

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
            <ParscadeButton
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </ParscadeButton>

            {/* Title */}
            <div className="hidden sm:block">
              {title ? (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-blue-600">{subtitle}</p>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-sm text-blue-600">Monitor your document processing and analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 transition-all duration-200 rounded-lg"
                />
              </div>
            </div>

            {/* Notifications */}
            <ParscadeButton variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <motion.span 
                className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </ParscadeButton>

            {/* Custom Actions */}
            {actions}

            {/* User Menu */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;