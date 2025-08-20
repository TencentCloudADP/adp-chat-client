import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

export const login = (token: string, callback?: () => void) => {
  authStore.login(token)
  // 如果提供了回调函数，则执行
  if (callback) {
    callback()
  }
}

export const logout = (callback?: () => void) => {
  authStore.logout()
  // 如果提供了回调函数，则执行
  if (callback) {
    callback()
  }
}
