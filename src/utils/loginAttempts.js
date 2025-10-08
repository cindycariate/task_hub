/**
 * Login Attempt Tracker
 * Prevents brute force attacks by tracking failed login attempts
 * and implementing temporary lockouts
 */

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const STORAGE_KEY = 'login_attempts'

/**
 * Get stored login attempts from localStorage
 * @returns {Object} Login attempts data
 */
const getStoredAttempts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading login attempts from storage:', error)
    return {}
  }
}

/**
 * Save login attempts to localStorage
 * @param {Object} attempts - Login attempts data
 */
const saveAttempts = (attempts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  } catch (error) {
    console.error('Error saving login attempts to storage:', error)
  }
}

/**
 * Clean up expired lockouts
 * @param {Object} attempts - Login attempts data
 * @returns {Object} Cleaned attempts data
 */
const cleanExpiredLockouts = (attempts) => {
  const now = Date.now()
  const cleaned = {}
  
  for (const [email, data] of Object.entries(attempts)) {
    if (data.lockedUntil && now >= data.lockedUntil) {
      // Lockout has expired, reset attempts
      continue
    }
    cleaned[email] = data
  }
  
  return cleaned
}

/**
 * Check if an email is currently locked out
 * @param {string} email - Email address to check
 * @returns {Object} Lockout status with remaining time
 */
export const checkLockoutStatus = (email) => {
  if (!email) return { isLocked: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS }
  
  const attempts = cleanExpiredLockouts(getStoredAttempts())
  const emailData = attempts[email.toLowerCase()]
  
  if (!emailData) {
    return { isLocked: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS }
  }
  
  const now = Date.now()
  
  // Check if currently locked
  if (emailData.lockedUntil && now < emailData.lockedUntil) {
    return {
      isLocked: true,
      remainingTime: emailData.lockedUntil - now,
      attemptsLeft: 0,
      lockoutTime: emailData.lockedUntil
    }
  }
  
  // Not locked, return remaining attempts
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (emailData.attempts || 0))
  return {
    isLocked: false,
    remainingTime: 0,
    attemptsLeft
  }
}

/**
 * Record a failed login attempt
 * @param {string} email - Email address
 * @returns {Object} Updated lockout status
 */
export const recordFailedAttempt = (email) => {
  if (!email) return { isLocked: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS }
  
  const attempts = cleanExpiredLockouts(getStoredAttempts())
  const emailKey = email.toLowerCase()
  const now = Date.now()
  
  // Initialize or update attempt data
  if (!attempts[emailKey]) {
    attempts[emailKey] = {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now
    }
  }
  
  attempts[emailKey].attempts += 1
  attempts[emailKey].lastAttempt = now
  
  // Check if we need to lock the account
  if (attempts[emailKey].attempts >= MAX_ATTEMPTS) {
    attempts[emailKey].lockedUntil = now + LOCKOUT_DURATION
    attempts[emailKey].attempts = 0 // Reset for next cycle
  }
  
  saveAttempts(attempts)
  return checkLockoutStatus(email)
}

/**
 * Record a successful login (clears attempts)
 * @param {string} email - Email address
 */
export const recordSuccessfulLogin = (email) => {
  if (!email) return
  
  const attempts = getStoredAttempts()
  const emailKey = email.toLowerCase()
  
  // Remove the email's attempt data
  if (attempts[emailKey]) {
    delete attempts[emailKey]
    saveAttempts(attempts)
  }
}

/**
 * Format remaining time for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatRemainingTime = (milliseconds) => {
  const minutes = Math.ceil(milliseconds / (60 * 1000))
  
  if (minutes === 1) {
    return '1 minute'
  }
  
  return `${minutes} minutes`
}

/**
 * Get lockout configuration for display
 * @returns {Object} Configuration details
 */
export const getLockoutConfig = () => ({
  maxAttempts: MAX_ATTEMPTS,
  lockoutDurationMinutes: LOCKOUT_DURATION / (60 * 1000)
})

/**
 * Clear all login attempts (admin function)
 */
export const clearAllAttempts = () => {
  localStorage.removeItem(STORAGE_KEY)
}