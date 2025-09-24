import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { PATHS } from '@/app/config/routes';
import { useAuth } from '@/features/auth';
import LoadingSpinner from '@/shared/components/forms/atoms/LoadingSpinner';
import { ParscadeCard } from '@/shared/components/brand';

type UserRole = 'user' | 'admin';
type UserPlan = 'free' | 'standard' | 'pro' | 'enterprise';

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPlan?: UserPlan;
  redirectTo?: string;
  fallbackContent?: React.ReactNode;
}

/**
 * Plan hierarchy for tier comparisons
 */
const PLAN_HIERARCHY: Record<UserPlan, number> = {
  free: 0,
  standard: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Check if user plan meets minimum requirement
 */
function hasMinimumPlan(userPlan: UserPlan, requiredPlan: UserPlan): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan];
}

/**
 * Get plan display name for UI
 */
function getPlanDisplayName(plan: UserPlan): string {
  const displayNames: Record<UserPlan, string> = {
    free: 'Free',
    standard: 'Standard',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };
  return displayNames[plan];
}

/**
 * Default upgrade prompt component
 */
const DefaultUpgradePrompt: React.FC<{
  requiredPlan?: UserPlan;
  requiredRole?: UserRole;
  userPlan: UserPlan;
  userRole: UserRole;
}> = ({ requiredPlan, requiredRole, userPlan, userRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ParscadeCard className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {requiredPlan ? 'Upgrade Required' : 'Access Restricted'}
          </h2>
          <p className="text-gray-600">
            {requiredPlan
              ? `This feature requires a ${getPlanDisplayName(requiredPlan)} plan or higher.`
              : requiredRole
              ? `This feature requires ${requiredRole} access.`
              : 'You do not have access to this feature.'
            }
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {requiredPlan && (
            <div className="text-sm text-gray-500">
              <p>Your current plan: <span className="font-medium text-gray-700">{getPlanDisplayName(userPlan)}</span></p>
              <p>Required plan: <span className="font-medium text-amber-600">{getPlanDisplayName(requiredPlan)}</span></p>
            </div>
          )}
          {requiredRole && (
            <div className="text-sm text-gray-500">
              <p>Your current role: <span className="font-medium text-gray-700">{userRole}</span></p>
              <p>Required role: <span className="font-medium text-red-600">{requiredRole}</span></p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {requiredPlan && (
            <button
              onClick={() => window.location.href = PATHS.DASHBOARD.BILLING}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Upgrade Plan
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </ParscadeCard>
    </div>
  );
};

/**
 * Feature Protected Route component with subscription tier and role enforcement
 *
 * This component provides client-side route protection that complements the backend RBAC
 * enforcement. It checks user roles and subscription tiers before allowing access to routes.
 *
 * Features:
 * - Subscription tier enforcement (free, standard, pro, enterprise)
 * - Role-based access control (user, admin)
 * - Hierarchical plan checking (pro includes standard features)
 * - Custom fallback content support
 * - Admin bypass for plan restrictions
 * - Professional upgrade prompts
 */
const FeatureProtectedRoute: React.FC<FeatureProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPlan,
  redirectTo = PATHS.HOME,
  fallbackContent,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // First ensure user is authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Get user role and plan with proper typing
  const userRole: UserRole = user.user_role || 'user';
  const userPlan: UserPlan = user.subscription_tier || user.plan || 'free';

  // Check role requirement
  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
    return (
      <DefaultUpgradePrompt
        requiredRole={requiredRole}
        requiredPlan={requiredPlan}
        userRole={userRole}
        userPlan={userPlan}
      />
    );
  }

  // Check plan requirement (admins bypass plan restrictions)
  if (requiredPlan && userRole !== 'admin' && !hasMinimumPlan(userPlan, requiredPlan)) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
    return (
      <DefaultUpgradePrompt
        requiredRole={requiredRole}
        requiredPlan={requiredPlan}
        userRole={userRole}
        userPlan={userPlan}
      />
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default FeatureProtectedRoute;