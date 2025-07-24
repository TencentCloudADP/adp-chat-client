
const dateFormat = (date: Date, format: string) => {
  date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))

  const pad = (num: number) => num.toString().padStart(2, '0')
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
}

export {dateFormat}