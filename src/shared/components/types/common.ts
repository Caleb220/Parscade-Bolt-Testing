/**
 * Common Component Type Definitions
 * Shared types for component props and refs
 */

import type {
  ComponentPropsWithRef,
  ElementType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';

/**
 * Generic component with ref forwarding support
 */
export type ComponentWithRef<P, T> = ForwardRefExoticComponent<P & RefAttributes<T>>;

/**
 * Polymorphic component props for components that can render as different elements
 */
export type PolymorphicProps<E extends ElementType, P = {}> = P &
  Omit<ComponentPropsWithRef<E>, keyof P> & {
    as?: E;
  };

/**
 * Common size variants used across components
 */
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common color variants used across components
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Common button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

/**
 * Pagination interface
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
