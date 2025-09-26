/**
 * AccessControl Component
 * Provides UI-level access control based on RBAC
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, AlertCircle } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';
import { useRBAC } from '@/shared/hooks/useRBAC';
import type { AccessControlProps } from '@/shared/types/rbac';

const AccessControl: React.FC<AccessControlProps> = ({
  requiredRole,
  requiredPlan,
  requiredPermission,
  fallback,
  showUpgradePrompt = true,
  children,
}) => {
  const { canAccess, hasPermission, user } = useRBAC();

  // Check role and plan access
  const hasRoleAccess = canAccess(requiredRole, requiredPlan);

  // Check specific permission if provided
  const hasPermissionAccess = requiredPermission
    ? hasPermission(requiredPermission)
    : true;

  const hasFullAccess = hasRoleAccess && hasPermissionAccess;

  // If user has access, render children
  if (hasFullAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  // If upgrade prompt is disabled, render nothing
  if (!showUpgradePrompt) {
    return null;
  }

  // Default upgrade prompt
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-neutral-100/50 backdrop-blur-sm rounded-xl z-10" />
        <div className="relative z-20 p-6 text-center">
          <div className="flex justify-center mb-4">
            {requiredPlan && user?.plan !== requiredPlan ? (
              <Crown className="w-12 h-12 text-purple-500" />
            ) : (
              <Lock className="w-12 h-12 text-neutral-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {requiredPlan && user?.plan !== requiredPlan
              ? 'Premium Feature'
              : 'Access Restricted'}
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            {requiredPlan && user?.plan !== requiredPlan
              ? `Upgrade to ${requiredPlan} plan to unlock this feature`
              : requiredRole
              ? `${requiredRole} role required to access this feature`
              : 'You do not have permission to access this feature'}
          </p>
          {requiredPlan && user?.plan !== requiredPlan && (
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-primary-700 transition-all">
              Upgrade Plan
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// FeatureGate: A simpler component for feature gating
export const FeatureGate: React.FC<{
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ feature, children, fallback = null }) => {
  const { user } = useRBAC();

  const hasFeature = user?.metadata?.features?.includes(feature);

  return hasFeature ? <>{children}</> : <>{fallback}</>;
};

// LockedFeature: Shows a locked state for features
export const LockedFeature: React.FC<{
  title: string;
  description?: string;
  requiredPlan?: string;
  className?: string;
}> = ({ title, description, requiredPlan, className }) => {
  return (
    <div className={cn("relative group cursor-not-allowed", className)}>
      <div className="absolute inset-0 bg-neutral-50/60 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs mx-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900 text-sm">{title}</p>
              {description && (
                <p className="text-xs text-neutral-600 mt-1">{description}</p>
              )}
              {requiredPlan && (
                <p className="text-xs text-purple-600 font-medium mt-2">
                  Requires {requiredPlan} plan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 pointer-events-none">{/* Original content goes here */}</div>
    </div>
  );
};

// RoleIndicator: Shows current user role/plan
export const RoleIndicator: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { user } = useRBAC();

  if (!user) return null;

  const planColors = {
    free: 'bg-neutral-100 text-neutral-700',
    standard: 'bg-blue-100 text-blue-700',
    pro: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-gradient-to-r from-purple-100 to-primary-100 text-purple-700',
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "px-2 py-1 rounded-md text-xs font-medium capitalize",
          planColors[user.plan]
        )}
      >
        {user.plan}
      </span>
      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs font-medium capitalize">
        {user.role}
      </span>
    </div>
  );
};

export default AccessControl;