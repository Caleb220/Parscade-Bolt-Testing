/**
 * Parscade Processing Pipeline Visualization
 * Unique visual metaphor for document transformation
 */

import { motion } from 'framer-motion';
import { FileText, Zap, Database, Rocket } from 'lucide-react';
import React from 'react';

interface PipelineStep {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'idle' | 'active' | 'completed';
  description: string;
}

interface ProcessingPipelineProps {
  currentStep?: number;
  animated?: boolean;
  className?: string;
}

/**
 * Branded pipeline visualization showing document transformation journey
 */
const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  currentStep = 0,
  animated = true,
  className = '',
}) => {
  const steps: PipelineStep[] = [
    {
      id: 'ingest',
      title: 'Ingest',
      icon: FileText,
      status: currentStep >= 0 ? 'completed' : 'idle',
      description: 'Document received',
    },
    {
      id: 'parse',
      title: 'Parse',
      icon: Zap,
      status: currentStep >= 1 ? (currentStep === 1 ? 'active' : 'completed') : 'idle',
      description: 'AI extraction',
    },
    {
      id: 'structure',
      title: 'Structure',
      icon: Database,
      status: currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : 'idle',
      description: 'Data formatting',
    },
    {
      id: 'deliver',
      title: 'Deliver',
      icon: Rocket,
      status: currentStep >= 3 ? 'completed' : 'idle',
      description: 'Ready to use',
    },
  ];

  const getStepColor = (status: PipelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'active':
        return 'from-purple-600 to-cyan-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getStepTextColor = (status: PipelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'active':
        return 'text-purple-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Node */}
          <div className="flex flex-col items-center">
            <motion.div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getStepColor(step.status)} flex items-center justify-center shadow-lg`}
              animate={
                animated && step.status === 'active'
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 8px 32px rgba(124, 109, 242, 0.3)',
                        '0 12px 48px rgba(124, 109, 242, 0.5)',
                        '0 8px 32px rgba(124, 109, 242, 0.3)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
            >
              <step.icon className="w-8 h-8 text-white" />

              {/* Active Pulse */}
              {step.status === 'active' && animated && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>

            <div className="mt-3 text-center">
              <div className={`text-sm font-bold ${getStepTextColor(step.status)}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">{step.description}</div>
            </div>
          </div>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-6 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: currentStep > index ? '100%' : '0%',
                }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProcessingPipeline;
