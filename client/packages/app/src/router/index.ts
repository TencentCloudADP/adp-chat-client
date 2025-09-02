import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { isLoggedIn } from '@/service/login'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/:conversationId?',
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
    console.log('router',to)
    if (to.name !== 'login' && !isLoggedIn()) {
      next({ name: 'login' })
    } else if (to.name === 'login' && isLoggedIn()) {
      next({ name: 'Home' })
    } else {
      next()
    }
  },
)

export default router
