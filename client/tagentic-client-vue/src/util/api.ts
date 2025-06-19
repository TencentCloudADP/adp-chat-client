import axios from 'axios'
import useEventsBus from '@/util/eventBus'
const {emit} = useEventsBus()

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 10*1000,
  headers: { 'X-Custom-Header': 'foobar' }
})

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 在请求发送前可以做一些处理
  if (localStorage.getItem('access_token')) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
  // 在响应到达之前可以做一些处理
  return response
}, error => {
  // 全局处理错误
  console.log('[error]', error)

  try {
    if (error.response.data.detail.exception == 'AccountUnauthorized') {
      localStorage.removeItem('access_token')
      emit("login-state-changed", null)
    }
  } catch (e) {
    console.log('[error.response]', e)
  }
  return Promise.reject(error)
})

async function* chunkSplitter(src: any) : AsyncGenerator<string> {
  let buffer = ''
  for await (const raw of src) {
    buffer += new TextDecoder().decode(raw)
    let lines = buffer.split('\n')
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].trim() != '') {
        yield lines[i]
      }
    }
    buffer = lines[lines.length - 1]
  }
  if (buffer) {
    if (buffer.trim() != '') {
      yield buffer
    }
  }
}

export { axiosInstance as api, chunkSplitter };
export default axiosInstance;
