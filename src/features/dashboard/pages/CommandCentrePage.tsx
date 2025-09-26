/**
 * Command Centre - Enterprise Dashboard Transformation
 * Eye-catching, modern, uniquely Parscade command centre with RBAC awareness
 */

import { motion, useSpring, useTransform } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Command,
  Crown,
  Database,
  FileCheck,
  FileText,
  FileWarning,
  FileX2,
  Gauge,
  Info,
  Layers,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Upload,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useRBAC } from '@/shared/hooks/useRBAC';
import type { UserRole, UserPlan } from '@/shared/types/rbac';
import { cn } from '@/shared/utils/cn';

import DashboardLayout from '../components/layout/DashboardLayout';

// Hero Utility Strip Component
const HeroUtilityStrip: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { canAccess } = useRBAC();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-neutral-50 to-white"
    >
      {/* soft pattern */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(60%_60%_at_50%_0%,#000_0%,transparent_100%)]">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-purple-200/30 blur-2xl" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="min-w-0">
            <h1
              className="
            font-sans text-4xl sm:text-5xl font-extrabold tracking-tighter2 leading-[1.1]
            bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-700
            drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]
          "
            >
              Command Centre
            </h1>
            <p className="mt-2 text-neutral-600 text-base sm:text-lg">
              Real-time insights and control at your fingertips
            </p>
          </div>

          {/* status pill */}
          <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          All Systems Operational
        </span>
          </div>
        </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Global Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
                <input
                  type="text"
                  placeholder="Search documents, jobs, workflows..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="Global search across all content"
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-black/50 text-primary-100 placeholder-black/60 focus:bg-white/30 focus:border-black/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <button
              disabled={!canAccess('operator')}
              aria-label="Upload documents for processing"
              title="Upload documents for processing"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Upload className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">Upload</span>
            </button>

            <button
              disabled={!canAccess('operator')}
              aria-label="Create a new processing job"
              title="Create a new processing job"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">New Job</span>
            </button>

            <button
              onClick={() => setShowCommandPalette(!showCommandPalette)}
              aria-label="Open command palette"
              title="Open command palette (Ctrl+K)"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all whitespace-nowrap"
            >
              <Command className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">⌘K</span>
            </button>
          </div>
        </div>
    </motion.div>
  );
};

// Enhanced KPI Tile Component with Circular Progress Support
interface KPITileProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'error' | 'purple';
  subtitle?: string;
  requiredRole?: UserRole;
  requiredPlan?: UserPlan;
  showProgress?: boolean;
  progressValue?: number;
  maxValue?: number;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  format?: (value: number) => string;
}> = ({ value, duration = 1, format = (v) => v.toString() }) => {
  const spring = useSpring(value, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => format(Math.round(current)));

  return <motion.span>{display}</motion.span>;
};

