/**
 * Hard Logout & Session Sanitization Utilities
 * 
 * Implements enterprise-grade logout that:
 * - Revokes server-side tokens globally
 * - Purges all client-side storage
 * - Synchronizes logout across tabs
 * - Prevents cached page restoration
 * - Closes realtime connections
 * 
 * Security: Ensures complete session termination with no possibility of silent re-login
 */

import { supabase } from '@/lib/supabase';
import { logger } from '@/services/logger';
import { AUTH_PATHS } from '@/routes/paths';

/**
 * Cross-tab logout synchronization channel
 */
const LOGOUT_BROADCAST_CHANNEL = 'parscade-auth-logout';

/**
 * Creates a broadcast channel for cross-tab logout synchronization
 */
const createLogoutBroadcastChannel = (): BroadcastChannel | null => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      return new BroadcastChannel(LOGOUT_BROADCAST_CHANNEL);
    }
  } catch (error) {
    logger.warn('BroadcastChannel not supported', {
      context: { feature: 'auth', action: 'createBroadcastChannel' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
  return null;
};

/**
 * Purges all client-side storage related to authentication and app state
 */
const purgeClientStorage = (): void => {
  try {
    // 1. Clear Supabase auth tokens (all variants)
    const supabaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') ||
      key.startsWith('supabase.auth.token') ||
      key.includes('auth-token')
    );
    
    supabaseKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        logger.debug(`Removed localStorage key: ${key}`, {
          context: { feature: 'auth', action: 'storageCleanup' }
        });
      } catch (error) {
        logger.warn(`Failed to remove localStorage key: ${key}`, {
          context: { feature: 'auth', action: 'storageCleanup' },
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    });

    // 2. Clear additional auth-related storage
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('auth') || 
      key.includes('token') ||
      key.includes('session') ||
      key.includes('user') ||
      key.includes('login')
    );
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        logger.warn(`Failed to remove auth key: ${key}`, {
          context: { feature: 'auth', action: 'authStorageCleanup' },
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    });

    // 3. Clear sessionStorage completely
    try {
      sessionStorage.clear();
      logger.debug('SessionStorage cleared', {
        context: { feature: 'auth', action: 'sessionStorageCleanup' }
      });
    } catch (error) {
      logger.warn('Failed to clear sessionStorage', {
        context: { feature: 'auth', action: 'sessionStorageCleanup' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }

    // 4. Clear cookies (non-HTTPOnly)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name && (
          name.includes('supabase') || 
          name.includes('auth') || 
          name.includes('token') ||
          name.includes('session')
        )) {
          // Clear for current domain and path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          
          // Clear for parent domain if subdomain
          const parts = window.location.hostname.split('.');
          if (parts.length > 2) {
            const parentDomain = '.' + parts.slice(-2).join('.');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
          }
        }
      });
    }

    logger.info('Client storage purged successfully', {
      context: { feature: 'auth', action: 'storageCleanup' }
    });

  } catch (error) {
    logger.error('Error during storage purge', {
      context: { feature: 'auth', action: 'storageCleanup' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

/**
 * Purges IndexedDB stores if present
 */
const purgeIndexedDB = async (): Promise<void> => {
  try {
    if (typeof indexedDB === 'undefined') {
      return;
    }

    // Get all databases
    if ('databases' in indexedDB) {
      const databases = await (indexedDB as any).databases();
      
      // Delete auth-related databases
      const authDatabases = databases.filter((db: any) => 
        db.name && (
          db.name.includes('supabase') ||
          db.name.includes('auth') ||
          db.name.includes('parscade') ||
          db.name.includes('keyval') ||
          db.name.includes('idb')
        )
      );

      for (const db of authDatabases) {
        try {
          indexedDB.deleteDatabase(db.name);
          logger.debug(`Deleted IndexedDB: ${db.name}`, {
            context: { feature: 'auth', action: 'indexedDBCleanup' }
          });
        } catch (error) {
          logger.warn(`Failed to delete IndexedDB: ${db.name}`, {
            context: { feature: 'auth', action: 'indexedDBCleanup' },
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    }
  } catch (error) {
    logger.warn('IndexedDB cleanup failed', {
      context: { feature: 'auth', action: 'indexedDBCleanup' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

/**
 * Closes all Supabase realtime connections
 */
const closeRealtimeConnections = (): void => {
  try {
    // Close all realtime channels
    supabase.removeAllChannels();
    
    logger.info('Realtime connections closed', {
      context: { feature: 'auth', action: 'closeRealtime' }
    });
  } catch (error) {
    logger.warn('Failed to close realtime connections', {
      context: { feature: 'auth', action: 'closeRealtime' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};

/**
 * Broadcasts logout event to other tabs
 */
const broadcastLogout = (channel: BroadcastChannel | null): void => {
  if (channel) {
    try {
      channel.postMessage({ 
        type: 'HARD_LOGOUT',
        timestamp: Date.now(),
        origin: window.location.origin 
      });
      
      logger.debug('Logout broadcasted to other tabs', {
        context: { feature: 'auth', action: 'broadcastLogout' }
      });
    } catch (error) {
      logger.warn('Failed to broadcast logout', {
        context: { feature: 'auth', action: 'broadcastLogout' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
};

/**
 * Sets up cross-tab logout listener
 */
export const setupCrossTabLogoutListener = (onLogout: () => void): (() => void) => {
  const channel = createLogoutBroadcastChannel();
  
  if (!channel) {
    return () => {}; // No cleanup needed
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'HARD_LOGOUT') {
      logger.info('Received cross-tab logout signal', {
        context: { feature: 'auth', action: 'crossTabLogout' }
      });
      onLogout();
    }
  };

  channel.addEventListener('message', handleMessage);
  
  // Return cleanup function
  return () => {
    try {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    } catch (error) {
      logger.warn('Error cleaning up broadcast channel', {
        context: { feature: 'auth', action: 'cleanupBroadcast' },
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  };
};

/**
 * Performs complete hard logout with session sanitization
 */
export const performHardLogout = async (): Promise<void> => {
  logger.info('Starting hard logout process', {
    context: { feature: 'auth', action: 'hardLogout' }
  });

  const channel = createLogoutBroadcastChannel();

  try {
    // 1. Broadcast logout to other tabs FIRST (while we still have auth context)
    broadcastLogout(channel);

    // 2. Server-side token revocation with global scope
    const { error: signOutError } = await supabase.auth.signOut({ 
      scope: 'global' // Revokes refresh token across all sessions
    });

    if (signOutError) {
      logger.warn('Supabase global signout error', {
        context: { feature: 'auth', action: 'globalSignOut' },
        error: signOutError,
      });
      // Continue with cleanup even if server signout fails
    }

    // 3. Close realtime connections
    closeRealtimeConnections();

    // 4. Purge all client-side storage
    purgeClientStorage();

    // 5. Purge IndexedDB
    await purgeIndexedDB();

    logger.info('Hard logout completed successfully', {
      context: { feature: 'auth', action: 'hardLogout' }
    });

  } catch (error) {
    logger.error('Critical error during hard logout', {
      context: { feature: 'auth', action: 'hardLogout' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
    
    // Even if there are errors, ensure we clean up what we can
    try {
      purgeClientStorage();
      closeRealtimeConnections();
    } catch (cleanupError) {
      logger.error('Error during emergency cleanup', {
        context: { feature: 'auth', action: 'emergencyCleanup' },
        error: cleanupError instanceof Error ? cleanupError : new Error(String(cleanupError)),
      });
    }
  } finally {
    // Always clean up broadcast channel
    if (channel) {
      try {
        channel.close();
      } catch (error) {
        logger.warn('Error closing broadcast channel', {
          context: { feature: 'auth', action: 'channelCleanup' },
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
  }
};

/**
 * Triggers server-side logout endpoint for additional security
 */
export const triggerServerLogout = (): void => {
  try {
    // Navigate to server logout endpoint which will:
    // 1. Set Clear-Site-Data headers
    // 2. Add Cache-Control: no-store
    // 3. Redirect to login with logout confirmation
    window.location.href = '/api/auth/logout';
  } catch (error) {
    logger.warn('Failed to trigger server logout', {
      context: { feature: 'auth', action: 'serverLogout' },
      error: error instanceof Error ? error : new Error(String(error)),
    });
    
    // Fallback to direct redirect
    window.location.href = AUTH_PATHS.LOGOUT_REDIRECT;
  }
};