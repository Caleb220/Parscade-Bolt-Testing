/**
 * Dashboard Sidebar Component - Scalable Navigation
 * Modular navigation system with feature access control
 */

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
  Crown,
  Brain,
  TrendingUp,
  FileSpreadsheet,
  Settings2,
  Layout,
  Cpu,
  CheckCircle2,
  Code2,
  Webhook,
  Database,
  Cloud,
  UserCog,
  GraduationCap,
  Shield,
  ScrollText,
  FileSearch,
  Archive,
  Activity,
  User,
  Lock,
  Bell,
  Receipt,
  Command,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ParscadeLogo } from '@/shared/components/brand';
import { navigationStructure } from '@/shared/design/theme';
import { type UserRole, type UserPlan } from '@/shared/hooks/useFeatureAccess';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  role?: 'admin';
  tier?: 'free' | 'standard' | 'pro' | 'enterprise';
}

interface RawNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description?: string;
  tier?: 'free' | 'standard' | 'pro' | 'enterprise';
  role?: 'admin';
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
  Brain,
  TrendingUp,
  FileSpreadsheet,
  Settings2,
  Layout,
  Cpu,
  CheckCircle2,
  Code2,
  Webhook,
  Database,
  Cloud,
  UserCog,
  GraduationCap,
  Shield,
  ScrollText,
  FileSearch,
  Archive,
  Activity,
  User,
  Lock,
  Bell,
  Receipt,
  Command,
} as const;

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  variant?: 'default' | 'command-center' | 'analytics' | 'minimal';
}

/**
 * Scalable sidebar navigation with feature access control
 */
