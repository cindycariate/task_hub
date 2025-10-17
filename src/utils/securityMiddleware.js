// Security middleware for API requests
import { supabase } from '@/utils/supabase'

export class SecurityMiddleware {
  // Content Security Policy headers
  static CSP_HEADERS = {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: Remove unsafe-* in production
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; '),
  }

  // Rate limiting for different operations
  static RATE_LIMITS = {
    task_creation: { max: 20, window: 60000 },
    task_update: { max: 50, window: 60000 },
    login_attempts: { max: 5, window: 300000 },
    api_requests: { max: 100, window: 60000 },
  }

  /**
   * Validate user session and permissions
   */
  static async validateSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Session validation error:', error)
        return null
      }

      if (!session) {
        console.warn('No active session found')
        return null
      }

      // Check if session is expired
      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        console.warn('Session expired')
        await supabase.auth.signOut()
        return null
      }

      return session
    } catch (error) {
      console.error('Session validation failed:', error)
      return null
    }
  }

  /**
   * Validate that user owns the resource
   */
  static async validateResourceOwnership(resourceType, resourceId, userId) {
    try {
      let query

      switch (resourceType) {
        case 'task':
          query = supabase
            .from('tasks')
            .select('user_id')
            .eq('id', resourceId)
            .eq('user_id', userId)
            .single()
          break

        case 'note':
          query = supabase
            .from('notes')
            .select('user_id')
            .eq('id', resourceId)
            .eq('user_id', userId)
            .single()
          break

        default:
          throw new Error('Unknown resource type')
      }

      const { data, error } = await query

      if (error || !data) {
        console.warn(`Resource ownership validation failed for ${resourceType}:${resourceId}`)
        return false
      }

      return true
    } catch (error) {
      console.error('Resource ownership validation error:', error)
      return false
    }
  }

  /**
   * Secure API request wrapper
   */
  static async secureRequest(operation, ...args) {
    try {
      // Validate session first
      const session = await this.validateSession()
      if (!session) {
        throw new Error('Authentication required')
      }

      // Apply rate limiting
      const userId = session.user.id
      if (this.isRateLimited(userId, 'api_requests')) {
        throw new Error('Rate limit exceeded. Please slow down.')
      }

      // Execute the operation
      const result = await operation(...args)

      return result
    } catch (error) {
      console.error('Secure request failed:', error)
      throw error
    }
  }

  /**
   * Rate limiting check
   */
  static isRateLimited(identifier, operationType) {
    const limits = this.RATE_LIMITS[operationType]
    if (!limits) return false

    const key = `${operationType}_${identifier}`
    const now = Date.now()

    // Get or create attempt history
    let attempts = JSON.parse(localStorage.getItem(key) || '[]')

    // Remove expired attempts
    attempts = attempts.filter((timestamp) => now - timestamp < limits.window)

    // Check if limit exceeded
    if (attempts.length >= limits.max) {
      return true
    }

    // Add current attempt
    attempts.push(now)
    localStorage.setItem(key, JSON.stringify(attempts))

    return false
  }

  /**
   * Clear rate limit for a user (e.g., after successful action)
   */
  static clearRateLimit(identifier, operationType) {
    const key = `${operationType}_${identifier}`
    localStorage.removeItem(key)
  }

  /**
   * Secure headers for fetch requests
   */
  static getSecureHeaders() {
    return {
      ...this.CSP_HEADERS,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  }
}

// Vue plugin for global security middleware
export default {
  install(app) {
    app.config.globalProperties.$security = SecurityMiddleware
    app.provide('security', SecurityMiddleware)
  },
}
