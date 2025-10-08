<template>
  <div class="reset-password-container">
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="mx-auto" max-width="500" elevation="8">
        <v-card-title class="text-center pa-6">
          <v-icon color="cyan-darken-2" size="32" class="mb-2">mdi-lock-reset</v-icon>
          <div class="text-h5" style="color: #00838f; font-family: 'Poppins', sans-serif">
            Set New Password
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-8">
            <v-progress-circular
              color="cyan-darken-2"
              indeterminate
              size="48"
            ></v-progress-circular>
            <p class="mt-4 text-grey-darken-1">Verifying reset token...</p>
          </div>

          <!-- Error State -->
          <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            prominent
          >
            <v-alert-title class="font-weight-bold">
              <v-icon class="mr-2">mdi-alert-circle</v-icon>
              Invalid or Expired Link
            </v-alert-title>
            <div class="mt-2">
              {{ error }}
            </div>
            <div class="text-caption mt-2">
              Password reset links expire after 1 hour for security reasons.
            </div>
          </v-alert>

          <!-- Success State -->
          <v-alert
            v-else-if="passwordUpdated"
            type="success"
            variant="tonal"
            class="mb-4"
            prominent
          >
            <v-alert-title class="font-weight-bold">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Password Updated Successfully!
            </v-alert-title>
            <div class="mt-2">
              Your password has been changed. You can now log in with your new password.
            </div>
          </v-alert>

          <!-- Reset Form -->
          <div v-else-if="isValidToken">
            <p class="text-body-2 mb-4 text-grey-darken-1">
              Please enter your new password below. Make sure it's strong and secure.
            </p>

            <AlertNotification
              :form-error-message="formAction.formErrorMessage"
            />

            <v-form ref="refVform" @submit.prevent="onFormSubmit">
              <!-- New Password Field -->
              <v-text-field
                v-model="formData.password"
                label="New Password"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                prepend-inner-icon="mdi-lock-plus"
                color="cyan-darken-3"
                class="mb-3"
                :disabled="formAction.formProcess"
              />

              <!-- Password Strength Indicator -->
              <div v-if="formData.password" class="mb-4">
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

              <!-- Confirm Password Field -->
              <v-text-field
                v-model="formData.confirmPassword"
                label="Confirm New Password"
                variant="outlined"
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="confirmPasswordRules"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                prepend-inner-icon="mdi-lock-check"
                color="cyan-darken-3"
                class="mb-4"
                :disabled="formAction.formProcess"
              />

              <v-btn
                type="submit"
                color="cyan-darken-2"
                block
                size="large"
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess || passwordStrength.score < 4"
                class="mb-4"
              >
                <v-icon left class="mr-2">mdi-content-save</v-icon>
                Update Password
              </v-btn>
            </v-form>
          </div>

          <!-- Action Buttons -->
          <div class="text-center">
            <v-btn
              v-if="passwordUpdated"
              color="cyan-darken-2"
              variant="outlined"
              @click="goToLogin"
              class="mb-2"
            >
              <v-icon left class="mr-2">mdi-login</v-icon>
              Go to Login
            </v-btn>

            <v-btn
              v-else-if="error"
              color="cyan-darken-2"
              variant="outlined"
              @click="requestNewLink"
              class="mb-2"
            >
              <v-icon left class="mr-2">mdi-email-send</v-icon>
              Request New Link
            </v-btn>

            <v-btn
              variant="text"
              color="grey-darken-1"
              @click="goToLogin"
              block
            >
              <v-icon left class="mr-2">mdi-arrow-left</v-icon>
              Back to Login
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase'
import AlertNotification from '@/components/common/AlertNotification.vue'

const route = useRoute()
const router = useRouter()

// Reactive data
const formData = ref({
  password: '',
  confirmPassword: ''
})

const formAction = ref({ ...formActionDefault })
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(true)
const isValidToken = ref(false)
const passwordUpdated = ref(false)
const error = ref('')
const refVform = ref()

// Password strength computation
const passwordStrength = computed(() => {
  const password = formData.value.password
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
    { text: 'Strong', color: 'green' }
  ]
  
  return {
    score,
    text: strengthLevels[score]?.text || 'Very Weak',
    color: strengthLevels[score]?.color || 'red',
    feedback: feedback.length ? `Missing: ${feedback.join(', ')}` : 'Password meets requirements'
  }
})

// Form validation rules
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters long',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
  v => /\d/.test(v) || 'Password must contain at least one number',
  v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character'
]

const confirmPasswordRules = [
  v => !!v || 'Please confirm your password',
  v => v === formData.value.password || 'Passwords do not match'
]

// Check if reset token is valid
const verifyResetToken = async () => {
  try {
    // Get the session from the URL hash (Supabase redirects with tokens in hash)
    const { data, error } = await supabase.auth.getSession()
    
    if (error || !data.session) {
      throw new Error('Invalid or expired reset link. Please request a new password reset.')
    }
    
    isValidToken.value = true
  } catch (err) {
    console.error('Token verification error:', err)
    error.value = err.message || 'Invalid or expired reset link.'
  } finally {
    isLoading.value = false
  }
}

// Handle password update
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.value.password
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      formAction.value.formErrorMessage = updateError.message || 'Failed to update password. Please try again.'
    } else {
      passwordUpdated.value = true
      console.log('Password updated successfully')
      
      // Clear form data
      formData.value.password = ''
      formData.value.confirmPassword = ''
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred. Please try again.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Form submission handler
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid && passwordStrength.value.score >= 4) {
      onSubmit()
    }
  })
}

// Navigation functions
const goToLogin = () => {
  router.push('/auth/login')
}

const requestNewLink = () => {
  router.push('/auth/login')
}

// Initialize component
onMounted(() => {
  verifyResetToken()
})
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
}

.v-card {
  border-radius: 16px;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}
</style>