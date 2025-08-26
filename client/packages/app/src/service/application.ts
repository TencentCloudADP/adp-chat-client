/**
 * 应用服务模块
 * @module applicationService
 */
import { httpService } from './httpService'
import type { Application } from '@/model/application'

/**
 * 加载应用列表
 * @async
 * @function handleLoadApplication
 * @returns {Promise<{Applications: Application}>} 返回应用列表数据
 * @throws {Error} 当请求失败时抛出错误
 */
export const handleLoadApplication = async () => {
  try {
    const response: {
      Applications: Application[]
    } = await httpService.get('/application/list')
    return response
  } catch (error) {
    console.error('获取应用列表失败:', error)
    throw new Error('获取应用列表失败')
  }
}
