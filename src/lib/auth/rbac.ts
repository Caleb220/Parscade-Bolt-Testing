/**
 * Role-Based Access Control (RBAC) System
 * Enterprise-grade permission management
 */

// Permission Definitions
export const PERMISSIONS = {
  // Document permissions
  DOCUMENT_VIEW: 'document.view',
  DOCUMENT_CREATE: 'document.create',
  DOCUMENT_EDIT: 'document.edit',
  DOCUMENT_DELETE: 'document.delete',
  DOCUMENT_PROCESS: 'document.process',
  DOCUMENT_DOWNLOAD: 'document.download',
  DOCUMENT_SHARE: 'document.share',
  DOCUMENT_BULK: 'document.bulk',

  // Job permissions
  JOB_VIEW: 'job.view',
  JOB_CREATE: 'job.create',
  JOB_CANCEL: 'job.cancel',
  JOB_RETRY: 'job.retry',
  JOB_PRIORITY: 'job.priority',

  // Analytics permissions
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',
  ANALYTICS_CUSTOM: 'analytics.custom',

  // Team permissions
  TEAM_VIEW: 'team.view',
  TEAM_CREATE: 'team.create',
  TEAM_EDIT: 'team.edit',
  TEAM_DELETE: 'team.delete',
  TEAM_MEMBER_ADD: 'team.member.add',
  TEAM_MEMBER_REMOVE: 'team.member.remove',
  TEAM_MEMBER_ROLE: 'team.member.role',

  // User management
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_EDIT: 'user.edit',
  USER_DELETE: 'user.delete',
  USER_SUSPEND: 'user.suspend',
  USER_IMPERSONATE: 'user.impersonate',

  // Workflow permissions
  WORKFLOW_VIEW: 'workflow.view',
  WORKFLOW_CREATE: 'workflow.create',
  WORKFLOW_EDIT: 'workflow.edit',
  WORKFLOW_DELETE: 'workflow.delete',
  WORKFLOW_EXECUTE: 'workflow.execute',

  // Integration permissions
  INTEGRATION_VIEW: 'integration.view',
  INTEGRATION_CREATE: 'integration.create',
  INTEGRATION_EDIT: 'integration.edit',
  INTEGRATION_DELETE: 'integration.delete',
  INTEGRATION_CONNECT: 'integration.connect',

  // System permissions
  SYSTEM_VIEW: 'system.view',
  SYSTEM_CONFIG: 'system.config',
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_RESTORE: 'system.restore',
  SYSTEM_MAINTENANCE: 'system.maintenance',

  // Audit permissions
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',

  // Billing permissions
  BILLING_VIEW: 'billing.view',
  BILLING_MANAGE: 'billing.manage',
  BILLING_PAYMENT: 'billing.payment',

  // API permissions
  API_KEY_VIEW: 'api.key.view',
  API_KEY_CREATE: 'api.key.create',
  API_KEY_DELETE: 'api.key.delete',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role Definitions
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem?: boolean; // System roles cannot be edited
  priority?: number; // Higher priority overrides lower
}

// Predefined System Roles
export const SYSTEM_ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.values(PERMISSIONS),
    isSystem: true,
    priority: 100,
  },

  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    description: 'Administrative access excluding system configuration',
    permissions: [
      ...Object.values(PERMISSIONS).filter(
        p => !p.startsWith('system.') || p === PERMISSIONS.SYSTEM_VIEW
      ),
    ],
    isSystem: true,
    priority: 90,
  },

  MANAGER: {
    id: 'manager',
    name: 'Manager',
    description: 'Team and workflow management',
    permissions: [
      PERMISSIONS.DOCUMENT_VIEW,
      PERMISSIONS.DOCUMENT_CREATE,
      PERMISSIONS.DOCUMENT_EDIT,
      PERMISSIONS.DOCUMENT_PROCESS,
      PERMISSIONS.DOCUMENT_DOWNLOAD,
      PERMISSIONS.DOCUMENT_SHARE,
      PERMISSIONS.JOB_VIEW,
      PERMISSIONS.JOB_CREATE,
      PERMISSIONS.JOB_CANCEL,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.ANALYTICS_EXPORT,
      PERMISSIONS.TEAM_VIEW,
      PERMISSIONS.TEAM_EDIT,
      PERMISSIONS.TEAM_MEMBER_ADD,
      PERMISSIONS.TEAM_MEMBER_REMOVE,
      PERMISSIONS.WORKFLOW_VIEW,
      PERMISSIONS.WORKFLOW_CREATE,
      PERMISSIONS.WORKFLOW_EDIT,
      PERMISSIONS.WORKFLOW_EXECUTE,
      PERMISSIONS.INTEGRATION_VIEW,
      PERMISSIONS.USER_VIEW,
    ],
    isSystem: true,
    priority: 70,
  },

  OPERATOR: {
    id: 'operator',
    name: 'Operator',
    description: 'Document processing and workflow execution',
    permissions: [
      PERMISSIONS.DOCUMENT_VIEW,
      PERMISSIONS.DOCUMENT_CREATE,
      PERMISSIONS.DOCUMENT_PROCESS,
      PERMISSIONS.DOCUMENT_DOWNLOAD,
      PERMISSIONS.JOB_VIEW,
      PERMISSIONS.JOB_CREATE,
      PERMISSIONS.JOB_CANCEL,
      PERMISSIONS.WORKFLOW_VIEW,
      PERMISSIONS.WORKFLOW_EXECUTE,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.TEAM_VIEW,
    ],
    isSystem: true,
    priority: 50,
  },

  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to documents and analytics',
    permissions: [
      PERMISSIONS.DOCUMENT_VIEW,
      PERMISSIONS.JOB_VIEW,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.TEAM_VIEW,
      PERMISSIONS.WORKFLOW_VIEW,
    ],
    isSystem: true,
    priority: 30,
  },

  GUEST: {
    id: 'guest',
    name: 'Guest',
    description: 'Limited temporary access',
    permissions: [
      PERMISSIONS.DOCUMENT_VIEW,
    ],
    isSystem: true,
    priority: 10,
  },
};

