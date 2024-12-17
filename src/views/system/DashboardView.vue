<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNav from '@/components/layout/navigation/SideNav.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation> <SideNav const isDrawerVisible="ref(true)"></SideNav> </template>
    <template #content> </template>
  </AppLayout>
</template>

<style></style>
