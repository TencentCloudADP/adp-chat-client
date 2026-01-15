import { httpService } from './httpService'
import type { ChatConversation, ChatConversationProps, Record } from '@/model/chat'
import type { AxiosRequestConfig } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/i18n'

/**
 * 加载聊天会话列表
 * @returns {Promise<ChatConversation[]>} 返回聊天会话列表的Promise
 * @throws {Error} 如果请求失败，抛出错误
 */
export const handleLoadConversations = async () => {
  try {
    const response: ChatConversation[] = await httpService.get('/chat/conversations')
    return response
  } catch (error:any) {
    console.error(t('获取应用列表失败:'), error)
    MessagePlugin.error({
          content: error?.message || t('获取聊天信息失败'),
          duration: 3000
    })
    throw new Error(t('获取应用列表失败'))
  }
}

/**
 * 加载聊天会话详情
 * @param {ChatConversationProps} params 会话详情请求参数
 * @returns {Promise<{Response: {ApplicationId: string, Records: Record[], LastRecordId: string}}>} 返回会话详情的Promise
 * @throws {Error} 如果请求失败，抛出错误
 */
export const handleLoadConversationDetail = async (params: ChatConversationProps) => {
  try {
    const response: {
      Response: {
        ApplicationId: string,
        Records: Record[],
        LastRecordId: string,
      }
    } = await httpService.get('/chat/messages', params)
    return response
  } catch (error:any) {
    console.error(t('获取聊天信息失败:'), error)
    MessagePlugin.error({
          content: error?.message || t('获取聊天信息失败'),
          duration: 3000
    })
    throw new Error(t('获取聊天信息失败'))
  } 
}

/**
 * 发送聊天消息
 * @param {object} params 消息内容参数
 * @param {AxiosRequestConfig} [options] 可选的请求配置
 * @returns {Promise<any>} 返回发送消息的Promise
 */
export const handleSendConversation = async (params: object, options: AxiosRequestConfig) => {
  const _options = {
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 1000 * 600,
    ...options
  } as AxiosRequestConfig
  return httpService.post('/chat/message', params, _options)
}

/**
 * 对聊天消息进行评分
 * @param {object} params 评分参数
 * @returns {Promise<any>} 返回评分结果的Promise
 * @throws {Error} 如果请求失败，抛出错误
 */
export const handleRate = async (params: object) => {
  try {
    const response: any = await httpService.post('/feedback/rate', params)
    return response
  } catch (error:any) {
    console.error(t('获取聊天信息失败:'), error)
    MessagePlugin.error({
          content: error?.message || t('获取聊天信息失败'),
          duration: 3000
    })
    throw new Error(t('获取聊天信息失败'))
  }
}

/**
 * 获取分享ID
 * @param {object} params 分享参数
 * @returns {Promise<any>} 返回分享ID的Promise
 * @throws {Error} 如果请求失败，抛出错误
 */
export const handleGetShareId = async (params: object) => {
  try {
    const response: any = await httpService.post('/share/create', params)
    return response
  } catch (error:any) {
    console.error(t('获取聊天信息失败:'), error)
    MessagePlugin.error({
          content: error?.message || t('获取聊天信息失败'),
          duration: 3000
    })
    throw new Error(t('获取聊天信息失败'))
  }
}

export const handleGetAsrUrl = async () => {
  try {
    const response: any = await httpService.get('/helper/asr/url')
    return response
  } catch (error:any) {
    console.error(t('获取聊天信息失败:'), error)
    MessagePlugin.success({
          content: error?.message || t('operation.copySuccess'),
          duration: 3000
    })
    throw new Error(t('获取聊天信息失败'))
  }
}
