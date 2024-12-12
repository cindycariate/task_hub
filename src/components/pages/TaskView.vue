<script setup>
import AppLayout from '../layout/AppLayout.vue'
import SideNav from '../layout/navigation/SideNav.vue'
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
        <div class="main-content"></div
      ></v-container-fluid>
    </template>
  </AppLayout>
</template>
