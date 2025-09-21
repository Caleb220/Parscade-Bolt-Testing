import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { PATHS } from '@/app/config/routes';
import { useAuth } from '@/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Enhanced Protected Route component with hard logout security
 * 
 * Features:
 * - Prevents authentication loops
 * - Adds cache prevention headers
 * - Secure redirect handling
 * - Comprehensive loading states
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = PATHS.HOME
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Add cache prevention for protected routes
  React.useEffect(() => {
    // Add no-cache meta tags for protected routes
    const addNoCacheHeaders = () => {
      // Remove existing cache control meta tags
      const existingTags = document.querySelectorAll('meta[http-equiv="Cache-Control"], meta[http-equiv="Pragma"], meta[http-equiv="Expires"]');
      existingTags.forEach(tag => tag.remove());
      
      // Add no-cache meta tags
      const metaTags = [
        { httpEquiv: 'Cache-Control', content: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
        { httpEquiv: 'Pragma', content: 'no-cache' },
        { httpEquiv: 'Expires', content: '0' },
      ];
      
      metaTags.forEach(({ httpEquiv, content }) => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });
    };
    
    addNoCacheHeaders();
    
    // Cleanup on unmount
    return () => {
      const tags = document.querySelectorAll('meta[http-equiv="Cache-Control"], meta[http-equiv="Pragma"], meta[http-equiv="Expires"]');
      tags.forEach(tag => tag.remove());
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store the attempted location for post-login redirect
    return (
      <Navigate 
        to={redirectTo}
        state={{ from: location }}
        replace 
      />
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;