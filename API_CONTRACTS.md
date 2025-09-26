# Parscade API Contracts & WebSocket Schema

## Overview

This document defines the complete API contract requirements for the Parscade backend implementation. All endpoints and WebSocket events listed here are required for full frontend functionality.

**Generated**: 2025-09-25
**Version**: 1.0.0
**Frontend Status**: Optimized and ready for integration

---

## REST API Endpoints

### Authentication & Authorization

#### Existing Endpoints (Keep As-Is)
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Current user info

#### New Required Endpoints
```typescript
// Multi-factor authentication
POST /auth/mfa/enable
POST /auth/mfa/verify
POST /auth/mfa/disable

// Session management
GET /auth/sessions
DELETE /auth/sessions/:id

// Password management
POST /auth/password/reset
POST /auth/password/change
```

### Document Processing

#### New Required Endpoints
```typescript
// Bulk operations
POST /documents/bulk/upload
{
  files: File[],
  metadata?: Record<string, any>,
  processingOptions?: {
    priority?: 'low' | 'normal' | 'high',
    webhookUrl?: string,
    extractFields?: string[]
  }
}

POST /documents/bulk/process
{
  documentIds: string[],
  action: 'process' | 'reprocess' | 'cancel',
  options?: ProcessingOptions
}

DELETE /documents/bulk
{
  documentIds: string[]
}

// Advanced processing
POST /documents/:id/reprocess
{
  options?: {
    engine?: string,
    extractFields?: string[],
    enhanceQuality?: boolean
  }
}

GET /documents/:id/versions
Response: DocumentVersion[]

POST /documents/:id/validate
{
  rules: ValidationRule[]
}
```

### Analytics & Reporting

#### New Required Endpoints
```typescript
// Dashboard analytics
GET /analytics/dashboard
{
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year',
  startDate?: string,
  endDate?: string
}
Response: {
  summary: {
    totalDocuments: number,
    processedToday: number,
    successRate: number,
    avgProcessingTime: number
  },
  charts: {
    documentsOverTime: TimeSeriesData[],
    processingSpeed: TimeSeriesData[],
    errorRate: TimeSeriesData[],
    userActivity: TimeSeriesData[]
  },
  topMetrics: Metric[]
}

// Usage metrics
GET /analytics/usage
{
  groupBy?: 'user' | 'team' | 'project' | 'document_type',
  period?: string
}
Response: UsageMetrics

// Custom reports
POST /analytics/reports/generate
{
  type: 'processing' | 'errors' | 'usage' | 'performance',
  filters: Record<string, any>,
  format?: 'json' | 'csv' | 'pdf'
}

GET /analytics/reports/:id
GET /analytics/reports/:id/download
```

### Team Management

#### New Required Endpoints
```typescript
// Team CRUD
POST /teams
{
  name: string,
  description?: string,
  settings?: TeamSettings
}

GET /teams
GET /teams/:id
PUT /teams/:id
DELETE /teams/:id

// Team members
GET /teams/:id/members
POST /teams/:id/members
{
  userId: string,
  role: 'owner' | 'admin' | 'member' | 'viewer'
}

PUT /teams/:id/members/:userId
{
  role: string
}

DELETE /teams/:id/members/:userId

// Team permissions
GET /teams/:id/permissions
PUT /teams/:id/permissions
{
  permissions: Permission[]
}

// Team activity
GET /teams/:id/activity
{
  limit?: number,
  offset?: number,
  filter?: 'all' | 'documents' | 'members' | 'settings'
}
```

### Workflow & Automation

#### New Required Endpoints
```typescript
// Workflow templates
GET /workflows/templates
GET /workflows/templates/:id
POST /workflows/templates
{
  name: string,
  description?: string,
  steps: WorkflowStep[],
  triggers?: WorkflowTrigger[]
}

PUT /workflows/templates/:id
DELETE /workflows/templates/:id

// Workflow instances
POST /workflows/execute
{
  templateId: string,
  input: Record<string, any>,
  options?: {
    async?: boolean,
    webhookUrl?: string
  }
}

GET /workflows/instances
GET /workflows/instances/:id
POST /workflows/instances/:id/cancel

// Automation rules
GET /automations/rules
POST /automations/rules
{
  name: string,
  condition: RuleCondition,
  actions: RuleAction[],
  enabled?: boolean
}

PUT /automations/rules/:id
DELETE /automations/rules/:id
POST /automations/rules/:id/test
```

### Enterprise Features

