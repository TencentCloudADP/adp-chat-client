
const dateFormat = (date: Date, format: string) => {
  const pad = (num: number) => num.toString().padStart(2, '0')
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
}

const dateGroup = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp*1000);
  
  // 计算时间差（天）
  const diffInDays = Math.floor((now.getTime()/1000 - timestamp) / (60 * 60 * 24));
  
  // 今天
  if (diffInDays === 0 && date.getDate() === now.getDate() && 
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return "今天";
  }
  
  // 昨天
  if (diffInDays === 1 && date.getDate() === now.getDate() - 1 && 
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return "昨天";
  }
  
  // 过去7天内（不包括今天和昨天）
  if (diffInDays > 1 && diffInDays <= 7) {
    return "过去7天";
  }
  
  // 过去30天内（不包括过去7天）
  if (diffInDays > 7 && diffInDays <= 30) {
    return "过去30天";
  }
  
  // 今年内的月份
  if (date.getFullYear() === now.getFullYear()) {
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", 
                        "7月", "8月", "9月", "10月", "11月", "12月"];
    return monthNames[date.getMonth()];
  }
  
  // 往年
  return `${date.getFullYear()}年`;
}

export {dateFormat, dateGroup}