import { httpService } from './httpService'

export const fetchLoginProviders = async () => {
  try {
    const response: any = await httpService.get('/account/providers')
    return response
  } catch (error) {
    console.error('获取登录方式列表失败:', error)
    throw new Error('获取登录方式列表失败')
  }
}
