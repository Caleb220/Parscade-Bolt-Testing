/**
 * Dashboard Sidebar Component
 * Navigation sidebar with responsive behavior
 */

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Settings, 
  Users, 
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '@/features/auth';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiresAdmin?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { label: 'Jobs', href: '/dashboard/jobs', icon: Zap },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Team', href: '/dashboard/team', icon: Users, requiresAdmin: true },
  { label: 'Settings', href: '/account', icon: Settings },
];

/**
 * Collapsible sidebar navigation with role-based filtering
 */
const DashboardSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.user_metadata?.role === 'admin';
  const visibleItems = navigationItems.filter(item => !item.requiresAdmin || isAdmin);

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={`hidden lg:flex flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-premium transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <img
                src="/main-logo.png"
                alt="Parscade"
                className="w-8 h-8 rounded-full mr-3 shadow-sm"
              />
              <span className="text-xl font-black text-gray-900 tracking-tight">Parscade</span>
            </motion.div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100/80 transition-all duration-200 hover:shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive: linkIsActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive(item.href) || linkIsActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200/60'
                  : 'text-gray-700 hover:bg-gray-50/80 hover:shadow-sm hover:scale-[1.02]'
              }`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <motion.span 
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/60">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 font-medium">
            <p>Parscade Beta v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;