#### New Required Endpoints
```typescript
// Compliance & Audit
GET /compliance/reports
{
  type: 'gdpr' | 'hipaa' | 'sox' | 'custom',
  period: string
}

GET /audit/logs
{
  startDate: string,
  endDate: string,
  userId?: string,
  action?: string,
  resourceType?: string,
  limit?: number,
  offset?: number
}

GET /audit/logs/export
{
  format: 'json' | 'csv' | 'pdf',
  filters: AuditFilter
}

// Data governance
GET /governance/policies
POST /governance/policies
{
  name: string,
  type: 'retention' | 'deletion' | 'encryption' | 'access',
  rules: PolicyRule[],
  scope: PolicyScope
}

PUT /governance/policies/:id
DELETE /governance/policies/:id

// Advanced security
GET /security/threats
GET /security/scans/:id
POST /security/scans
{
  scope: 'full' | 'documents' | 'users' | 'integrations'
}

// SSO & Directory sync
POST /sso/configure
{
  provider: 'saml' | 'oauth' | 'ldap',
  config: SSOConfig
}

GET /sso/metadata
POST /sso/test

POST /directory/sync
{
  source: 'ldap' | 'azure_ad' | 'google',
  config: DirectoryConfig
}

GET /directory/sync/status
```

### System Administration

#### New Required Endpoints
```typescript
// System monitoring
GET /system/health
Response: {
  status: 'healthy' | 'degraded' | 'down',
  services: {
    api: ServiceStatus,
    database: ServiceStatus,
    storage: ServiceStatus,
    queue: ServiceStatus,
    websocket: ServiceStatus
  },
  metrics: {
    cpu: number,
    memory: number,
    disk: number,
    network: NetworkMetrics
  }
}

GET /system/metrics
{
  metrics?: string[],
  period?: string
}

// Configuration management
GET /system/config
PUT /system/config
{
  category: string,
  settings: Record<string, any>
}

// Backup & Recovery
POST /system/backup
{
  type: 'full' | 'incremental',
  includeDocuments?: boolean
}

GET /system/backups
POST /system/restore/:backupId
```

---

## WebSocket Events

### Connection Protocol

```typescript
// Client -> Server
{
  type: 'auth',
  payload: {
    token: string
  }
}

// Server -> Client
{
  type: 'auth:success',
  payload: {
    userId: string,
    permissions: string[]
  }
}

// Heartbeat
Client -> Server: { type: 'ping', timestamp: number }
Server -> Client: { type: 'pong', timestamp: number }
```

### Job Events

```typescript
// Server -> Client
interface JobEvents {
  'job:created': {
    jobId: string,
    documentId: string,
    type: string,
    createdBy: string,
    createdAt: string
  },

  'job:status': {
    jobId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
    progress?: number,
    message?: string,
    stage?: string
  },

  'job:progress': {
    jobId: string,
    progress: number, // 0-100
    stage: string,
    details?: {
      currentStep: number,
      totalSteps: number,
      estimatedTimeRemaining?: number
    }
  },

  'job:completed': {
    jobId: string,
    result: {
      documentId: string,
      status: 'success' | 'partial' | 'failed',
      extractedData?: Record<string, any>,
      metadata?: {
        pages: number,
        processingTime: number,
        confidence: number,
        warnings?: string[]
      }
    }
  },

  'job:failed': {
    jobId: string,
    error: string,
    details?: {
      code: string,
      retryable: boolean,
      suggestion?: string
    }
  }
}
```

### Document Events

```typescript
interface DocumentEvents {
  'document:uploaded': {
    documentId: string,
    name: string,
    size: number,
    type: string,
    uploadedBy: string
  },

  'document:processing': {
    documentId: string,
    stage: 'queued' | 'preprocessing' | 'ocr' | 'extraction' | 'validation' | 'complete',
    progress: number,
    message?: string
  },

  'document:processed': {
    documentId: string,
    result: ProcessingResult
  },

  'document:error': {
    documentId: string,
    error: string,
    recoverable: boolean
  },

  'document:deleted': {
    documentId: string,
    deletedBy: string
  }
}
```

### Real-time Analytics

```typescript
interface AnalyticsEvents {
  'analytics:update': {
    metric: string,
    value: number,
    change?: number,
    trend?: 'up' | 'down' | 'stable'
  },

  'analytics:realtime': {
    activeUsers: number,
    activeJobs: number,
    queueLength: number,
    processingRate: number, // docs/min
    errorRate: number, // percentage
    systemLoad: {
      cpu: number,
      memory: number,
      queue: number
    }
  },

  'analytics:alert': {
    type: 'threshold' | 'anomaly' | 'trend',
    metric: string,
    value: number,
    threshold?: number,
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string
  }
}
```

### System Events

```typescript
interface SystemEvents {
  'system:status': {
    status: 'healthy' | 'degraded' | 'down',
    services: Record<string, boolean>,
    issues?: SystemIssue[]
  },

  'system:maintenance': {
    scheduled: boolean,
    startTime?: string,
    endTime?: string,
    message?: string,
    affectedServices?: string[]
  },

  'system:notification': {
    id: string,
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string,
    actions?: NotificationAction[],
    persistent?: boolean
  },

  'system:broadcast': {
    message: string,
    severity: 'info' | 'warning' | 'critical',
    dismissible: boolean
  }
}
```

### Team Collaboration

```typescript
interface TeamEvents {
  'team:member_joined': {
    teamId: string,
    userId: string,
    userName: string,
    role: string
  },

  'team:member_left': {
    teamId: string,
    userId: string,
    userName: string
  },

  'team:activity': {
    teamId: string,
    userId: string,
    userName: string,
    action: string,
    resource?: string,
    details?: Record<string, any>
  },

  'team:document_shared': {
    teamId: string,
    documentId: string,
    sharedBy: string,
    permissions: string[]
  }
}
```

