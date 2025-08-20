import moment from 'moment'
import { useI18n } from 'vue-i18n'

export function formatDisplayTime(dateInput: string | number | Date): string {
  const { t } = useI18n()
  const date = moment(dateInput)
  const now = moment()
  if (date.isSame(now, 'day')) {
    return `${t('今天')} ${date.format('HH:mm:ss')}`
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss')
  }
}
