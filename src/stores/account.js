import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tkoyxzuvvlfxpqpndizu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb3l4enV2dmxmeHBxcG5kaXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODE5MjMsImV4cCI6MjA0NzA1NzkyM30.g0xqUGp8eKdS3BuFIPCw_E41kikDiEuznobJb4Qi1Cw',
)

export const useAccountStore = defineStore('account', {
  actions: {
    async updateAccount(email, currentPassword, newPassword) {
      const user = supabase.auth.user()

      if (!user) {
        throw new Error('User not logged in')
      }

      // Verify the current password by reauthenticating
      const { error: authError } = await supabase.auth.signIn({
        email: user.email,
        password: currentPassword,
      })

      if (authError) {
        throw new Error('Current password is incorrect')
      }

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.update({ email })
        if (emailError) {
          throw new Error(emailError.message)
        }
      }

      // Update password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.update({ password: newPassword })
        if (passwordError) {
          throw new Error(passwordError.message)
        }
      }
    },
  },
})
