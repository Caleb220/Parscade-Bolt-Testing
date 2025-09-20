/**
 * Security Tab Component
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
  CheckCircle
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

const SecurityTab: React.FC = () => {
  const { user } = useAccountContext();
  const { toast } = useToast();
  
  const { data: apiKeys, isLoading: keysLoading } = useApiKeys();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const { data: securityEvents, isLoading: eventsLoading } = useSecurityEvents();
  
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const revokeSession = useRevokeSession();

  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

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
      setNewKeyResult(result.key);
      reset();
      toast({
        title: 'API key created',
        description: 'Your new API key has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Creation failed',
        description: 'Failed to create API key. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard.',
    });
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
              Manage your API keys for programmatic access
            </CardDescription>
          </div>
          <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    <div className="flex items-center space-x-2">
                      <Input value={newKeyResult} readOnly className="font-mono text-sm" />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(newKeyResult)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
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
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
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
                      {['read', 'write', 'admin'].map((scope) => (
                        <label key={scope} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={scope}
                            {...register('scopes')}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm capitalize">{scope}</span>
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
                <Skeleton key={i} className="h-16 w-full" />
              ))}
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
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{key.name}</h4>
                      <div className="flex space-x-1">
                        {key.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                      {key.last_used_at && (
                        <span>Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {key.preview && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          value={visibleKeys.has(key.id) ? `pk_live_${key.preview}...` : '•'.repeat(20)}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => revokeApiKey.mutate(key.id)}
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
                          {session.user_agent.split(' ')[0] || 'Unknown Device'}
                        </span>
                        {session.is_current && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.ip_address} • Last seen {new Date(session.last_seen).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {!session.is_current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeSession.mutate(session.id)}
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
          {eventsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !securityEvents?.length ? (
            <div className="text-center py-8">
              <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No security events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.description}</p>
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