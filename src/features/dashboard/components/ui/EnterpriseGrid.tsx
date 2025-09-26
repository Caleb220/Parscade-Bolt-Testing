/**
 * Enterprise Grid System Component
 * Advanced CSS Grid system with adaptive layouts for command center UI
 */

import { motion } from 'framer-motion';
import React from 'react';

import { parscadeAnimations } from '@/shared/design/theme';

interface EnterpriseGridProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'analytics' | 'command-center' | 'minimal';
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  staggerChildren?: boolean;
  dense?: boolean;
}

interface GridItemProps {
  children: React.ReactNode;
  colSpan?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  rowSpan?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Main Enterprise Grid Container
 */
const EnterpriseGrid: React.FC<EnterpriseGridProps> & {
  Item: React.FC<GridItemProps>;
} = ({
  children,
  variant = 'dashboard',
  columns,
  gap = 'lg',
  className = '',
  staggerChildren = true,
  dense = false,
}) => {
  // Default column configurations for different variants
  const defaultColumns = {
    dashboard: { base: 1, sm: 2, md: 4, lg: 8, xl: 12, '2xl': 12 },
    analytics: { base: 1, sm: 2, md: 3, lg: 6, xl: 8, '2xl': 12 },
    'command-center': { base: 1, sm: 2, md: 6, lg: 12, xl: 12, '2xl': 16 },
    minimal: { base: 1, sm: 1, md: 2, lg: 4, xl: 6, '2xl': 8 },
  };

  const gridColumns = columns || defaultColumns[variant];

  // Gap size mapping
  const gapSizes = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  // Generate responsive grid classes
  const generateGridClasses = () => {
    const classes = ['grid'];

    if (gridColumns.base) classes.push(`grid-cols-${gridColumns.base}`);
    if (gridColumns.sm) classes.push(`sm:grid-cols-${gridColumns.sm}`);
    if (gridColumns.md) classes.push(`md:grid-cols-${gridColumns.md}`);
    if (gridColumns.lg) classes.push(`lg:grid-cols-${gridColumns.lg}`);
    if (gridColumns.xl) classes.push(`xl:grid-cols-${gridColumns.xl}`);
    if (gridColumns['2xl']) classes.push(`2xl:grid-cols-${gridColumns['2xl']}`);

    classes.push(gapSizes[gap]);

    if (dense) {
      classes.push('grid-flow-dense');
    }

    return classes.join(' ');
  };

  const containerAnimation = staggerChildren
    ? parscadeAnimations.staggerContainer
    : parscadeAnimations.fadeInUp;

  return (
    <motion.div {...containerAnimation} className={`${generateGridClasses()} ${className}`}>
      {children}
    </motion.div>
  );
};

/**
 * Enterprise Grid Item Component
 */
const GridItem: React.FC<GridItemProps> = ({
  children,
  colSpan,
  rowSpan,
  className = '',
  priority = 'medium',
}) => {
  // Generate responsive column span classes
  const generateColSpanClasses = () => {
    if (!colSpan) return '';

    const classes = [];
    if (colSpan.base) classes.push(`col-span-${colSpan.base}`);
    if (colSpan.sm) classes.push(`sm:col-span-${colSpan.sm}`);
    if (colSpan.md) classes.push(`md:col-span-${colSpan.md}`);
    if (colSpan.lg) classes.push(`lg:col-span-${colSpan.lg}`);
    if (colSpan.xl) classes.push(`xl:col-span-${colSpan.xl}`);
    if (colSpan['2xl']) classes.push(`2xl:col-span-${colSpan['2xl']}`);

    return classes.join(' ');
  };

  // Generate responsive row span classes
  const generateRowSpanClasses = () => {
    if (!rowSpan) return '';

    const classes = [];
    if (rowSpan.base) classes.push(`row-span-${rowSpan.base}`);
    if (rowSpan.sm) classes.push(`sm:row-span-${rowSpan.sm}`);
    if (rowSpan.md) classes.push(`md:row-span-${rowSpan.md}`);
    if (rowSpan.lg) classes.push(`lg:row-span-${rowSpan.lg}`);
    if (rowSpan.xl) classes.push(`xl:row-span-${rowSpan.xl}`);
    if (rowSpan['2xl']) classes.push(`2xl:row-span-${rowSpan['2xl']}`);

    return classes.join(' ');
  };

  // Priority-based styling
  const priorityStyles = {
    high: 'z-10 order-first',
    medium: 'z-5',
    low: 'z-1 order-last',
  };

  return (
    <motion.div
      {...parscadeAnimations.staggerItem}
      className={`
        ${generateColSpanClasses()}
        ${generateRowSpanClasses()}
        ${priorityStyles[priority]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// Attach the GridItem as a static component
EnterpriseGrid.Item = GridItem;

export default EnterpriseGrid;
export { type EnterpriseGridProps, type GridItemProps };
