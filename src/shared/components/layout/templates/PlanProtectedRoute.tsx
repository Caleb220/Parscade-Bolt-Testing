import React from 'react';

import FeatureProtectedRoute from './FeatureProtectedRoute';

type UserPlan = 'free' | 'standard' | 'pro' | 'enterprise';

interface PlanProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan: UserPlan;
  redirectTo?: string;
  fallbackContent?: React.ReactNode;
}

/**
 * Plan Protected Route - Convenience wrapper for subscription tier protection
 *
 * This component simplifies protecting routes based on subscription tiers.
 * It automatically handles plan hierarchy (higher plans include lower plan features).
 *
 * @param requiredPlan - Minimum subscription tier required
 * @param children - Content to render when access is granted
 * @param redirectTo - Where to redirect unauthorized users (optional)
 * @param fallbackContent - Custom content to show when access is denied (optional)
 */
const PlanProtectedRoute: React.FC<PlanProtectedRouteProps> = ({
  children,
  requiredPlan,
  redirectTo,
  fallbackContent,
}) => {
  return (
    <FeatureProtectedRoute
      requiredPlan={requiredPlan}
      redirectTo={redirectTo}
      fallbackContent={fallbackContent}
    >
      {children}
    </FeatureProtectedRoute>
  );
};

/**
 * Standard Plan Protected Route - Requires Standard plan or higher
 */
export const StandardProtectedRoute: React.FC<
  Omit<PlanProtectedRouteProps, 'requiredPlan'>
> = props => <PlanProtectedRoute requiredPlan="standard" {...props} />;

/**
 * Pro Plan Protected Route - Requires Pro plan or higher
 */
export const ProProtectedRoute: React.FC<Omit<PlanProtectedRouteProps, 'requiredPlan'>> = props => (
  <PlanProtectedRoute requiredPlan="pro" {...props} />
);

/**
 * Enterprise Plan Protected Route - Requires Enterprise plan
 */
export const EnterpriseProtectedRoute: React.FC<
  Omit<PlanProtectedRouteProps, 'requiredPlan'>
> = props => <PlanProtectedRoute requiredPlan="enterprise" {...props} />;

export default PlanProtectedRoute;
