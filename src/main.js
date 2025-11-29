// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/authStore'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  components,
  directives,
})

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// Import admin tools for testing (remove in production)
if (import.meta.env.DEV) {
  import('./utils/loginAttemptsAdmin.js')
}

app.mount('#app')

// Initialize auth store and subscribe to auth state changes
try {
  const authStore = useAuthStore()

  // Set initial session if present
  ;(async () => {
    try {
      const { data } = await supabase.auth.getSession()
      authStore.setSession(data.session)
    } catch (err) {
      console.warn('Failed to get initial Supabase session:', err)
    }
  })()

  // Listen for auth state changes and update the store
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      authStore.setSession(session)
    } else {
      authStore.clearSession()
    }
  })
} catch (err) {
  // If something fails here, don't block app startup
  console.error('Auth listener setup error:', err)
}
