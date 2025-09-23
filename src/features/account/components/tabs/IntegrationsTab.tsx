/**
 * Integrations Tab Component - Refactored
 * Streamlined integrations management with extracted component sections
 */

import React from 'react';
import { motion } from 'framer-motion';

import {
  WebhooksSection,
  ServicesSection,
  DataSourcesSection
} from '../integrations';

const IntegrationsTab: React.FC = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <WebhooksSection />
      <ServicesSection />
      <DataSourcesSection />
    </motion.div>
  );
};

export default React.memo(IntegrationsTab);