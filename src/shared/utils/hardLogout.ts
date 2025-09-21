/**
 * Hard Logout Utilities
 * Provides complete session termination across all tabs and storage
 */

/**
 * Cross-tab logout communication
 */
const LOGOUT_EVENT_KEY = 'parscade_logout_event';

/**
 * Broadcast logout event to all tabs
 */
export const broadcastLogoutEvent = (): void => {
  try {
    localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
    localStorage.removeItem(LOGOUT_EVENT_KEY);
  } catch (error) {
    // Silently fail if localStorage is not available
  }
};

/**
 * Set up listener for cross-tab logout events
 */
export const setupCrossTabLogoutListener = (onLogout: () => void): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === LOGOUT_EVENT_KEY) {
      onLogout();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * Perform complete logout with storage cleanup
 */
export const performHardLogout = async (): Promise<void> => {
  try {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Broadcast logout to other tabs
    broadcastLogoutEvent();

    // Navigate to logout endpoint for server-side cleanup
    window.location.href = '/auth/logout';
  } catch (error) {
    // Fallback to simple redirect if cleanup fails
    window.location.href = '/';
  }
};