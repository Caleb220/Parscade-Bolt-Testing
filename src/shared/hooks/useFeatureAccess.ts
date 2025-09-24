/**
 * Feature Access Control Hook
 * Manages role-based and plan-based feature access
 */

import { useMemo } from 'react';

import { useAuth } from '@/features/auth';
import { featureModules } from '@/shared/design/theme';

export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'standard' |'pro' | 'enterprise';

export type FeatureId = keyof typeof featureModules.features;

interface FeatureAccess {
  hasAccess: (featureId: FeatureId) => boolean;
  getAccessibleFeatures: () => FeatureId[];
  isFeatureEnabled: (featureId: FeatureId) => boolean;
  getUpgradeMessage: (featureId: FeatureId) => string | null;
}

/**
 * Hook for managing feature access based on user role and plan
 */
export const useFeatureAccess = (): FeatureAccess => {
  const { user } = useAuth();

  // Properly typed user access - no more casting to any
  const userRole: UserRole = user?.user_role || 'user';
  const userPlan: UserPlan = user?.subscription_tier || user?.plan || 'free';

  const featureAccess = useMemo(() => {
    const hasAccess = (featureId: FeatureId): boolean => {
      const feature = featureModules.features[featureId];
      if (!feature) return false;

      const hasRole = feature.roles.includes(userRole);
      const hasPlan = feature.plans.includes(userPlan);

      return hasRole && hasPlan;
    };

    const getAccessibleFeatures = (): FeatureId[] => {
      return Object.keys(featureModules.features).filter(
        featureId => hasAccess(featureId as FeatureId)
      ) as FeatureId[];
    };

    const isFeatureEnabled = (featureId: FeatureId): boolean => {
      return hasAccess(featureId);
    };

    const getUpgradeMessage = (featureId: FeatureId): string | null => {
      const feature = featureModules.features[featureId];
      if (!feature) return null;

      const hasRole = feature.roles.includes(userRole);
      const hasPlan = feature.plans.includes(userPlan);

      if (!hasRole) {
        return 'This feature requires admin access.';
      }

      if (!hasPlan) {
        const requiredPlan = feature.plans.find(plan => 
          ['standard', 'pro', 'enterprise'].includes(plan)
        );
        return `This feature requires ${requiredPlan} plan.`;
      }

      return null;
    };

    return {
      hasAccess,
      getAccessibleFeatures,
      isFeatureEnabled,
      getUpgradeMessage,
    };
  }, [userRole, userPlan]);

  return featureAccess;
};