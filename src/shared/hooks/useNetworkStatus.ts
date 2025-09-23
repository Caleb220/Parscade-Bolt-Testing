import { useState, useEffect, useRef } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

interface UseNetworkStatusReturn extends NetworkStatus {
  wasOffline: boolean;
  reconnectAttempts: number;
  lastDisconnect: Date | null;
  lastReconnect: Date | null;
}

export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
  });

  const [wasOffline, setWasOffline] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastDisconnect, setLastDisconnect] = useState<Date | null>(null);
  const [lastReconnect, setLastReconnect] = useState<Date | null>(null);
  const wasOnlineRef = useRef(navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection ||
                        (navigator as any).mozConnection ||
                        (navigator as any).webkitConnection;

      const isOnline = navigator.onLine;
      const wasOnlineBefore = wasOnlineRef.current;

      // Track disconnect/reconnect events
      if (!isOnline && wasOnlineBefore) {
        setWasOffline(true);
        setLastDisconnect(new Date());
      } else if (isOnline && !wasOnlineBefore) {
        setLastReconnect(new Date());
        setReconnectAttempts(prev => prev + 1);
      }

      wasOnlineRef.current = isOnline;

      let isSlowConnection = false;
      let connectionType = 'unknown';
      let effectiveType = 'unknown';
      let downlink = 0;
      let rtt = 0;

      if (connection) {
        connectionType = connection.type || 'unknown';
        effectiveType = connection.effectiveType || 'unknown';
        downlink = connection.downlink || 0;
        rtt = connection.rtt || 0;

        // Consider connection slow if:
        // - Effective type is 'slow-2g' or '2g'
        // - Downlink is less than 1.5 Mbps
        // - RTT is greater than 300ms
        isSlowConnection = (
          effectiveType === 'slow-2g' ||
          effectiveType === '2g' ||
          downlink < 1.5 ||
          rtt > 300
        );
      }

      setNetworkStatus({
        isOnline,
        isSlowConnection,
        connectionType,
        effectiveType,
        downlink,
        rtt,
      });
    };

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    const handleConnectionChange = () => updateNetworkStatus();

    // Initial update
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes (if supported)
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return {
    ...networkStatus,
    wasOffline,
    reconnectAttempts,
    lastDisconnect,
    lastReconnect,
  };
};

// Hook for automatic retry with exponential backoff
export const useNetworkRetry = (
  callback: () => Promise<void>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { isOnline } = useNetworkStatus();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const retry = async () => {
    if (!isOnline || retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    const delay = baseDelay * Math.pow(2, retryCount);

    timeoutRef.current = setTimeout(async () => {
      try {
        await callback();
        setRetryCount(0);
        setIsRetrying(false);
      } catch (error) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(false);

        if (retryCount + 1 < maxRetries) {
          retry();
        }
      }
    }, delay);
  };

  const reset = () => {
    setRetryCount(0);
    setIsRetrying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries && isOnline,
  };
};