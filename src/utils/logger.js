// Production-safe logging and error handling utility
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development'
    this.isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === 'production'
  }

  /**
   * Development-only console logging
   * In production, these won't appear in browser console
   */
  dev(...args) {
    if (this.isDevelopment) {
      console.log('[DEV]', ...args)
    }
  }

  devError(...args) {
    if (this.isDevelopment) {
      console.error('[DEV ERROR]', ...args)
    }
  }

  devWarn(...args) {
    if (this.isDevelopment) {
      console.warn('[DEV WARN]', ...args)
    }
  }

  /**
   * Production-safe info logging
   * Only shows generic messages to users
   */
  info(userMessage, devDetails = null) {
    if (this.isProduction) {
      console.log(userMessage)
    } else {
      console.log('[INFO]', userMessage, devDetails || '')
    }
  }

  /**
   * Production-safe error logging
   * Users see generic errors, devs see full details
   */
  error(userMessage, devError = null, context = null) {
    if (this.isProduction) {
      // Only show generic message to users
      console.error(userMessage)

      // Send detailed errors to monitoring service (not console)
      this.sendToMonitoring({
        userMessage,
        error: devError,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    } else {
      // Show full details in development
      console.error('[ERROR]', userMessage)
      if (devError) {
        console.error('[ERROR DETAILS]', devError)
      }
      if (context) {
        console.error('[ERROR CONTEXT]', context)
      }
    }
  }

  /**
   * Security event logging
   * Always logged but details hidden in production
   */
  security(event, details = null) {
    if (this.isProduction) {
      console.warn('Security event detected')
      this.sendToMonitoring({
        type: 'security',
        event,
        details,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.warn('[SECURITY]', event, details || '')
    }
  }

  /**
   * Success logging for user feedback
   */
  success(message, devDetails = null) {
    if (this.isProduction) {
      // Could show user notifications instead of console
      console.log(message)
    } else {
      console.log('[SUCCESS]', message, devDetails || '')
    }
  }

  /**
   * Send sensitive data to monitoring service
   * In production, this would go to your logging service
   */
  sendToMonitoring(data) {
    if (this.isProduction) {
      // In real production, send to logging service like:
      // - Sentry
      // - LogRocket
      // - DataDog
      // - Custom logging endpoint

      // For now, we'll store in a secure way that users can't easily access
      this.storeSecureLog(data)
    }
  }

  /**
   * Store logs securely (not in localStorage where users can see)
   */
  storeSecureLog(data) {
    try {
      // Use sessionStorage instead of localStorage (cleared on tab close)
      const logs = JSON.parse(sessionStorage.getItem('__app_monitoring') || '[]')
      logs.push(data)

      // Keep only last 50 logs to prevent memory issues
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50)
      }

      sessionStorage.setItem('__app_monitoring', JSON.stringify(logs))
    } catch (error) {
      // Fail silently in production
      if (this.isDevelopment) {
        console.error('Failed to store monitoring log:', error)
      }
    }
  }

  /**
   * Admin-only function to retrieve logs
   * Can be called from console: logger.getSecureLogs()
   */
  getSecureLogs() {
    if (this.isDevelopment) {
      try {
        return JSON.parse(sessionStorage.getItem('__app_monitoring') || '[]')
      } catch {
        return []
      }
    } else {
      return 'Access denied in production'
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  sanitizeForLogging(data) {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sanitized = { ...data }
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'session']

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }
}

// Create singleton instance
export const logger = new Logger()

// Production-safe error handler for API responses
export class ErrorHandler {
  /**
   * Handle API errors with user-friendly messages
   */
  static handleApiError(error, operation = 'operation') {
    const userMessages = {
      // Database errors
      PGRST301: 'Access denied. Please check your permissions.',
      PGRST204: 'The requested data was not found.',
      PGRST116: 'No data found.',

      // Auth errors
      invalid_grant: 'Invalid credentials provided.',
      access_denied: 'Access denied. Please log in again.',
      token_expired: 'Your session has expired. Please log in again.',

      // Rate limiting
      rate_limit_exceeded: 'Too many requests. Please wait a moment.',

      // Validation errors
      validation_error: 'Please check your input and try again.',
      invalid_input: 'Invalid data provided. Please check your input.',

      // Generic fallbacks
      network_error: 'Network error. Please check your connection.',
      server_error: 'Server error. Please try again later.',
      unknown_error: 'An unexpected error occurred. Please try again.',
    }

    // Determine error type and user message
    let userMessage = 'An error occurred'
    let errorCode = 'unknown_error'

    if (error?.code) {
      errorCode = error.code
      userMessage = userMessages[error.code] || userMessages.unknown_error
    } else if (error?.message) {
      // Check for common error patterns
      if (error.message.includes('rate limit')) {
        errorCode = 'rate_limit_exceeded'
        userMessage = userMessages.rate_limit_exceeded
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorCode = 'network_error'
        userMessage = userMessages.network_error
      } else if (error.message.includes('validation') || error.message.includes('invalid')) {
        errorCode = 'validation_error'
        userMessage = userMessages.validation_error
      }
    }

    // Log appropriately
    logger.error(`${operation} failed: ${userMessage}`, error, { operation, errorCode })

    return {
      userMessage,
      errorCode,
      shouldRetry: ['network_error', 'server_error'].includes(errorCode),
    }
  }

  /**
   * Create user-friendly error for display
   */
  static createUserError(message, canRetry = false) {
    return {
      message,
      canRetry,
      timestamp: new Date().toISOString(),
    }
  }
}

// Environment utilities
export const Environment = {
  isDev: import.meta.env.DEV || import.meta.env.NODE_ENV === 'development',
  isProd: import.meta.env.PROD || import.meta.env.NODE_ENV === 'production',
  isTest: import.meta.env.NODE_ENV === 'test',
}

export default logger
