/**
 * Dashboard Header Component
 * Top navigation bar with title, actions, and user menu
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';

import { useAuth } from '@/features/auth';
import CustomButton from '@/shared/components/forms/CustomButton';
import { Input } from '@/shared/components/ui/input';
import UserMenu from '@/shared/components/layout/molecules/UserMenu';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  onMenuToggle?: () => void;
}

/**
 * Dashboard header with responsive design and user context
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
  onMenuToggle,
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <CustomButton
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-gray-100/80 transition-colors duration-200"
              onClick={onMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </CustomButton>

            {/* Title */}
            <div className="hidden sm:block">
              {title ? (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Process documents with intelligent parsing</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10 w-64 bg-gray-50/80 border-gray-200/60 focus:bg-white focus:border-blue-300 transition-all duration-200"
                />
              </div>
            </div>

            {/* Notifications */}
            <CustomButton variant="ghost" size="sm" className="relative hover:bg-gray-100/80 transition-colors duration-200">
              <Bell className="w-5 h-5" />
              <motion.span 
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </CustomButton>

            {/* Custom Actions */}
            {actions}

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;