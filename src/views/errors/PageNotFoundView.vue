<script setup>
// import AppLayout from '@/components/layout/AppLayout.vue'
// import SideNavigation from '@/components/layout/navigation/SideNavigation.vue'
// import { onMounted, ref } from 'vue'
// import { isAuthenticated } from '@/utils/supabase'

// Reactive references
// const isLoggedIn = ref(false)
// const mobile = ref(false) // Define or update this based on your logic or utility
// const isDrawerVisible = ref(mobile.value ? false : true)

// // Get Authentication status from Supabase
// const getLoggedStatus = async () => {
//   isLoggedIn.value = await isAuthenticated()
// }

// // Call getLoggedStatus during component mounting
// onMounted(() => {
//   getLoggedStatus()
// })
</script>

<template>
  <v-container class="text-center mt-16">
    <v-row>
      <v-col class="mx-auto" cols="12" lg="4">
        <h1 class="text-h1 font-weight-black text-cyan-darken-4">404</h1>
        <h2 class="text-h2 font-weight-black mb-2">Page Not Found</h2>

        <p class="text-subtitle-1 font-weight-bold mb-4">
          The page you are looking for does not exist.
        </p>

        <v-btn color="red-darken-4" prepend-icon="mdi-home" to="/"> Back to Home </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
