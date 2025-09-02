import axios from 'axios'

// 根据环境动态设置baseURL
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : ''

// 创建axios实例
const instance = axios.create({
  baseURL,
  timeout: 1000 * 60, // 请求超时时间
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
  async (error) => {
    // 如果是stream响应
    if (error.response && error.response.config && error.response.config.responseType === 'stream') {
      try {
        // 将流转换为文本
        const data = await new Response(error.response.data).text()
        // 替换为转换后的数据
        if (error.response.headers['content-type'] === 'application/json') {
          error.response.data = JSON.parse(data)
        } else {
          error.response.data = data
        }
      } catch (e) {
        console.error('stream转换失败:', e)
      }
    }else if (error.response) { // 对响应错误做点什么
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.status, error.response.data)
    } else {
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default instance
