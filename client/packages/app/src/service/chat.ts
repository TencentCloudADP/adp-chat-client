import { httpService } from './httpService'
import type { ChatConversationProps, Record } from 'adp-chat-component'
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/i18n'

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
