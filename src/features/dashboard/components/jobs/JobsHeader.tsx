/**
 * Jobs Header Component
 * Statistics overview and primary actions for jobs dashboard
 */

import { motion } from 'framer-motion';
import {
  Zap,
  Plus,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import Button from '@/shared/components/forms/atoms/Button';
import type { Job } from '@/types/api-types';

interface JobsHeaderProps {
  jobs: Job[];
  totalJobs: number;
  isLoading: boolean;
  onCreateJob: () => void;
  onRefresh: () => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ icon, value, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <ParscadeCard className="p-6 text-center hover:shadow-lg transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} mx-auto mb-4 flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </ParscadeCard>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const JobsHeader: React.FC<JobsHeaderProps> = ({
  jobs,
  totalJobs,
  isLoading,
  onCreateJob,
  onRefresh,
}) => {
  const stats = React.useMemo(() => {
    const pending = jobs.filter(job => job.status === 'pending').length;
    const running = jobs.filter(job => job.status === 'running').length;
    const completed = jobs.filter(job => job.status === 'completed').length;
    const failed = jobs.filter(job => job.status === 'failed').length;

    return { pending, running, completed, failed };
  }, [jobs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Jobs Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor your document processing workflows
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRefresh}
            isLoading={isLoading}
          >
            Refresh
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={onCreateJob} glow>
            New Job
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<Activity className="w-6 h-6 text-white" />}
          value={totalJobs}
          label="Total Jobs"
          color="from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-white" />}
          value={stats.pending}
          label="Pending"
          color="from-yellow-500 to-yellow-600"
          delay={0.2}
        />
        <StatCard
          icon={<Activity className="w-6 h-6 text-white" />}
          value={stats.running}
          label="Running"
          color="from-blue-500 to-blue-600"
          delay={0.3}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          value={stats.completed}
          label="Completed"
          color="from-green-500 to-green-600"
          delay={0.4}
        />
        <StatCard
          icon={<XCircle className="w-6 h-6 text-white" />}
          value={stats.failed}
          label="Failed"
          color="from-red-500 to-red-600"
          delay={0.5}
        />
      </div>
    </div>
  );
};

export default React.memo(JobsHeader);
