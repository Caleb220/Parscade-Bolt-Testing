/**
 * Layout Components Index
 * Central export for all layout components
 */

// Templates
export { default as Layout } from './templates/Layout';
export { default as ProtectedRoute } from './templates/ProtectedRoute';
export { default as PublicAuthLayout } from './templates/PublicAuthLayout';

// Organisms
export { default as Header } from './organisms/Header';
export { default as Footer } from './organisms/Footer';

// Molecules
export { default as Navigation } from './molecules/Navigation';
export { default as UserMenu } from './molecules/UserMenu';
export { default as ErrorBoundary } from './molecules/ErrorBoundary';
export { default as FeatureCard } from './molecules/FeatureCard';
export { default as StepNavigator } from './molecules/StepNavigator';
export { default as AuthLoadingSkeleton } from './molecules/AuthLoadingSkeleton';

// Feature Access
export { default as FeatureGate } from './FeatureGate';
