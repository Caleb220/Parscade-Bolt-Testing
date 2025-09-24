/**
 * Project Stats Cards Component
 * Displays key project metrics in animated cards
 */

import { motion } from 'framer-motion';
import { FileText, Activity, Calendar } from 'lucide-react';
import React from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import { formatRelativeTime } from '@/shared/utils/formatters';
import type { Project, Document, Job } from '@/types/api-types';

interface ProjectStatsCardsProps {
  project: Project;
  documents: Document[];
  jobs: Job[];
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  delay: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({
  icon,
  title,
  value,
  subtitle,
  delay,
  color
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <ParscadeCard className="p-6 text-center hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} mx-auto mb-4 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-400">{subtitle}</div>
      )}
    </ParscadeCard>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const ProjectStatsCards: React.FC<ProjectStatsCardsProps> = ({
  project,
  documents,
  jobs,
}) => {
  const stats = React.useMemo(() => {
    const totalDocuments = documents.length;
    const totalJobs = jobs.length;
    const lastActivity = project.updated_at;

    return {
      documents: totalDocuments,
      jobs: totalJobs,
      lastActivity: formatRelativeTime(lastActivity)
    };
  }, [documents, jobs, project.updated_at]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<FileText className="w-6 h-6 text-white" />}
        title="Documents"
        value={stats.documents}
        subtitle="Total files"
        delay={0.1}
        color="from-blue-500 to-blue-600"
      />

      <StatCard
        icon={<Activity className="w-6 h-6 text-white" />}
        title="Processing Jobs"
        value={stats.jobs}
        subtitle="Total jobs"
        delay={0.2}
        color="from-green-500 to-green-600"
      />

      <StatCard
        icon={<Calendar className="w-6 h-6 text-white" />}
        title="Last Activity"
        value={stats.lastActivity}
        subtitle="Most recent update"
        delay={0.3}
        color="from-purple-500 to-purple-600"
      />
    </div>
  );
};

export default React.memo(ProjectStatsCards);