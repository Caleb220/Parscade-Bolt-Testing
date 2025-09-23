/**
 * Common Formatting Utilities
 * Reusable formatters for consistent data display
 */

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format user agent to browser name
 */
export const formatUserAgent = (userAgent: string): string => {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'Unknown Browser';
  }
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Mobile')) return 'Mobile Browser';
  return 'Unknown Browser';
};

/**
 * Format job type for display
 */
export const formatJobType = (type: string): string => {
  if (!type || typeof type !== 'string') {
    return 'Unknown Job';
  }
  
  switch (type) {
    case 'parse_document':
      return 'Parse Document';
    case 'extract_text':
      return 'Extract Text';
    case 'analyze_structure':
      return 'Analyze Structure';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

/**
 * Format status for display
 */
export const formatStatus = (status: string): string => {
  if (!status || typeof status !== 'string') {
    return 'Unknown';
  }
  
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  if (!date) {
    return 'Unknown time';
  }
  
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // Check for invalid date
  if (isNaN(targetDate.getTime())) {
    return 'Invalid date';
  }
  
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return targetDate.toLocaleDateString();
};

/**
 * Format date to human readable string
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) {
    return 'Unknown date';
  }
  
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // Check for invalid date
  if (isNaN(targetDate.getTime())) {
    return 'Invalid date';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return targetDate.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format duration in milliseconds to human readable string
 */
export const formatDuration = (durationMs: number): string => {
  if (!durationMs || durationMs < 0) {
    return '0s';
  }

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};