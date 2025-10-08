<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const tab = ref(1)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// For user profile
const user = ref({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Snackbar for feedback
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Password strength computation
const passwordStrength = computed(() => {
  const password = user.value.newPassword
  if (!password) return { score: 0, text: '', color: '' }

  let score = 0
  let feedback = []

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('at least 8 characters')

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('uppercase letter')

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('lowercase letter')

  // Number check
  if (/\d/.test(password)) score += 1
  else feedback.push('number')

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('special character')

  const strengthLevels = [
    { text: 'Very Weak', color: 'red' },
    { text: 'Weak', color: 'orange' },
    { text: 'Fair', color: 'yellow' },
    { text: 'Good', color: 'light-green' },
    { text: 'Strong', color: 'green' },
  ]

  return {
    score,
    text: strengthLevels[score]?.text || 'Very Weak',
    color: strengthLevels[score]?.color || 'red',
    feedback: feedback.length ? `Missing: ${feedback.join(', ')}` : 'Password meets requirements',
  }
})

// Form validation
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
]

const currentPasswordRules = [(v) => !!v || 'Current password is required for security']

const newPasswordRules = [
  (v) => !!v || 'New password is required',
  (v) => v.length >= 8 || 'Password must be at least 8 characters long',
  (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  (v) => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
  (v) => /\d/.test(v) || 'Password must contain at least one number',
  (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
]

const confirmPasswordRules = [
  (v) => !!v || 'Please confirm your password',
  (v) => v === user.value.newPassword || 'Passwords do not match',
]

onMounted(async () => {
  try {
    const { data: session, error: authError } = await supabase.auth.getSession()
    if (authError || !session?.session) {
      console.error('Error fetching session:', authError ? authError.message : 'No session found')
      return
    }

    // Get user email from auth
    user.value.email = session.session.user.email || ''
  } catch (error) {
    console.error('Unexpected error:', error)
  }
})

const verifyCurrentPassword = async (email, password) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return !error
  } catch (error) {
    return false
  }
}

const handleUpdateUserProfile = async () => {
  isLoading.value = true
  snackbar.value = false

  try {
    // Verify current password before making changes
    if (user.value.currentPassword) {
      const isCurrentPasswordValid = await verifyCurrentPassword(
        user.value.email,
        user.value.currentPassword,
      )
      if (!isCurrentPasswordValid) {
        snackbarMessage.value = 'Current password is incorrect. Please try again.'
        snackbarColor.value = 'error'
        snackbar.value = true
        isLoading.value = false
        return
      }
    }

    // Update user profile
    const updates = {}

    // Update email if changed
    if (user.value.email) {
      updates.email = user.value.email
    }

    // Update password if provided
    if (user.value.newPassword) {
      if (user.value.newPassword !== user.value.confirmPassword) {
        snackbarMessage.value = 'New passwords do not match.'
        snackbarColor.value = 'error'
        snackbar.value = true
        isLoading.value = false
        return
      }
      updates.password = user.value.newPassword
    }

    const { error: updateError } = await supabase.auth.updateUser(updates)

    if (updateError) {
      console.error('Error updating user profile:', updateError.message)
      snackbarMessage.value = updateError.message || 'Failed to save changes. Please try again.'
      snackbarColor.value = 'error'
    } else {
      console.log('User profile updated successfully')
      snackbarMessage.value = 'Profile updated successfully!'
      snackbarColor.value = 'success'

      // Clear password fields after successful update
      user.value.currentPassword = ''
      user.value.newPassword = ''
      user.value.confirmPassword = ''
    }

    snackbar.value = true
  } catch (error) {
    console.error('Unexpected error:', error)
    snackbarMessage.value = 'An unexpected error occurred. Please try again.'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <v-tab value="1">Account Settings</v-tab>
          </v-tabs>

          <!-- Profile Information Section -->
          <v-container class="pa-6">
            <!-- Section Header -->
            <v-row class="mb-4">
              <v-col cols="12">
                <p
                  class="text-h5 mb-2"
                  style="color: #00838f; font-family: 'Poppins', sans-serif; font-weight: bold"
                >
                  <v-icon class="mr-2" color="cyan-darken-2" size="24"
                    >mdi-account-circle-outline</v-icon
                  >
                  Profile Information
                </p>
                <p style="font-size: 14px; color: #757575; font-family: 'Poppins', sans-serif">
                  Update your email and password securely below.
                </p>
              </v-col>
            </v-row>

            <v-form>
              <!-- Email Address Field -->
              <v-row>
                <v-col cols="12" md="8" class="mb-3">
                  <v-text-field
                    label="Email Address"
                    v-model="user.email"
                    :rules="emailRules"
                    variant="outlined"
                    color="cyan-darken-3"
                    prepend-inner-icon="mdi-email-outline"
                  />
                </v-col>
              </v-row>

              <!-- Password Section -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <p
                    class="text-h6 mb-3"
                    style="color: #00838f; font-family: 'Poppins', sans-serif; font-weight: bold"
                  >
                    <v-icon class="mr-2" color="cyan-darken-2" size="20">mdi-lock-outline</v-icon>
                    Change Password
                  </p>
                  <p
                    style="
                      font-size: 12px;
                      color: #757575;
                      font-family: 'Poppins', sans-serif;
                      margin-bottom: 16px;
                    "
                  >
                    Leave password fields blank if you don't want to change your password.
                  </p>
                </v-col>
              </v-row>

              <!-- Current Password Field -->
              <v-row>
                <v-col cols="12" md="8" class="mb-3">
                  <v-text-field
                    label="Current Password"
                    variant="outlined"
                    v-model="user.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :rules="user.newPassword ? currentPasswordRules : []"
                    :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showCurrentPassword = !showCurrentPassword"
                    prepend-inner-icon="mdi-lock"
                    color="cyan-darken-3"
                    hint="Required for security when changing password"
                  />
                </v-col>
              </v-row>

              <!-- New Password Field -->
              <v-row>
                <v-col cols="12" md="8" class="mb-3">
                  <v-text-field
                    label="New Password"
                    variant="outlined"
                    v-model="user.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    :rules="user.newPassword ? newPasswordRules : []"
                    :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showNewPassword = !showNewPassword"
                    prepend-inner-icon="mdi-lock-plus"
                    color="cyan-darken-3"
                  />
                  <!-- Password Strength Indicator -->
                  <div v-if="user.newPassword" class="mt-2">
                    <v-progress-linear
                      :model-value="(passwordStrength.score / 5) * 100"
                      :color="passwordStrength.color"
                      height="4"
                      rounded
                    ></v-progress-linear>
                    <p
                      class="text-caption mt-1"
                      :style="`color: ${passwordStrength.color === 'yellow' ? '#F57F17' : passwordStrength.color}`"
                    >
                      Strength: {{ passwordStrength.text }}
                    </p>
                    <p class="text-caption" style="color: #757575">
                      {{ passwordStrength.feedback }}
                    </p>
                  </div>
                </v-col>
              </v-row>

              <!-- Confirm Password Field -->
              <v-row>
                <v-col cols="12" md="8" class="mb-3">
                  <v-text-field
                    label="Confirm New Password"
                    variant="outlined"
                    v-model="user.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :rules="user.newPassword ? confirmPasswordRules : []"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    prepend-inner-icon="mdi-lock-check"
                    color="cyan-darken-3"
                  />
                </v-col>
              </v-row>

              <!-- Save Changes Button -->
              <v-row class="mt-4">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    :color="
                      passwordStrength.score >= 4 || !user.newPassword ? 'cyan-darken-2' : 'grey'
                    "
                    :disabled="isLoading"
                    :loading="isLoading"
                    dark
                    class="px-8 py-2"
                    style="font-family: 'Poppins', sans-serif; font-weight: bold"
                    @click="handleUpdateUserProfile"
                  >
                    <v-icon left class="mr-2">mdi-content-save</v-icon>
                    Save Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>

          <!-- Enhanced Snackbar for Feedback -->
          <v-snackbar
            v-model="snackbar"
            :timeout="4000"
            :color="snackbarColor"
            location="top"
            rounded="pill"
          >
            <v-icon class="mr-2">
              {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
            {{ snackbarMessage }}
            <template #actions>
              <v-btn icon="mdi-close" size="small" @click="snackbar = false"></v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Profile Card */
.profile-card {
  color: #00838f;
  border-radius: 12px;
}

/* Avatar */

/* Change Photo Button */
.change-photo-btn {
  color: #00838f;
  text-transform: none;
  font-weight: 600;
}

/* Buttons */
.v-btn {
  text-transform: none;
  font-weight: 600;
}

.save-btn {
  margin-bottom: 10px;
  margin-right: 10px;
}

/* Typography */
p {
  margin: 0;
}
.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}

.custom-border {
  border: 2px solid #0097a7;
  border-radius: 8px;
}
</style>
