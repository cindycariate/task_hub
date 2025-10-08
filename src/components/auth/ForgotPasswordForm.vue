<template>
  <v-card class="mx-auto" max-width="400" elevation="8">
    <v-card-title class="text-center pa-6">
      <v-icon color="cyan-darken-2" size="32" class="mb-2">mdi-lock-reset</v-icon>
      <div class="text-h6" style="color: #00838f; font-family: 'Poppins', sans-serif">
        Reset Password
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <!-- Success Message -->
      <v-alert
        v-if="emailSent"
        type="success"
        variant="tonal"
        class="mb-4"
        prominent
      >
        <v-alert-title class="font-weight-bold">
          <v-icon class="mr-2">mdi-email-check</v-icon>
          Email Sent Successfully!
        </v-alert-title>
        <div class="mt-2">
          We've sent a password reset link to <strong>{{ formData.email }}</strong>
        </div>
        <div class="text-caption mt-2">
          Please check your inbox (and spam folder) for the reset link.
          The link will expire in 1 hour.
        </div>
      </v-alert>

      <!-- Form -->
      <div v-if="!emailSent">
        <p class="text-body-2 mb-4 text-grey-darken-1">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        <AlertNotification
          :form-error-message="formAction.formErrorMessage"
        />

        <v-form ref="refVform" @submit.prevent="onFormSubmit">
          <v-text-field
            v-model="formData.email"
            label="Email Address"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            :rules="[requiredValidator, emailValidator]"
            :disabled="formAction.formProcess"
            color="cyan-darken-3"
            class="mb-4"
          />

          <v-btn
            type="submit"
            color="cyan-darken-2"
            block
            size="large"
            :loading="formAction.formProcess"
            :disabled="formAction.formProcess"
            class="mb-4"
          >
            <v-icon left class="mr-2">mdi-email-send</v-icon>
            Send Reset Link
          </v-btn>
        </v-form>
      </div>

      <!-- Action Buttons -->
      <div class="text-center">
        <v-btn
          v-if="emailSent"
          color="cyan-darken-2"
          variant="outlined"
          @click="resetForm"
          class="mb-2"
        >
          <v-icon left class="mr-2">mdi-refresh</v-icon>
          Send Another Email
        </v-btn>

        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="$emit('back-to-login')"
          block
        >
          <v-icon left class="mr-2">mdi-arrow-left</v-icon>
          Back to Login
        </v-btn>
      </div>

      <!-- Help Text -->
      <div class="text-center mt-4">
        <p class="text-caption text-grey-darken-1">
          <v-icon size="small" class="mr-1">mdi-help-circle</v-icon>
          Didn't receive the email? Check your spam folder or contact support.
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'
import AlertNotification from '@/components/common/AlertNotification.vue'

// Define emits
const emit = defineEmits(['back-to-login'])

// Reactive data
const formData = ref({
  email: ''
})

const formAction = ref({ ...formActionDefault })
const emailSent = ref(false)
const refVform = ref()

// Reset form to initial state
const resetForm = () => {
  formData.value.email = ''
  formAction.value = { ...formActionDefault }
  emailSent.value = false
  refVform.value?.resetValidation()
}

// Handle password reset request
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.value.email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`
      }
    )

    if (error) {
      console.error('Password reset error:', error)
      
      // Handle specific error cases
      if (error.message.includes('Email not confirmed')) {
        formAction.value.formErrorMessage = 'Please verify your email address first before resetting your password.'
      } else if (error.message.includes('Invalid email')) {
        formAction.value.formErrorMessage = 'Please enter a valid email address.'
      } else {
        formAction.value.formErrorMessage = 'Unable to send reset email. Please try again or contact support.'
      }
    } else {
      // Success - show confirmation
      emailSent.value = true
      console.log('Password reset email sent successfully')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    formAction.value.formErrorMessage = 'An unexpected error occurred. Please try again.'
  } finally {
    formAction.value.formProcess = false
  }
}

// Form submission handler
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) {
      onSubmit()
    }
  })
}
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}
</style>