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
 * 检测容器是否为小尺寸
 * @param container 容器选择器或元素
 * @returns {boolean} true 表示小尺寸容器
 */
export const isSmallContainer = (container?: string | Element | null): boolean => {
  if (typeof document === 'undefined') return false
  
  let element: Element | null = null
  if (typeof container === 'string') {
    element = document.querySelector(container)
  } else if (container instanceof Element) {
    element = container
  }
  
  // 容器不存在时降级到 body
  if (!element) {
    element = document.body
  }
  
  const rect = element.getBoundingClientRect()
  return rect.width <= MOBILE_WIDTH_THRESHOLD
}

/**
 * 计算是否为移动端模式
 * @param options 配置选项
 * @param options.isOverlay 是否为浮层模式
 * @param options.width 宽度（仅浮层模式有效）
 * @param options.height 高度（仅浮层模式有效）
 * @param options.container 容器选择器或元素（仅非浮层模式有效）
 * @returns {boolean} 是否为移动端模式
 */
export const computeIsMobile = (options: {
  isOverlay?: boolean
  width?: string | number
  height?: string | number
  container?: string | Element | null
}): boolean => {
  const { isOverlay = false, width = 0, height = 0, container } = options

  // 1. 非浮层模式（撑满容器）：根据容器尺寸判断
  if (!isOverlay) {
    return isSmallContainer(container)
  }

  // 2. 浮层模式：根据宽高判断
  return detectMobileBySize(width, height)
}

/**
 * 获取视口宽度（不包含滚动条）
 * 兼容处理：优先使用 documentElement.clientWidth，降级到 body.clientWidth 或 window.innerWidth
 */
export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 0
  return document.documentElement?.clientWidth 
    || document.body?.clientWidth 
    || window.innerWidth 
    || 0
}

/**
 * 获取视口高度（不包含滚动条）
 * 兼容处理：优先使用 documentElement.clientHeight，降级到 body.clientHeight 或 window.innerHeight
 */
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0
  return document.documentElement?.clientHeight 
    || document.body?.clientHeight 
    || window.innerHeight 
    || 0
}

// 默认 padding
const DEFAULT_PADDING = 24

/**
 * 将尺寸值转换为像素值
 * @param size 尺寸值（数字或字符串，支持 px、vh、vw、%）
 * @returns 像素值
 */
export const parseSize = (size: string | number): number => {
  if (typeof document === 'undefined') return typeof size === 'number' ? size : 0
  if (typeof size === 'number') return size
  if (size.endsWith('px')) return parseInt(size, 10)
  if (size.endsWith('vh')) return (parseInt(size, 10) / 100) * getViewportHeight()
  if (size.endsWith('vw')) return (parseInt(size, 10) / 100) * getViewportWidth()
  if (size.endsWith('%')) return (parseInt(size, 10) / 100) * getViewportWidth()
  return parseInt(size, 10) || 0
}

/**
 * 规范化尺寸，超出屏幕时返回屏幕尺寸减去 padding * 2
 * @param size 尺寸值
 * @param maxSize 最大尺寸（屏幕宽度或高度）
 * @param padding padding 值
 * @returns 规范化后的尺寸（像素值）
 */
export const normalizeSize = (
  size: string | number,
  maxSize: number,
  padding = DEFAULT_PADDING
): number => {
  const parsedSize = parseSize(size)
  const maxAllowed = maxSize - padding * 2
  return parsedSize > maxAllowed ? maxAllowed : parsedSize
}

/**
 * 规范化宽度，超出屏幕宽度时返回屏幕宽度减去 padding * 2
 * @param width 宽度值
 * @param padding padding 值
 * @returns 规范化后的宽度（像素值）
 */
export const normalizeWidth = (width: string | number, padding = DEFAULT_PADDING): number => {
  if (typeof document === 'undefined') return typeof width === 'number' ? width : 0
  return normalizeSize(width, getViewportWidth(), padding)
}

/**
 * 规范化高度，超出屏幕高度时返回屏幕高度减去 padding * 2
 * @param height 高度值
 * @param padding padding 值
 * @returns 规范化后的高度（像素值）
 */
export const normalizeHeight = (height: string | number, padding = DEFAULT_PADDING): number => {
  if (typeof document === 'undefined') return typeof height === 'number' ? height : 0
  return normalizeSize(height, getViewportHeight(), padding)
}
