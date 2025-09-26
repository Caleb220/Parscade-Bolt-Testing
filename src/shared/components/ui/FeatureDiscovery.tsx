/**
 * Enterprise Feature Discovery System
 * Sophisticated UI for showcasing all platform capabilities with elegant upgrade paths
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Sparkles,
  Lock,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  BarChart3,
  Users,
  Workflow,
  Database,
  Globe,
  Bot,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import React, { useState } from 'react';

import { useAuth } from '@/features/auth';
import { ParscadeButton } from '@/shared/components/brand';
import { parscadeAnimations } from '@/shared/design/theme';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'core' | 'analytics' | 'automation' | 'collaboration' | 'enterprise';
  tier: 'free' | 'standard' | 'pro' | 'enterprise';
  status?: 'available' | 'locked' | 'beta' | 'coming-soon';
  benefits: string[];
  useCases?: string[];
  demoUrl?: string;
  learnMoreUrl?: string;
  popularity?: number; // 1-5 stars
}

interface FeatureDiscoveryProps {
  variant?: 'compact' | 'detailed' | 'showcase';
  showUpgradePrompt?: boolean;
  onUpgrade?: (tier: string) => void;
  onDemoRequest?: (featureId: string) => void;
  className?: string;
}

interface FeatureCardProps {
  feature: Feature;
  variant: 'compact' | 'detailed' | 'showcase';
  onUpgrade?: (tier: string) => void;
  onDemoRequest?: (featureId: string) => void;
}

// Enterprise feature catalog
const enterpriseFeatures: Feature[] = [
  {
    id: 'document-processing',
    name: 'AI Document Processing',
    description: 'Transform any document into structured data with advanced AI extraction',
    icon: <Bot className="w-6 h-6" />,
    category: 'core',
    tier: 'free',
    status: 'available',
    benefits: [
      'PDF, Word, Excel support',
      'Table extraction',
      'Form recognition',
      'Multi-language processing',
    ],
    useCases: ['Invoice processing', 'Contract analysis', 'Data migration'],
    popularity: 5,
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics Dashboard',
    description: 'Real-time insights and predictive analytics for your data pipeline',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'analytics',
    tier: 'pro',
    status: 'available',
    benefits: [
      'Custom dashboards',
      'Predictive insights',
      'Performance metrics',
      'Export capabilities',
    ],
    useCases: ['Performance monitoring', 'Trend analysis', 'ROI tracking'],
    popularity: 4,
    demoUrl: '/demo/analytics',
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Build sophisticated automation pipelines with visual workflow builder',
    icon: <Workflow className="w-6 h-6" />,
    category: 'automation',
    tier: 'enterprise',
    status: 'available',
    benefits: [
      'Visual workflow builder',
      'Conditional logic',
      'API integrations',
      'Error handling',
    ],
    useCases: ['Document routing', 'Approval workflows', 'Data validation'],
    popularity: 5,
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Advanced team management with role-based access and collaboration tools',
    icon: <Users className="w-6 h-6" />,
    category: 'collaboration',
    tier: 'pro',
    status: 'available',
    benefits: ['Role-based access', 'Team workspaces', 'Shared projects', 'Activity tracking'],
    useCases: ['Team coordination', 'Project management', 'Access control'],
    popularity: 4,
  },
  {
    id: 'enterprise-security',
    name: 'Enterprise Security',
    description: 'Military-grade security with SOC2 compliance and audit trails',
    icon: <Shield className="w-6 h-6" />,
    category: 'enterprise',
    tier: 'enterprise',
    status: 'available',
    benefits: ['SOC2 compliance', 'Audit trails', 'SSO integration', 'Data encryption'],
    useCases: ['Compliance reporting', 'Security audits', 'Access management'],
    popularity: 5,
  },
  {
    id: 'api-platform',
    name: 'Developer API Platform',
    description: 'Comprehensive API suite for custom integrations and automation',
    icon: <Database className="w-6 h-6" />,
    category: 'enterprise',
    tier: 'pro',
    status: 'available',
    benefits: ['RESTful APIs', 'Webhook support', 'SDK libraries', 'Rate limiting'],
    useCases: ['Custom integrations', 'Bulk processing', 'Third-party sync'],
    popularity: 4,
  },
  {
    id: 'global-deployment',
    name: 'Global Edge Deployment',
    description: 'Deploy processing nodes globally for optimal performance and compliance',
    icon: <Globe className="w-6 h-6" />,
    category: 'enterprise',
    tier: 'enterprise',
    status: 'beta',
    benefits: ['Edge computing', 'Regional compliance', 'Low latency', 'Auto-scaling'],
    useCases: ['Global operations', 'Compliance requirements', 'Performance optimization'],
    popularity: 3,
  },
  {
    id: 'ai-assistant',
    name: 'AI-Powered Assistant',
    description: 'Intelligent assistant for natural language queries and automated insights',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'analytics',
    tier: 'enterprise',
    status: 'coming-soon',
    benefits: [
      'Natural language queries',
      'Automated insights',
      'Smart recommendations',
      'Voice interface',
    ],
    useCases: ['Data exploration', 'Report generation', 'Trend detection'],
    popularity: 5,
  },
];

/**
 * Individual Feature Card Component
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  variant,
  onUpgrade,
  onDemoRequest,
}) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const userTier = user?.subscription_tier || user?.plan || 'free';
  const tierHierarchy = ['free', 'standard', 'pro', 'enterprise'];
  const userTierLevel = tierHierarchy.indexOf(userTier);
  const featureTierLevel = tierHierarchy.indexOf(feature.tier);
  const isAvailable = userTierLevel >= featureTierLevel;
  const needsUpgrade = !isAvailable && feature.tier !== 'free';

  const tierColors = {
    free: 'text-neutral-600 bg-neutral-100 border-neutral-200',
    standard: 'text-primary-600 bg-primary-100 border-primary-200',
    pro: 'text-purple-600 bg-purple-100 border-purple-200',
    enterprise: 'text-teal-600 bg-teal-100 border-teal-200',
  };

  const statusColors = {
    available: 'text-success-600 bg-success-100',
    locked: 'text-warning-600 bg-warning-100',
    beta: 'text-primary-600 bg-primary-100',
    'coming-soon': 'text-purple-600 bg-purple-100',
  };

  return (
    <motion.div
      {...parscadeAnimations.cardHover}
      className={`
        group relative bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl
        shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden
        ${needsUpgrade ? 'border-purple-200/60 bg-gradient-to-br from-purple-25/30 to-white' : ''}
        ${variant === 'showcase' ? 'p-8' : variant === 'detailed' ? 'p-6' : 'p-4'}
      `}
    >
      {/* Premium Overlay */}
      {needsUpgrade && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center space-x-1">
            {feature.tier === 'enterprise' ? (
              <Crown className="w-4 h-4 text-teal-600" />
            ) : (
              <Lock className="w-4 h-4 text-purple-600" />
            )}
          </div>
        </div>
      )}

      {/* Status Badge */}
      {feature.status && feature.status !== 'available' && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`
            px-2 py-1 text-xs font-medium rounded-full border
            ${statusColors[feature.status]}
          `}
          >
            {feature.status === 'coming-soon' ? 'Coming Soon' : feature.status.toUpperCase()}
          </span>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              {...parscadeAnimations.iconBounce}
              className={`
                flex items-center justify-center w-12 h-12 rounded-xl shadow-parscade-xs
                ${
                  needsUpgrade
                    ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600'
                    : 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600'
                }
              `}
            >
              {feature.icon}
            </motion.div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-1">{feature.name}</h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`
                  px-2 py-0.5 text-xs font-medium rounded-full border
                  ${tierColors[feature.tier]}
                `}
                >
                  {feature.tier.charAt(0).toUpperCase() + feature.tier.slice(1)}
                </span>
                {feature.popularity && (
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: feature.popularity }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-warning-400 text-warning-400" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 mb-4 text-sm leading-relaxed">{feature.description}</p>

        {/* Benefits */}
        {(variant === 'detailed' || variant === 'showcase') && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Key Benefits
            </h4>
            <div className="space-y-1">
              {feature.benefits.slice(0, variant === 'showcase' ? 6 : 3).map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Check className="w-3 h-3 text-success-600 flex-shrink-0" />
                  <span className="text-neutral-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Use Cases (Showcase only) */}
        {variant === 'showcase' && feature.useCases && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Use Cases
            </h4>
            <div className="flex flex-wrap gap-1">
              {feature.useCases.map((useCase, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center space-x-2">
            {isAvailable ? (
              <ParscadeButton
                variant="primary"
                size="sm"
                className="text-xs px-3 py-1.5"
                onClick={() => {
                  /* Navigate to feature */
                }}
              >
                <Zap className="w-3 h-3 mr-1" />
                Use Now
              </ParscadeButton>
            ) : (
              <ParscadeButton
                variant="premium"
                size="sm"
                className="text-xs px-3 py-1.5"
                onClick={() => onUpgrade?.(feature.tier)}
                glow
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade to {feature.tier}
              </ParscadeButton>
            )}

            {feature.demoUrl && (
              <button
                onClick={() => onDemoRequest?.(feature.id)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>Demo</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {variant !== 'compact' && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-neutral-100"
            >
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">
                  Learn more about this feature and explore implementation options for your
                  workflow.
                </p>
                <div className="flex space-x-2">
                  <ParscadeButton variant="outline" size="sm" className="text-xs">
                    Documentation
                  </ParscadeButton>
                  <ParscadeButton variant="ghost" size="sm" className="text-xs">
                    Contact Sales
                  </ParscadeButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * Main Feature Discovery Component
 */
const FeatureDiscovery: React.FC<FeatureDiscoveryProps> = ({
  variant = 'detailed',
  showUpgradePrompt = true,
  onUpgrade,
  onDemoRequest,
  className = '',
}) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const userTier = user?.subscription_tier || user?.plan || 'free';

  const categories = [
    { id: 'all', name: 'All Features', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'core', name: 'Core Features', icon: <Bot className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'automation', name: 'Automation', icon: <Workflow className="w-4 h-4" /> },
    { id: 'collaboration', name: 'Collaboration', icon: <Users className="w-4 h-4" /> },
    { id: 'enterprise', name: 'Enterprise', icon: <Crown className="w-4 h-4" /> },
  ];

  const filteredFeatures =
    selectedCategory === 'all'
      ? enterpriseFeatures
      : enterpriseFeatures.filter(feature => feature.category === selectedCategory);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div {...parscadeAnimations.fadeInUp} className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 rounded-full border border-primary-200">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-semibold text-primary-800">
            Discover Enterprise Features
          </span>
        </div>

        <h2 className="text-3xl font-bold text-neutral-900">
          Unlock the Full Potential of Your Data
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Explore our comprehensive suite of enterprise-grade features designed to transform your
          document processing workflow.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        {...parscadeAnimations.slideInRight}
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map(category => (
          <motion.button
            key={category.id}
            {...parscadeAnimations.buttonPress}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-parscade-md'
                  : 'bg-white/80 text-neutral-700 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
              }
            `}
          >
            {category.icon}
            <span>{category.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        {...parscadeAnimations.staggerContainer}
        className={`
          grid gap-6
          ${
            variant === 'compact'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : variant === 'showcase'
                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }
        `}
      >
        {filteredFeatures.map(feature => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            variant={variant}
            onUpgrade={onUpgrade}
            onDemoRequest={onDemoRequest}
          />
        ))}
      </motion.div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && userTier !== 'enterprise' && (
        <motion.div
          {...parscadeAnimations.scaleIn}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10 space-y-4">
            <Crown className="w-12 h-12 mx-auto text-white/90" />
            <h3 className="text-2xl font-bold">Ready for Enterprise Scale?</h3>
            <p className="text-white/90 max-w-md mx-auto">
              Unlock advanced features, priority support, and enterprise-grade security.
            </p>
            <div className="flex justify-center space-x-4">
              <ParscadeButton
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => onUpgrade?.('enterprise')}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </ParscadeButton>
              <ParscadeButton variant="ghost" className="text-white hover:bg-white/10">
                Compare Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </ParscadeButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeatureDiscovery;
