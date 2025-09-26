/**
 * RBAC Hook for Access Control
 * Provides easy-to-use access control functions
 */

import { useMemo } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';
import type {
  UserRole,
  UserPlan,
  UserContext,
  Permission} from '@/shared/types/rbac';
import {
  canAccess,
  hasPermission,
  canPerformAction,
} from '@/shared/types/rbac';

export interface UseRBACReturn {
  user: UserContext | null;
  canAccess: (requiredRole?: UserRole, requiredPlan?: UserPlan) => boolean;
  hasPermission: (permission: Permission) => boolean;
  canPerformAction: (action: string, resource?: any) => boolean;
  isLoading: boolean;
}

export const useRBAC = (): UseRBACReturn => {
  const { user: authUser, isLoading } = useAuth();

  // Transform auth user to RBAC user context
  const user: UserContext | null = useMemo(() => {
    if (!authUser) return null;

    // Map from enhanced auth user to RBAC context
    const rbacRole = authUser.user_role === 'admin' ? 'admin' : 'operator'; // Most users should be operators, not viewers
    const rbacPlan = authUser.subscription_tier;

    return {
      id: authUser.id,
      email: authUser.email,
      role: rbacRole as UserRole,
      plan: rbacPlan as UserPlan,
      organizationId: undefined, // Not implemented yet
      permissions: [], // Could be added later based on role/plan
      metadata: {
        isFirstRun: false, // Could be derived from profile data
        onboardingCompleted: true, // Could be derived from profile data
        features: [], // Could be derived from subscription tier
      },
    };
  }, [authUser]);

  const rbacCanAccess = useMemo(
    () => (requiredRole?: UserRole, requiredPlan?: UserPlan) => {
      return canAccess(user, requiredRole, requiredPlan);
    },
    [user]
  );

  const rbacHasPermission = useMemo(
    () => (permission: Permission) => {
      return hasPermission(user, permission);
    },
    [user]
  );

  const rbacCanPerformAction = useMemo(
    () => (action: string, resource?: any) => {
      return canPerformAction(user, action, resource);
    },
    [user]
  );

  return {
    user,
    canAccess: rbacCanAccess,
    hasPermission: rbacHasPermission,
    canPerformAction: rbacCanPerformAction,
    isLoading,
  };
};