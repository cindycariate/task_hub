<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase' // Import Supabase for auth

const isDrawerVisible = ref(true)
const tab = ref(1)

// For task management
const taskStore = useTaskStore()

// For user profile
const user = ref({
  fullName: '',
  email: '',
  firstname: '',
  lastname: '',
  avatarUrl: '', // Profile picture URL
})

onMounted(async () => {
  // Fetch user metadata from Supabase
  const { data: session, error: authError } = await supabase.auth.getSession()
  if (authError) {
    console.error('Error fetching session:', authError.message)
    return
  }

  if (session) {
    // Fetch user profile from the Supabase user metadata
    const { data, error } = await supabase
      .from('profiles')
      .select('firstname, lastname, email, avatar_url')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error.message)
    } else {
      user.value = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        avatarUrl: data.avatar_url || '',
        fullName: `${data.firstname} ${data.lastname}`, // Combining first and last name
      }
    }
  }
})

// Function to update the user's profile information
const updateUserProfile = async () => {
  const { data: session, error: authError } = await supabase.auth.getSession()
  if (authError) {
    console.error('Error fetching session:', authError.message)
    return
  }

  if (session) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        firstname: user.value.firstname,
        lastname: user.value.lastname,
        email: user.value.email,
        avatar_url: user.value.avatarUrl,
      })
      .eq('id', session.user.id)

    if (error) {
      console.error('Error updating profile:', error.message)
    } else {
      alert('Profile updated successfully!')
    }
  }
}

// Function to change the profile picture (example functionality)
const changeProfilePicture = async (newAvatarUrl) => {
  // For now, assume the new avatar URL is passed
  user.value.avatarUrl = newAvatarUrl
  await updateUserProfile() // Save the updated avatar URL
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

          <!-- Profile and Task Management Sections -->
          <v-row>
            <!-- Profile Picture Section -->
            <v-col cols="12" md="3" class="d-flex flex-column align-center justify-center">
              <v-avatar color="#26C6DA" size="100" class="mt-2 mb-3">
                <img :src="user.avatarUrl || 'default-avatar-url.png'" alt="Profile" />
              </v-avatar>
              <v-btn
                color="#00838f"
                class="change-photo-btn"
                prepend-icon="mdi-camera"
                @click="changeProfilePicture('new-avatar-url.png')"
              >
                Change Photo
              </v-btn>
            </v-col>

            <!-- Profile Information Section -->
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12">
                  <p class="text-h6 mt-5" style="color: #00838f; font-family: 'Poppins'">
                    <v-icon class="mr-1" color="cyan-darken-2"
                      >mdi mdi-account-circle-outline</v-icon
                    >
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

                <!-- First Name Field (used for internal management) -->
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    label="First Name"
                    variant="outlined"
                    v-model="user.firstname"
                    :rules="[(val) => !!val || 'First name is required']"
                  />
                </v-col>

                <!-- Last Name Field (used for internal management) -->
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    label="Last Name"
                    variant="outlined"
                    v-model="user.lastname"
                    :rules="[(val) => !!val || 'Last name is required']"
                  />
                </v-col>

                <!-- Save Changes Button -->
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="cyan-darken-2" @click="updateUserProfile" class="save-btn"
                    >Save Changes</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
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
