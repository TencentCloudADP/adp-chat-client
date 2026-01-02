import axios from 'axios';
import router from '@/router'
import { logout } from '@/service/login';

// 根据环境动态设置baseURL
const isDev = import.meta.env.DEV

// 开发环境使用/api代理，生产环境使用相对路径
let baseURL: string
if (isDev) {
  baseURL = '/api'
} else {
  // 获取当前页面的路径
  const currentPath = window.location.pathname
  // 找到/static的位置，计算需要返回的层级
  const staticIndex = currentPath.indexOf('/static')
  if (staticIndex !== -1) {
    // 计算从当前路径到/static前的路径需要多少层../
    const pathAfterStatic = currentPath.substring(staticIndex + '/static'.length)
    const pathSegments = pathAfterStatic.split('/').filter((segment) => segment.length > 0)
    // 需要返回的层级数 = 路径段数
    const levelsToGoUp = pathSegments.length
    baseURL = '../'.repeat(levelsToGoUp)
  } else {
    // 如果没找到/static，使用安全的默认值
    baseURL = './'
  }
}

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
    if (
      error.response &&
      error.response.config &&
      error.response.config.responseType === 'stream'
    ) {
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
    } else if (error.response) {
      // 对响应错误做点什么
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.status, error.response.data)
    } else {
      console.error('Network Error:', error.message)
    }
    console.log('error',error)
    if (error.response && error.response.data && error.response.data.Error && error.response.data.Error.Exception == 'AccountUnauthorized') {
      logout(() => router.replace({ name: 'login' }));
    }
    return Promise.reject(error)
  },
)

// workaround for webkit bug 194379 (https://bugs.webkit.org/show_bug.cgi?id=194379)
if (!(ReadableStream.prototype as any)[Symbol.asyncIterator]) {
  (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  };
}
export default instance
