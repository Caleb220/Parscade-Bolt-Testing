import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Database,
  Lock,
  Eye,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Key,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending';
  score: number;
  lastAssessment: string;
  nextAssessment: string;
  requirements: {
    total: number;
    compliant: number;
    pending: number;
    failed: number;
  };
  categories: {
    name: string;
    status: 'compliant' | 'partial' | 'non_compliant';
    score: number;
  }[];
}

interface SecurityControl {
  id: string;
  name: string;
  category: string;
  status: 'implemented' | 'partial' | 'not_implemented' | 'not_applicable';
  effectiveness: number;
  lastTested: string;
  nextReview: string;
  owner: string;
  description: string;
  evidence: string[];
}

const ComplianceDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'frameworks' | 'controls' | 'assessments' | 'reports'>('overview');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  const complianceFrameworks: ComplianceFramework[] = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'System and Organization Controls for Service Organizations',
      status: 'compliant',
      score: 94,
      lastAssessment: '2024-01-15',
      nextAssessment: '2024-07-15',
      requirements: {
        total: 64,
        compliant: 58,
        pending: 4,
        failed: 2
      },
      categories: [
        { name: 'Security', status: 'compliant', score: 96 },
        { name: 'Availability', status: 'compliant', score: 98 },
        { name: 'Processing Integrity', status: 'partial', score: 88 },
        { name: 'Confidentiality', status: 'compliant', score: 95 },
        { name: 'Privacy', status: 'partial', score: 89 }
      ]
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      status: 'partial',
      score: 87,
      lastAssessment: '2024-01-10',
      nextAssessment: '2024-04-10',
      requirements: {
        total: 42,
        compliant: 34,
        pending: 6,
        failed: 2
      },
      categories: [
        { name: 'Data Rights', status: 'compliant', score: 92 },
        { name: 'Data Processing', status: 'partial', score: 85 },
        { name: 'Data Protection', status: 'compliant', score: 90 },
        { name: 'Breach Notification', status: 'partial', score: 82 }
      ]
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'Information Security Management System',
      status: 'pending',
      score: 76,
      lastAssessment: '2023-12-20',
      nextAssessment: '2024-03-20',
      requirements: {
        total: 114,
        compliant: 82,
        pending: 24,
        failed: 8
      },
      categories: [
        { name: 'Information Security Policies', status: 'compliant', score: 95 },
        { name: 'Access Control', status: 'partial', score: 78 },
        { name: 'Cryptography', status: 'non_compliant', score: 65 },
        { name: 'Physical Security', status: 'compliant', score: 88 },
        { name: 'Operations Security', status: 'partial', score: 72 }
      ]
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard',
      status: 'compliant',
      score: 91,
      lastAssessment: '2024-01-08',
      nextAssessment: '2024-07-08',
      requirements: {
        total: 78,
        compliant: 69,
        pending: 7,
        failed: 2
      },
      categories: [
        { name: 'Network Security', status: 'compliant', score: 94 },
        { name: 'Cardholder Data Protection', status: 'compliant', score: 92 },
        { name: 'Vulnerability Management', status: 'partial', score: 86 },
        { name: 'Access Control', status: 'compliant', score: 93 }
      ]
    }
  ];

  const securityControls: SecurityControl[] = [
    {
      id: 'ctrl_001',
      name: 'Multi-Factor Authentication',
      category: 'Access Control',
      status: 'implemented',
      effectiveness: 95,
      lastTested: '2024-01-20',
      nextReview: '2024-02-20',
      owner: 'IT Security Team',
      description: 'Mandatory MFA for all user accounts accessing sensitive data',
      evidence: ['MFA Policy Document', 'Implementation Screenshots', 'Test Results']
    },
    {
      id: 'ctrl_002',
      name: 'Data Encryption at Rest',
      category: 'Data Protection',
      status: 'implemented',
      effectiveness: 98,
      lastTested: '2024-01-18',
      nextReview: '2024-02-18',
      owner: 'Data Security Team',
      description: 'AES-256 encryption for all stored sensitive data',
      evidence: ['Encryption Configuration', 'Key Management Procedures', 'Audit Reports']
    },
    {
      id: 'ctrl_003',
      name: 'Vulnerability Scanning',
      category: 'Vulnerability Management',
      status: 'partial',
      effectiveness: 82,
      lastTested: '2024-01-15',
      nextReview: '2024-02-01',
      owner: 'Security Operations',
      description: 'Regular automated vulnerability scans of all systems',
      evidence: ['Scan Reports', 'Remediation Plans']
    },
    {
      id: 'ctrl_004',
      name: 'Incident Response Plan',
      category: 'Incident Management',
      status: 'implemented',
      effectiveness: 88,
      lastTested: '2024-01-12',
      nextReview: '2024-02-15',
      owner: 'CISO Office',
      description: 'Comprehensive incident response and recovery procedures',
      evidence: ['IR Playbooks', 'Training Records', 'Test Exercises']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'implemented':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'partial':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'non_compliant':
      case 'not_implemented':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
      case 'not_applicable':
        return 'text-slate-400 bg-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const overallComplianceScore = Math.round(
    complianceFrameworks.reduce((sum, framework) => sum + framework.score, 0) / complianceFrameworks.length
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor regulatory compliance and security posture across frameworks</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'frameworks', label: 'Frameworks', icon: Shield },
          { id: 'controls', label: 'Security Controls', icon: Lock },
          { id: 'assessments', label: 'Assessments', icon: FileText },
          { id: 'reports', label: 'Reports', icon: Download }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-blue-600/20 text-blue-400 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Overall Compliance</p>
                  <p className={`text-2xl font-bold mt-1 ${getScoreColor(overallComplianceScore)}`}>
                    {overallComplianceScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Frameworks</p>
                  <p className="text-2xl font-bold text-white mt-1">4</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Security Controls</p>
                  <p className="text-2xl font-bold text-white mt-1">47</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Open Findings</p>
                  <p className="text-2xl font-bold text-white mt-1">23</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </ParscadeCard>
          </div>

          {/* Compliance Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Framework Status</h3>
              <div className="space-y-4">
                {complianceFrameworks.map((framework) => (
                  <div key={framework.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        framework.status === 'compliant' ? 'bg-emerald-500/20' :
                        framework.status === 'partial' ? 'bg-yellow-500/20' :
                        framework.status === 'pending' ? 'bg-blue-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <Shield className={`w-5 h-5 ${
                          framework.status === 'compliant' ? 'text-emerald-400' :
                          framework.status === 'partial' ? 'text-yellow-400' :
                          framework.status === 'pending' ? 'text-blue-400' :
                          'text-red-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{framework.name}</p>
                        <p className="text-xs text-slate-400">Last assessed: {framework.lastAssessment}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(framework.score)}`}>
                          {framework.score}%
                        </p>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(framework.status)}`}>
                          {framework.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compliance Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">SOC 2 Score (6 months)</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">+8%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">GDPR Score (6 months)</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">+5%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-yellow-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">ISO 27001 Score (6 months)</span>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">-3%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-orange-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </ParscadeCard>
          </div>

          {/* Recent Activity & Upcoming Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Compliance Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">SOC 2 Audit Completed</p>
                    <p className="text-xs text-slate-400">94% compliance score achieved • 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-white">GDPR Privacy Review</p>
                    <p className="text-xs text-slate-400">6 findings require remediation • 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">ISO 27001 Assessment Started</p>
                    <p className="text-xs text-slate-400">External auditor began review process • 1 week ago</p>
                  </div>
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Assessments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">ISO 27001 Review</p>
                      <p className="text-xs text-slate-400">External audit assessment</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-400 font-medium">Mar 20</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-white">GDPR Quarterly Review</p>
                      <p className="text-xs text-slate-400">Internal compliance check</p>
                    </div>
                  </div>
                  <span className="text-sm text-purple-400 font-medium">Apr 10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-white">SOC 2 Mid-Year Review</p>
                      <p className="text-xs text-slate-400">Continuous monitoring check</p>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-400 font-medium">Jul 15</span>
                </div>
              </div>
            </ParscadeCard>
          </div>
        </div>
      )}

      {activeTab === 'frameworks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework) => (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{framework.name}</h3>
                      <p className="text-sm text-slate-400 mb-3">{framework.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(framework.status)}`}>
                          {framework.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-lg font-bold ${getScoreColor(framework.score)}`}>
                          {framework.score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Requirements</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-400">Compliant</span>
                          <span className="text-white">{framework.requirements.compliant}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-yellow-400">Pending</span>
                          <span className="text-white">{framework.requirements.pending}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-400">Failed</span>
                          <span className="text-white">{framework.requirements.failed}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Assessment</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last</span>
                          <span className="text-white">{framework.lastAssessment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Next</span>
                          <span className="text-white">{framework.nextAssessment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Category Breakdown</p>
                    {framework.categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getScoreColor(category.score)}`}>
                            {category.score}%
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            category.status === 'compliant' ? 'bg-emerald-500' :
                            category.status === 'partial' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'controls' && (
        <div className="space-y-4">
          {securityControls.map((control) => (
            <motion.div
              key={control.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParscadeCard className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        control.status === 'implemented' ? 'bg-emerald-500/20' :
                        control.status === 'partial' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <Lock className={`w-5 h-5 ${
                          control.status === 'implemented' ? 'text-emerald-400' :
                          control.status === 'partial' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{control.name}</h3>
                        <p className="text-sm text-slate-400">{control.category}</p>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">{control.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(control.status)}`}>
                          {control.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Effectiveness</p>
                        <p className={`text-sm font-medium ${getScoreColor(control.effectiveness)}`}>
                          {control.effectiveness}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Tested</p>
                        <p className="text-sm text-white">{control.lastTested}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Next Review</p>
                        <p className="text-sm text-white">{control.nextReview}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Owner</p>
                        <p className="text-sm text-white">{control.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Evidence</p>
                        <div className="flex space-x-1">
                          {control.evidence.slice(0, 3).map((_, index) => (
                            <FileText key={index} className="w-4 h-4 text-blue-400" />
                          ))}
                          {control.evidence.length > 3 && (
                            <span className="text-xs text-slate-400">+{control.evidence.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ParscadeCard>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Assessment Schedule</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Upcoming Assessments</h4>
                <div className="space-y-3">
                  {[
                    { framework: 'ISO 27001', date: '2024-03-20', type: 'External Audit', status: 'scheduled' },
                    { framework: 'GDPR', date: '2024-04-10', type: 'Internal Review', status: 'scheduled' },
                    { framework: 'SOC 2', date: '2024-07-15', type: 'Continuous Monitoring', status: 'scheduled' }
                  ].map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{assessment.framework}</p>
                        <p className="text-xs text-slate-400">{assessment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{assessment.date}</p>
                        <ParscadeStatusBadge status={assessment.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Recent Assessments</h4>
                <div className="space-y-3">
                  {[
                    { framework: 'SOC 2', date: '2024-01-15', type: 'Type II Audit', result: '94%' },
                    { framework: 'PCI DSS', date: '2024-01-08', type: 'Annual Assessment', result: '91%' },
                    { framework: 'GDPR', date: '2024-01-10', type: 'Privacy Review', result: '87%' }
                  ].map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{assessment.framework}</p>
                        <p className="text-xs text-slate-400">{assessment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getScoreColor(parseInt(assessment.result))}`}>
                          {assessment.result}
                        </p>
                        <p className="text-xs text-slate-400">{assessment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Executive Summary', description: 'High-level compliance overview for leadership', format: 'PDF', frameworks: ['All'] },
                { name: 'SOC 2 Readiness', description: 'Detailed SOC 2 compliance status and recommendations', format: 'PDF', frameworks: ['SOC 2'] },
                { name: 'GDPR Compliance Status', description: 'Privacy and data protection compliance report', format: 'PDF', frameworks: ['GDPR'] },
                { name: 'Security Controls Matrix', description: 'Complete security controls implementation status', format: 'Excel', frameworks: ['All'] },
                { name: 'Risk Assessment Report', description: 'Compliance risk analysis and mitigation strategies', format: 'PDF', frameworks: ['All'] },
                { name: 'Audit Trail Export', description: 'Complete audit logs for compliance evidence', format: 'CSV', frameworks: ['All'] }
              ].map((report) => (
                <div key={report.name} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div>
                      <h4 className="font-medium text-white">{report.name}</h4>
                      <p className="text-xs text-slate-400">{report.format} • {report.frameworks.join(', ')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{report.description}</p>
                  <ParscadeButton size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </ParscadeButton>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default ComplianceDashboardPage;