/**
 * RBAC (Role-Based Access Control) Types
 * Enterprise-grade access control system for Parscade
 */

// User roles hierarchy (higher number = more permissions)
export type UserRole = 'viewer' | 'operator' | 'admin' | 'owner';

// Subscription plans hierarchy (higher number = more features)
export type UserPlan = 'free' | 'standard' | 'pro' | 'enterprise';

// Role hierarchy mapping
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,     // Read-only access
  operator: 2,   // Can create and modify resources
  admin: 3,      // Full management except billing
  owner: 4,      // Complete control including billing
} as const;

// Plan hierarchy mapping
export const PLAN_HIERARCHY: Record<UserPlan, number> = {
  free: 1,       // Basic features
  standard: 2,   // Enhanced features
  pro: 3,        // Advanced features
  enterprise: 4, // All features + custom
} as const;

// Feature access requirements
export interface FeatureAccess {
  requiredRole?: UserRole;
  requiredPlan?: UserPlan;
  customCheck?: (user: UserContext) => boolean;
}

// User context for access control
export interface UserContext {
  id: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  organizationId?: string;
  permissions?: string[];
  metadata?: {
    isFirstRun?: boolean;
    onboardingCompleted?: boolean;
    features?: string[];
  };
}

// Permission types for fine-grained control
export type Permission =
  | 'documents.read'
  | 'documents.write'
  | 'documents.delete'
  | 'jobs.read'
  | 'jobs.write'
  | 'jobs.cancel'
  | 'workflows.read'
  | 'workflows.write'
  | 'workflows.execute'
  | 'analytics.view'
  | 'analytics.export'
  | 'team.view'
  | 'team.invite'
  | 'team.manage'
  | 'billing.view'
  | 'billing.manage'
  | 'settings.view'
  | 'settings.manage'
  | 'api.read'
  | 'api.write'
  | 'integrations.view'
  | 'integrations.manage';

// Feature flag types
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetRoles?: UserRole[];
  targetPlans?: UserPlan[];
}

// Access control helpers
export const canAccess = (
  user: UserContext | null,
  requiredRole?: UserRole,
  requiredPlan?: UserPlan
): boolean => {
  if (!user) return false;

  const userRoleLevel = ROLE_HIERARCHY[user.role];
  const userPlanLevel = PLAN_HIERARCHY[user.plan];
  const requiredRoleLevel = requiredRole ? ROLE_HIERARCHY[requiredRole] : 0;
  const requiredPlanLevel = requiredPlan ? PLAN_HIERARCHY[requiredPlan] : 0;

  return userRoleLevel >= requiredRoleLevel && userPlanLevel >= requiredPlanLevel;
};

export const hasPermission = (
  user: UserContext | null,
  permission: Permission
): boolean => {
  if (!user) return false;
  if (user.role === 'owner') return true; // Owners have all permissions

  return user.permissions?.includes(permission) ?? false;
};

export const canPerformAction = (
  user: UserContext | null,
  action: string,
  resource?: any
): boolean => {
  if (!user) return false;

  // Define action rules
  const actionRules: Record<string, (user: UserContext, resource?: any) => boolean> = {
    'upload_document': (u) => canAccess(u, 'operator'),
    'delete_document': (u, r) => canAccess(u, 'operator') && (!r || r.ownerId === u.id || u.role === 'admin'),
    'create_job': (u) => canAccess(u, 'operator'),
    'cancel_job': (u, r) => canAccess(u, 'operator') && (!r || r.ownerId === u.id || u.role === 'admin'),
    'view_analytics': (u) => canAccess(u, 'viewer', 'pro'),
    'export_data': (u) => canAccess(u, 'operator', 'pro'),
    'manage_team': (u) => canAccess(u, 'admin', 'pro'),
    'manage_billing': (u) => u.role === 'owner' || u.role === 'admin',
    'configure_integrations': (u) => canAccess(u, 'admin', 'pro'),
  };

  const rule = actionRules[action];
  return rule ? rule(user, resource) : false;
};

// UI access control component props
export interface AccessControlProps {
  requiredRole?: UserRole;
  requiredPlan?: UserPlan;
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  children: React.ReactNode;
}

// Audit log types for tracking access
export interface AccessAuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource?: string;
  granted: boolean;
  reason?: string;
  metadata?: Record<string, any>;
}