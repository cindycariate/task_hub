// Enhanced input validation and sanitization utilities
import DOMPurify from 'isomorphic-dompurify'

export class InputValidator {
  // SQL injection patterns to detect
  static SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/i,
    /(--|\*\/|\/\*)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /('|\"|;|\\)/,
    /(\bSCRIPT\b)/i,
    /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT|ONLOAD|ONERROR)\b)/i,
  ]

  // XSS patterns to detect
  static XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<.*?>/g,
  ]

  /**
   * Validate and sanitize text input
   */
  static sanitizeText(input, maxLength = 1000) {
    if (!input || typeof input !== 'string') return ''

    // Remove potential SQL injection patterns
    let sanitized = input.trim()

    // Length validation
    if (sanitized.length > maxLength) {
      throw new Error(`Input too long. Maximum ${maxLength} characters allowed.`)
    }

    // Check for SQL injection patterns
    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        console.warn('Potential SQL injection attempt detected:', sanitized)
        throw new Error('Invalid input detected. Please check your data.')
      }
    }

    // Check for XSS patterns
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(sanitized)) {
        console.warn('Potential XSS attempt detected:', sanitized)
        sanitized = sanitized.replace(pattern, '')
      }
    }

    // HTML sanitization using DOMPurify
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    })

    return sanitized
  }

  /**
   * Validate task title
   */
  static validateTaskTitle(title) {
    const sanitized = this.sanitizeText(title, 200)

    if (!sanitized || sanitized.length < 1) {
      throw new Error('Task title is required and cannot be empty.')
    }

    // Additional business logic validation
    if (/^\s*$/.test(sanitized)) {
      throw new Error('Task title cannot be only whitespace.')
    }

    return sanitized
  }

  /**
   * Validate task description
   */
  static validateTaskDescription(description) {
    if (!description) return null
    return this.sanitizeText(description, 1000)
  }

  /**
   * Validate task notes
   */
  static validateTaskNotes(notes) {
    if (!notes) return null
    return this.sanitizeText(notes, 2000)
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    const sanitized = this.sanitizeText(email, 254)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format.')
    }

    return sanitized.toLowerCase()
  }

  /**
   * Validate UUID
   */
  static validateUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuid || !uuidRegex.test(uuid)) {
      throw new Error('Invalid UUID format.')
    }

    return uuid
  }

  /**
   * Validate date input
   */
  static validateDate(dateString) {
    if (!dateString) return null

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format.')
    }

    // Check for reasonable date range (not too far in past or future)
    const now = new Date()
    const minDate = new Date(now.getFullYear() - 10, 0, 1)
    const maxDate = new Date(now.getFullYear() + 10, 11, 31)

    if (date < minDate || date > maxDate) {
      throw new Error('Date must be within reasonable range.')
    }

    return date.toISOString()
  }

  /**
   * Validate status name
   */
  static validateStatus(status) {
    const allowedStatuses = ['To Do', 'In Progress', 'Done']
    const sanitized = this.sanitizeText(status, 50)

    if (!allowedStatuses.includes(sanitized)) {
      throw new Error('Invalid status. Must be one of: ' + allowedStatuses.join(', '))
    }

    return sanitized
  }

  /**
   * Validate priority level
   */
  static validatePriority(priority) {
    const allowedPriorities = ['Urgent', 'Important', 'Routine']
    const sanitized = this.sanitizeText(priority, 50)

    if (!allowedPriorities.includes(sanitized)) {
      throw new Error('Invalid priority. Must be one of: ' + allowedPriorities.join(', '))
    }

    return sanitized
  }
}

// Rate limiting utility
export class RateLimiter {
  static attempts = new Map()

  static isRateLimited(identifier, maxAttempts = 10, windowMs = 60000) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []

    // Remove expired attempts
    const validAttempts = userAttempts.filter((timestamp) => now - timestamp < windowMs)

    if (validAttempts.length >= maxAttempts) {
      return true
    }

    // Add current attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)

    return false
  }

  static resetAttempts(identifier) {
    this.attempts.delete(identifier)
  }
}
