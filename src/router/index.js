import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import SignUpView from '@/views/auth/SignUpView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import PageNotFoundView from '@/views/errors/PageNotFoundView.vue'
import { supabase } from '@/utils/supabase'

// Check if a user is authenticated using Supabase
const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error checking session:', error)
    return false // Treat as not authenticated if an error occurs
  }
  return !!data.session // Return true if a session exists
}

// Define the routes
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }, // Meta field for guest-only routes
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: SignUpView,
    meta: { requiresGuest: true }, // Meta field for guest-only routes
  },
  {
    path: '/system/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }, // Meta field for auth-required routes
  },
  {
    path: '/errors/notfound',
    name: 'notfound',
    component: PageNotFoundView,
  },
  {
    // Catch-all route for undefined paths
    path: '/:catchAll(.*)',
    redirect: (to) => {
      return { name: 'notfound' } // Redirect to the notfound page
    },
  },
]

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Add navigation guards
router.beforeEach(async (to, from, next) => {
  const loggedIn = await isAuthenticated()

  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: 'login' }) // Redirect to login if not authenticated
  } else if (to.meta.requiresGuest && loggedIn) {
    next({ name: 'dashboard' }) // Redirect logged-in users to dashboard
  } else {
    next() // Proceed to the route
  }
})

export default router
