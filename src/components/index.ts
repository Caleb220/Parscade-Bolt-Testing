/**
 * Unified Components Index - Parscade Design System
 * Central export point for all reusable components
 */

// UI Components
export { default as Button } from './ui/button';
export { default as Input } from './ui/input';
export { default as Badge } from './ui/badge';
export { default as LoadingSpinner } from './ui/loading-spinner';

// Re-export existing shared components for backward compatibility
export { ParscadeCard, ParscadeLogo, ParscadeButton as ParscadeBrandButton } from '@/shared/components/brand';
export { Label } from '@/shared/components/ui/label';
export { Skeleton } from '@/shared/components/ui/skeleton';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';

// Layout Components
export { default as Navigation } from '@/shared/components/layout/molecules/Navigation';
export { default as Footer } from '@/shared/components/layout/organisms/Footer';
export { default as FeatureGate } from '@/shared/components/layout/FeatureGate';
export { default as ProtectedRoute } from '@/shared/components/layout/templates/ProtectedRoute';

// Form Components
export { default as PasswordInput } from '@/shared/components/forms/atoms/PasswordInput';
export { default as FormFieldInput } from '@/shared/components/forms/FormFieldInput';
export { default as PasswordStrengthMeter } from '@/shared/components/forms/PasswordStrengthMeter';

// Toast and Notifications
export { useToast } from '@/shared/components/ui/use-toast';
export { Toaster } from '@/shared/components/ui/toaster';

// Type exports
export type { ButtonProps } from './ui/button';
export type { InputProps } from './ui/input';
export type { BadgeProps } from './ui/badge';