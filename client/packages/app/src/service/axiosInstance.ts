import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加token
    const token = authStore.token
    if (token) {
      config.url = `${config.url}?token=${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.status, error.response.data)
    } else {
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default instance
