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

import { ParscadeLogo } from '@/shared/components/brand';
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
    <aside className={`hidden lg:flex flex-col bg-white/95 backdrop-blur-xl border-r border-purple-200/30 shadow-parscade transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-purple-200/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ParscadeLogo size="md" variant="gradient" animated />
            </motion.div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-purple-50/80 transition-all duration-200 hover:shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-purple-600" />
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
                  ? 'bg-gradient-to-r from-purple-50 to-cyan-50 text-purple-700 shadow-parscade border border-purple-200/60'
                  : 'text-gray-700 hover:bg-purple-50/50 hover:shadow-sm hover:scale-[1.02]'
              }`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
            </motion.div>
            
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
                      className="bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold shadow-sm"
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
      <div className="p-4 border-t border-purple-200/30">
        {!isCollapsed && (
          <div className="text-xs text-purple-600/70 font-bold">
            <p>Parscade Beta v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;