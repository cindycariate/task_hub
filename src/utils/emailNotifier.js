// src/utils/emailNotifier.js

import { supabase } from '@/utils/supabase'

/**
 * Send deadline email notification via Supabase Edge Function
 * @param {string} taskId - Task ID
 * @param {string} userId - User ID
 * @param {string} taskTitle - Task title
 * @param {string|Date} deadline - Task deadline
 * @returns {Promise<Object>} Response from function
 */
export const sendDeadlineEmail = async (taskId, userId, taskTitle, deadline) => {
  try {
    const projectUrl = supabase.supabaseUrl
    const functionName = 'send_deadline_email'

    // Get current session for auth token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.access_token) {
      throw new Error('No active session')
    }

    // Call the Edge Function
    const response = await fetch(`${projectUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        taskId,
        userId,
        taskTitle,
        deadline,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending deadline email:', error.message)
    throw error
  }
}
