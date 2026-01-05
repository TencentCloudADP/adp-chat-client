/**
 * 判断当前运行环境是否为移动端
 * 综合检测用户代理、触摸支持、屏幕尺寸等多个因素
 * @returns {boolean} true 表示移动端，false 表示PC端
 */
export const isMobile = (): boolean => {
  // 检测用户代理字符串
  const userAgent = navigator.userAgent.toLowerCase()

  // 移动设备关键词检测
  const mobileKeywords = [
    'mobile',
    'android',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'webos',
    'opera mini',
    'iemobile',
    'kindle',
  ]

  const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword))

  // 检测触摸支持
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // 检测屏幕尺寸
  const isSmallScreen = window.innerWidth <= 768

  // 综合判断：用户代理是移动设备，或者有触摸支持且屏幕较小
  return isMobileUA || (hasTouch && isSmallScreen)
}

/**
 * 判断是否为平板设备
 * @returns {boolean} true 表示平板设备
 */
export const isTablet = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase()
  return (
    userAgent.includes('ipad') ||
    (userAgent.includes('android') && !userAgent.includes('mobile')) ||
    (userAgent.includes('windows') && userAgent.includes('touch'))
  )
}

/**
 * 判断是否为手机设备
 * @returns {boolean} true 表示手机设备
 */
export const isPhone = (): boolean => {
  return isMobile() && !isTablet()
}

/**
 * 获取详细的设备类型信息
 * @returns {string} 设备类型描述
 */
export const getDeviceType = (): string => {
  if (isPhone()) return 'phone'
  if (isTablet()) return 'tablet'
  return 'desktop'
}
