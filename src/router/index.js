import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import SignUpView from '@/views/auth/SignUpView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUpView,
    },
    {
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: NotFoundView,
    },
  ],
})

export default router
