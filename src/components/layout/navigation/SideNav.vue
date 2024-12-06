<template>
  <v-navigation-drawer v-model="isDrawerVisible" app color="primary" expand-on-hover>
    <v-list>
      <!-- Loop through the items and display them -->
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <!-- Display the icon (left side of the text) -->
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <!-- Display the title next to the icon -->
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

// Define the side navigation items with their titles and corresponding icons
const items = [
  { title: 'Dashboard', icon: 'mdi-home' },
  { title: 'Tasks', icon: 'mdi-pen' },
  { title: 'Settings', icon: 'mdi-cog' },
]

// State to manage drawer visibility
const isDrawerVisible = ref(true)
</script>

<style scoped>
/* Customize the background color and gradient of the navigation drawer */
.v-navigation-drawer {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
}

/* Add some padding and style the items if needed */
.v-list-item {
  display: flex;
  align-items: center;
}

/* Style for the icon to ensure it appears left of the text */
.v-list-item-icon {
  margin-right: 16px; /* Adjust the space between the icon and text */
}

/* Optional: style the list item text */
.v-list-item-title {
  font-weight: bold;
}
</style>
