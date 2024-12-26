<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute to detect the current route
import { isAuthenticated } from '@/utils/supabase'
import BackgroundLayout from '../auth/BackgroundLayout.vue'
import ProfileHeader from './ProfileHeader.vue'
import SideNav from './navigation/SideNav.vue'
import LoadingScreen from '../auth/LoadingScreen.vue'

//for the Loading screen
const loading = ref(true)

// Simulated loading delay function
const showLoadingScreen = (delay = 2000) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, delay)
}

// Simulated logout function
const logout = async () => {
  showLoadingScreen() // Show loading screen during logout
  // Simulate logout process (replace with your real logout logic)
  setTimeout(() => {
    isLoggedIn.value = false
  }, 2000)
}
// for the navbar
const props = defineProps(['isWithAppBarNavIcon'])
const emit = defineEmits(['isDrawerVisible'])

const isLoggedIn = ref(false)

/// Check if the user is authenticated on component mount
const getLoggedStatus = async () => {
  showLoadingScreen() // Show loading screen during initial check
  isLoggedIn.value = await isAuthenticated()
}
// Get the current route to determine if it's the login/signup or dashboard
const route = useRoute()

// Check if we are on the login or signup route
const isLoginOrSignup = computed(() => route.name === 'login' || route.name === 'signUp')

// Load functions during component rendering
onMounted(() => {
  getLoggedStatus()
})

// For managing the side navigation (drawer)
const isDrawerVisible = ref(false) // Controls drawer visibility
</script>

<template>
  <!-- Apply BackgroundLayout only for the login/signup route -->
  <template v-if="isLoginOrSignup">
    <BackgroundLayout>
      <!-- Loading Screen -->
      <LoadingScreen v-if="loading" />
      <v-responsive>
        <v-app :theme="theme" class="transparent-app">
          <v-app-bar class="px-3" color="transparent">
            <h3 class="text-logo font-weight-black">
              <span class="task-text">Task</span><span class="hub-text">Hub</span>
            </h3>

            <v-spacer></v-spacer>
          </v-app-bar>

          <v-container> </v-container>

          <v-spacer></v-spacer>
          <v-main><slot name="content"></slot> </v-main>
          <v-divider class="mt-5"></v-divider>
          <footer class="app-footer">
            <p>Copyright © 2024 TaskHub | All Rights Reserved</p>
          </footer>
        </v-app>
      </v-responsive>
    </BackgroundLayout>
    <!-- Footer -->
  </template>

  <!-- For other views like dashboard, render the default content without BackgroundLayout -->
  <template v-else>
    <v-responsive>
      <v-app :theme="theme">
        <v-app-bar class="app-bar px-3">
          <img src="/logo_icon.png" alt="" height="50px" />
          <h3 class="text-logo font-weight-black">
            <span class="task-text">Task</span><span class="hub-text">Hub</span>
          </h3>

          <v-spacer></v-spacer>

          <div class="profile-header">
            <ProfileHeader></ProfileHeader>
          </div>
        </v-app-bar>
        <!-- Side Navigation (Drawer) -->

        <SideNav v-model:drawer-visible="isDrawerVisible" />

        <!-- Only one scrollable area for the content -->

        <v-main><slot name="content"></slot> </v-main>
      </v-app>
    </v-responsive>
  </template>
</template>

<style scoped>
.transparent-app {
  background: transparent;
}

.glassmorphic-card {
  color: white;
  background: rgba(64, 64, 64, 0.15); /* Transparent white */
  backdrop-filter: blur(25px); /* Frosted glass effect */
  border: 2px solid rgba(255, 255, 255, 0.959); /* Frosted border */
  border-radius: 16px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow for depth */
}

.description {
  font-size: 18px;
  color: white;
  text-align: center;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}

.text-logo {
  font-family: 'Poppins';
  font-weight: bolder;
  font-size: x-large;
}

.task-text {
  color: white;
}
.hub-text {
  color: aqua;
}

.app-bar {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  z-index: 10; /* Ensures the app bar is above other components */
}

.profile-header {
  margin-bottom: 15px;
}
.v-main {
  min-height: 100vh;
}

/* Footer Styles */
.app-footer {
  color: white; /* Text color */
  text-align: center; /* Center-align text */
  padding: 15px 0; /* Spacing */
  font-size: 14px; /* Text size */
  font-family: 'Poppins', sans-serif;
  position: relative; /* Change to fixed if you want it always visible */
  bottom: 0;
  width: 100%;
}
</style>
