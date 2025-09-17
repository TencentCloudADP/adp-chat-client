import axios from 'axios'
import useEventsBus from '@/util/eventBus'
const {emit} = useEventsBus()
import Cookies from 'js-cookie'
import { message } from 'ant-design-vue'

const axiosInstance = axios.create({
  baseURL: '../..',
  timeout: 10*1000,
})

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 在请求发送前可以做一些处理
  if (Cookies.get('token')) {
    config.headers.Authorization = 'Bearer ' + Cookies.get('token')
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
  // 在响应到达之前可以做一些处理
  return response
}, async error => {
  // 全局处理错误
  console.log('[error]', error)

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
  }

  let msg = error
  if (!error.response) {
    if (error.message) {
      msg = error.message
    } else {
      msg = '网络错误'
    }
  }
  else if (error.response.data.Error.Message) {
    msg = error.response.data.Error.Message
  }
  else if (error.response.data.Error.Exception) {
    msg = error.response.data.Error.Exception
  }
  message.error(msg)

  try {
    if (error.response.data.Error.Exception == 'AccountUnauthorized') {
      emit("login-state-changed", null)
    }
  } catch (e) {
    console.log('[error.response]', e)
  }
  return Promise.reject(error)
})

async function* chunkSplitter(src: any) : AsyncGenerator<string> {
  let buffer = new Uint8Array(0)
  const textDecoder = new TextDecoder('utf-8')
  const newlineChar = '\n'.charCodeAt(0)

  for await (const chunk of src) {
    // 合并新数据到缓冲区
    const newBuffer = new Uint8Array(buffer.length + chunk.length)
    newBuffer.set(buffer)
    newBuffer.set(chunk, buffer.length)
    buffer = newBuffer

    // 查找所有 \n 的位置
    let lineStart = 0
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === newlineChar) {
        // 提取当前行（不包括 \n）
        const lineBytes = buffer.slice(lineStart, i)
        const line = textDecoder.decode(lineBytes).trim()
        if (line) {
          yield line
        }
        lineStart = i + 1 // 跳过 \n
      }
    }

    // 保留未处理的部分（可能包含不完整的行或 UTF-8 字符）
    buffer = buffer.slice(lineStart)
  }

  // 处理剩余数据（最后一行可能没有 \n）
  if (buffer.length > 0) {
    const line = textDecoder.decode(buffer).trim()
    if (line) {
      yield line
    }
  }
}

// workaround for webkit bug 194379 (https://bugs.webkit.org/show_bug.cgi?id=194379)
if (!ReadableStream.prototype[Symbol.asyncIterator]) {
  ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
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

export { axiosInstance as api, chunkSplitter };
export default axiosInstance;
