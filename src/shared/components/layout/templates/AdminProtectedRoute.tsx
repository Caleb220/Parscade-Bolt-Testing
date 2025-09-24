import React from 'react';

import FeatureProtectedRoute from './FeatureProtectedRoute';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallbackContent?: React.ReactNode;
}

/**
 * Admin Protected Route - Requires admin role
 *
 * This component provides admin-only route protection.
 * Only users with 'admin' role can access the protected content.
 *
 * @param children - Content to render when access is granted
 * @param redirectTo - Where to redirect unauthorized users (optional)
 * @param fallbackContent - Custom content to show when access is denied (optional)
 */
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  redirectTo,
  fallbackContent,
}) => {
  return (
    <FeatureProtectedRoute
      requiredRole="admin"
      redirectTo={redirectTo}
      fallbackContent={fallbackContent}
    >
      {children}
    </FeatureProtectedRoute>
  );
};

export default AdminProtectedRoute;