// User with roles and permissions
export interface User {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
  additionalPermissions?: Permission[]; // Direct permissions
  deniedPermissions?: Permission[]; // Explicitly denied
  teams?: Team[];
}

// Team with permissions
export interface Team {
  id: string;
  name: string;
  permissions?: Permission[];
  memberRoles?: Record<string, Role>; // userId -> Role
}

// Resource-based permissions
export interface ResourcePermission {
  resourceType: 'document' | 'job' | 'workflow' | 'integration';
  resourceId: string;
  userId?: string;
  teamId?: string;
  permissions: Permission[];
  grantedBy?: string;
  grantedAt?: Date;
  expiresAt?: Date;
}

// Permission check result
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  source?: 'role' | 'direct' | 'team' | 'resource';
}

/**
 * RBAC Manager Class
 */
export class RBACManager {
  private user: User | null = null;
  private resourcePermissions: Map<string, ResourcePermission[]> = new Map();
  private cache: Map<string, PermissionCheckResult> = new Map();
  private cacheTimeout = 60000; // 1 minute

  constructor(user?: User) {
    if (user) {
      this.setUser(user);
    }
  }

  /**
   * Set the current user
   */
  setUser(user: User) {
    this.user = user;
    this.clearCache();
  }

  /**
   * Clear the current user
   */
  clearUser() {
    this.user = null;
    this.clearCache();
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.user;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    const result = this.checkPermission(permission);
    return result.allowed;
  }

