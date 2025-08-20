import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      const userStore = useUserStore()
      userStore.clearUserInfo()
      localStorage.removeItem('token')
    },
  },
})