// Circular Progress Component for KPI tiles
const CircularProgress: React.FC<{
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}> = ({ value, maxValue, size = 60, strokeWidth = 4, color }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-neutral-900">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const KPITile: React.FC<KPITileProps> = React.memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  subtitle,
  requiredRole,
  requiredPlan,
  showProgress = false,
  progressValue = 0,
  maxValue = 100,
}) => {
  const { canAccess } = useRBAC();
  const hasAccess = canAccess(requiredRole, requiredPlan);

  const colorClasses = {
    primary: 'from-primary-100 to-primary-200 text-primary-600 border-primary-200/60',
    success: 'from-success-100 to-success-200 text-success-600 border-success-200/60',
    warning: 'from-warning-100 to-warning-200 text-warning-600 border-warning-200/60',
    error: 'from-error-100 to-error-200 text-error-600 border-error-200/60',
    purple: 'from-purple-100 to-purple-200 text-purple-600 border-purple-200/60',
  };

  const progressColors = {
    primary: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    purple: 'text-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hasAccess ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative bg-white rounded-xl p-6 border shadow-card hover:shadow-card-hover transition-all min-h-[140px]",
        !hasAccess && "opacity-60 cursor-not-allowed"
      )}
    >
      {!hasAccess && (
        <div className="absolute inset-0 bg-neutral-50/50 rounded-xl backdrop-blur-sm z-10 flex items-center justify-center">
          <span className="text-sm text-neutral-600 bg-white px-3 py-1 rounded-lg shadow-sm whitespace-nowrap">
            Upgrade to access
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl bg-gradient-to-br flex-shrink-0", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>

        {showProgress && (
          <CircularProgress
            value={progressValue}
            maxValue={maxValue}
            color={progressColors[color]}
          />
        )}

        {!showProgress && change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium flex-shrink-0",
            changeType === 'increase' && "text-success-600",
            changeType === 'decrease' && "text-error-600",
            changeType === 'neutral' && "text-neutral-600"
          )}>
            {changeType === 'increase' && <TrendingUp className="w-4 h-4" />}
            {changeType === 'decrease' && <TrendingDown className="w-4 h-4" />}
            {changeType === 'neutral' && <ArrowUp className="w-4 h-4" />}
            <span className="whitespace-nowrap">{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-neutral-600 text-sm leading-tight break-words">{title}</p>
        <div className="text-2xl font-bold text-neutral-900 break-all">
          {typeof value === 'number' && !title.includes('%') ? (
            <AnimatedCounter
              value={value}
              format={(v) => v.toLocaleString()}
            />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-500 leading-tight break-words">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
});

// Activity Item Component
interface ActivityItemProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = React.memo(({
  type,
  title,
  description,
  timestamp,
  actionLabel,
  onAction,
}) => {
  const typeConfig = {
    error: { icon: FileX2, color: 'text-error-600', bg: 'bg-error-50' },
    warning: { icon: FileWarning, color: 'text-warning-600', bg: 'bg-warning-50' },
    info: { icon: Info, color: 'text-primary-600', bg: 'bg-primary-50' },
    success: { icon: FileCheck, color: 'text-success-600', bg: 'bg-success-50' },
  };

  const { icon: Icon, color, bg } = typeConfig[type];

  // Add pulse animation for recent items
  const isRecent = timestamp.includes('minutes') || timestamp.includes('mins');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex gap-4 p-4 bg-white rounded-lg border transition-all group relative overflow-hidden",
        type === 'error' ? "border-error-200/60 hover:border-error-300" :
        type === 'warning' ? "border-warning-200/60 hover:border-warning-300" :
        type === 'success' ? "border-success-200/60 hover:border-success-300" :
        "border-neutral-200/60 hover:border-neutral-300"
      )}
    >
      {/* Pulse effect for recent activities */}
      {isRecent && (
        <motion.div
          className={cn(
            "absolute inset-0 opacity-30",
            type === 'error' ? "bg-error-50" :
            type === 'warning' ? "bg-warning-50" :
            type === 'success' ? "bg-success-50" :
            "bg-primary-50"
          )}
          animate={{ opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className={cn("p-2 rounded-lg flex-shrink-0 relative z-10", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
        {isRecent && (
          <div className={cn(
            "absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse",
            type === 'error' ? "bg-error-400" :
            type === 'warning' ? "bg-warning-400" :
            type === 'success' ? "bg-success-400" :
            "bg-primary-400"
          )} />
        )}
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="font-medium text-neutral-900 text-sm leading-tight break-words">{title}</p>
        <p className="text-xs text-neutral-600 mt-1 leading-tight break-words line-clamp-2">{description}</p>
        <p className="text-xs text-neutral-500 mt-2 whitespace-nowrap">{timestamp}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-primary-600 hover:text-primary-700 self-start mt-1 flex-shrink-0 whitespace-nowrap relative z-10"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
});

// Job/Workflow Row Component
interface JobRowProps {
  id: string;
  name: string;
  type: 'job' | 'workflow';
  status: 'running' | 'completed' | 'failed' | 'pending';
  owner: string;
  startTime: string;
  endTime?: string;
  progress?: number;
}

const JobRow: React.FC<JobRowProps> = ({
  id,
  name,
  type,
  status,
  owner,
  startTime,
  endTime,
  progress,
}) => {
  const statusConfig = {
    running: { icon: Loader2, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Running' },
    completed: { icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50', label: 'Completed' },
    failed: { icon: AlertCircle, color: 'text-error-600', bg: 'bg-error-50', label: 'Failed' },
    pending: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Pending' },
  };

  const { icon: StatusIcon, color, bg, label } = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200/60 hover:border-primary-200 transition-all group"
    >
      <div className={cn("p-2 rounded-lg", bg)}>
        {status === 'running' ? (
          <StatusIcon className={cn("w-5 h-5 animate-spin", color)} />
        ) : (
          <StatusIcon className={cn("w-5 h-5", color)} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <p className="font-medium text-neutral-900 text-sm leading-tight break-words flex-1">{name}</p>
          <span className="text-xs text-neutral-500 flex-shrink-0 whitespace-nowrap">#{id}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-neutral-600 flex-wrap">
          <span className="truncate">{owner}</span>
          <span className="whitespace-nowrap">{startTime}</span>
          {endTime && <span className="whitespace-nowrap">→ {endTime}</span>}
        </div>
        {progress !== undefined && status === 'running' && (
          <div className="mt-2 w-full bg-neutral-100 rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" role="group" aria-label="Job actions">
        <button className="p-1.5 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:opacity-100" aria-label="Rerun job">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        </button>
        <button className="p-1.5 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:opacity-100" aria-label="View job details">
          <Layers className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
};

// Document Row Component
interface DocumentRowProps {
  id: string;
  name: string;
  status: 'processing' | 'parsed' | 'failed' | 'pending';
  uploadedBy: string;
  uploadTime: string;
  size: string;
  progress?: number;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  id,
  name,
  status,
  uploadedBy,
  uploadTime,
  size,
  progress,
}) => {
  const statusConfig = {
    processing: { color: 'text-primary-600', bg: 'bg-primary-50', label: 'Processing' },
    parsed: { color: 'text-success-600', bg: 'bg-success-50', label: 'Parsed' },
    failed: { color: 'text-error-600', bg: 'bg-error-50', label: 'Failed' },
    pending: { color: 'text-warning-600', bg: 'bg-warning-50', label: 'Pending' },
  };

  const { color, bg, label } = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200/60 hover:border-primary-200 transition-all group"
    >
      <div className="p-2 bg-primary-50 rounded-lg">
        <FileText className="w-5 h-5 text-primary-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-sm leading-tight break-words mb-1">{name}</p>
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-neutral-600 flex-wrap">
          <span className="truncate">{uploadedBy}</span>
          <span className="whitespace-nowrap">{uploadTime}</span>
          <span className="whitespace-nowrap">{size}</span>
        </div>
        {progress !== undefined && status === 'processing' && (
          <div className="mt-2 w-full bg-neutral-100 rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <span className={cn("px-2 py-1 text-xs font-medium rounded-lg", bg, color)}>
        {label}
      </span>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" role="group" aria-label="Document actions">
        <button className="p-1.5 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:opacity-100" aria-label="Reprocess document">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        </button>
        <button className="p-1.5 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:opacity-100" aria-label="Link to project">
          <Link2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
};

// System Health Metric Component
interface SystemMetricProps {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
}

const SystemMetric: React.FC<SystemMetricProps> = ({ label, value, maxValue, unit, status }) => {
  const percentage = (value / maxValue) * 100;
  const statusColors = {
    healthy: 'bg-success-500',
    warning: 'bg-warning-500',
    critical: 'bg-error-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-600">{label}</span>
        <span className="font-medium text-neutral-900">
          {value}{unit} / {maxValue}{unit}
        </span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all", statusColors[status])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Onboarding Checklist Component
const OnboardingChecklist: React.FC = () => {
  const { user } = useRBAC();
  const tasks = [
    { id: 1, label: 'Connect data source', completed: true },
    { id: 2, label: 'Upload first document', completed: true },
    { id: 3, label: 'Create a workflow', completed: true },
    { id: 4, label: 'Invite team member', completed: false },
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  if (progress === 100 || !user?.metadata?.isFirstRun) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-primary-50 rounded-xl p-6 border border-purple-200/40"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Getting Started</h3>
          <p className="text-sm text-neutral-600 mt-1">Complete these steps to get the most out of Parscade</p>
        </div>
        <span className="text-sm font-medium text-purple-600">
          {completedCount}/{tasks.length} completed
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              task.completed
                ? "bg-success-500 border-success-500"
                : "border-neutral-300"
            )}>
              {task.completed && (
                <CheckCircle2 className="w-3 h-3 text-white" />
              )}
            </div>
            <span className={cn(
              "text-sm transition-all",
              task.completed ? "text-neutral-600 line-through" : "text-neutral-900"
            )}>
              {task.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full bg-purple-100 rounded-full h-2">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

// Main Command Centre Component
const CommandCentrePage: React.FC = () => {
  const { user } = useAuth();
  const { canAccess, user: rbacUser } = useRBAC();

  // Mock data - replace with actual API calls - Memoized for performance
  const kpiData = useMemo(() => ({
    processedToday: 1247,
    successRate: 98.7,
    avgLatency: 1.3,
    activeJobs: 23,
    failures24h: 3,
  }), []);

  const activities = useMemo(() => [
    {
      type: 'error' as const,
      title: 'Parse failed for invoice_2024.pdf',
      description: 'OCR confidence below threshold',
      timestamp: '2 minutes ago',
      actionLabel: 'View details',
    },
    {
      type: 'warning' as const,
      title: 'High latency detected',
      description: 'EU-West region experiencing delays',
      timestamp: '15 minutes ago',
      actionLabel: 'Monitor',
    },
    {
      type: 'success' as const,
      title: 'Batch processing completed',
      description: '500 documents processed successfully',
      timestamp: '1 hour ago',
    },
    {
      type: 'info' as const,
      title: 'New API version available',
      description: 'v2.5.0 includes performance improvements',
      timestamp: '3 hours ago',
      actionLabel: 'Learn more',
    },
  ], []);

  const recentJobs = useMemo(() => [
    {
      id: 'J2024001',
      name: 'Invoice Batch Processing',
      type: 'job' as const,
      status: 'running' as const,
      owner: 'John Doe',
      startTime: '10:30 AM',
      progress: 67,
    },
    {
      id: 'W2024002',
      name: 'Contract Analysis Workflow',
      type: 'workflow' as const,
      status: 'completed' as const,
      owner: 'Jane Smith',
      startTime: '9:15 AM',
      endTime: '10:20 AM',
    },
    {
      id: 'J2024003',
      name: 'Receipt OCR Processing',
      type: 'job' as const,
      status: 'failed' as const,
      owner: 'Mike Johnson',
      startTime: '11:00 AM',
      endTime: '11:05 AM',
    },
  ], []);

  const recentDocuments = useMemo(() => [
    {
      id: 'D001',
      name: 'Q4_financial_report.pdf',
      status: 'processing' as const,
      uploadedBy: 'Sarah Lee',
      uploadTime: '5 mins ago',
      size: '2.4 MB',
      progress: 45,
    },
    {
      id: 'D002',
      name: 'contract_template_v3.docx',
      status: 'parsed' as const,
      uploadedBy: 'Tom Wilson',
      uploadTime: '30 mins ago',
      size: '1.1 MB',
    },
    {
      id: 'D003',
      name: 'invoice_batch_2024.zip',
      status: 'pending' as const,
      uploadedBy: 'Emily Brown',
      uploadTime: '1 hour ago',
      size: '15.3 MB',
    },
  ], []);

  return (
    <DashboardLayout>
      <main className="space-y-6" role="main" aria-label="Command Centre Dashboard" tabIndex={-1}>

        {/* Hero Utility Strip */}
        <HeroUtilityStrip />

        {/* Onboarding Checklist (First-run only) */}
        {rbacUser?.metadata?.isFirstRun && (
          <OnboardingChecklist />
        )}

        {/* Enhanced KPI Tiles - Responsive Grid with Perfect Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <KPITile
            title="Documents Today"
            value={kpiData.processedToday.toLocaleString()}
            change={12}
            changeType="increase"
            icon={FileText}
            color="primary"
            subtitle="vs. yesterday"
          />
          <KPITile
            title="Success Rate"
            value={`${kpiData.successRate}%`}
            showProgress={true}
            progressValue={kpiData.successRate}
            maxValue={100}
            change={2.1}
            changeType="increase"
            icon={CheckCircle2}
            color="success"
            subtitle="Last 24 hours"
          />
          <KPITile
            title="Average Latency"
            value={`${kpiData.avgLatency}s`}
            change={8}
            changeType="decrease"
            icon={Gauge}
            color="purple"
            subtitle="p95: 2.1s"
          />
          <KPITile
            title="Active Jobs"
            value={kpiData.activeJobs}
            icon={Zap}
            color="warning"
            subtitle="In queue: 45"
          />
          <KPITile
            title="Failures (24h)"
            value={kpiData.failures24h}
            change={25}
            changeType="decrease"
            icon={AlertCircle}
            color="error"
            subtitle="0 critical"
          />
        </div>

        {/* Main Content Grid - Enhanced Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Activity & Alerts Rail */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-neutral-200/60 shadow-card h-full"
            >
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-neutral-900 truncate">Activity & Alerts</h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap flex-shrink-0">
                    View all
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="px-3 py-1 text-xs font-medium bg-error-50 text-error-700 rounded-lg whitespace-nowrap">
                    Errors (1)
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-warning-50 text-warning-700 rounded-lg whitespace-nowrap">
                    Warnings (1)
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-neutral-50 text-neutral-700 rounded-lg whitespace-nowrap">
                    Info (2)
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Workflows & Jobs Panel */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-neutral-200/60 shadow-card"
            >
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Workflow className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900">Workflows & Jobs</h2>
                      <p className="text-sm text-neutral-600">Recent processing activity</p>
                    </div>
                  </div>
                  <button
                    disabled={!canAccess('operator')}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Schedule New
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {recentJobs.map((job) => (
                  <JobRow key={job.id} {...job} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Documents Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-neutral-200/60 shadow-card"
        >
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-50 rounded-lg">
                  <FileText className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Recent Documents</h2>
                  <p className="text-sm text-neutral-600">Latest uploads and processing status</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-all">
                  View All
                </button>
                <button
                  disabled={!canAccess('operator')}
                  className="px-4 py-2 text-sm font-medium text-white bg-success-600 hover:bg-success-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload New
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {recentDocuments.map((doc) => (
              <DocumentRow key={doc.id} {...doc} />
            ))}
          </div>
        </motion.div>

        {/* System Health & Usage - Enhanced Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl border border-neutral-200/60 shadow-card"
          >
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-50 rounded-lg">
                  <Activity className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">System Health</h2>
                  <p className="text-sm text-neutral-600">Infrastructure and service status</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">API Gateway</p>
                    <p className="text-xs text-neutral-600">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Processing Engine</p>
                    <p className="text-xs text-neutral-600">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Database</p>
                    <p className="text-xs text-neutral-600">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">CDN</p>
                    <p className="text-xs text-neutral-600">High latency</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <SystemMetric
                  label="CPU Usage"
                  value={45}
                  maxValue={100}
                  unit="%"
                  status="healthy"
                />
                <SystemMetric
                  label="Memory"
                  value={6.2}
                  maxValue={8}
                  unit="GB"
                  status="warning"
                />
                <SystemMetric
                  label="Storage"
                  value={120}
                  maxValue={500}
                  unit="GB"
                  status="healthy"
                />
              </div>
            </div>
          </motion.div>

          {/* Usage & Quotas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl border border-neutral-200/60 shadow-card"
          >
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Usage & Quotas</h2>
                  <p className="text-sm text-neutral-600">Plan limits and consumption</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-primary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Enterprise Plan</p>
                  <p className="text-xs text-neutral-600">Unlimited processing</p>
                </div>
                <Crown className="w-5 h-5 text-purple-600" />
              </div>

              <div className="space-y-3">
                <SystemMetric
                  label="API Calls"
                  value={8500}
                  maxValue={10000}
                  unit=""
                  status="warning"
                />
                <SystemMetric
                  label="Documents"
                  value={45000}
                  maxValue={100000}
                  unit=""
                  status="healthy"
                />
                <SystemMetric
                  label="Team Members"
                  value={12}
                  maxValue={50}
                  unit=""
                  status="healthy"
                />
              </div>

              {canAccess('admin') && (
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 rounded-lg transition-all">
                  Upgrade Plan
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Integration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-neutral-50 to-primary-50/30 rounded-xl p-6 border border-neutral-200/40"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Link2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Active Integrations</h2>
                <p className="text-sm text-neutral-600">Connected services and APIs</p>
              </div>
            </div>
            {canAccess('operator', 'pro') && (
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Manage integrations
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200/60">
              <Cloud className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-neutral-900 text-sm">AWS S3</p>
                <p className="text-xs text-success-600">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200/60">
              <Database className="w-8 h-8 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900 text-sm">PostgreSQL</p>
                <p className="text-xs text-success-600">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200/60">
              <Webhook className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-neutral-900 text-sm">Webhooks</p>
                <p className="text-xs text-neutral-600">3 endpoints</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200/60 opacity-60">
              <Code2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-neutral-900 text-sm">REST API</p>
                <p className="text-xs text-neutral-600">Not configured</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </DashboardLayout>
  );
};

export default CommandCentrePage;