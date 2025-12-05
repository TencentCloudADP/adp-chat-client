import { httpService } from './httpService'
import Cookies from 'js-cookie'

export const isLoggedIn = () => {
  return !!Cookies.get('token')
}

export const logout = (callback?: () => void) => {
  let path = window.location.pathname.split('/static/app')[0]
  if (path == '') {
    path = '/'
  }
  Cookies.remove('token', { path: path })
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

// 通过邮箱及密码登录
export const login = async (email: string, password: string) => {
  try {
    const response: any = await httpService.post(
      '/login',
      {
        Email: email,
        Password: password,
      },
    )

    console.log('response', response)

    const token = response?.Token

    if (token) {
      // 保存 token 到 Cookies
      let path = window.location.pathname.split('/static/app')[0]
      if (path == '') {
        path = '/'
      }
      Cookies.set('token', token, { path: path })
      return response
    } else {
      throw new Error('登录响应中未找到 token')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    const errorMessage = error?.message || '登录失败，请检查用户名和密码'
    throw new Error(errorMessage)
  }
}