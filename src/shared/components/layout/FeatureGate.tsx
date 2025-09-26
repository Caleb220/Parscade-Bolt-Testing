/**
 * Feature Gate Component
 * Controls access to features based on user role and tier
 */

import { motion } from 'framer-motion';
import { Crown, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import {
  useFeatureAccess,
  type FeatureId,
  type UserRole,
  type UserPlan,
} from '@/shared/hooks/useFeatureAccess';

import type { ReactNode } from 'react';

interface FeatureGateProps {
  featureId?: FeatureId;
  requiredTier?: 'free' | 'standard' | 'pro' | 'enterprise';
  requiredRole?: 'user' | 'admin';
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

/**
 * Component that conditionally renders features based on access control
 */
const FeatureGate: React.FC<FeatureGateProps> = ({
  featureId,
  requiredTier,
  requiredRole,
  children,
  fallback,
  showUpgrade = true,
}) => {
  const { hasAccess, getUpgradeMessage } = useFeatureAccess();
  const navigate = useNavigate();
  const billingPath = '/billing';

  // Import useAuth to get user data for tier/role checks
  const { user } = useAuth();
  const userRole: UserRole = user?.user_role || 'user';
  const userTier: UserPlan = user?.subscription_tier || user?.plan || 'free';

  // Check access based on featureId first, then tier/role
  let hasAccessToFeature = true;
  let upgradeMessage = null;

  if (featureId) {
    hasAccessToFeature = hasAccess(featureId);
    upgradeMessage = getUpgradeMessage(featureId);
  } else {
    // Manual tier/role checking
    if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
      hasAccessToFeature = false;
      upgradeMessage = 'This feature requires admin access.';
    }

    if (requiredTier) {
      const tierHierarchy = ['free', 'standard', 'pro', 'enterprise'];
      const requiredIndex = tierHierarchy.indexOf(requiredTier);
      const userIndex = tierHierarchy.indexOf(userTier);

      if (userIndex < requiredIndex) {
        hasAccessToFeature = false;
        upgradeMessage = `This feature requires ${requiredTier} plan.`;
      }
    }
  }

  if (hasAccessToFeature) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const goToBilling = () => {
    try {
      navigate(billingPath);
    } catch {
      // Fallback if not in a Router context:
      window.location.href = billingPath;
    }
  };

  return (
    <ParscadeCard variant="gradient" className="p-6 text-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          {upgradeMessage?.includes('admin') ? (
            <Users className="w-6 h-6 text-blue-600" />
          ) : (
            <Crown className="w-6 h-6 text-blue-600" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {upgradeMessage?.includes('admin') ? 'Admin Access Required' : 'Upgrade Required'}
        </h3>

        <p className="text-gray-600 mb-4">
          {upgradeMessage || 'This feature is not available on your current plan.'}
        </p>

        {!upgradeMessage?.includes('admin') && (
          <ParscadeButton type="button" variant="primary" size="sm" onClick={goToBilling}>
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Plan
          </ParscadeButton>
        )}
      </motion.div>
    </ParscadeCard>
  );
};

export default FeatureGate;
