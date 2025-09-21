/**
 * Feature Access Control Hook
 * Manages role-based and tier-based feature access
 */

import { useMemo } from 'react';
import { useAuth } from '@/features/auth';
import { featureModules } from '@/shared/design/theme';

export type UserRole = 'user' | 'admin';
export type UserTier = 'free' | 'pro' | 'enterprise';
export type FeatureId = keyof typeof featureModules.features;

interface FeatureAccess {
  hasAccess: (featureId: FeatureId) => boolean;
  getAccessibleFeatures: () => FeatureId[];
  isFeatureEnabled: (featureId: FeatureId) => boolean;
  getUpgradeMessage: (featureId: FeatureId) => string | null;
}

/**
 * Hook for managing feature access based on user role and tier
 */
export const useFeatureAccess = (): FeatureAccess => {
  const { user } = useAuth();
  
  const userRole: UserRole = (user as any)?.user_role || 'user';
  const userTier: UserTier = (user as any)?.plan || 'free';

  const featureAccess = useMemo(() => {
    const hasAccess = (featureId: FeatureId): boolean => {
      const feature = featureModules.features[featureId];
      if (!feature) return false;

      const hasRole = feature.roles.includes(userRole);
      const hasTier = feature.tiers.includes(userTier);

      return hasRole && hasTier;
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
      const hasTier = feature.tiers.includes(userTier);

      if (!hasRole) {
        return 'This feature requires admin access.';
      }

      if (!hasTier) {
        const requiredTier = feature.tiers.find(tier => 
          ['pro', 'enterprise'].includes(tier)
        );
        return `This feature requires ${requiredTier} plan.`;
      }

      return null;
    };

    return {
      hasAccess,
      getAccessibleFeatures,
      isFeatureEnabled,
      getUpgradeMessage,
    };
  }, [userRole, userTier]);

  return featureAccess;
};