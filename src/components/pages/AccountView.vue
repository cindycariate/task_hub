<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const tab = ref(1)

// For user profile
const user = ref({
  email: '',
  password: '',
  newPassword: '',
})

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
    } else {
      console.log('User profile updated successfully')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
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
          <v-col cols="12" md="9">
            <v-row>
              <v-col cols="12">
                <p class="text-h6 mt-5" style="color: #00838f; font-family: 'Poppins'">
                  <v-icon class="mr-1" color="cyan-darken-2">mdi mdi-account-circle-outline</v-icon>
                  <b>Profile Information</b>
                </p>
              </v-col>

              <!-- Email Address Field -->
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  label="Email Address"
                  variant="outlined"
                  v-model="user.email"
                  :rules="[(val) => !!val || 'Email is required']"
                />
              </v-col>

              <!-- New Password Field -->
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  label="New Password"
                  variant="outlined"
                  v-model="user.newPassword"
                  type="password"
                  :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
                />
              </v-col>

              <!-- Save Changes Button -->
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="cyan-darken-2" @click="handleUpdateUserProfile" class="save-btn"
                  >Save Changes</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
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
