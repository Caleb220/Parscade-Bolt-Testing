/**
 * React Hooks for WebSocket Integration
 * Provides easy-to-use hooks for real-time features
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';

import { getWebSocketClient } from './client';

import type { WebSocketStatus, WebSocketEvents, JobStatus } from './client';


// Configuration
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

/**
 * Hook to manage WebSocket connection
 */
export function useWebSocket() {
  const { session } = useAuth();
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [latency, setLatency] = useState<number | null>(null);
  const clientRef = useRef<ReturnType<typeof getWebSocketClient> | null>(null);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    // Initialize WebSocket client with auth token
    const wsUrl = `${WS_URL}?token=${session.access_token}`;
    const client = getWebSocketClient({
      url: wsUrl,
      reconnect: true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      heartbeatInterval: 30000,
      debug: import.meta.env.DEV,
    });

    clientRef.current = client;

    // Subscribe to status changes
    const unsubscribeStatus = client.subscribe('status' as any, (newStatus: WebSocketStatus) => {
      setStatus(newStatus);
    });

    // Subscribe to latency updates
    const unsubscribeLatency = client.subscribe('latency' as any, (newLatency: number) => {
      setLatency(newLatency);
    });

    // Connect
    client.connect();

    // Cleanup
    return () => {
      unsubscribeStatus();
      unsubscribeLatency();
      client.disconnect();
    };
  }, [session?.access_token]);

  const send = useCallback((type: string, payload: any) => {
    clientRef.current?.send(type, payload);
  }, []);

  return {
    status,
    latency,
    send,
    isConnected: status === 'connected',
    client: clientRef.current,
  };
}

/**
 * Hook to subscribe to specific WebSocket events
 */
export function useWebSocketEvent<K extends keyof WebSocketEvents>(
  event: K,
  callback: (data: WebSocketEvents[K]) => void,
  deps: React.DependencyList = []
) {
  const { client } = useWebSocket();

  useEffect(() => {
    if (!client) return;

    const unsubscribe = client.subscribe(event, callback);
    return unsubscribe;
  }, [client, event, ...deps]);
}

/**
 * Hook for real-time job status updates
 */
export function useJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<JobStatus>('pending');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useWebSocketEvent(
    'job:status',
    (data) => {
      if (data.jobId === jobId) {
        setStatus(data.status);
        if (data.progress !== undefined) {
          setProgress(data.progress);
        }
        if (data.message) {
          setMessage(data.message);
        }
      }
    },
    [jobId]
  );

  useWebSocketEvent(
    'job:progress',
    (data) => {
      if (data.jobId === jobId) {
        setProgress(data.progress);
        if (data.stage) {
          setMessage(`Processing: ${data.stage}`);
        }
      }
    },
    [jobId]
  );

  useWebSocketEvent(
    'job:completed',
    (data) => {
      if (data.jobId === jobId) {
        setStatus('completed');
        setProgress(100);
        setResult(data.result);
        setMessage('Processing completed');
      }
    },
    [jobId]
  );

  useWebSocketEvent(
    'job:failed',
    (data) => {
      if (data.jobId === jobId) {
        setStatus('failed');
        setError(data.error);
        setMessage(`Failed: ${data.error}`);
      }
    },
    [jobId]
  );

  return {
    status,
    progress,
    message,
    result,
    error,
    isProcessing: status === 'processing',
    isCompleted: status === 'completed',
    isFailed: status === 'failed',
  };
}

/**
 * Hook for real-time document processing updates
 */
export function useDocumentProcessing(documentId: string | null) {
  const [stage, setStage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useWebSocketEvent(
    'document:processing',
    (data) => {
      if (data.documentId === documentId) {
        setStage(data.stage);
        setProgress(data.progress);
      }
    },
    [documentId]
  );

  useWebSocketEvent(
    'document:processed',
    (data) => {
      if (data.documentId === documentId) {
        setResult(data.result);
        setProgress(100);
        setStage('Completed');
      }
    },
    [documentId]
  );

  useWebSocketEvent(
    'document:error',
    (data) => {
      if (data.documentId === documentId) {
        setError(data.error);
        setStage('Failed');
      }
    },
    [documentId]
  );

  return {
    stage,
    progress,
    result,
    error,
    isProcessing: progress > 0 && progress < 100,
    isCompleted: progress === 100,
    isFailed: !!error,
  };
}

/**
 * Hook for real-time notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
  }>>([]);

  useWebSocketEvent(
    'notification:new',
    (data) => {
      const notification = {
        id: `notif-${Date.now()}`,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };
}

/**
 * Hook for real-time analytics updates
 */
export function useRealtimeAnalytics() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  useWebSocketEvent(
    'analytics:update',
    (data) => {
      setMetrics((prev) => ({
        ...prev,
        [data.metric]: data.value,
      }));
    },
    []
  );

  useWebSocketEvent(
    'analytics:realtime',
    (data) => {
      setActiveUsers(data.activeUsers);
      setActiveJobs(data.activeJobs);
      setQueueLength(data.queueLength);
    },
    []
  );

  return {
    metrics,
    activeUsers,
    activeJobs,
    queueLength,
  };
}

/**
 * Hook for system status monitoring
 */
export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy');
  const [services, setServices] = useState<Record<string, boolean>>({});
  const [maintenance, setMaintenance] = useState<{
    scheduled: boolean;
    startTime?: string;
    endTime?: string;
    message?: string;
  }>({ scheduled: false });

  useWebSocketEvent(
    'system:status',
    (data) => {
      setSystemStatus(data.status);
      setServices(data.services);
    },
    []
  );

  useWebSocketEvent(
    'system:maintenance',
    (data) => {
      setMaintenance(data);
    },
    []
  );

  return {
    systemStatus,
    services,
    maintenance,
    isHealthy: systemStatus === 'healthy',
    isDegraded: systemStatus === 'degraded',
    isDown: systemStatus === 'down',
    hasIssues: systemStatus !== 'healthy',
  };
}

/**
 * Hook for team activity monitoring
 */
export function useTeamActivity(teamId: string | null) {
  const [activities, setActivities] = useState<Array<{
    id: string;
    userId: string;
    action: string;
    resource?: string;
    timestamp: number;
  }>>([]);

  const [members, setMembers] = useState<Set<string>>(new Set());

  useWebSocketEvent(
    'team:activity',
    (data) => {
      const activity = {
        id: `activity-${Date.now()}`,
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        timestamp: Date.now(),
      };
      setActivities((prev) => [activity, ...prev].slice(0, 100)); // Keep last 100 activities
    },
    [teamId]
  );

  useWebSocketEvent(
    'team:member_joined',
    (data) => {
      if (data.teamId === teamId) {
        setMembers((prev) => new Set([...prev, data.userId]));
      }
    },
    [teamId]
  );

  useWebSocketEvent(
    'team:member_left',
    (data) => {
      if (data.teamId === teamId) {
        setMembers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    },
    [teamId]
  );

  return {
    activities,
    activeMembers: Array.from(members),
    activeMemberCount: members.size,
  };
}