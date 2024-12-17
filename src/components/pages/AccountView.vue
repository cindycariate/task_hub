<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <h1>Hello Love, Goodbye</h1>
    </template>
  </AppLayout>
</template>
