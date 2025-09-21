/**
 * Enterprise Logging Service
 * Provides structured logging with context and user tracking
 */

interface LogContext {
  feature?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

interface LogMetadata {
  [key: string]: any;
}

interface UserContext {
  id: string;
  email?: string;
  username?: string;
}

class Logger {
  private userContext: UserContext | null = null;
  private globalContext: Record<string, any> = {};
  private isInitialized = false;

  initialize(): void {
    this.isInitialized = true;
    this.info('Logger initialized');
  }

  setUserContext(user: UserContext): void {
    this.userContext = user;
  }

  clearUserContext(): void {
    this.userContext = null;
  }

  setContext(key: string, value: any): void {
    this.globalContext[key] = value;
  }

  private formatMessage(level: string, message: string, context?: LogContext, metadata?: LogMetadata, error?: Error): void {
    if (!this.isInitialized && level !== 'info') return;

    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(metadata && { metadata }),
      ...(this.userContext && { user: this.userContext }),
      ...(Object.keys(this.globalContext).length > 0 && { global: this.globalContext }),
      ...(error && { 
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      }),
    };

    // In development, use console methods for better formatting
    if (import.meta.env?.MODE === 'development') {
      switch (level) {
        case 'error':
          console.error(`[${level.toUpperCase()}] ${message}`, logData);
          break;
        case 'warn':
          console.warn(`[${level.toUpperCase()}] ${message}`, logData);
          break;
        case 'debug':
          console.debug(`[${level.toUpperCase()}] ${message}`, logData);
          break;
        default:
          console.log(`[${level.toUpperCase()}] ${message}`, logData);
      }
    } else {
      // In production, use structured JSON logging
      console.log(JSON.stringify(logData));
    }
  }

  debug(message: string, options?: { context?: LogContext; metadata?: LogMetadata }): void {
    this.formatMessage('debug', message, options?.context, options?.metadata);
  }

  info(message: string, options?: { context?: LogContext; metadata?: LogMetadata }): void {
    this.formatMessage('info', message, options?.context, options?.metadata);
  }

  warn(message: string, options?: { context?: LogContext; metadata?: LogMetadata; error?: Error }): void {
    this.formatMessage('warn', message, options?.context, options?.metadata, options?.error);
  }

  error(message: string, options?: { context?: LogContext; metadata?: LogMetadata; error?: Error }): void {
    this.formatMessage('error', message, options?.context, options?.metadata, options?.error);
  }
}

export const logger = new Logger();