/**
 * Dashboard Grid Component
 * Responsive grid system for dashboard layouts
 */

import React from 'react';

import type { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Flexible grid system for dashboard content organization
 */
const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 1,
  gap = 'md',
  className = '',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default DashboardGrid;