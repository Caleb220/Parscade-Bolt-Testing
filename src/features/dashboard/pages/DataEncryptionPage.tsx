import { motion } from 'framer-motion';
import {
  Lock,
  Shield,
  Key,
  Database,
  FileText,
  Server,
  Cloud,
  Globe,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  HardDrive,
  Network,
  Archive,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import React, { useState } from 'react';

import ParscadeButton from '@/shared/components/brand/ParscadeButton';
import ParscadeCard from '@/shared/components/brand/ParscadeCard';
import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge';

interface EncryptionPolicy {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  keyLength: number;
  status: 'active' | 'inactive' | 'deprecated';
  dataTypes: string[];
  coverage: number;
  lastRotation: string;
  nextRotation: string;
  complianceFrameworks: string[];
}

interface EncryptedResource {
  id: string;
  name: string;
  type: 'database' | 'file' | 'backup' | 'communication';
  encryptionStatus: 'encrypted' | 'partial' | 'unencrypted';
  algorithm: string;
  keyId: string;
  dataSize: string;
  lastEncrypted: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface CryptographicKey {
  id: string;
  name: string;
  algorithm: string;
  keyLength: number;
  purpose: string;
  status: 'active' | 'rotated' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  usageCount: number;
  associatedResources: number;
}

const DataEncryptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'resources' | 'keys' | 'compliance'>('overview');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('all');
  const [showKeyDetails, setShowKeyDetails] = useState<string | null>(null);

  const encryptionPolicies: EncryptionPolicy[] = [
    {
      id: 'policy_001',
      name: 'Financial Data Encryption',
      description: 'AES-256 encryption for all financial records and transactions',
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      status: 'active',
      dataTypes: ['Financial Records', 'Payment Data', 'Tax Documents'],
      coverage: 98,
      lastRotation: '2024-01-15',
      nextRotation: '2024-04-15',
      complianceFrameworks: ['PCI DSS', 'SOX', 'GDPR']
    },
    {
      id: 'policy_002',
      name: 'Personal Data Protection',
      description: 'End-to-end encryption for personally identifiable information',
      algorithm: 'AES-256-CBC',
      keyLength: 256,
      status: 'active',
      dataTypes: ['Customer Data', 'Employee Records', 'Medical Information'],
      coverage: 95,
      lastRotation: '2024-01-10',
      nextRotation: '2024-04-10',
      complianceFrameworks: ['GDPR', 'HIPAA', 'CCPA']
    },
    {
      id: 'policy_003',
      name: 'Communication Encryption',
      description: 'TLS 1.3 and RSA-4096 for all data in transit',
      algorithm: 'RSA-4096',
      keyLength: 4096,
      status: 'active',
      dataTypes: ['API Communications', 'Email', 'File Transfers'],
      coverage: 100,
      lastRotation: '2024-01-20',
      nextRotation: '2024-07-20',
      complianceFrameworks: ['SOC 2', 'ISO 27001', 'NIST']
    },
    {
      id: 'policy_004',
      name: 'Legacy Data Encryption',
      description: 'Deprecated AES-128 policy for legacy system compatibility',
      algorithm: 'AES-128-CBC',
      keyLength: 128,
      status: 'deprecated',
      dataTypes: ['Legacy Systems', 'Archived Data'],
      coverage: 23,
      lastRotation: '2023-10-15',
      nextRotation: '2024-02-15',
      complianceFrameworks: ['SOC 2']
    }
  ];

  const encryptedResources: EncryptedResource[] = [
    {
      id: 'res_001',
      name: 'Customer Database',
      type: 'database',
      encryptionStatus: 'encrypted',
      algorithm: 'AES-256-GCM',
      keyId: 'key_001',
      dataSize: '2.4 TB',
      lastEncrypted: '2024-01-24 00:00:00',
      location: 'Primary Data Center',
      riskLevel: 'high'
    },
    {
      id: 'res_002',
      name: 'Financial Reports Archive',
      type: 'file',
      encryptionStatus: 'encrypted',
      algorithm: 'AES-256-CBC',
      keyId: 'key_002',
      dataSize: '847 GB',
      lastEncrypted: '2024-01-23 23:45:00',
      location: 'Cloud Storage',
      riskLevel: 'critical'
    },
    {
      id: 'res_003',
      name: 'Email Communications',
      type: 'communication',
      encryptionStatus: 'encrypted',
      algorithm: 'RSA-4096',
      keyId: 'key_003',
      dataSize: '156 GB',
      lastEncrypted: '2024-01-24 15:30:00',
      location: 'Email Servers',
      riskLevel: 'medium'
    },
    {
      id: 'res_004',
      name: 'Legacy System Backup',
      type: 'backup',
      encryptionStatus: 'partial',
      algorithm: 'AES-128-CBC',
      keyId: 'key_004',
      dataSize: '1.2 TB',
      lastEncrypted: '2024-01-20 02:00:00',
      location: 'Backup Facility',
      riskLevel: 'medium'
    },
    {
      id: 'res_005',
      name: 'Development Documents',
      type: 'file',
      encryptionStatus: 'unencrypted',
      algorithm: 'None',
      keyId: 'None',
      dataSize: '45 GB',
      lastEncrypted: 'Never',
      location: 'Development Servers',
      riskLevel: 'low'
    }
  ];

  const cryptographicKeys: CryptographicKey[] = [
    {
      id: 'key_001',
      name: 'Customer-DB-Primary-Key',
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      purpose: 'Database Encryption',
      status: 'active',
      createdAt: '2024-01-15',
      expiresAt: '2024-04-15',
      lastUsed: '2024-01-24 15:30:00',
      usageCount: 245678,
      associatedResources: 3
    },
    {
      id: 'key_002',
      name: 'Financial-Archive-Key',
      algorithm: 'AES-256-CBC',
      keyLength: 256,
      purpose: 'File Encryption',
      status: 'active',
      createdAt: '2024-01-10',
      expiresAt: '2024-04-10',
      lastUsed: '2024-01-23 23:45:00',
      usageCount: 156890,
      associatedResources: 5
    },
    {
      id: 'key_003',
      name: 'Communication-TLS-Key',
      algorithm: 'RSA-4096',
      keyLength: 4096,
      purpose: 'Transport Encryption',
      status: 'active',
      createdAt: '2024-01-20',
      expiresAt: '2024-07-20',
      lastUsed: '2024-01-24 15:45:00',
      usageCount: 892345,
      associatedResources: 12
    },
    {
      id: 'key_004',
      name: 'Legacy-Backup-Key',
      algorithm: 'AES-128-CBC',
      keyLength: 128,
      purpose: 'Backup Encryption',
      status: 'rotated',
      createdAt: '2023-10-15',
      expiresAt: '2024-01-15',
      lastUsed: '2024-01-20 02:00:00',
      usageCount: 45678,
      associatedResources: 2
    }
  ];

  const getEncryptionStatusColor = (status: string) => {
    switch (status) {
      case 'encrypted': return 'text-emerald-400 bg-emerald-500/20';
      case 'partial': return 'text-yellow-400 bg-yellow-500/20';
      case 'unencrypted': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'file': return FileText;
      case 'backup': return Archive;
      case 'communication': return Network;
      default: return Shield;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const overallEncryptionCoverage = Math.round(
    encryptionPolicies
      .filter(p => p.status === 'active')
      .reduce((sum, policy) => sum + policy.coverage, 0) /
    encryptionPolicies.filter(p => p.status === 'active').length
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Encryption</h1>
          <p className="text-slate-400 mt-1">Manage cryptographic policies, keys, and encrypted data protection</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <ParscadeButton variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Rotate Keys
          </ParscadeButton>
          <ParscadeButton variant="primary">
            <Key className="w-4 h-4 mr-2" />
            Generate Key
          </ParscadeButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'policies', label: 'Encryption Policies', icon: Settings },
          { id: 'resources', label: 'Encrypted Resources', icon: Database },
          { id: 'keys', label: 'Key Management', icon: Key },
          { id: 'compliance', label: 'Compliance Status', icon: CheckCircle }
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
                  <p className="text-sm text-slate-400">Encryption Coverage</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{overallEncryptionCoverage}%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Keys</p>
                  <p className="text-2xl font-bold text-white mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Encrypted Data</p>
                  <p className="text-2xl font-bold text-white mt-1">4.8 TB</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Keys Expiring</p>
                  <p className="text-2xl font-bold text-white mt-1">3</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </ParscadeCard>
          </div>

          {/* Encryption Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Encryption by Data Type</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Financial Data</span>
                  <span className="text-sm font-medium text-emerald-400">98% encrypted</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Personal Data</span>
                  <span className="text-sm font-medium text-emerald-400">95% encrypted</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Communications</span>
                  <span className="text-sm font-medium text-emerald-400">100% encrypted</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Legacy Systems</span>
                  <span className="text-sm font-medium text-yellow-400">23% encrypted</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-yellow-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '23%' }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Algorithm Distribution</h3>
              <div className="space-y-3">
                {[
                  { algorithm: 'AES-256-GCM', percentage: 45, color: 'bg-blue-500' },
                  { algorithm: 'AES-256-CBC', percentage: 32, color: 'bg-emerald-500' },
                  { algorithm: 'RSA-4096', percentage: 18, color: 'bg-purple-500' },
                  { algorithm: 'AES-128-CBC', percentage: 5, color: 'bg-amber-500' }
                ].map((item) => (
                  <div key={item.algorithm} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-white">{item.algorithm}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </ParscadeCard>
          </div>

          {/* Recent Activity */}
          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Encryption Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <Key className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">New encryption key generated</p>
                  <p className="text-xs text-slate-400">Customer-DB-Secondary-Key created • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Key rotation completed</p>
                  <p className="text-xs text-slate-400">Financial-Archive-Key rotated successfully • 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">Policy updated</p>
                  <p className="text-xs text-slate-400">Personal Data Protection policy enhanced • 1 day ago</p>
                </div>
              </div>
            </div>
          </ParscadeCard>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {encryptionPolicies.map((policy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{policy.name}</h3>
                        <ParscadeStatusBadge status={policy.status} />
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{policy.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Algorithm</p>
                      <p className="text-white font-mono">{policy.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Key Length</p>
                      <p className="text-white">{policy.keyLength} bits</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Coverage</p>
                      <p className="text-sm font-medium text-white">{policy.coverage}%</p>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          policy.coverage >= 90 ? 'bg-emerald-500' :
                          policy.coverage >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${policy.coverage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">Data Types</p>
                    <div className="flex flex-wrap gap-2">
                      {policy.dataTypes.map((type) => (
                        <span key={type} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">Compliance Frameworks</p>
                    <div className="flex flex-wrap gap-2">
                      {policy.complianceFrameworks.map((framework) => (
                        <span key={framework} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>Last rotation: {policy.lastRotation}</span>
                    <span>Next rotation: {policy.nextRotation}</span>
                  </div>

                  <div className="flex space-x-2">
                    <ParscadeButton variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </ParscadeButton>
                    <ParscadeButton size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </ParscadeButton>
                  </div>
                </ParscadeCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-4">
          {encryptedResources.map((resource) => {
            const TypeIcon = getResourceTypeIcon(resource.type);
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParscadeCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-blue-400" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{resource.name}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEncryptionStatusColor(resource.encryptionStatus)}`}>
                            {resource.encryptionStatus.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskLevelColor(resource.riskLevel)}`}>
                            {resource.riskLevel.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Algorithm</p>
                            <p className="text-white font-mono text-sm">{resource.algorithm}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Data Size</p>
                            <p className="text-white text-sm">{resource.dataSize}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Location</p>
                            <p className="text-white text-sm">{resource.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Encrypted</p>
                            <p className="text-white text-sm">{resource.lastEncrypted}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Key className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400">Key: {resource.keyId}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Database className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 capitalize">Type: {resource.type.replace('_', ' ')}</span>
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
                      {resource.encryptionStatus !== 'encrypted' && (
                        <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors">
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </ParscadeCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-4">
          {cryptographicKeys.map((key) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParscadeCard className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      key.status === 'active' ? 'bg-emerald-500/20' :
                      key.status === 'rotated' ? 'bg-blue-500/20' :
                      key.status === 'expired' ? 'bg-red-500/20' :
                      'bg-slate-500/20'
                    }`}>
                      <Key className={`w-6 h-6 ${
                        key.status === 'active' ? 'text-emerald-400' :
                        key.status === 'rotated' ? 'text-blue-400' :
                        key.status === 'expired' ? 'text-red-400' :
                        'text-slate-400'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {showKeyDetails === key.id ? key.name : `${key.name.substring(0, 20)}...`}
                        </h3>
                        <ParscadeStatusBadge status={key.status} />
                        <button
                          onClick={() => setShowKeyDetails(showKeyDetails === key.id ? null : key.id)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {showKeyDetails === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Algorithm</p>
                          <p className="text-white font-mono text-sm">{key.algorithm}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Key Length</p>
                          <p className="text-white text-sm">{key.keyLength} bits</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Purpose</p>
                          <p className="text-white text-sm">{key.purpose}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Usage Count</p>
                          <p className="text-white text-sm">{key.usageCount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Created</p>
                          <p className="text-white text-sm">{key.createdAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Expires</p>
                          <p className="text-white text-sm">{key.expiresAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Used</p>
                          <p className="text-white text-sm">{key.lastUsed}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">
                            {key.associatedResources} associated resources
                          </span>
                        </div>
                        {new Date(key.expiresAt) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400">Expires soon</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    {key.status === 'active' && (
                      <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </ParscadeCard>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['GDPR', 'SOC 2', 'PCI DSS'].map((framework) => (
              <ParscadeCard key={framework} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{framework}</h3>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Encryption Requirements</span>
                    <span className="text-emerald-400">Met</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Key Management</span>
                    <span className="text-emerald-400">Compliant</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Data Protection</span>
                    <span className="text-emerald-400">Verified</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Audit</span>
                    <span className="text-white">Jan 15, 2024</span>
                  </div>
                </div>
              </ParscadeCard>
            ))}
          </div>

          <ParscadeCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Requirements Status</h3>
            <div className="space-y-4">
              {[
                { requirement: 'Data Encryption at Rest', status: 'compliant', frameworks: ['GDPR', 'SOC 2', 'PCI DSS'] },
                { requirement: 'Data Encryption in Transit', status: 'compliant', frameworks: ['SOC 2', 'PCI DSS'] },
                { requirement: 'Key Rotation Policies', status: 'compliant', frameworks: ['GDPR', 'SOC 2'] },
                { requirement: 'Access Control to Keys', status: 'partial', frameworks: ['PCI DSS'] },
                { requirement: 'Encryption Audit Logging', status: 'compliant', frameworks: ['GDPR', 'SOC 2', 'PCI DSS'] }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{item.requirement}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.frameworks.map((framework) => (
                        <span key={framework} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status === 'compliant' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.status === 'compliant' ? 'text-emerald-400' : 'text-yellow-400'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ParscadeCard>
        </div>
      )}
    </div>
  );
};

export default DataEncryptionPage;