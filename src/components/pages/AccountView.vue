<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const tab = ref(1)
const showPassword = ref(false) // Correct variable name for password visibility

// For user profile
const user = ref({
  email: '',
  password: '',
  newPassword: '',
})

// Snackbar for feedback
const snackbar = ref(false) // Controls the visibility of the snackbar
const snackbarMessage = ref('') // Message displayed in the snackbar

onMounted(async () => {
  try {
    const { data: session, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      console.error('Error fetching session:', authError ? authError.message : 'No session found')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error.message)
    } else {
      user.value.email = data.email
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
})

const handleUpdateUserProfile = async () => {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      email: user.value.email,
      password: user.value.newPassword || undefined, // Only update if a new password is provided
    })

    if (updateError) {
      console.error('Error updating user profile:', updateError.message)
      snackbarMessage.value = 'Failed to save changes. Please try again.' // Error feedback
    } else {
      console.log('User profile updated successfully')
      snackbarMessage.value = 'Profile updated successfully!' // Success feedback
    }

    snackbar.value = true // Show the snackbar
  } catch (error) {
    console.error('Unexpected error:', error)
    snackbarMessage.value = 'An unexpected error occurred. Please try again.'
    snackbar.value = true // Show the snackbar
  }
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <!-- Add Tab Headers if needed -->
          </v-tabs>

          <!-- Profile Information Section -->
          <!-- Profile Information Section -->
          <v-container class="pa-4">
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
                  Update your email and password below.
                </p>
              </v-col>
            </v-row>

            <!-- Form Fields -->
            <v-row>
              <!-- Email Address Field -->
              <v-col cols="12" sm="6" md="8" class="mb-3">
                <v-text-field
                  label="Email Address"
                  v-model="user.email"
                  :rules="[(val) => !!val || 'Email is required']"
                  outlined
                  dense
                  color="cyan-darken-3"
                />
              </v-col>

              <!-- New Password Field -->
              <v-col cols="12" sm="6" md="8" class="mb-3">
                <v-text-field
                  label="New Password"
                  variant="outlined"
                  v-model="user.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  color="cyan-darken-3"
                />
              </v-col>
            </v-row>

            <!-- Save Changes Button -->
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="cyan-darken-2"
                  dark
                  class="px-6 py-2"
                  style="font-family: 'Poppins', sans-serif; font-weight: bold"
                  @click="handleUpdateUserProfile"
                >
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

          <!-- Snackbar for Feedback -->
          <v-snackbar v-model="snackbar" timeout="3000" top>
            {{ snackbarMessage }}
            <template #actions>
              <v-btn text color="white" @click="snackbar = false">Close</v-btn>
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
