/**
 * WebSocket Client for Real-time Updates
 * Handles connection management, reconnection, and message routing
 */

import { EventEmitter } from 'events';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp?: number;
  id?: string;
}

// WebSocket Event Types
export interface WebSocketEvents {
  // Job Events
  'job:created': { jobId: string; documentId: string; status: string };
  'job:status': { jobId: string; status: JobStatus; progress?: number; message?: string };
  'job:progress': { jobId: string; progress: number; stage?: string };
  'job:completed': { jobId: string; result: ProcessingResult };
  'job:failed': { jobId: string; error: string; details?: any };

  // Document Events
  'document:uploaded': { documentId: string; name: string; size: number };
  'document:processing': { documentId: string; stage: string; progress: number };
  'document:processed': { documentId: string; result: ProcessingResult };
  'document:error': { documentId: string; error: string };

  // System Events
  'notification:new': { type: NotificationType; title: string; message: string; severity?: 'info' | 'warning' | 'error' | 'success' };
  'system:status': { status: 'healthy' | 'degraded' | 'down'; services: Record<string, boolean> };
  'system:maintenance': { scheduled: boolean; startTime?: string; endTime?: string; message?: string };

  // Analytics Events
  'analytics:update': { metric: string; value: number; change?: number };
  'analytics:realtime': { activeUsers: number; activeJobs: number; queueLength: number };

  // Team Events
  'team:member_joined': { userId: string; userName: string; teamId: string };
  'team:member_left': { userId: string; userName: string; teamId: string };
  'team:activity': { userId: string; action: string; resource?: string };
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface ProcessingResult {
  documentId: string;
  status: 'success' | 'partial' | 'failed';
  extractedData?: any;
  metadata?: {
    pages?: number;
    processingTime?: number;
    confidence?: number;
  };
  errors?: string[];
}

class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectTimer?: NodeJS.Timeout;
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectCount = 0;
  private messageQueue: WebSocketMessage[] = [];
  private status: WebSocketStatus = 'disconnected';
  private lastPing?: number;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnect: true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      heartbeatInterval: 30000,
      debug: false,
      ...config,
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('Already connected');
      return;
    }

    this.setStatus('connecting');
    this.log(`Connecting to ${this.config.url}...`);

    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
    } catch (error) {
      this.log('Connection error:', error);
      this.setStatus('error');
      this.handleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.config.reconnect = false;
    this.clearTimers();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.setStatus('disconnected');
    this.log('Disconnected');
  }

  /**
   * Send message through WebSocket
   */
  send<T = any>(type: string, payload: T): void {
    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateId(),
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.log('Sent message:', message);
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      this.log('Queued message:', message);

      // Try to reconnect if disconnected
      if (this.status === 'disconnected') {
        this.connect();
      }
    }
  }

  /**
   * Subscribe to specific event type
   */
  subscribe<K extends keyof WebSocketEvents>(
    event: K,
    callback: (data: WebSocketEvents[K]) => void
  ): () => void {
    this.on(event, callback);
    return () => this.off(event, callback);
  }

  /**
   * Get current connection status
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.log('Connected');
      this.setStatus('connected');
      this.reconnectCount = 0;

      // Start heartbeat
      this.startHeartbeat();

      // Flush message queue
      this.flushMessageQueue();

      // Emit connected event
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.log('Received message:', message);

        // Handle system messages
        if (message.type === 'pong') {
          this.handlePong();
          return;
        }

        // Emit typed event
        this.emit(message.type, message.payload);

        // Also emit generic message event
        this.emit('message', message);
      } catch (error) {
        this.log('Error parsing message:', error);
        this.emit('error', error);
      }
    };

    this.ws.onerror = (error) => {
      this.log('WebSocket error:', error);
      this.setStatus('error');
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      this.log(`Connection closed: ${event.code} - ${event.reason}`);
      this.ws = null;
      this.clearTimers();

      if (event.code !== 1000 && this.config.reconnect) {
        this.handleReconnect();
      } else {
        this.setStatus('disconnected');
      }

      this.emit('disconnected', { code: event.code, reason: event.reason });
    };
  }

  private handleReconnect(): void {
    if (!this.config.reconnect || this.reconnectCount >= this.config.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.setStatus('disconnected');
      this.emit('reconnect_failed');
      return;
    }

    this.setStatus('reconnecting');
    this.reconnectCount++;

    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(1.5, this.reconnectCount - 1),
      30000
    );

    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectCount}/${this.config.reconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.clearTimers();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.lastPing = Date.now();
        this.send('ping', { timestamp: this.lastPing });

        // Check for heartbeat timeout
        setTimeout(() => {
          if (this.lastPing && Date.now() - this.lastPing > this.config.heartbeatInterval * 2) {
            this.log('Heartbeat timeout - reconnecting...');
            this.ws?.close();
            this.handleReconnect();
          }
        }, 5000);
      }
    }, this.config.heartbeatInterval);
  }

  private handlePong(): void {
    if (this.lastPing) {
      const latency = Date.now() - this.lastPing;
      this.emit('latency', latency);
      this.log(`Latency: ${latency}ms`);
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        this.log('Sent queued message:', message);
      }
    }
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit('status', status);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }
}

// Create singleton instance
let instance: WebSocketClient | null = null;

export function getWebSocketClient(config?: WebSocketConfig): WebSocketClient {
  if (!instance && config) {
    instance = new WebSocketClient(config);
  }

  if (!instance) {
    throw new Error('WebSocket client not initialized. Call with config first.');
  }

  return instance;
}

export function destroyWebSocketClient(): void {
  if (instance) {
    instance.disconnect();
    instance = null;
  }
}

export default WebSocketClient;