import { httpService } from './httpService'
import { useUserStore } from '@/stores/user'

/**
 * 获取用户信息
 */
export const fetchUserInfo = async () => {
  const userStore = useUserStore()
  try {
    // 模拟API请求，实际项目中替换为真实API路径
    const response: any = await httpService.get('/account/info')
    const { Info = {} } = response
    const { Name, Avatar = '' } = Info
    userStore.setUserInfo(Name, Avatar)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw new Error('获取用户信息失败')
  }
}
