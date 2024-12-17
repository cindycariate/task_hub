<!-- TaskView.vue -->
<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <h1>TaskHub</h1>
        <h2>Hello</h2>
        <!-- Your Task Content Goes Here -->
      </v-container>
    </template>
  </AppLayout>
</template>
