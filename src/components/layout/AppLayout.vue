<script setup>
import { ref } from 'vue'
/*
import { RouterLink } from 'vue-router'
*/
import { isAuthenticated } from '@/utils/supabase'
import BackgroundLayout from '../auth/BackgroundLayout.vue'
import { onMounted } from 'vue'
import ProfileHeader from './ProfileHeader.vue'

// for the navbar
const props = defineProps(['isWithAppBarNavIcon'])

const emit = defineEmits(['isDrawerVisible'])

//Load variables
const isLoggedIn = ref(false)

// Get authentication from Supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load functions during component rendering
onMounted(() => {
  getLoggedStatus()
})
</script>
<template>
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

        <v-app-bar-nav-icon
          v-if="props.isWithAppBarNavIcon"
          icon="mdi-menu"
          :theme="theme"
          @click="emit('isDrawerVisible')"
        >
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-main><slot name="content"></slot> </v-main>
      </v-app>
    </v-responsive>
  </BackgroundLayout>
</template>
<style scoped>
.transparent-app {
  background: transparent;
}
.glassmorphic-card {
  color: white;
  background: rgba(64, 64, 64, 0.15); /* Transparent white */
  backdrop-filter: blur(25px); /* Frosted glass effect */
  /* -webkit-backdrop-filter: blur(10px); Safari support */
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
</style>
