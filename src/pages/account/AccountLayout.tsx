/**
 * Account Layout with Context Provider
 */

import React, { createContext, useContext } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Zap } from 'lucide-react';
import Layout from '@/components/templates/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccount } from '@/hooks/api/useAccountData';
import type { User as UserType } from '@/lib/types';

interface AccountContextType {
  user: UserType | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AccountContext = createContext<AccountContextType | null>(null);

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within AccountLayout');
  }
  return context;
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, path: '/account' },
  { id: 'security', label: 'Security', icon: Shield, path: '/account/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/account/notifications' },
  { id: 'integrations', label: 'Integrations', icon: Zap, path: '/account/integrations' },
] as const;

const AccountLayout: React.FC = () => {
  const location = useLocation();
  const { data: user, isLoading, error } = useAccount();

  const activeTab = tabs.find(tab => 
    tab.path === location.pathname || 
    (tab.id === 'profile' && location.pathname === '/account')
  )?.id || 'profile';

  const contextValue: AccountContextType = {
    user,
    isLoading,
    error: error instanceof Error ? error : null,
  };

  return (
    <Layout>
      <AccountContext.Provider value={contextValue}>
        <div className="bg-gray-50 min-h-screen">
          {/* Sticky Header */}
          <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-1">
                      Manage your profile, security, and integration preferences
                    </p>
                    {user?.email && (
                      <p className="text-sm text-blue-600 mt-1">
                        Signed in as {user.email}
                      </p>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : user && (
                    <div className="flex items-center space-x-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name || user.email}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {user.full_name || user.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tab Navigation */}
                <div className="mt-6">
                  {/* Desktop Tabs */}
                  <div className="hidden sm:block">
                    <nav className="flex space-x-6" aria-label="Account sections">
                      {tabs.map(({ id, label, icon: Icon, path }) => (
                        <NavLink
                          key={id}
                          to={path}
                          className={({ isActive }) =>
                            `flex items-center py-3 px-2 border-b-2 font-medium text-sm transition-colors duration-200 min-w-0 ${
                              isActive
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`
                          }
                          end={id === 'profile'}
                        >
                          <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{label}</span>
                        </NavLink>
                      ))}
                    </nav>
                  </div>

                  {/* Mobile Tabs - Horizontal Scroll */}
                  <div className="sm:hidden">
                    <div className="flex space-x-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
                      {tabs.map(({ id, label, icon: Icon, path }) => (
                        <NavLink
                          key={id}
                          to={path}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200 min-w-max ${
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`
                          }
                          end={id === 'profile'}
                        >
                          <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </AccountContext.Provider>
    </Layout>
  );
};

export default AccountLayout;