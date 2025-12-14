/**
 * 应用服务模块
 * @module applicationService
 */
import { httpService } from './httpService'
import type { Application } from '@/model/application'
import  { t } from '@/i18n'


/**
 * 加载应用列表
 * @async
 * @function handleLoadApplication
 * @returns {Promise<{Applications: Application}>} 返回应用列表数据
 * @throws {Error} 当请求失败时抛出错误
 */
export const handleLoadApplication = async (type:string = '0') => {
  try {
    const response: {
      Applications: Application[]
    } = await httpService.get(`/application/list?type=${type}`)
    
    // 将 OpeningQuestions 从字符串转换为数组（如果是以冒号分隔的字符串）
    if (response.Applications && Array.isArray(response.Applications)) {
      response.Applications = response.Applications.map((app: any) => {
        if (app.OpeningQuestions && typeof app.OpeningQuestions === 'string') {
          // 如果 OpeningQuestions 是字符串，按冒号分隔并过滤空值
          app.OpeningQuestions = app.OpeningQuestions.split(':').filter((q: string) => q.trim().length > 0)
        } else if (!app.OpeningQuestions) {
          // 如果 OpeningQuestions 不存在，设置为空数组
          app.OpeningQuestions = []
        }
        return app
      })
    }
    
    return response
  } catch (error) {
    console.error(t('获取应用列表失败:'), error)
    throw new Error(t('获取应用列表失败'))
  }
}

export const handleCreateApplication = async (params:any) => {
  try {
    const response: {
      Application: Application
    } = await httpService.post('/application/create', params)
    return response
  } catch (error) {
    console.error(t('创建应用失败:'), error)
    throw new Error(t('创建应用失败'))
  }
}

export const handleShareApplication = async (params:any) => {
  try {
    const response: {
      Success: number
    } = await httpService.post('/application/share', params)
    return response
  } catch (error) {
    console.error(t('分享应用失败:'), error)
    throw new Error(t('分享应用失败'))
  }
}

export const handleUnshareApplication = async (params:any) => {
  try {
    const response: {
      Success: number
    } = await httpService.post('/application/unshare', params)
    return response
  } catch (error) {
    console.error(t('取消分享应用失败:'), error)
    throw new Error(t('取消分享应用失败'))
  }
}

export const handlePublishApplication = async (params:any) => {
  try {
    const response: {
      Success: number
    } = await httpService.post('/application/publish', params)
    return response
  } catch (error) {
    console.error(t('发布应用失败:'), error)
    throw new Error(t('发布应用失败'))
  }
}

export const handleUnpublishApplication = async (params:any) => {
  try {
    const response: {
      Success: number
    } = await httpService.post('/application/unpublish', params)
    return response
  } catch (error) {
    console.error(t('取消发布应用失败:'), error)
    throw new Error(t('取消发布应用失败'))
  }
}