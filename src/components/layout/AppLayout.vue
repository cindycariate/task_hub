<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute to detect the current route
import { isAuthenticated } from '@/utils/supabase'
import BackgroundLayout from '../auth/BackgroundLayout.vue'
import ProfileHeader from './ProfileHeader.vue'

// for the navbar
const props = defineProps(['isWithAppBarNavIcon'])
const emit = defineEmits(['isDrawerVisible'])

const isLoggedIn = ref(false)

// Get authentication from Supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load functions during component rendering
onMounted(() => {
  getLoggedStatus()
})

// Get the current route to determine if it's the login/signup or dashboard
const route = useRoute()

// Check if we are on the login or signup route
const isLoginOrSignup = computed(() => route.name === 'login' || route.name === 'signUp')
</script>

<template>
  <!-- Apply BackgroundLayout only for the login/signup route -->
  <template v-if="isLoginOrSignup">
    <BackgroundLayout>
      <v-responsive>
        <v-app :theme="theme" class="transparent-app">
          <v-app-bar class="px-3" color="transparent">
            <h3 class="text-logo font-weight-black">
              <span class="task-text">Task</span><span class="hub-text">Hub</span>
            </h3>

            <v-spacer></v-spacer>
            <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
          </v-app-bar>

          <v-container> </v-container>

          <v-spacer></v-spacer>
          <v-main><slot name="content"></slot> </v-main>
        </v-app>
      </v-responsive>
    </BackgroundLayout>
  </template>

  <!-- For other views like dashboard, render the default content without BackgroundLayout -->
  <template v-else>
    <v-responsive>
      <v-app :theme="theme">
        <v-app-bar class="app-bar px-3">
          <v-app-bar-nav-icon
            v-if="props.isWithAppBarNavIcon"
            icon="mdi-menu"
            color="white"
            :theme="theme"
            @click="emit('isDrawerVisible')"
          >
          </v-app-bar-nav-icon>
          <h3 class="text-logo font-weight-black">
            <span class="task-text">Task</span><span class="hub-text">Hub</span>
          </h3>
          <v-spacer></v-spacer>
          <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
        </v-app-bar>
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
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
}
.nav-drawer {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  color: white;
}
</style>
