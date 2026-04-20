/**
 * SSE请求处理模块
 * @module sseRequest-reasoning
 * @description 处理SSE(Server-Sent Events)流式请求的通用逻辑
 */
import type { SseEvent } from './chat-v2'

/**
 * SSE请求选项配置接口
 * @interface FetchSSEOptions
 * @property {Function} success - 成功回调函数，接收解析后的数据
 * @property {Function} [fail] - 失败回调函数，可选，接收错误信息
 * @property {Function} [complete] - 完成回调函数，可选，接收操作状态和可选信息
 */
interface FetchSSEOptions {
  success: (event: SseEvent) => void
  fail?: (msg?: string | null | undefined | unknown) => void
  complete?: (isOk: boolean, msg?: string) => void
}
/**
 * 获取函数类型定义
 * @typedef {Function} FetchFn
 * @returns {void}
 */
type FetchFn = () => Promise<any>

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return undefined
}

/**
 * 处理SSE流式请求
 * @async
 * @function fetchSSE
 * @param {FetchFn} fetchFn - 执行SSE请求的函数
 * @param {FetchSSEOptions} options - 请求配置选项
 * @returns {Promise<void>} 无返回值
 * @throws 当请求过程中出现错误时抛出异常
 * @description 处理SSE流式响应，根据消息类型分发到不同的回调函数
 */
export const fetchSSE = async (fetchFn: FetchFn, options: FetchSSEOptions): Promise<void> => {
  const { success, fail, complete } = options
  try {
    const res = await fetchFn()
    for await (const line of chunkSplitter(res)) {
      if (!line.startsWith('data:')) {
        continue
      }
      const payload = line.slice('data:'.length).trim()
      if (!payload || payload === '[DONE]') {
        continue
      }
      let event: SseEvent
      try {
        event = JSON.parse(payload) as SseEvent
      } catch {
        continue
      }
      if (event.Type === 'error') {
        const errorMsg = event.Error?.Message
        fail?.(errorMsg)
        complete?.(false, errorMsg)
        return
      }
      success(event)
    }
  } catch (err) {
    // abort 停止会走到catch
    console.log(err)
    fail?.(err)
    complete?.(false, getErrorMessage(err))
    return
  }
  complete?.(true)

}

/**
 * 分块处理器
 * @async
 * @generator
 * @function chunkSplitter
 * @param {any} src - 原始数据源
 * @yields {string} 处理后的单行数据
 * @description 将SSE流数据按行分割的异步生成器函数
 */
export async function* chunkSplitter(src: any): AsyncGenerator<string> {
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
