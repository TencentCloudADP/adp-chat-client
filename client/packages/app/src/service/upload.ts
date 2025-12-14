import { httpService } from './httpService'
import { storeToRefs } from 'pinia'
import { useAppsStore } from '@/stores/apps'
import { t } from '@/i18n'

const appsStore = useAppsStore()
const { currentApplicationId } = storeToRefs(appsStore)

export interface UploadFile extends File {
  raw?: File
}

/**
 * 上传文件到当前应用
 * 根据文件 MIME type 和文件名自动解析扩展名，作为 Type 参数传给服务端
 */
export const uploadFile = async (params:any) => {
  try {
    const file: File = params.file?.raw || params.file

    // 优先根据 MIME type 映射扩展名
    const mimeType = file.type || ''
    const mimeMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpg': 'jpg',
      'image/jpeg': 'jpeg',
      'image/bmp': 'bmp',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'text/plain': 'txt',
      'text/csv': 'csv',
    }

    let fileExt = mimeMap[mimeType]

    // 如果 MIME 未命中，退回到文件名后缀（兼容部分移动端）
    if (!fileExt && file.name) {
      const nameParts = file.name.split('.')
      if (nameParts.length > 1) {
        fileExt = nameParts.pop()?.toLowerCase() || ''
      }
    }

    // 最终兜底，防止为空
    const fileType = fileExt || 'bin'

    const response:{
      Url: string
    } = await httpService.post(
      `/file/upload?ApplicationId=${currentApplicationId.value}&Type=${fileType}`,
      params.file
    )
    return response
  } catch (error) {
    console.error(t('上传文件失败:'), error)
    throw new Error(t('上传文件失败'))
  }
}