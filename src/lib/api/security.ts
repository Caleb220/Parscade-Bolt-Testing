/**
 * API Security Enhancements
 * Implements security best practices for API interactions
 * Includes input sanitization, XSS prevention, and secure headers
 */

import DOMPurify from 'isomorphic-dompurify';

import { logger } from '@/shared/services/logger';

/**
 * Security configuration for different data types
 */
interface SecurityConfig {
  readonly sanitizeInput: boolean;
  readonly allowHTML: boolean;
  readonly maxLength?: number;
  readonly blacklistedPatterns?: RegExp[];
}

/**
 * Default security configurations
 */
const DEFAULT_CONFIGS: Record<string, SecurityConfig> = {
  text: {
    sanitizeInput: true,
    allowHTML: false,
    maxLength: 10000,
    blacklistedPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript URLs
      /on\w+\s*=/gi, // Event handlers
      /data:text\/html/gi, // Data URLs
    ],
  },
  html: {
    sanitizeInput: true,
    allowHTML: true,
    maxLength: 50000,
  },
  url: {
    sanitizeInput: true,
    allowHTML: false,
    maxLength: 2048,
    blacklistedPatterns: [/javascript:/gi, /data:text\/html/gi, /vbscript:/gi],
  },
  json: {
    sanitizeInput: true,
    allowHTML: false,
    maxLength: 100000,
  },
};

/**
 * Security utilities for API data sanitization
 */
export class ApiSecurity {
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Sanitize string input based on security configuration
   */
  sanitizeString(input: string, type: keyof typeof DEFAULT_CONFIGS = 'text'): string {
    const config = DEFAULT_CONFIGS[type];

    // Length validation
    if (config.maxLength && input.length > config.maxLength) {
      if (this.isDevelopment) {
        logger.warn('Input exceeds maximum length', {
          context: { feature: 'api-security', action: 'sanitizeString' },
          metadata: { type, length: input.length, maxLength: config.maxLength },
        });
      }
      input = input.substring(0, config.maxLength);
    }

    // Pattern blacklist validation
    if (config.blacklistedPatterns) {
      for (const pattern of config.blacklistedPatterns) {
        if (pattern.test(input)) {
          if (this.isDevelopment) {
            logger.warn('Input contains blacklisted pattern', {
              context: { feature: 'api-security', action: 'sanitizeString' },
              metadata: { type, pattern: pattern.toString() },
            });
          }
          input = input.replace(pattern, '');
        }
      }
    }

    // HTML sanitization
    if (config.sanitizeInput) {
      if (config.allowHTML) {
        // Allow safe HTML tags only
        input = DOMPurify.sanitize(input, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span'],
          ALLOWED_ATTR: ['class'],
        });
      } else {
        // Strip all HTML tags
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
      }
    }

    return input;
  }

  /**
   * Sanitize URL to prevent malicious redirects
   */
  sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url, 'url');

    try {
      const urlObj = new URL(sanitized);

      // Only allow HTTPS and HTTP for localhost
      if (urlObj.protocol === 'https:') {
        return sanitized;
      }

      if (urlObj.protocol === 'http:') {
        const hostname = urlObj.hostname.toLowerCase();
        if (
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname === '::1' ||
          hostname.endsWith('.local')
        ) {
          return sanitized;
        }
      }

      throw new Error('URL must use HTTPS or be localhost');
    } catch (error) {
      if (this.isDevelopment) {
        logger.warn('URL sanitization failed', {
          context: { feature: 'api-security', action: 'sanitizeUrl' },
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { originalUrl: url, sanitizedUrl: sanitized },
        });
      }
      throw new Error('Invalid or insecure URL');
    }
  }

  /**
   * Sanitize object recursively
   */
  sanitizeObject(obj: any, maxDepth = 10): any {
    if (maxDepth <= 0) {
      if (this.isDevelopment) {
        logger.warn('Object sanitization max depth reached', {
          context: { feature: 'api-security', action: 'sanitizeObject' },
        });
      }
      return obj;
    }

    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, maxDepth - 1));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize key names to prevent prototype pollution
        const sanitizedKey = this.sanitizeString(key.toString());
        if (
          sanitizedKey !== '__proto__' &&
          sanitizedKey !== 'constructor' &&
          sanitizedKey !== 'prototype'
        ) {
          sanitized[sanitizedKey] = this.sanitizeObject(value, maxDepth - 1);
        }
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Validate and sanitize file uploads
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // File size validation (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds 100MB limit' };
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    // File name validation
    const sanitizedName = this.sanitizeString(file.name);
    if (sanitizedName !== file.name) {
      return { valid: false, error: 'File name contains invalid characters' };
    }

    // Check for executable extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.com', '.pif', '.js', '.vbs'];
    const extension = file.name.toLowerCase().split('.').pop();
    if (extension && dangerousExtensions.includes(`.${extension}`)) {
      return { valid: false, error: 'Executable files are not allowed' };
    }

    return { valid: true };
  }

  /**
   * Generate secure headers for API requests
   */
  getSecureHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      Pragma: 'no-cache',
    };
  }

  /**
   * Rate limiting helper (client-side)
   */
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(endpoint: string, maxRequests = 60, windowMs = 60000): boolean {
    const now = Date.now();
    const key = `${endpoint}`;
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      if (this.isDevelopment) {
        logger.warn('Client-side rate limit exceeded', {
          context: { feature: 'api-security', action: 'checkRateLimit' },
          metadata: { endpoint, count: record.count, maxRequests },
        });
      }
      return false;
    }

    record.count++;
    return true;
  }
}

// Export singleton instance
export const apiSecurity = new ApiSecurity();
