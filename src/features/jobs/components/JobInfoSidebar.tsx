/**
 * Job Info Sidebar Component
 * Container for all job information cards
 */

import { motion } from 'framer-motion';
import React from 'react';

import type { Job, Project, Document } from '@/types/api-types';

import DocumentInfoCard from './DocumentInfoCard';
import JobConfigCard from './JobConfigCard';
import JobInfoCard from './JobInfoCard';
import ProjectInfoCard from './ProjectInfoCard';


interface JobInfoSidebarProps {
  job: Job;
  project?: Project;
  document?: Document;
}

const JobInfoSidebar: React.FC<JobInfoSidebarProps> = ({
  job,
  project,
  document,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      <JobInfoCard job={job} />

      {project && <ProjectInfoCard project={project} />}

      {document && <DocumentInfoCard document={document} />}

      <JobConfigCard job={job} />
    </motion.div>
  );
};

export default React.memo(JobInfoSidebar);