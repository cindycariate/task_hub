<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { isAuthenticated } from '@/utils/supabase'
import BackgroundLayout from '../auth/BackgroundLayout.vue'
import ProfileHeader from './ProfileHeader.vue'
import SideNav from './navigation/SideNav.vue'

// Props and Emits
const props = defineProps(['isWithAppBarNavIcon'])
const emit = defineEmits(['isDrawerVisible'])

// Authentication state
const isLoggedIn = ref(false)

// Check authentication status
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

onMounted(() => {
  getLoggedStatus()
})

// Route and layout logic
const route = useRoute()
const isLoginOrSignup = computed(() => route.name === 'login' || route.name === 'signUp')

// For managing the side navigation (drawer)
const isDrawerVisible = ref(false) // Controls drawer visibility
</script>

<template>
  <!-- Apply BackgroundLayout only for login/signup routes -->
  <template v-if="isLoginOrSignup">
    <BackgroundLayout>
      <v-responsive>
        <v-app class="transparent-app">
          <v-app-bar color="transparent">
            <h3 class="text-logo font-weight-black">
              <span class="task-text">Task</span><span class="hub-text">Hub</span>
            </h3>
          </v-app-bar>

          <v-container></v-container>

          <v-main>
            <slot name="content"></slot>
          </v-main>
        </v-app>
      </v-responsive>
    </BackgroundLayout>
  </template>

  <!-- Render default layout for other routes -->
  <template v-else>
    <v-responsive>
      <v-app>
        <v-app-bar class="app-bar px-3">
          <v-app-bar-nav-icon
            v-if="props.isWithAppBarNavIcon"
            icon="mdi-menu"
            color="white"
            @click="emit('isDrawerVisible')"
          ></v-app-bar-nav-icon>
          <h3 class="text-logo font-weight-black">
            <span class="task-text">Task</span><span class="hub-text">Hub</span>
          </h3>
          <v-spacer></v-spacer>
          <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
        </v-app-bar>
        <!-- Side Navigation (Drawer) -->
        <SideNav v-model:drawer-visible="isDrawerVisible" />

        <!-- Only one scrollable area for the content -->
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
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
}
</style>
