import { httpService } from './httpService'
import Cookies from 'js-cookie'

export const isLoggedIn = () => {
  return !!Cookies.get('token')
}

export const logout = (callback?: () => void) => {
  Cookies.remove('token')
  // 如果提供了回调函数，则执行
  if (callback) {
    callback()
  }
}

export const fetchLoginProviders = async () => {
  try {
    const response: any = await httpService.get('/account/providers')
    return response
  } catch (error) {
    console.error('获取登录方式列表失败:', error)
    throw new Error('获取登录方式列表失败')
  }
}
