<script setup>
import AppLayout from '../layout/AppLayout.vue'
import SideNav from '../layout/navigation/SideNav.vue'
import { ref } from 'vue'

// Sidebar visibility state
const isDrawerVisible = ref(true)

// Tabs setup
const tabs = ['To Do', 'In Progress', 'Done']
const currentTab = ref('To Do') // Default active tab

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

        <!-- Tabs Navigation -->
        <v-tabs v-model="currentTab.value" background-color="white" align-tabs="center">
          <v-tab v-for="tab in tabs" :key="tab" :value="tab">
            {{ tab }}
          </v-tab>
        </v-tabs>

        <!-- Tabs Content -->
        <v-tabs-items v-model="currentTab.value">
          <v-tab-item value="To Do">
            <v-card flat class="pa-4">
              <h2 class="text-h5">To Do</h2>
              <p>This is the To Do tab content.</p>
            </v-card>
          </v-tab-item>
          <v-tab-item value="In Progress">
            <v-card flat class="pa-4">
              <h2 class="text-h5">In Progress</h2>
              <p>This is the In Progress tab content.</p>
            </v-card>
          </v-tab-item>
          <v-tab-item value="Done">
            <v-card flat class="pa-4">
              <h2 class="text-h5">Done</h2>
              <p>This is the Done tab content.</p>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
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
