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
  RefreshCw,
  AlertCircle as AlertIcon
} from 'lucide-react';

import { getErrorMessage } from '@/lib/api';
import { apiKeySchema, type ApiKeyFormData } from '@/lib/validation/account';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import ConfirmationDialog from '@/shared/components/ui/confirmation-dialog';
import StatusBadge from '@/shared/components/ui/status-badge';
import { useClipboard, formatUserAgent, formatDate } from '@/shared/utils';
import { 
  useApiKeys, 
  useCreateApiKey, 
  useRevokeApiKey,
  useSessions,
  useRevokeSession,
  useSecurityEvents
} from '@/shared/hooks/api/useAccountData';

const SecurityTab: React.FC = () => {
  const { user } = useAccountContext();
  const { copy } = useClipboard();
  
  const { data: apiKeys, isLoading: keysLoading, error: keysError, refetch: refetchKeys } = useApiKeys();
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions();
  const { data: securityEvents, isLoading: eventsLoading, error: eventsError } = useSecurityEvents();
  
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const revokeSession = useRevokeSession();

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [confirmRevokeKey, setConfirmRevokeKey] = useState<string | null>(null);
  const [confirmRevokeSession, setConfirmRevokeSession] = useState<string | null>(null);

  const handleRevokeApiKey = async (keyId: string, keyName: string) => {
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
              Manage your API keys for programmatic access to Parscade
            </CardDescription>
          </div>
          <Button size="sm" disabled>
            <Plus className="w-4 h-4 mr-2" />
            New Key (Coming Soon)
          </Button>
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
                      <span>Created {formatDate(key.created_at)}</span>
                      {key.last_used_at && (
                        <span>Last used {formatDate(key.last_used_at)}</span>
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
                            onClick={() => copy(key.preview!, 'API key preview')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmRevokeKey(key.id)}
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
          const key = apiKeys?.find(k => k.id === confirmRevokeKey);
          if (key) handleRevokeApiKey(key.id, key.name);
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
                          <StatusBadge status="active" className="text-xs" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.ip_address} • Last seen {formatDate(session.last_seen)}
                      </div>
                    </div>
                  </div>
                  {!session.is_current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmRevokeSession(session.id)}
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
                      <span>{formatDate(event.created_at)}</span>
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