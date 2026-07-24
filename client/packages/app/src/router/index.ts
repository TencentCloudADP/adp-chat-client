import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized
} from 'vue-router'
import { isLoggedIn } from '@/service/login'
import { httpService } from '@/service/httpService'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      // 渠道会话：/:applicationId/channel/:conversationId
      // 渠道（访客）会话不落地本地 chat_conversation 表，权威源在 CAPI DescribeConversationList。
      // 通过 URL 里的 /channel/ 段显式区分：
      //   1) 刷新时前端可直接判定为渠道会话，跳过普通 /chat/messages 首屏拉取
      //   2) 侧栏点击渠道会话时 router.push 到该变体，保持刷新可复原
      // 注意：必须放在通用 home 路由之前，确保 /channel/ 段优先匹配（vue-router 从上到下匹配）。
      path: '/:applicationId/channel/:conversationId',
      name: 'home-channel',
      component: () => import('@/pages/Home.vue'),
    },
    {
      // 统一层级结构：/:applicationId?/:conversationId?
      // 例：/                       -> 未选应用
      //     /appA                   -> 选中应用 appA，无会话
      //     /appA/convX             -> 应用 appA 下的普通会话 convX
      path: '/:applicationId?/:conversationId?',
      name: 'home',
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

let entre = false
router.beforeEach(
  async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    if (to.meta.unauthorized) {
      return
    } else {
      if (entre) {
        // 防止重复进入, axiosInstance.ts中会统一处理AccountUnauthorized错误，并跳转登录页
        console.log(`prevent re-entre`);
        return
      }
      // 配置AUTO_CREATE_ACCOUNT=true时，检查是否需要自动创建账号
      entre = true
      try {
        await httpService.get('/account/info')
      } catch {
      }
      entre = false
      
      if (to.name !== 'login' && !isLoggedIn()) {
        return { name: 'login' }
      } else if (to.name === 'login' && isLoggedIn()) {
        return { name: 'home' }
      } else {
        return
      }
    }
  },
)

export default router
