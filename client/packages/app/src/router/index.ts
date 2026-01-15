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
      name: 'home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/app/:applicationId?',
      name: 'app',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
    },
    {
      path: '/share/:shareId?',
      name: 'share',
      meta:{
        unauthorized: true
      },
      component: () => import('@/pages/Share.vue'),
    },
  ],
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if(to.meta.unauthorized){
      next()
    }else{
      if (to.name !== 'login' && !isLoggedIn()) {
        next({ name: 'login' })
      } else if (to.name === 'login' && isLoggedIn()) {
        next({ name: 'home' })
      } else {
        next()
      }
    }
  },
)

export default router
