/**
 * Team Management Dashboard Page - User Administration
 * Admin-only team management and user administration
 */

import { motion } from 'framer-motion';
import { Users, Plus, Settings, Crown, Mail, MoreVertical, UserPlus, Shield } from 'lucide-react';
import React, { useState } from 'react';

import { ParscadeCard } from '@/shared/components/brand';
import CustomButton from '@/shared/components/forms/CustomButton';
import FeatureGate from '@/shared/components/layout/FeatureGate';

import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardSection from '../components/ui/DashboardSection';

/**
 * Team management page for admin users
 */
const TeamPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'user'>('all');

  const teamMembers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@parscade.com',
      role: 'admin' as const,
      status: 'active' as const,
      lastActive: '2 hours ago',
      joinedDate: '2024-01-15',
      avatar: null,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@parscade.com',
      role: 'user' as const,
      status: 'active' as const,
      lastActive: '1 day ago',
      joinedDate: '2024-02-20',
      avatar: null,
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@parscade.com',
      role: 'user' as const,
      status: 'pending' as const,
      lastActive: 'Never',
      joinedDate: '2024-03-10',
      avatar: null,
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@parscade.com',
      role: 'admin' as const,
      status: 'active' as const,
      lastActive: '30 minutes ago',
      joinedDate: '2024-01-20',
      avatar: null,
    },
  ];

  const filteredMembers = teamMembers.filter(member => {
    if (selectedRole === 'all') return true;
    return member.role === selectedRole;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <FeatureGate
        requiredRole="admin"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <ParscadeCard className="p-12 text-center max-w-md">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
              <p className="text-gray-600">
                You need administrator privileges to access team management.
              </p>
            </ParscadeCard>
          </div>
        }
      >
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
              <p className="text-gray-600">Manage team members, roles, and permissions</p>
            </div>

            <CustomButton variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
              Invite Member
            </CustomButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <ParscadeCard className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg mr-4">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.role === 'admin').length}
                  </p>
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </ParscadeCard>

            <ParscadeCard className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.status === 'pending').length}
                  </p>
                </div>
              </div>
            </ParscadeCard>
          </motion.div>

          {/* Role Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-b border-gray-200"
          >
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Members' },
                { key: 'admin', label: 'Administrators' },
                { key: 'user', label: 'Users' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedRole(tab.key as typeof selectedRole)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedRole === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Team Members List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {filteredMembers.map((member, index) => (
              <ParscadeCard key={member.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{getInitials(member.name)}</span>
                    </div>

                    {/* Member Info */}
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}
                        >
                          {member.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                          {member.role}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{member.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Last active: {member.lastActive}</span>
                        <span>Joined: {new Date(member.joinedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      leftIcon={<Settings className="w-4 h-4" />}
                    >
                      Edit
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      leftIcon={<MoreVertical className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </ParscadeCard>
            ))}
          </motion.div>

          {/* Invite Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DashboardSection
              title="Invite New Members"
              description="Add team members and manage their access"
            >
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                    <p className="text-gray-600 text-sm">
                      Invite colleagues to collaborate on documents and projects
                    </p>
                  </div>
                  <CustomButton variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                    Send Invitation
                  </CustomButton>
                </div>
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      </FeatureGate>
    </DashboardLayout>
  );
};

export default TeamPage;