  /**
   * Check permission with details
   */
  checkPermission(permission: Permission): PermissionCheckResult {
    if (!this.user) {
      return { allowed: false, reason: 'No user authenticated' };
    }

    // Check cache
    const cacheKey = `${this.user.id}:${permission}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Check denied permissions first
    if (this.user.deniedPermissions?.includes(permission)) {
      const result = { allowed: false, reason: 'Permission explicitly denied', source: 'direct' as const };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Check direct permissions
    if (this.user.additionalPermissions?.includes(permission)) {
      const result = { allowed: true, source: 'direct' as const };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Check role permissions
    for (const role of this.user.roles) {
      if (role.permissions.includes(permission)) {
        const result = { allowed: true, source: 'role' as const };
        this.cache.set(cacheKey, result);
        return result;
      }
    }

    // Check team permissions
    if (this.user.teams) {
      for (const team of this.user.teams) {
        if (team.permissions?.includes(permission)) {
          const result = { allowed: true, source: 'team' as const };
          this.cache.set(cacheKey, result);
          return result;
        }

        // Check team member role
        const memberRole = team.memberRoles?.[this.user.id];
        if (memberRole?.permissions.includes(permission)) {
          const result = { allowed: true, source: 'team' as const };
          this.cache.set(cacheKey, result);
          return result;
        }
      }
    }

    const result = { allowed: false, reason: 'Permission not granted' };
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Check multiple permissions (AND logic)
   */
  hasAllPermissions(...permissions: Permission[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Check multiple permissions (OR logic)
   */
  hasAnyPermission(...permissions: Permission[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  /**
   * Check resource-specific permission
   */
  checkResourcePermission(
    resourceType: ResourcePermission['resourceType'],
    resourceId: string,
    permission: Permission
  ): PermissionCheckResult {
    if (!this.user) {
      return { allowed: false, reason: 'No user authenticated' };
    }

    // First check general permission
    const generalCheck = this.checkPermission(permission);
    if (generalCheck.allowed) {
      return generalCheck;
    }

    // Check resource-specific permissions
    const key = `${resourceType}:${resourceId}`;
    const resourcePerms = this.resourcePermissions.get(key) || [];

    for (const rp of resourcePerms) {
      // Check if permission applies to user
      if (rp.userId && rp.userId !== this.user.id) continue;

      // Check if permission applies to user's team
      if (rp.teamId && !this.user.teams?.some(t => t.id === rp.teamId)) continue;

      // Check expiration
      if (rp.expiresAt && new Date(rp.expiresAt) < new Date()) continue;

      // Check if has permission
      if (rp.permissions.includes(permission)) {
        return { allowed: true, source: 'resource' };
      }
    }

    return { allowed: false, reason: 'No resource permission' };
  }

  /**
   * Grant resource permission
   */
  grantResourcePermission(resourcePermission: ResourcePermission) {
    const key = `${resourcePermission.resourceType}:${resourcePermission.resourceId}`;
    const existing = this.resourcePermissions.get(key) || [];
    existing.push({
      ...resourcePermission,
      grantedAt: new Date(),
    });
    this.resourcePermissions.set(key, existing);
    this.clearCache();
  }

  /**
   * Revoke resource permission
   */
  revokeResourcePermission(
    resourceType: ResourcePermission['resourceType'],
    resourceId: string,
    userId?: string,
    teamId?: string
  ) {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.resourcePermissions.get(key) || [];
    const filtered = existing.filter(rp => {
      if (userId && rp.userId === userId) return false;
      if (teamId && rp.teamId === teamId) return false;
      return true;
    });
    this.resourcePermissions.set(key, filtered);
    this.clearCache();
  }

  /**
   * Get user's roles
   */
  getRoles(): Role[] {
    return this.user?.roles || [];
  }

  /**
   * Get user's highest priority role
   */
  getPrimaryRole(): Role | null {
    const roles = this.getRoles();
    if (roles.length === 0) return null;

    return roles.reduce((highest, role) => {
      const highestPriority = highest.priority || 0;
      const rolePriority = role.priority || 0;
      return rolePriority > highestPriority ? role : highest;
    });
  }

  /**
   * Get all user permissions
   */
  getAllPermissions(): Permission[] {
    if (!this.user) return [];

    const permissions = new Set<Permission>();

    // Add role permissions
    for (const role of this.user.roles) {
      role.permissions.forEach(p => permissions.add(p));
    }

    // Add direct permissions
    this.user.additionalPermissions?.forEach(p => permissions.add(p));

    // Add team permissions
    this.user.teams?.forEach(team => {
      team.permissions?.forEach(p => permissions.add(p));
      const memberRole = team.memberRoles?.[this.user!.id];
      memberRole?.permissions.forEach(p => permissions.add(p));
    });

    // Remove denied permissions
    this.user.deniedPermissions?.forEach(p => permissions.delete(p));

    return Array.from(permissions);
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasAnyPermission(PERMISSIONS.SYSTEM_CONFIG, PERMISSIONS.USER_DELETE);
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    const primaryRole = this.getPrimaryRole();
    return primaryRole?.id === 'super_admin';
  }

  /**
   * Clear permission cache
   */
  private clearCache() {
    this.cache.clear();
  }

  /**
   * Export permissions for debugging
   */
  exportPermissions() {
    return {
      user: this.user,
      allPermissions: this.getAllPermissions(),
      primaryRole: this.getPrimaryRole(),
      resourcePermissions: Array.from(this.resourcePermissions.entries()),
    };
  }
}

// Singleton instance
let rbacInstance: RBACManager | null = null;

export function getRBACManager(): RBACManager {
  if (!rbacInstance) {
    rbacInstance = new RBACManager();
  }
  return rbacInstance;
}

export function setRBACUser(user: User) {
  getRBACManager().setUser(user);
}

export function clearRBACUser() {
  getRBACManager().clearUser();
}

// Utility functions
export function canView(resource: 'document' | 'job' | 'analytics' | 'team'): boolean {
  const manager = getRBACManager();
  const permissionMap = {
    document: PERMISSIONS.DOCUMENT_VIEW,
    job: PERMISSIONS.JOB_VIEW,
    analytics: PERMISSIONS.ANALYTICS_VIEW,
    team: PERMISSIONS.TEAM_VIEW,
  };
  return manager.hasPermission(permissionMap[resource]);
}

export function canEdit(resource: 'document' | 'team' | 'workflow'): boolean {
  const manager = getRBACManager();
  const permissionMap = {
    document: PERMISSIONS.DOCUMENT_EDIT,
    team: PERMISSIONS.TEAM_EDIT,
    workflow: PERMISSIONS.WORKFLOW_EDIT,
  };
  return manager.hasPermission(permissionMap[resource]);
}

export function canDelete(resource: 'document' | 'team' | 'workflow'): boolean {
  const manager = getRBACManager();
  const permissionMap = {
    document: PERMISSIONS.DOCUMENT_DELETE,
    team: PERMISSIONS.TEAM_DELETE,
    workflow: PERMISSIONS.WORKFLOW_DELETE,
  };
  return manager.hasPermission(permissionMap[resource]);
}