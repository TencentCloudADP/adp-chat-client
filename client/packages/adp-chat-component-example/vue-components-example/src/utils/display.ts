export const generateAvatarName = (inputName: string) => {
  const name = inputName?.trim() || ''
  // 中文名，取第一个字
  if (/^[\u4e00-\u9fa5]/.test(name)) {
    return name[0]
  }
  // 英文名，取每个单词首字母大写
  if (/^[a-zA-Z ]+$/.test(name)) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase() || '')
      .join('')
  }
  // 其它情况
  return name[0] || ''
}
