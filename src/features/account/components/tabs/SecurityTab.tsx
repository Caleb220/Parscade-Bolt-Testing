/**
 * Security Tab Component - Enhanced with Backend Integration
 * Comprehensive security management with API keys, sessions, and security events
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Copy, 
  Trash2, 
  Plus, 
  Smartphone, 
  Monitor,
  Shield,
  RefreshCw,
  AlertCircle as AlertIcon,
  CheckCircle
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import StatusBadge from '@/shared/components/ui/status-badge';
import { formatUserAgent, formatDate } from '@/shared/utils/formatters';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { useAccountContext } from '../AccountLayout';
import { 
  useApiKeys, 
  useCreateApiKey, 
  useRevokeApiKey,
  useSessions,
  useRevokeSession,
  useSecurityEvents
} from '@/shared/hooks/api/useAccountData';
import { apiKeySchema, type ApiKeyFormData } from '@/lib/validation/account';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const SecurityTab: React.FC = () => {
  const { user } = useAccountContext();
  const { copy } = useClipboard();
  
  const { data: apiKeys, isLoading: keysLoading, error: keysError, refetch: refetchKeys } = useApiKeys();
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions();
  const { data: securityEvents, isLoading: eventsLoading, error: eventsError } = useSecurityEvents();
  
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const revokeSession = useRevokeSession();

  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<{ key: string; name: string } | null>(null);
  const [confirmRevokeKey, setConfirmRevokeKey] = useState<string | null>(null);
  const [confirmRevokeSession, setConfirmRevokeSession] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      scopes: ['read'],
    },
  });

  const onCreateApiKey = async (data: ApiKeyFormData) => {
    try {
      const result = await createApiKey.mutateAsync(data);
      setNewKeyResult({ key: result.key, name: result.name });
      reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCreateApiKey = async () => {
    // This function is now replaced by the form submission
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      await revokeApiKey.mutateAsync(keyId);
      setConfirmRevokeKey(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    
    try {
      await revokeSession.mutateAsync(sessionId);
      setConfirmRevokeSession(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access to Parscade
          </CardDescription>
          <div className="mt-4">
            <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for accessing Parscade programmatically
                  </DialogDescription>
                </DialogHeader>
                
                {newKeyResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">API Key Created</span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Copy this key now - it won't be shown again for security reasons.
                      </p>
                      <div className="space-y-2">
                        <Label>Key Name: {newKeyResult.name}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newKeyResult.key}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => copy(newKeyResult.key, 'API key')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setNewKeyResult(null);
                        setShowNewKeyDialog(false);
                      }}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onCreateApiKey)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="key_name">Key Name</Label>
                      <Input
                        id="key_name"
                        {...register('name')}
                        placeholder="Production API, Development, etc."
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Scopes</Label>
                      <div className="space-y-2">
                        {[
                          { value: 'read', label: 'Read', description: 'View documents and data' },
                          { value: 'write', label: 'Write', description: 'Create and update data' },
                          { value: 'admin', label: 'Admin', description: 'Full administrative access' },
                        ].map((scope) => (
                          <label key={scope.value} className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              value={scope.value}
                              {...register('scopes')}
                              className="rounded border-gray-300 mt-1"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{scope.label}</span>
                              <p className="text-xs text-gray-500">{scope.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.scopes && (
                        <p className="text-sm text-red-600">{errors.scopes.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewKeyDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createApiKey.isPending}>
                        {createApiKey.isPending ? 'Creating...' : 'Create Key'}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {keysLoading && !apiKeys ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : keysError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 mb-4">{getErrorMessage(keysError)}</p>
              <Button variant="outline" onClick={() => refetchKeys()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : !apiKeys || !Array.isArray(apiKeys) || apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys configured</h3>
              <p className="text-gray-600 mb-4">
                API keys allow you to access Parscade programmatically. Create your first API key to get started with our REST API.
              </p>
              <Button size="sm" onClick={() => setShowNewKeyDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {(apiKeys || []).map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{key?.name || 'Unnamed Key'}</h4>
                      <div className="flex space-x-1">
                        {(key?.scopes || []).map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {key?.created_at ? formatDate(key.created_at) : 'Unknown'}</span>
                      {key?.last_used_at && (
                        <span>Last used {formatDate(key.last_used_at)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        value={key?.preview ? `...${key.preview}` : '••••••••'}
                        readOnly
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copy(key?.preview ? `...${key.preview}` : '', 'API key preview')}
                        disabled={!key?.preview}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmRevokeKey(key?.id || '')}
                    disabled={revokeApiKey.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={!!confirmRevokeKey}
        onClose={() => setConfirmRevokeKey(null)}
        onConfirm={() => {
          if (confirmRevokeKey) handleRevokeApiKey(confirmRevokeKey);
        }}
        title="Revoke API Key"
        description="Are you sure you want to revoke this API key? This action cannot be undone."
        confirmText="Revoke Key"
        variant="destructive"
        isLoading={revokeApiKey.isPending}
      />

      <ConfirmationDialog
        isOpen={!!confirmRevokeSession}
        onClose={() => setConfirmRevokeSession(null)}
        onConfirm={() => {
          if (confirmRevokeSession) handleRevokeSession(confirmRevokeSession);
        }}
        title="Revoke Session"
        description="Are you sure you want to revoke this session? The user will be signed out from that device."
        confirmText="Revoke Session"
        variant="destructive"
        isLoading={revokeSession.isPending}
      />

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage devices and sessions that have access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading && !sessions ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : sessionsError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600">{getErrorMessage(sessionsError)}</p>
            </div>
          ) : !sessions || !Array.isArray(sessions) || sessions.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active sessions</h3>
              <p className="text-gray-600 mb-4">
                Active sessions show devices and browsers that are currently signed in to your account. 
                Your current session will appear here once additional sessions are created.
              </p>
              <p className="text-sm text-gray-500">
                Sign in from another device or browser to see multiple sessions listed here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(sessions || []).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {session?.user_agent?.includes('Mobile') ? (
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {session?.user_agent ? formatUserAgent(session.user_agent) : 'Unknown Device'}
                        </span>
                        {session?.is_current && (
                          <StatusBadge status="active" className="text-xs" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session?.ip_address || 'Unknown IP'} • Last seen {session?.last_seen ? formatDate(session.last_seen) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                  {!session?.is_current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmRevokeSession(session?.id || '')}
                      disabled={revokeSession.isPending}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Recent security-related activities on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading && !securityEvents ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : eventsError ? (
            <div className="text-center py-8">
              <AlertIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600">{getErrorMessage(eventsError)}</p>
            </div>
          ) : !securityEvents || !Array.isArray(securityEvents) || securityEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security events recorded</h3>
              <p className="text-gray-600 mb-2">
                Security events track important account activities like sign-ins, password changes, and API key usage.
              </p>
              <p className="text-sm text-gray-500">
                Recent security activities will appear here as they occur.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(securityEvents || []).map((event) => (
                <div key={event?.id || Math.random()} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {event?.event_type ? event.event_type.replace(/_/g, ' ') : 'Security Event'}
                    </p>
                    <p className="text-sm text-gray-600">{event?.description || 'No description available'}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <span>{event?.created_at ? formatDate(event.created_at) : 'Unknown time'}</span>
                      {event?.ip_address && <span>• {event.ip_address}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityTab;