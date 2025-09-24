/**
 * Dashboard Section Component
 * Wrapper for dashboard content sections with consistent spacing
 */

import React from 'react';

import type { ReactNode } from 'react';

interface DashboardSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Standardized section wrapper for dashboard content
 */
const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  children,
  actions,
  className = '',
}) => {
  return (
    <section className={`space-y-6 ${className}`}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
};

export default DashboardSection;