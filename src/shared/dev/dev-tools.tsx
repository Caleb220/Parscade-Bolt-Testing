/**
 * Development Tools Container
 * Orchestrates all development utilities
 * Only renders in development mode
 */

import React, { useState } from 'react';

import ApiInspector from './api-inspector';
import PerformanceMonitor from './performance-monitor';

const DevTools: React.FC = () => {
  const [apiInspectorOpen, setApiInspectorOpen] = useState(false);
  const [performanceMonitorOpen, setPerformanceMonitorOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <ApiInspector
        isOpen={apiInspectorOpen}
        onToggle={() => setApiInspectorOpen(!apiInspectorOpen)}
      />
      <PerformanceMonitor
        isOpen={performanceMonitorOpen}
        onToggle={() => setPerformanceMonitorOpen(!performanceMonitorOpen)}
      />

      {/* Development Mode Indicator */}
      {!apiInspectorOpen && !performanceMonitorOpen && (
        <div className="fixed top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium z-40">
          DEV MODE
        </div>
      )}
    </>
  );
};

export default DevTools;