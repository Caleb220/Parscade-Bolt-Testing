/**
 * Dashboard Sidebar Component - Scalable Navigation
 * Modular navigation system with feature access control
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
  ChevronRight,
  CreditCard,
  Key,
  GitBranch,
  Puzzle,
  Crown
} from 'lucide-react';

import { ParscadeLogo } from '@/shared/components/brand';
import { useAuth } from '@/features/auth';
import { useFeatureAccess } from '@/shared/hooks/useFeatureAccess';
import { navigationStructure } from '@/shared/design/theme';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  role?: 'admin';
  tier?: 'pro' | 'enterprise';
}

// Icon mapping for navigation items
const iconMap = {
  Home,
  FileText,
  BarChart3,
  Settings,
  Users,
  Zap,
  CreditCard,
  Key,
  GitBranch,
  Puzzle,
  Crown,
} as const;

/**
 * Scalable sidebar navigation with feature access control
 */
const DashboardSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { hasAccess } = useFeatureAccess();

  const isAdmin = (user as any)?.user_role === 'admin';
  const userTier = (user as any)?.plan || 'free';

  // Convert navigation structure to items with access control
  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [];

    // Primary navigation
    navigationStructure.primary.forEach(item => {
      items.push({
        id: item.id,
        label: item.label,
        href: item.path,
        icon: iconMap[item.icon as keyof typeof iconMap],
      });
    });

    // Secondary navigation with tier checks
    navigationStructure.secondary.forEach(item => {
      if (!item.tier || userTier === item.tier || userTier === 'enterprise') {
        items.push({
          id: item.id,
          label: item.label,
          href: item.path,
          icon: iconMap[item.icon as keyof typeof iconMap],
          tier: item.tier,
          badge: item.tier && userTier !== item.tier ? 'Pro' : undefined,
        });
      }
    });

    // Admin navigation
    if (isAdmin) {
      navigationStructure.admin.forEach(item => {
        items.push({
          id: item.id,
          label: item.label,
          href: item.path,
          icon: iconMap[item.icon as keyof typeof iconMap],
          role: 'admin',
        });
      });
    }

    // Settings navigation
    navigationStructure.settings.forEach(item => {
      if (!item.tier || userTier === item.tier || userTier === 'enterprise') {
        items.push({
          id: item.id,
          label: item.label,
          href: item.path,
          icon: iconMap[item.icon as keyof typeof iconMap],
          tier: item.tier,
          badge: item.tier && userTier !== item.tier ? 'Pro' : undefined,
        });
      }
    });

    return items;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={`hidden lg:flex flex-col bg-white/95 backdrop-blur-sm border-r border-slate-200 shadow-parscade transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
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
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isItemActive = isActive(item.href);
          const needsUpgrade = item.tier && userTier !== item.tier && userTier !== 'enterprise';
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isItemActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200/60'
                  : needsUpgrade
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-blue-50/50 hover:shadow-sm hover:scale-[1.01]'
              }`}
              title={isCollapsed ? item.label : undefined}
              onClick={needsUpgrade ? (e) => e.preventDefault() : undefined}
            >
              <motion.div
                whileHover={!needsUpgrade ? { scale: 1.1 } : {}}
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
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                    {needsUpgrade && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        {!isCollapsed && (
          <div className="text-xs text-slate-500">
            <p className="font-medium">Parscade Beta v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;