import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Zap, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  Globe,
  Clock,
  Smartphone,
  Key,
  Mail
} from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';

import { useAccountSettings } from '@/features/account/hooks/useAccountSettings';
import { useAuth } from '@/features/auth';
import Button from '@/shared/components/forms/Button';
import Input from '@/shared/components/forms/Input';
import LoadingButton from '@/shared/components/forms/LoadingButton';
import LoadingSpinner from '@/shared/components/forms/LoadingSpinner';
import type {
  AccountSettingsSection,
  IntegrationSettings,
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
  WebhookConfig,
} from '@/shared/schemas';

/**
 * Account Settings Panel Component
 * 
 * ARCHITECTURE:
 * - Tab-based navigation for different settings sections
 * - Real-time form validation with Zod schemas
 * - Optimistic updates with error rollback
 * - Comprehensive loading states and error handling
 * - Responsive design with mobile-first approach
 * 
 * SECURITY:
 * - Sensitive data (API keys) are masked by default
 * - Password changes require current password verification
 * - All updates are validated server-side
 * - Rate limiting on sensitive operations
 */

const AccountSettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    settings,
    isLoading,
    error,
    savingSection,
    saveProfile,
    saveSecurity,
    saveNotifications,
    saveIntegrations,
  } = useAccountSettings({
    userId: user?.id,
    email: user?.email,
    fullName: user?.user_metadata?.full_name,
  });

  const [activeTab, setActiveTab] = useState<AccountSettingsSection>('profile');
  const [showApiKeys, setShowApiKeys] = useState({ production: false, development: false });
  const [editingWebhook, setEditingWebhook] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({});

  // Form state for each section
  const [profileForm, setProfileForm] = useState<ProfileSettings | null>(null);
  const [securityForm, setSecurityForm] = useState<SecuritySettings | null>(null);
  const [notificationsForm, setNotificationsForm] = useState<NotificationSettings | null>(null);
  const [integrationsForm, setIntegrationsForm] = useState<IntegrationSettings | null>(null);

  // Initialize forms when settings load
  React.useEffect(() => {
    if (settings) {
      setProfileForm(settings.profile);
      setSecurityForm(settings.security);
      setNotificationsForm(settings.notifications);
      setIntegrationsForm(settings.integrations);
    }
  }, [settings]);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'integrations' as const, label: 'Integrations', icon: Zap },
  ];

  const handleSaveSection = useCallback(async (section: AccountSettingsSection) => {
    try {
      switch (section) {
        case 'profile':
          if (profileForm) await saveProfile(profileForm);
          break;
        case 'security':
          if (securityForm) await saveSecurity(securityForm);
          break;
        case 'notifications':
          if (notificationsForm) await saveNotifications(notificationsForm);
          break;
        case 'integrations':
          if (integrationsForm) await saveIntegrations(integrationsForm);
          break;
      }
    } catch (error) {
      console.error(`Failed to save ${section}:`, error);
    }
  }, [profileForm, securityForm, notificationsForm, integrationsForm, saveProfile, saveSecurity, saveNotifications, saveIntegrations]);

  const handleAddWebhook = useCallback(() => {
    if (!integrationsForm || !newWebhook.name || !newWebhook.url) return;

    const webhook: WebhookConfig = {
      id: `webhook-${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      status: 'active',
      description: newWebhook.description || '',
    };

    setIntegrationsForm({
      ...integrationsForm,
      webhookConfigs: [...integrationsForm.webhookConfigs, webhook],
    });

    setNewWebhook({});
  }, [integrationsForm, newWebhook]);

  const handleRemoveWebhook = useCallback((webhookId: string) => {
    if (!integrationsForm) return;

    setIntegrationsForm({
      ...integrationsForm,
      webhookConfigs: integrationsForm.webhookConfigs.filter(w => w.id !== webhookId),
    });
  }, [integrationsForm]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" className="mr-4" />
            <span className="text-gray-600">Loading account settings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Failed to load account settings: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!settings || !profileForm || !securityForm || !notificationsForm || !integrationsForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-600">
            No settings available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Account settings sections">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {savingSection === id && (
                    <LoadingSpinner size="sm" />
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        leftIcon={<User className="w-5 h-5" />}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                      />
                      <Input
                        label="Phone Number"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        leftIcon={<Smartphone className="w-5 h-5" />}
                      />
                      <Input
                        label="Timezone"
                        value={profileForm.timezone}
                        onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                        leftIcon={<Globe className="w-5 h-5" />}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <LoadingButton
                      onClick={() => handleSaveSection('profile')}
                      isLoading={savingSection === 'profile'}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Profile
                    </LoadingButton>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">SMS Authentication</div>
                            <div className="text-sm text-gray-500">Receive codes via text message</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSecurityForm({ 
                            ...securityForm, 
                            smsTwoFactorEnabled: !securityForm.smsTwoFactorEnabled 
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securityForm.smsTwoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securityForm.smsTwoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Key className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">Authenticator App</div>
                            <div className="text-sm text-gray-500">Use Google Authenticator or similar</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSecurityForm({ 
                            ...securityForm, 
                            authenticatorAppEnabled: !securityForm.authenticatorAppEnabled 
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securityForm.authenticatorAppEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securityForm.authenticatorAppEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium text-gray-900">Production API Key</label>
                          <button
                            onClick={() => setShowApiKeys({ ...showApiKeys, production: !showApiKeys.production })}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showApiKeys.production ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                        <Input
                          type={showApiKeys.production ? 'text' : 'password'}
                          value={securityForm.apiKeys.production}
                          onChange={(e) => setSecurityForm({
                            ...securityForm,
                            apiKeys: { ...securityForm.apiKeys, production: e.target.value }
                          })}
                          placeholder="Enter production API key"
                        />
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium text-gray-900">Development API Key</label>
                          <button
                            onClick={() => setShowApiKeys({ ...showApiKeys, development: !showApiKeys.development })}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showApiKeys.development ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                        <Input
                          type={showApiKeys.development ? 'text' : 'password'}
                          value={securityForm.apiKeys.development}
                          onChange={(e) => setSecurityForm({
                            ...securityForm,
                            apiKeys: { ...securityForm.apiKeys, development: e.target.value }
                          })}
                          placeholder="Enter development API key"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <LoadingButton
                      onClick={() => handleSaveSection('security')}
                      isLoading={savingSection === 'security'}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Security Settings
                    </LoadingButton>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'accountUpdates' as const, label: 'Account Updates', description: 'Security changes, profile updates' },
                        { key: 'productUpdates' as const, label: 'Product Updates', description: 'New features, improvements' },
                        { key: 'marketingEmails' as const, label: 'Marketing Emails', description: 'Newsletter, promotions' },
                        { key: 'teamMemberActivity' as const, label: 'Team Activity', description: 'Team member actions' },
                        { key: 'projectChanges' as const, label: 'Project Changes', description: 'Project updates, status changes' },
                        { key: 'processingAlerts' as const, label: 'Processing Alerts', description: 'Document processing status' },
                        { key: 'errorNotifications' as const, label: 'Error Notifications', description: 'System errors, failures' },
                        { key: 'maintenanceAlerts' as const, label: 'Maintenance Alerts', description: 'Scheduled maintenance' },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-500">{description}</div>
                          </div>
                          <button
                            onClick={() => setNotificationsForm({ 
                              ...notificationsForm, 
                              [key]: !notificationsForm[key] 
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notificationsForm[key] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notificationsForm[key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Frequency</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['real-time', 'daily', 'weekly', 'monthly'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setNotificationsForm({ 
                            ...notificationsForm, 
                            frequency: freq as any 
                          })}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            notificationsForm.frequency === freq
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium capitalize">{freq.replace('-', ' ')}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <Input
                          type="time"
                          value={notificationsForm.quietHours.start}
                          onChange={(e) => setNotificationsForm({
                            ...notificationsForm,
                            quietHours: { ...notificationsForm.quietHours, start: e.target.value }
                          })}
                          leftIcon={<Clock className="w-5 h-5" />}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <Input
                          type="time"
                          value={notificationsForm.quietHours.end}
                          onChange={(e) => setNotificationsForm({
                            ...notificationsForm,
                            quietHours: { ...notificationsForm.quietHours, end: e.target.value }
                          })}
                          leftIcon={<Clock className="w-5 h-5" />}
                        />
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => setNotificationsForm({
                            ...notificationsForm,
                            quietHours: { ...notificationsForm.quietHours, enabled: !notificationsForm.quietHours.enabled }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationsForm.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationsForm.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="ml-3 text-sm text-gray-700">Enable quiet hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <LoadingButton
                      onClick={() => handleSaveSection('notifications')}
                      isLoading={savingSection === 'notifications'}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Notification Settings
                    </LoadingButton>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'slackConnected' as const, label: 'Slack', description: 'Send notifications to Slack channels' },
                        { key: 'teamsConnected' as const, label: 'Microsoft Teams', description: 'Integrate with Teams workflows' },
                        { key: 'zapierConnected' as const, label: 'Zapier', description: 'Connect to 1000+ apps via Zapier' },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-500">{description}</div>
                          </div>
                          <button
                            onClick={() => setIntegrationsForm({ 
                              ...integrationsForm, 
                              [key]: !integrationsForm[key] 
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              integrationsForm[key] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                integrationsForm[key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Webhooks</h3>
                    <div className="space-y-4">
                      {integrationsForm.webhookConfigs.map((webhook) => (
                        <div key={webhook.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{webhook.name}</div>
                              <div className="text-sm text-gray-500">{webhook.url}</div>
                              {webhook.description && (
                                <div className="text-sm text-gray-400 mt-1">{webhook.description}</div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                webhook.status === 'active' ? 'bg-green-100 text-green-800' :
                                webhook.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {webhook.status}
                              </span>
                              <button
                                onClick={() => handleRemoveWebhook(webhook.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Webhook */}
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Webhook Name"
                            value={newWebhook.name || ''}
                            onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                            placeholder="e.g., Processing Complete"
                          />
                          <Input
                            label="Webhook URL"
                            value={newWebhook.url || ''}
                            onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                            placeholder="https://your-app.com/webhook"
                          />
                        </div>
                        <Input
                          label="Description (Optional)"
                          value={newWebhook.description || ''}
                          onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                          placeholder="What does this webhook do?"
                        />
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleAddWebhook}
                            leftIcon={<Plus className="w-4 h-4" />}
                            disabled={!newWebhook.name || !newWebhook.url}
                          >
                            Add Webhook
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <LoadingButton
                      onClick={() => handleSaveSection('integrations')}
                      isLoading={savingSection === 'integrations'}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Integration Settings
                    </LoadingButton>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPanel;