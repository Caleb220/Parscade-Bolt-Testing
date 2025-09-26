/**
 * Enterprise RBAC-Aware Dashboard Component
 * Professional dashboard with intelligent feature discovery and tier-based UI
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Target,
  BarChart3,
  Download,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Settings,
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { ParscadeCard, ParscadeButton } from '@/shared/components/brand';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import AnalyticsHeader from './AdvancedAnalytics';
import ExportsManager from './ExportsManager';
import FileUploadZone from './FileUploadZone';
import JobsList from './JobsList';
import DashboardLayout from './layout/DashboardLayout';
import OverviewStats from './overview/OverviewStats';
import RecentActivity from './overview/RecentActivity';
import ProjectsOverview from './ProjectsOverview';
import DashboardSection from './ui/DashboardSection';

type UserRole = 'user' | 'admin';
type UserPlan = 'free' | 'standard' | 'pro' | 'enterprise';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredPlan?: UserPlan;
  requiredRole?: UserRole;
  path?: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

/**
 * Feature definitions with RBAC requirements
 */
const ENTERPRISE_FEATURES: FeatureCard[] = [
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Deep insights into processing trends, accuracy metrics, and error analysis',
    icon: <BarChart3 className="w-6 h-6" />,
    requiredPlan: 'pro',
    path: '/dashboard/analytics',
    isNew: true,
  },
  {
    id: 'exports',
    title: 'Data Exports',
    description: 'Export your documents and job data in multiple formats',
    icon: <Download className="w-6 h-6" />,
    requiredPlan: 'standard',
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Manage team members, roles, and collaboration',
    icon: <Users className="w-6 h-6" />,
    requiredPlan: 'pro',
    path: '/dashboard/team',
  },
  {
    id: 'workflows',
    title: 'Custom Workflows',
    description: 'Build automated processing pipelines',
    icon: <Zap className="w-6 h-6" />,
    requiredPlan: 'enterprise',
    path: '/dashboard/workflows',
    comingSoon: true,
  },
  {
    id: 'admin',
    title: 'Admin Console',
    description: 'System administration and user management',
    icon: <Shield className="w-6 h-6" />,
    requiredRole: 'admin',
    path: '/admin',
  },
];

/**
 * Plan hierarchy for comparisons
 */
const PLAN_HIERARCHY: Record<UserPlan, number> = {
  free: 0,
  standard: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Check if user has access to a feature
 */
function hasAccess(feature: FeatureCard, userRole: UserRole, userPlan: UserPlan): boolean {
  // Admin bypass
  if (userRole === 'admin') return true;

  // Role check
  if (feature.requiredRole && feature.requiredRole !== userRole) return false;

  // Plan check
  if (feature.requiredPlan && PLAN_HIERARCHY[userPlan] < PLAN_HIERARCHY[feature.requiredPlan]) {
    return false;
  }

  return true;
}

/**
 * Enterprise RBAC Dashboard Component
 */
const RBACDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const userRole: UserRole = user?.user_role || 'user';
  const userPlan: UserPlan = user?.subscription_tier || user?.plan || 'free';

  const handleJobSubmitted = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  const handleFeatureClick = (feature: FeatureCard) => {
    if (feature.comingSoon) return;

    if (hasAccess(feature, userRole, userPlan)) {
      if (feature.path) {
        navigate(feature.path);
      }
    } else {
      navigate('/dashboard/billing');
    }
  };

  const availableFeatures = ENTERPRISE_FEATURES.filter(
    f => hasAccess(f, userRole, userPlan) && !f.comingSoon
  );

  const lockedFeatures = ENTERPRISE_FEATURES.filter(
    f => !hasAccess(f, userRole, userPlan) && !f.comingSoon
  );

  const comingSoonFeatures = ENTERPRISE_FEATURES.filter(f => f.comingSoon);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header with Plan Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.full_name || 'User'}
              </h1>
              <p className="text-gray-600">Your document processing workspace is ready</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                  </span>
                </div>
              </div>
              {userRole === 'admin' && (
                <div className="bg-purple-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Admin</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <DashboardSection title="Overview" description="Your processing metrics and insights">
          <OverviewStats />
        </DashboardSection>

        {/* Document Processing Section */}
        <DashboardSection>
          <div className="flex items-center mb-6">
            <Target className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Document Processing</h3>
              <p className="text-slate-600 text-sm hidden sm:block">
                Upload documents to transform them into structured data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FileUploadZone onJobSubmitted={handleJobSubmitted} />
            <JobsList />
          </div>
        </DashboardSection>

        {/* Available Features Section */}
        {availableFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DashboardSection
              title="Your Features"
              description="Features available with your current plan"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFeatures.map(feature => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setActiveFeature(feature.id)}
                    onHoverEnd={() => setActiveFeature(null)}
                  >
                    <ParscadeCard
                      className="cursor-pointer transition-all duration-200 h-full"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              {React.cloneElement(feature.icon as React.ReactElement, {
                                className: 'w-5 h-5 text-green-600',
                              })}
                            </div>
                            {feature.isNew && (
                              <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                NEW
                              </div>
                            )}
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600 font-medium">AVAILABLE</span>
                          <ArrowRight
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              activeFeature === feature.id ? 'transform translate-x-1' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </ParscadeCard>
                  </motion.div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>
        )}

        {/* Locked Features Section */}
        {lockedFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DashboardSection
              title="Unlock More Features"
              description="Upgrade your plan to access these powerful features"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedFeatures.map(feature => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <ParscadeCard
                      className="cursor-pointer transition-all duration-200 border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50 h-full"
                      onClick={() => navigate('/dashboard/billing')}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              {React.cloneElement(feature.icon as React.ReactElement, {
                                className: 'w-5 h-5 text-orange-600',
                              })}
                            </div>
                            <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                              {feature.requiredPlan?.toUpperCase() || 'PREMIUM'}
                            </div>
                          </div>
                          <Lock className="w-5 h-5 text-orange-400" />
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-orange-600 font-medium">
                            UPGRADE REQUIRED
                          </span>
                          <ArrowRight className="w-4 h-4 text-orange-400" />
                        </div>
                      </div>
                    </ParscadeCard>
                  </motion.div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>
        )}

        {/* Coming Soon Features */}
        {comingSoonFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DashboardSection
              title="Coming Soon"
              description="Exciting new features we're working on"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comingSoonFeatures.map(feature => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <ParscadeCard className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 h-full">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {React.cloneElement(feature.icon as React.ReactElement, {
                                className: 'w-5 h-5 text-purple-600',
                              })}
                            </div>
                            <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                              COMING SOON
                            </div>
                          </div>
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                        <span className="text-xs text-purple-600 font-medium">IN DEVELOPMENT</span>
                      </div>
                    </ParscadeCard>
                  </motion.div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>
        )}

        {/* Activity and Analytics Section */}
        <DashboardSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity />

            <FeatureGate requiredTier="pro" hideWhenLocked>
              <AnalyticsHeader />
            </FeatureGate>
          </div>
        </DashboardSection>

        {/* Projects Management Section */}
        <DashboardSection>
          <ProjectsOverview />
        </DashboardSection>

        {/* Data Exports Section */}
        <DashboardSection>
          <FeatureGate requiredTier="standard" hideWhenLocked>
            <ExportsManager />
          </FeatureGate>
        </DashboardSection>
      </div>
    </DashboardLayout>
  );
};

export default RBACDashboard;
