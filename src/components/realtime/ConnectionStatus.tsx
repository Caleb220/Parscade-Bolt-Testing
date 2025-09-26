/**
 * Connection Status Indicator
 * Shows WebSocket connection status with latency
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';
import { useWebSocket } from '@/lib/websocket/hooks';

export function ConnectionStatus() {
  const { status, latency, isConnected } = useWebSocket();

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: latency ? `Connected (${latency}ms)` : 'Connected',
          className: 'text-green-600 bg-green-50',
          pulseClass: 'bg-green-400',
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: Loader2,
          text: status === 'reconnecting' ? 'Reconnecting...' : 'Connecting...',
          className: 'text-yellow-600 bg-yellow-50',
          pulseClass: 'bg-yellow-400',
          animate: true,
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          className: 'text-gray-600 bg-gray-50',
          pulseClass: 'bg-gray-400',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Connection Error',
          className: 'text-red-600 bg-red-50',
          pulseClass: 'bg-red-400',
        };
      default:
        return {
          icon: WifiOff,
          text: 'Unknown',
          className: 'text-gray-600 bg-gray-50',
          pulseClass: 'bg-gray-400',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {status !== 'connected' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
            config.className
          )}
        >
          <div className="relative">
            <Icon
              className={cn('h-4 w-4', {
                'animate-spin': config.animate,
              })}
            />
            {isConnected && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span
                  className={cn(
                    'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                    config.pulseClass
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex rounded-full h-2 w-2',
                    config.pulseClass
                  )}
                />
              </span>
            )}
          </div>
          <span className="text-sm font-medium">{config.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConnectionStatus;