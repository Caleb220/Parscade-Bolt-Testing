/**
 * Feature Gate Component
 * Controls access to features based on user role and tier
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Users } from 'lucide-react';

import { useFeatureAccess, type FeatureId } from '@/shared/hooks/useFeatureAccess';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';

interface FeatureGateProps {
  featureId: FeatureId;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

/**
 * Component that conditionally renders features based on access control
 */
const FeatureGate: React.FC<FeatureGateProps> = ({
  featureId,
  children,
  fallback,
  showUpgrade = true,
}) => {
  const { hasAccess, getUpgradeMessage } = useFeatureAccess();

  if (hasAccess(featureId)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const upgradeMessage = getUpgradeMessage(featureId);

  return (
    <ParscadeCard variant="gradient" className="p-6 text-center">
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
          <ParscadeButton variant="primary" size="sm">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Plan
          </ParscadeButton>
        )}
      </motion.div>
    </ParscadeCard>
  );
};

export default FeatureGate;