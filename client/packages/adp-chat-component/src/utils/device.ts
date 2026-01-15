/**
 * 设备检测工具函数
 */

// 移动端宽度阈值
const MOBILE_WIDTH_THRESHOLD = 768

/**
 * 检测用户代理是否为移动设备
 * @returns {boolean} true 表示移动端用户代理
 */
export const isMobileUA = (): boolean => {
  if (typeof navigator === 'undefined') return false
  
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
    'opera mini',
    'iemobile',
    'kindle',
  ]

  return mobileKeywords.some((keyword) => userAgent.includes(keyword))
}

/**
 * 检测是否支持触摸
 * @returns {boolean} true 表示支持触摸
 */
export const hasTouch = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检测屏幕是否为小屏幕
 * @returns {boolean} true 表示小屏幕
 */
export const isSmallScreen = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= MOBILE_WIDTH_THRESHOLD
}

/**
 * 判断当前运行环境是否为移动端（用于 full 模式）
 * 综合检测用户代理、触摸支持、屏幕尺寸等多个因素
 * @returns {boolean} true 表示移动端，false 表示PC端
 */
export const detectMobileByScreen = (): boolean => {
  // 检测用户代理
  const mobileUA = isMobileUA()

  // 检测触摸支持
  const touchSupport = hasTouch()

  // 检测屏幕尺寸
  const smallScreen = isSmallScreen()

  // 综合判断：用户代理是移动设备，或者有触摸支持且屏幕较小
  return mobileUA || (touchSupport && smallScreen)
}

/**
 * 根据宽高判断是否为移动端布局（用于 compact 模式）
 * @param width 宽度（数字或字符串）
 * @param height 高度（数字或字符串）
 * @returns {boolean} true 表示移动端布局
 */
export const detectMobileBySize = (width: string | number, height: string | number): boolean => {
  const w = typeof width === 'number' ? width : parseInt(width as string, 10) || 0
  const h = typeof height === 'number' ? height : parseInt(height as string, 10) || 0

  // 宽度小于阈值或宽度小于高度时判定为移动端布局
  return w < MOBILE_WIDTH_THRESHOLD || (w > 0 && h > 0 && w < h)
}

/**
 * 计算是否为移动端模式
 * @param options 配置选项
 * @param options.isMobile 用户传入的 isMobile 值
 * @param options.modelType 模式类型 'full' | 'compact'
 * @param options.width 宽度（仅 compact 模式有效）
 * @param options.height 高度（仅 compact 模式有效）
 * @returns {boolean} 是否为移动端模式
 */
export const computeIsMobile = (options: {
  isMobile?: boolean
  modelType?: 'full' | 'compact'
  width?: string | number
  height?: string | number
}): boolean => {
  const { isMobile, modelType = 'full', width = 0, height = 0 } = options

  // 1. 用户传入 isMobile 以用户传入为准
  if (isMobile !== undefined) {
    return isMobile
  }

  // 2. full 模式：根据屏幕 UA 等判断
  if (modelType === 'full') {
    return detectMobileByScreen()
  }

  // 3. compact 模式：根据宽高判断
  return detectMobileBySize(width, height)
}
