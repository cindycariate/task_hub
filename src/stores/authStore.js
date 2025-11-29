import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.session,
  },
  actions: {
    setSession(session) {
      this.session = session
      this.user = session?.user ?? null
    },
    clearSession() {
      this.session = null
      this.user = null
    },
  },
})
