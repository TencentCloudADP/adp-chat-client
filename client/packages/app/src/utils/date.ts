import moment from 'moment'
import { useI18n } from 'vue-i18n'

/**
 * 格式化显示时间
 * @param {number} dateInput - 时间戳（毫秒）
 * @param {string} [formateType] - 格式化类型，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 * @example
 * // 返回 "今天 14:30:25"
 * formatDisplayTime(Date.now())
 * // 返回 "2023-12-01 14:30:25" 
 * formatDisplayTime(1701415825000, 'YYYY-MM-DD HH:mm:ss')
 */
export function formatDisplayTime(dateInput: number, formateType?: string): string {
  const { t } = useI18n()
  const date = moment(dateInput)
  const now = moment()
  if (date.isSame(now, 'day')) {
    return `${t('common.today')} ${date.format('HH:mm:ss')}`
  } else {
    return date.format(formateType || 'YYYY-MM-DD HH:mm:ss')
  }
}
