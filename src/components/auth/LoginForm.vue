<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AlertNotification from '@/components/common/AlertNotification.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'
import {
  checkLockoutStatus,
  recordFailedAttempt,
  recordSuccessfulLogin,
  formatRemainingTime,
  getLockoutConfig
} from '@/utils/loginAttempts'

// Load variables
const router = useRouter()

// Pass the data here..?
const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})
const formAction = ref({ ...formActionDefault })

const visible = ref(false)
const refVform = ref()
const lockoutStatus = ref({ isLocked: false, remainingTime: 0, attemptsLeft: 3 })
const countdownInterval = ref(null)
const showForgotPassword = ref(false)

// Computed properties
const isFormDisabled = computed(() => lockoutStatus.value.isLocked || formAction.value.formProcess)
const lockoutConfig = getLockoutConfig()

// Toggle forgot password form
const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value
}

// Check lockout status when email changes
const checkEmailLockout = () => {
  if (formData.value.email) {
    lockoutStatus.value = checkLockoutStatus(formData.value.email)
    
    if (lockoutStatus.value.isLocked) {
      startCountdown()
    } else {
      stopCountdown()
    }
  }
}

// Start countdown timer
const startCountdown = () => {
  stopCountdown() // Clear any existing countdown
  
  countdownInterval.value = setInterval(() => {
    lockoutStatus.value = checkLockoutStatus(formData.value.email)
    
    if (!lockoutStatus.value.isLocked) {
      stopCountdown()
    }
  }, 1000)
}

// Stop countdown timer
const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const onSubmit = async () => {
  // Check lockout status before attempting login
  const currentStatus = checkLockoutStatus(formData.value.email)
  if (currentStatus.isLocked) {
    formAction.value.formErrorMessage = `Account temporarily locked. Try again in ${formatRemainingTime(currentStatus.remainingTime)}.`
    return
  }

  // Reset utils here
  formAction.value = { ...formActionDefault }
  // Turn on processing
  formAction.value.formProcess = true
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  // Add error message and status code
  if (error) {
    console.error(error)
    
    // Record failed attempt
    lockoutStatus.value = recordFailedAttempt(formData.value.email)
    
    if (lockoutStatus.value.isLocked) {
      formAction.value.formErrorMessage = `Too many failed attempts. Account locked for ${lockoutConfig.lockoutDurationMinutes} minutes.`
      startCountdown()
    } else {
      const attemptsLeft = lockoutStatus.value.attemptsLeft
      formAction.value.formErrorMessage = `${error.message} (${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining)`
    }
    
    formAction.value.formStatus = error.status
  } else if (data) {
    // Record successful login
    recordSuccessfulLogin(formData.value.email)
    lockoutStatus.value = { isLocked: false, remainingTime: 0, attemptsLeft: lockoutConfig.maxAttempts }
    
    // Add success message
    formAction.value.formSuccessMessage = 'Successfully Logged In.'
    router.replace('/pages/home')
  }

  refVform.value?.resetValidation()
  refVform.value?.reset()
  formAction.value.formProcess = false
}

onMounted(() => {
  // Check initial lockout status if email is pre-filled
  if (formData.value.email) {
    checkEmailLockout()
  }
})

onUnmounted(() => {
  stopCountdown()
})

const onFormSubmit = () => {
  // Don't allow form submission if account is locked
  if (lockoutStatus.value.isLocked) {
    formAction.value.formErrorMessage = `Account temporarily locked. Try again in ${formatRemainingTime(lockoutStatus.value.remainingTime)}.`
    return
  }
  
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <!-- Show Forgot Password Form -->
  <div v-if="showForgotPassword">
    <ForgotPasswordForm @back-to-login="toggleForgotPassword" />
  </div>

  <!-- Show Login Form -->
  <div v-else>
    <!-- Lockout Warning Banner -->
  <v-alert
    v-if="lockoutStatus.isLocked"
    type="warning"
    variant="tonal"
    class="mb-4"
    prominent
    border="start"
  >
    <v-alert-title class="font-weight-bold">
      <v-icon class="mr-2">mdi-lock-clock</v-icon>
      Account Temporarily Locked
    </v-alert-title>
    <div class="mt-2">
      Too many failed login attempts. Please try again in:
      <strong class="text-error">{{ formatRemainingTime(lockoutStatus.remainingTime) }}</strong>
    </div>
    <div class="text-caption mt-1">
      For security purposes, accounts are locked for {{ lockoutConfig.lockoutDurationMinutes }} minutes after {{ lockoutConfig.maxAttempts }} failed attempts.
    </div>
  </v-alert>

  <!-- Attempt Warning -->
  <v-alert
    v-else-if="!lockoutStatus.isLocked && lockoutStatus.attemptsLeft < lockoutConfig.maxAttempts && formData.email"
    type="warning"
    variant="tonal"
    class="mb-4"
    density="compact"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">mdi-alert</v-icon>
      <span>
        {{ lockoutStatus.attemptsLeft }} login attempt{{ lockoutStatus.attemptsLeft !== 1 ? 's' : '' }} remaining
      </span>
    </div>
  </v-alert>

  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />
  
  <v-form ref="refVform" @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
      :disabled="lockoutStatus.isLocked"
      @input="checkEmailLockout"
      @blur="checkEmailLockout"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator, passwordValidator]"
      :disabled="lockoutStatus.isLocked"
    ></v-text-field>

    <v-btn
      class="mt-2 text-white"
      type="submit"
      color="cyan-lighten-2"
      rounded="xl"
      block
      prepend-icon="mdi-login"
      :disabled="isFormDisabled"
      :loading="formAction.formProcess"
    >
      {{ lockoutStatus.isLocked ? 'Account Locked' : 'Log in' }}
    </v-btn>

    <!-- Forgot Password Link -->
    <div class="text-center mt-3">
      <v-btn
        variant="text"
        color="cyan-darken-2"
        size="small"
        @click="toggleForgotPassword"
        :disabled="lockoutStatus.isLocked"
      >
        <v-icon left size="small" class="mr-1">mdi-lock-question</v-icon>
        Forgot Password?
      </v-btn>
    </div>
    
    <!-- Security Information -->
    <div class="text-caption text-center mt-3 text-grey-darken-1">
      <v-icon size="small" class="mr-1">mdi-shield-check</v-icon>
      For security, accounts are temporarily locked after {{ lockoutConfig.maxAttempts }} failed attempts
    </div>
  </v-form>
  </div> <!-- End of login form container -->
</template>
