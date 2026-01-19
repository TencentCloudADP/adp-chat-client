/**
 * 获取 API baseURL
 * 开发环境使用 /api 代理，生产环境根据当前路径计算相对路径
 */
export const getBaseURL = (): string => {
  const isDev = import.meta.env.DEV
  if (isDev) {
    return '/api'
  }

  const currentPath = window.location.pathname
  const staticIndex = currentPath.indexOf('/static')
  if (staticIndex !== -1) {
    const pathAfterStatic = currentPath.substring(staticIndex + '/static'.length)
    const pathSegments = pathAfterStatic.split('/').filter((segment) => segment.length > 0)
    const levelsToGoUp = pathSegments.length
    return '../'.repeat(levelsToGoUp)
  }
  return './'
}
