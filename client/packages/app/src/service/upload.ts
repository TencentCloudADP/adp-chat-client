import { httpService } from './httpService'
import type { ChatConversation } from '@/model/chat'
import type { AxiosRequestConfig } from 'axios'
import { storeToRefs } from 'pinia'
import { useAppsStore } from '@/stores/apps'
import { t } from '@/i18n'
const appsStore = useAppsStore()
const { currentApplicationId } = storeToRefs(appsStore)


/**
 * 加载聊天会话列表
 * @returns {Promise<ChatConversation[]>} 返回聊天会话列表的Promise
 * @throws {Error} 如果请求失败，抛出错误
 */
export const uploadFile = async (params:any) => {
  try {
    const response:{
      Url: string
    } = await httpService.post(
      `/file/upload?ApplicationId=${currentApplicationId.value}&Type=${params.file.type}`,
      params.file
    )
    return response
  } catch (error) {
    console.error(t('上传文件失败:'), error)
    throw new Error(t('上传文件失败'))
  }
}