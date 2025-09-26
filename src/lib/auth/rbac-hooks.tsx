/**
 * React Hooks and Components for RBAC
 * Provides easy integration with React components
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';

import {
  getRBACManager,
  setRBACUser,
  clearRBACUser,
  PERMISSIONS,
  SYSTEM_ROLES
} from './rbac';

import type {
  Permission,
  Role,
  User as RBACUser,
  PermissionCheckResult,
  ResourcePermission} from './rbac';

// RBAC Context
interface RBACContextValue {
  user: RBACUser | null;
  permissions: Permission[];
  roles: Role[];
  primaryRole: Role | null;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (...permissions: Permission[]) => boolean;
  hasAnyPermission: (...permissions: Permission[]) => boolean;
  checkResourcePermission: (
    resourceType: ResourcePermission['resourceType'],
    resourceId: string,
    permission: Permission
  ) => PermissionCheckResult;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

const RBACContext = createContext<RBACContextValue | null>(null);

/**
 * RBAC Provider Component
 */
export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, session } = useAuth();
  const [rbacUser, setRbacUser] = useState<RBACUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const manager = useMemo(() => getRBACManager(), []);

  // Initialize RBAC user from auth user
  useEffect(() => {
    if (authUser && session) {
      // In a real app, this would fetch roles from the backend
      // For now, we'll use mock data based on user metadata
      const userRoles = authUser.user_metadata?.roles || ['viewer'];
      const roles = userRoles.map((roleId: string) =>
        SYSTEM_ROLES[roleId.toUpperCase()] || SYSTEM_ROLES.VIEWER
      );

      const rbacUserData: RBACUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name,
        roles,
        additionalPermissions: authUser.user_metadata?.permissions,
        deniedPermissions: authUser.user_metadata?.denied_permissions,
        teams: authUser.user_metadata?.teams,
      };

      setRbacUser(rbacUserData);
      setRBACUser(rbacUserData);
      setIsLoading(false);
    } else {
      setRbacUser(null);
      clearRBACUser();
      setIsLoading(false);
    }
  }, [authUser, session]);

  // Memoized values
  const permissions = useMemo(() =>
    manager.getAllPermissions(),
    [manager, rbacUser]
  );

  const roles = useMemo(() =>
    manager.getRoles(),
    [manager, rbacUser]
  );

  const primaryRole = useMemo(() =>
    manager.getPrimaryRole(),
    [manager, rbacUser]
  );

  const isAdmin = useMemo(() =>
    manager.isAdmin(),
    [manager, rbacUser]
  );

  const isSuperAdmin = useMemo(() =>
    manager.isSuperAdmin(),
    [manager, rbacUser]
  );

  // Callbacks
  const hasPermission = useCallback((permission: Permission) =>
    manager.hasPermission(permission),
    [manager]
  );

  const hasAllPermissions = useCallback((...permissions: Permission[]) =>
    manager.hasAllPermissions(...permissions),
    [manager]
  );

  const hasAnyPermission = useCallback((...permissions: Permission[]) =>
    manager.hasAnyPermission(...permissions),
    [manager]
  );

  const checkResourcePermission = useCallback((
    resourceType: ResourcePermission['resourceType'],
    resourceId: string,
    permission: Permission
  ) => manager.checkResourcePermission(resourceType, resourceId, permission),
    [manager]
  );

  const value: RBACContextValue = {
    user: rbacUser,
    permissions,
    roles,
    primaryRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    checkResourcePermission,
    isAdmin,
    isSuperAdmin,
    isLoading,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

/**
 * Hook to access RBAC context
 */
export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider');
  }
  return context;
}

/**
 * Hook to check a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useRBAC();
  return hasPermission(permission);
}

/**
 * Hook to check multiple permissions (AND)
 */
export function useAllPermissions(...permissions: Permission[]): boolean {
  const { hasAllPermissions } = useRBAC();
  return hasAllPermissions(...permissions);
}

/**
 * Hook to check multiple permissions (OR)
 */
export function useAnyPermission(...permissions: Permission[]): boolean {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(...permissions);
}

/**
 * Hook to check resource permission
 */
export function useResourcePermission(
  resourceType: ResourcePermission['resourceType'],
  resourceId: string,
  permission: Permission
): PermissionCheckResult {
  const { checkResourcePermission } = useRBAC();
  return checkResourcePermission(resourceType, resourceId, permission);
}

/**
 * Permission Guard Component
 * Renders children only if user has permission
 */
interface PermissionGuardProps {
  permission: Permission | Permission[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  fallback = null,
  requireAll = false,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useRBAC();

  const hasAccess = useMemo(() => {
    if (typeof permission === 'string') {
      return hasPermission(permission);
    }

    if (requireAll) {
      return hasAllPermissions(...permission);
    }

    return hasAnyPermission(...permission);
  }, [permission, requireAll, hasPermission, hasAllPermissions, hasAnyPermission]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Role Guard Component
 * Renders children only if user has specific role
 */
interface RoleGuardProps {
  role: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({ role, fallback = null, children }: RoleGuardProps) {
  const { roles } = useRBAC();

  const hasRole = useMemo(() => {
    const roleIds = roles.map(r => r.id);
    if (typeof role === 'string') {
      return roleIds.includes(role);
    }
    return role.some(r => roleIds.includes(r));
  }, [role, roles]);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Admin Guard Component
 * Renders children only if user is admin
 */
export function AdminGuard({
  children,
  fallback = null
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isAdmin } = useRBAC();

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Locked Feature Component
 * Shows locked state when user lacks permission
 */
interface LockedFeatureProps {
  permission: Permission;
  children: React.ReactNode;
  lockedMessage?: string;
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
}

export function LockedFeature({
  permission,
  children,
  lockedMessage = 'This feature requires additional permissions',
  showUpgradeButton = true,
  onUpgradeClick,
}: LockedFeatureProps) {
  const { hasPermission } = useRBAC();
  const hasAccess = hasPermission(permission);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg text-center max-w-sm">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-gray-600 mb-4">{lockedMessage}</p>
          {showUpgradeButton && (
            <button
              onClick={onUpgradeClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Permission Badge Component
 * Shows permission status
 */
interface PermissionBadgeProps {
  permission: Permission;
  showLabel?: boolean;
}

export function PermissionBadge({ permission, showLabel = true }: PermissionBadgeProps) {
  const { hasPermission } = useRBAC();
  const hasAccess = hasPermission(permission);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        hasAccess
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {hasAccess ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {showLabel && <span>{permission.split('.').pop()}</span>}
    </span>
  );
}

/**
 * Role Badge Component
 * Shows user role
 */
export function RoleBadge({ role }: { role: Role }) {
  const getPriorityColor = (priority?: number) => {
    if (!priority) return 'bg-gray-100 text-gray-700';
    if (priority >= 90) return 'bg-purple-100 text-purple-700';
    if (priority >= 70) return 'bg-blue-100 text-blue-700';
    if (priority >= 50) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
        role.priority
      )}`}
    >
      {role.name}
    </span>
  );
}

// Export commonly used permissions for convenience
export { PERMISSIONS } from './rbac';