const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
  variant: _variant = 'default',
}) => {
  // Use controlled collapsed state if provided, otherwise use internal state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const location = useLocation();
  const { user } = useAuth();

  const userRole: UserRole = user?.user_role || 'user';
  const userTier: UserPlan = user?.subscription_tier || user?.plan || 'free';
  const isAdmin = userRole === 'admin';

  // Create sophisticated categorized navigation for enterprise platform
  const getNavigationCategories = () => {
    const tierHierarchy = ['free', 'standard', 'pro', 'enterprise'];
    const userTierLevel = tierHierarchy.indexOf(userTier);

    const processNavItems = (items: RawNavigationItem[]) =>
      items.map(item => ({
        id: item.id,
        label: item.label,
        href: item.path,
        icon: iconMap[item.icon as keyof typeof iconMap],
        description: item.description,
        tier: item.tier,
        role: item.role,
        badge: item.tier && tierHierarchy.indexOf(item.tier) > userTierLevel ?
               item.tier.charAt(0).toUpperCase() + item.tier.slice(1) : undefined,
      })).filter(item => {
        // Show admin items only to admins
        if (item.role === 'admin' && !isAdmin) return false;
        // Always show items (with upgrade badges for premium features)
        return true;
      });

    return {
      primary: processNavItems(navigationStructure.primary),
      analytics: processNavItems(navigationStructure.analytics),
      processing: processNavItems(navigationStructure.processing),
      integrations: processNavItems(navigationStructure.integrations),
      workflow: processNavItems(navigationStructure.workflow),
      security: processNavItems(navigationStructure.security),
      admin: processNavItems(navigationStructure.admin),
      account: processNavItems(navigationStructure.account),
    };
  };

  const navigationCategories = getNavigationCategories();

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Close mobile sidebar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && onClose) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col inset-y-0 left-0 z-30 bg-white/95 backdrop-blur-sm
              border-r border-slate-200 shadow-parscade transition-all duration-300
            ${isCollapsed ? 'w-20' : 'w-82'}`}  // use Tailwind widths; w-82 isn't standard
        >
        <SidebarContent
          isCollapsed={isCollapsed}
          onToggleCollapse={() => {
            if (onToggleCollapse) {
              onToggleCollapse();
            } else {
              setInternalCollapsed(!internalCollapsed);
            }
          }}
          navigationCategories={navigationCategories}
          isActive={isActive}
          userTier={userTier}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            id="mobile-sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative flex flex-col w-80 max-w-sm bg-white shadow-2xl"
          >
            <SidebarContent
              isCollapsed={false}
              onToggleCollapse={onClose}
              navigationCategories={navigationCategories}
              isActive={isActive}
              userTier={userTier}
              isMobile={true}
            />
          </motion.aside>
        </div>
      )}
    </>
  );
};

interface SidebarContentProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  navigationCategories: {
    primary: NavigationItem[];
    analytics: NavigationItem[];
    processing: NavigationItem[];
    integrations: NavigationItem[];
    workflow: NavigationItem[];
    security: NavigationItem[];
    admin: NavigationItem[];
    account: NavigationItem[];
  };
  isActive: (href: string) => boolean;
  userTier: string;
  isMobile?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isCollapsed,
  onToggleCollapse,
  navigationCategories,
  isActive,
  userTier,
  isMobile = false,
}) => {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ParscadeLogo size="md" variant="gradient" animated />
            </motion.div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
          >
            {isMobile ? (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.div>
            ) : isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto">
        {/* Primary Section */}
        <NavigationSection
          title="Dashboard"
          items={navigationCategories.primary}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
        />

        {/* Analytics & Intelligence */}
        <NavigationSection
          title="Analytics & Intelligence"
          items={navigationCategories.analytics}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={BarChart3}
        />

        {/* Processing Engine */}
        <NavigationSection
          title="Processing Engine"
          items={navigationCategories.processing}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={Cpu}
        />

        {/* Integrations */}
        <NavigationSection
          title="Integrations"
          items={navigationCategories.integrations}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={Webhook}
        />

        {/* Team & Workflow */}
        <NavigationSection
          title="Team & Workflow"
          items={navigationCategories.workflow}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={Users}
        />

        {/* Security & Compliance */}
        <NavigationSection
          title="Security & Compliance"
          items={navigationCategories.security}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={Shield}
        />

        {/* Admin Console */}
        {navigationCategories.admin.length > 0 && (
          <NavigationSection
            title="Admin Console"
            items={navigationCategories.admin}
            isActive={isActive}
            userTier={userTier}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onToggleCollapse={onToggleCollapse}
            icon={Settings2}
          />
        )}

        {/* Account */}
        <NavigationSection
          title="Account"
          items={navigationCategories.account}
          isActive={isActive}
          userTier={userTier}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onToggleCollapse={onToggleCollapse}
          icon={User}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        {(!isCollapsed || isMobile) && (
          <div className="text-xs text-slate-500">
            <p className="font-medium">Parscade Beta v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        )}
      </div>
    </>
  );
};

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  isActive: (href: string) => boolean;
  userTier: string;
  isCollapsed: boolean;
  isMobile: boolean;
  onToggleCollapse: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  title,
  items,
  isActive,
  userTier,
  isCollapsed,
  isMobile,
  onToggleCollapse,
  icon: SectionIcon,
}) => {
  if (!items.length) return null;

  return (
    <div className="space-y-4 mb-6">
      {/* Section Header */}
      {(!isCollapsed || isMobile) && (
        <div className="flex items-center px-4 mb-4 mt-2">
          {SectionIcon && (
            <SectionIcon className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          )}
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}

      {/* Section Items */}
      <div className="space-y-2">
        {items.map(item => {
          const isItemActive = isActive(item.href);
          const tierHierarchy = ['free', 'standard', 'pro', 'enterprise'];
          const userTierLevel = tierHierarchy.indexOf(userTier);
          const itemTierLevel = item.tier ? tierHierarchy.indexOf(item.tier) : -1;
          const needsUpgrade = itemTierLevel > userTierLevel;

          return (
            <NavLink
              key={item.href}
              to={needsUpgrade ? '/billing' : item.href}
              onClick={isMobile ? onToggleCollapse : undefined}
              className={`flex items-center mx-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isCollapsed && !isMobile
                  ? 'justify-center py-4 px-3 min-h-[52px]'
                  : isMobile
                    ? 'py-4 px-4 min-h-[48px]'
                    : 'py-4 px-4'
              } ${
                isItemActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200/60'
                  : needsUpgrade
                    ? 'text-slate-500 hover:bg-amber-50/50 hover:text-amber-700 hover:shadow-sm cursor-pointer border border-amber-200/40'
                    : 'text-slate-700 hover:bg-blue-50/50 hover:shadow-sm hover:scale-[1.01]'
              }`}
              title={
                needsUpgrade
                  ? `Upgrade to ${item.tier} to access ${item.label}`
                  : isCollapsed && !isMobile
                    ? `${item.label}${item.description ? ` - ${item.description}` : ''}`
                    : undefined
              }
            >
              <motion.div
                whileHover={!needsUpgrade ? { scale: 1.1 } : {}}
                transition={{ duration: 0.2 }}
              >
                <item.icon
                  className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${isCollapsed && !isMobile ? '' : 'mr-3'} flex-shrink-0 ${
                    needsUpgrade ? 'text-amber-400' : ''
                  }`}
                />
              </motion.div>

              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center justify-between flex-1"
                  >
                    <div className="flex flex-col py-0.5">
                      <span className={`font-medium leading-snug ${isMobile ? 'text-sm' : 'text-sm'}`}>{item.label}</span>
                      {item.description && !needsUpgrade && (
                        <span className={`text-slate-500 mt-1 ${isMobile ? 'text-xs' : 'text-xs'} leading-relaxed`}>
                          {item.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && !needsUpgrade && (
                        <motion.span
                          className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      {needsUpgrade && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center space-x-1"
                        >
                          <Crown className="w-4 h-4 text-amber-500 drop-shadow-sm" />
                          <span className="text-xs text-amber-600 font-medium">
                            {item.tier?.toUpperCase()}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