---

## Performance Requirements

### API Response Times (p95)
- Authentication endpoints: <100ms
- Document CRUD: <200ms
- Processing initiation: <300ms
- Analytics queries: <500ms
- Bulk operations: <1000ms
- Report generation: <3000ms

### WebSocket Requirements
- Connection establishment: <500ms
- Message delivery: <100ms
- Reconnection time: <3s
- Max concurrent connections per user: 5
- Message queue size: 1000 messages
- Heartbeat interval: 30s

### Throughput Targets
- Concurrent document uploads: 100
- Concurrent processing jobs: 50
- WebSocket messages/sec: 1000
- API requests/sec: 500

---

## Data Formats

### Standard Response Format
```typescript
interface ApiResponse<T> {
  success: boolean,
  data?: T,
  error?: {
    code: string,
    message: string,
    details?: any
  },
  metadata?: {
    timestamp: string,
    requestId: string,
    version: string
  }
}
```

### Pagination Format
```typescript
interface PaginatedResponse<T> {
  data: T[],
  pagination: {
    total: number,
    page: number,
    perPage: number,
    totalPages: number
  },
  links?: {
    first?: string,
    prev?: string,
    next?: string,
    last?: string
  }
}
```

### Error Codes
```typescript
enum ErrorCode {
  // Authentication
  AUTH_INVALID_CREDENTIALS = 'AUTH001',
  AUTH_TOKEN_EXPIRED = 'AUTH002',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH003',

  // Validation
  VALIDATION_FAILED = 'VAL001',
  VALIDATION_REQUIRED_FIELD = 'VAL002',

  // Processing
  PROCESSING_FAILED = 'PROC001',
  PROCESSING_TIMEOUT = 'PROC002',

  // System
  SYSTEM_ERROR = 'SYS001',
  SYSTEM_MAINTENANCE = 'SYS002',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE001'
}
```

---

## Security Requirements

### Authentication
- JWT tokens with 15min access / 7day refresh
- MFA support via TOTP
- Session management with device tracking
- Rate limiting per endpoint

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Team-based isolation
- API key management with scopes

### Data Protection
- TLS 1.3 for all communications
- AES-256 encryption at rest
- Field-level encryption for PII
- Audit logging for all operations

---

## Integration Requirements

### Webhook Payloads
```typescript
interface WebhookPayload {
  event: string,
  timestamp: string,
  data: any,
  signature: string // HMAC-SHA256
}
```

### API Versioning
- Version in URL path: `/api/v1/`
- Version in Accept header: `Accept: application/vnd.parscade.v1+json`
- Deprecation notices in headers

### Rate Limiting
- Default: 1000 requests/hour
- Bulk operations: 100 requests/hour
- WebSocket messages: 100/minute
- Headers: `X-RateLimit-*`

---

## Migration Plan

### Phase 1: Core APIs (Week 1)
- Authentication & authorization
- Document CRUD operations
- Basic processing endpoints
- WebSocket infrastructure

### Phase 2: Advanced Features (Week 2)
- Bulk operations
- Analytics endpoints
- Team management
- Workflow automation

### Phase 3: Enterprise Features (Week 3)
- Compliance & audit
- Advanced security
- SSO integration
- System administration

---

## Testing Requirements

### API Testing
- Unit tests for all endpoints
- Integration tests for workflows
- Load testing for performance targets
- Security testing for vulnerabilities

### WebSocket Testing
- Connection stability tests
- Message ordering tests
- Reconnection tests
- Load tests (1000+ concurrent connections)

---

## Documentation Requirements

### API Documentation
- OpenAPI 3.0 specification
- Interactive API explorer
- Code examples in multiple languages
- Postman/Insomnia collections

### WebSocket Documentation
- Event catalog with schemas
- Connection flow diagrams
- Client implementation guides
- Troubleshooting guide

---

## Monitoring & Observability

### Metrics to Track
- API response times
- Error rates by endpoint
- WebSocket connection count
- Message throughput
- Processing queue depth

### Logging Requirements
- Structured JSON logs
- Correlation IDs
- User context
- Performance metrics
- Error stack traces

### Alerting Thresholds
- API error rate > 1%
- Response time > 1s (p95)
- WebSocket disconnection rate > 5%
- Queue depth > 1000
- System resource usage > 80%

---

## Handoff Checklist

- [ ] All REST endpoints implemented
- [ ] WebSocket server operational
- [ ] Authentication & authorization complete
- [ ] Rate limiting configured
- [ ] Error handling standardized
- [ ] Performance targets met
- [ ] Security requirements satisfied
- [ ] API documentation complete
- [ ] Integration tests passing
- [ ] Load tests passing
- [ ] Monitoring configured
- [ ] Deployment pipeline ready

---

This contract represents the complete backend requirements for the Parscade frontend. The backend team should implement these specifications to ensure seamless integration with the optimized frontend application.