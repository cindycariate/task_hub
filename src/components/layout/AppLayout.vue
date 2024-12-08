<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute to detect the current route
import { isAuthenticated } from '@/utils/supabase'
import BackgroundLayout from '../auth/BackgroundLayout.vue'
import SideNav from './navigation/SideNav.vue'

// Props and emits for navigation icon and drawer visibility
const props = defineProps(['isWithAppBarNavIcon'])
const emit = defineEmits(['isDrawerVisible'])

// Authentication status
const isLoggedIn = ref(false)

// Get the user's logged-in status from Supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load function on component mount
onMounted(() => {
  getLoggedStatus()
})

// Get the current route
const route = useRoute()

// Check if the current route is for login or signup
const isLoginOrSignup = computed(() => route.name === 'login' || route.name === 'signUp')

// For managing the drawer visibility
const isDrawerVisible = ref(false)
</script>

<template>
  <!-- Apply BackgroundLayout only for the login/signup route -->
  <template v-if="isLoginOrSignup">
    <BackgroundLayout>
      <v-responsive>
        <v-app class="transparent-app">
          <!-- App Bar -->
          <v-app-bar class="px-3" color="transparent">
            <h3 class="text-logo font-weight-black">
              <span class="task-text">Task</span><span class="hub-text">Hub</span>
            </h3>
            <v-spacer></v-spacer>
          </v-app-bar>

          <!-- Main Container -->
          <v-container> </v-container>

          <v-main>
            <slot name="content"></slot>
          </v-main>
        </v-app>
      </v-responsive>
    </BackgroundLayout>
  </template>

  <!-- Default layout for authenticated users (e.g., dashboard) -->
  <template v-else>
    <v-responsive>
      <v-app>
        <!-- Side Navigation (Drawer) -->
        <SideNav v-model:drawer-visible="isDrawerVisible" />

        <!-- Main content area -->
        <v-main>
          <slot></slot>
        </v-main>
      </v-app>
    </v-responsive>
  </template>
</template>

<style scoped>
.transparent-app {
  background: transparent;
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
  background: transparent;
}
.nav-drawer {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  color: white;
}
</style>
