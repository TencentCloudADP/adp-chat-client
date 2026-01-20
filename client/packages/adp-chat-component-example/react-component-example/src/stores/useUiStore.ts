import { useState, useCallback, useEffect } from 'react'

export type ThemeType = 'light' | 'dark'

// 获取初始主题
const getInitialTheme = (): ThemeType => {
  const savedTheme = localStorage.getItem('theme') as ThemeType
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 检测是否为移动端
const checkIsMobile = (): boolean => {
  return window.innerWidth <= 768
}

// 全局状态
let globalTheme: ThemeType = getInitialTheme()
let globalIsMobile: boolean = checkIsMobile()
const listeners: Set<() => void> = new Set()

const notifyListeners = () => {
  listeners.forEach(listener => listener())
}

export const setGlobalTheme = (theme: ThemeType) => {
  globalTheme = theme
  localStorage.setItem('theme', theme)
  document.documentElement.setAttribute('theme-mode', theme)
  notifyListeners()
}

export const useUiStore = () => {
  const [theme, setLocalTheme] = useState<ThemeType>(globalTheme)
  const [isMobile, setIsMobile] = useState<boolean>(globalIsMobile)

  useEffect(() => {
    const listener = () => {
      setLocalTheme(globalTheme)
      setIsMobile(globalIsMobile)
    }
    listeners.add(listener)
    
    document.documentElement.setAttribute('theme-mode', globalTheme)
    
    const handleResize = () => {
      globalIsMobile = checkIsMobile()
      notifyListeners()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      listeners.delete(listener)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const setTheme = useCallback((newTheme: ThemeType) => {
    setGlobalTheme(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = globalTheme === 'light' ? 'dark' : 'light'
    setGlobalTheme(newTheme)
  }, [])

  return {
    theme,
    isMobile,
    setTheme,
    toggleTheme,
  }
}
