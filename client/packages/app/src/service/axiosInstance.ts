import axios from 'axios'

// 根据环境动态设置baseURL
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : ''

// 创建axios实例
const instance = axios.create({
  baseURL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
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
