/**
 * Security Tab Component - Enhanced with Backend Integration
 * Comprehensive security management with API keys, sessions, and security events
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Plus, 
  Smartphone, 
  Monitor,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  AlertCircle as AlertIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import { useAccountContext } from '../AccountLayout';
import { 
  useApiKeys, 
  useCreateApiKey, 
  useRevokeApiKey,
  useSessions,
  useRevokeSession,
  useSecurityEvents
} from '@/hooks/api/useAccountData';
import { apiKeySchema, type ApiKeyFormData } from '@/lib/validation/account';
import { getErrorMessage } from '@/lib/api';

const SecurityTab: React.FC = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  
  const { data: apiKeys, isLoading: keysLoading, error: keysError, refetch: refetchKeys } = useApiKeys();
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions();
  const { data: securityEvents, isLoading: eventsLoading, error: eventsError } = useSecurityEvents();
  
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const revokeSession = useRevokeSession();

  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<{ key: string; name: string } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [confirmRevokeKey, setConfirmRevokeKey] = useState<string | null>(null);
  const [confirmRevokeSession, setConfirmRevokeSession] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      scopes: ['read'],
    },
  });

  const watchedScopes = watch('scopes');

  const onCreateApiKey = async (data: ApiKeyFormData) => {
    try {
      const result = await createApiKey.mutateAsync(data);
      setNewKeyResult({ key: result.key, name: result.name });
      reset();
      
      toast({
        title: 'API key created',
        description: `Your new API key "${result.name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleRevokeApiKey = async (keyId: string, keyName: string) => {
    try {
      await revokeApiKey.mutateAsync(keyId);
      setConfirmRevokeKey(null);
      
      toast({
        title: 'API key revoked',
        description: `API key "${keyName}" has been revoked successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession.mutateAsync(sessionId);
      setConfirmRevokeSession(null);
      
      toast({
        title: 'Session revoked',
        description: 'The session has been revoked successfully.',
      });
    } catch (error) {
      toast({
        title: 'Revocation failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: `${description} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard. Please copy manually.',
        variant: 'destructive',
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const formatUserAgent = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Mobile')) return 'Mobile Browser';
    return 'Unknown Browser';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* API Keys Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access to Parscade
            </CardDescription>
          </div>
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
                          onClick={() => copyToClipboard(newKeyResult.key, 'API key')}
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
        </CardHeader>
        <CardContent>
          {keysLoading ? (
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
          ) : !apiKeys?.length ? (
            <div className="text-center py-8">
              <Key className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No API keys yet</p>
              <p className="text-gray-500 text-sm">Create your first API key to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{key.name}</h4>
                      <div className="flex space-x-1">
                        {key.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                      {key.last_used_at && (
                        <span>Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {key.preview && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          value={visibleKeys.has(key.id) ? key.preview : '•'.repeat(20)}
                          readOnly
                          className="font-mono text-xs flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        {visibleKeys.has(key.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(key.preview!, 'API key preview')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <Dialog open={confirmRevokeKey === key.id} onOpenChange={(open) => !open && setConfirmRevokeKey(null)}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmRevokeKey(key.id)}
                        disabled={revokeApiKey.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Revoke API Key</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to revoke the API key "{key.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setConfirmRevokeKey(null)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRevokeApiKey(key.id, key.name)}
                          disabled={revokeApiKey.isPending}
                        >
                          {revokeApiKey.isPending ? 'Revoking...' : 'Revoke Key'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          {sessionsLoading ? (
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
          ) : !sessions?.length ? (
            <div className="text-center py-8">
              <Monitor className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No active sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {session.user_agent.includes('Mobile') ? (
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {formatUserAgent(session.user_agent)}
                        </span>
                        {session.is_current && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.ip_address} • Last seen {new Date(session.last_seen).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!session.is_current && (
                    <Dialog open={confirmRevokeSession === session.id} onOpenChange={(open) => !open && setConfirmRevokeSession(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmRevokeSession(session.id)}
                          disabled={revokeSession.isPending}
                        >
                          Revoke
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke Session</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to revoke this session? The user will be signed out from that device.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setConfirmRevokeSession(null)}>
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={revokeSession.isPending}
                          >
                            {revokeSession.isPending ? 'Revoking...' : 'Revoke Session'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
          {eventsLoading ? (
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
          ) : !securityEvents?.length ? (
            <div className="text-center py-8">
              <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No security events</p>
              <p className="text-gray-500 text-sm">Security activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {event.event_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <span>{new Date(event.created_at).toLocaleString()}</span>
                      {event.ip_address && <span>• {event.ip_address}</span>}
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