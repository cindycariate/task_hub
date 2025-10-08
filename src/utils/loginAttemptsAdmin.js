/**
 * Admin utilities for managing login attempts
 * Use these functions in browser console for testing and administration
 */

import { 
  checkLockoutStatus, 
  clearAllAttempts, 
  recordFailedAttempt,
  formatRemainingTime
} from './loginAttempts.js'

/**
 * Test the lockout system by simulating failed attempts
 * @param {string} email - Email to test with
 * @param {number} attempts - Number of attempts to simulate
 */
export const simulateFailedAttempts = (email, attempts = 3) => {
  console.log(`🧪 Simulating ${attempts} failed attempts for ${email}`)
  
  for (let i = 0; i < attempts; i++) {
    const status = recordFailedAttempt(email)
    console.log(`Attempt ${i + 1}:`, {
      isLocked: status.isLocked,
      attemptsLeft: status.attemptsLeft,
      remainingTime: status.remainingTime ? formatRemainingTime(status.remainingTime) : 'N/A'
    })
  }
  
  return checkLockoutStatus(email)
}

/**
 * Check the status of a specific email
 * @param {string} email - Email to check
 */
export const checkEmailStatus = (email) => {
  const status = checkLockoutStatus(email)
  console.log(`📧 Status for ${email}:`, {
    isLocked: status.isLocked,
    attemptsLeft: status.attemptsLeft,
    remainingTime: status.remainingTime ? formatRemainingTime(status.remainingTime) : 'N/A'
  })
  return status
}

/**
 * View all stored login attempts
 */
export const viewAllAttempts = () => {
  try {
    const stored = localStorage.getItem('login_attempts')
    const attempts = stored ? JSON.parse(stored) : {}
    console.log('📊 All stored login attempts:', attempts)
    return attempts
  } catch (error) {
    console.error('Error reading attempts:', error)
    return {}
  }
}

/**
 * Clear all login attempts (admin function)
 */
export const clearAllLoginAttempts = () => {
  clearAllAttempts()
  console.log('🧹 All login attempts cleared')
}

/**
 * Test the complete lockout flow
 * @param {string} email - Email to test with
 */
export const testLockoutFlow = (email = 'test@example.com') => {
  console.log('🔒 Testing complete lockout flow...')
  
  // Clear any existing data for this email
  clearAllAttempts()
  
  // Simulate 3 failed attempts
  const finalStatus = simulateFailedAttempts(email, 3)
  
  console.log('✅ Test complete. Final status:', finalStatus)
  
  if (finalStatus.isLocked) {
    console.log(`🚫 Email ${email} is now locked for ${formatRemainingTime(finalStatus.remainingTime)}`)
  }
  
  return finalStatus
}

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.loginAttemptsAdmin = {
    simulateFailedAttempts,
    checkEmailStatus,
    viewAllAttempts,
    clearAllLoginAttempts,
    testLockoutFlow
  }
  
  console.log('🛠️ Login attempts admin tools loaded. Access via window.loginAttemptsAdmin')
}