/**
 * Check if a task's deadline is within 24 hours
 * @param {Date|string} deadline - Task deadline
 * @returns {boolean} true if deadline is within 24 hours
 */
export const isDeadlineNear = (deadline) => {
  if (!deadline) return false

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60)

  return hoursUntilDeadline > 0 && hoursUntilDeadline <= 24
}

/**
 * Get human-readable time until deadline
 * @param {Date|string} deadline - Task deadline
 * @returns {string} e.g., "2 hours", "30 minutes"
 */
export const getTimeUntilDeadline = (deadline) => {
  if (!deadline) return ''

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const minutesUntil = Math.floor((deadlineDate - now) / (1000 * 60))

  if (minutesUntil < 0) return 'Past due'
  if (minutesUntil < 60) return `${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`

  const hoursUntil = Math.floor(minutesUntil / 60)
  return `${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`
}

/**
 * Get all tasks with near deadlines
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Tasks with deadlines within 24 hours
 */
export const getTasksWithNearDeadlines = (tasks) => {
  return tasks.filter((task) => isDeadlineNear(task.deadline))
}
