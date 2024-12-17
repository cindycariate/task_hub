<script setup>
import AppLayout from '../layout/AppLayout.vue'
import SideNav from '../layout/navigation/SideNav.vue'
import { ref } from 'vue'

// Sidebar visibility state
const isDrawerVisible = ref(true)

// for the tabs part
const tab = ref(null)

// Toggle function for the sidebar
const toggleSidebar = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible.value = !isDrawerVisible.value"
  >
    <!-- Sidebar Navigation -->
    <template #navigation>
      <SideNav :is-drawer-visible="isDrawerVisible.value" />
    </template>

    <!-- Main Content -->
    <template #content>
      <v-container fluid class="container gradient-bg fill-height">
        <!-- Sidebar Toggle Button -->
        <div class="menu-btn">
          <v-btn icon @click="toggleSidebar" class="toggle-btn">
            <v-icon>{{ isDrawerVisible.value ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
          </v-btn>
        </div>
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="one">Item One</v-tab>
            <v-tab value="two">Item Two</v-tab>
            <v-tab value="three">Item Three</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one"> One </v-tabs-window-item>

              <v-tabs-window-item value="two"> Two </v-tabs-window-item>

              <v-tabs-window-item value="three"> Three </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Gradient background */
.gradient-bg {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Container styling */
.container {
  position: relative;
  padding: 20px;
}

/* Button positioning */
.menu-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.toggle-btn {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
</style>
