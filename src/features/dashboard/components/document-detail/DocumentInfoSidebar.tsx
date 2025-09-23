/**
 * Document Info Sidebar Component
 * Container for all document information cards
 */

import React from 'react';
import { motion } from 'framer-motion';
import DocumentInfoCard from './DocumentInfoCard';
import DocumentMetadataCard from './DocumentMetadataCard';
import { ProjectInfoCard } from '../../../jobs/components';
import type { Document, Project } from '@/types/api-types';

interface DocumentInfoSidebarProps {
  document: Document;
  project?: Project;
}

const DocumentInfoSidebar: React.FC<DocumentInfoSidebarProps> = ({
  document,
  project,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      <DocumentInfoCard document={document} />

      {project && <ProjectInfoCard project={project} />}

      <DocumentMetadataCard document={document} />
    </motion.div>
  );
};

export default React.memo(DocumentInfoSidebar);