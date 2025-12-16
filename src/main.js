// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

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

// Request browser notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission()
}

// Check for deadline notifications on app load
;(async () => {
  try {
    // Wait a bit for stores to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { useTaskStore } = await import('@/stores/taskStore')
    const taskStore = useTaskStore()
    await taskStore.checkDeadlineNotifications()
  } catch (err) {
    console.warn('Deadline check failed on app load:', err)
  }
})()
