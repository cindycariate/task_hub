<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation> </template>
    <template #content>
      <v-container-fluid class="container">
        <!-- Main Content -->
        <div class="menu-btn">
          <!-- Button to toggle the sidebar visibility -->
          <v-btn icon @click="toggleSidebar" class="toggle-btn">
            <v-icon>{{ isDrawerVisible ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
          </v-btn>
        </div>
        <div class="main-content">
          <div class="welcome-message">
            <h1 class="text-white text-h3">
              Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
            </h1>
            <p class="p">Visually Manage Your Tasks</p>
            <button class="create-new-btn rounded-pill">
              <i class="mdi mdi-plus"></i> Create New
            </button>
          </div>
        </div></v-container-fluid
      >
    </template>
  </AppLayout>
</template>

<style></style>
