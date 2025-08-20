import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',

      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
    },
  ],
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    if (to.name !== 'login' && !authStore.isLoggedIn) {
      next({ name: 'login' })
    } else if (to.name === 'login' && authStore.isLoggedIn) {
      next({ name: 'Home' })
    } else {
      next()
    }
  },
)

export default router
